import { Flow } from '@hlang-org/runtime';
import type { Node, Port as HlangPort } from '@hlang-org/runtime';

import BaseConsumer from './internal-components/base/Consumer';
import BaseProducer from './internal-components/base/Producer';
import { END_COMPONENT_NAME, START_COMPONENT_NAME } from './constants';

/**
 * Options for running a pipeline with multiple outputs.
 */
export interface RunOptions {
  /**
   * Output port identifiers to collect results from.
   * Format: `componentName.portName`.
   */
  includeOutputsFrom: string[];
}

type SingleResolver = (value: unknown) => void;

/** A run that has sent its input and waits for its result. */
interface PendingRun {
  readonly reject: (error: Error) => void;
  /** Removes the run from its route queue, so a later value resolves the next run. */
  cancel: () => void;
}

/** Returns `error` as an `Error`, wrapping any other thrown value. */
function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

interface MultiOutputContext {
  resolve: (value: Record<string, unknown>) => void;
  results: Record<string, unknown>;
  count: number;
}

interface ParsedPortIdentifier {
  componentName: string;
  portName: string;
}

/** Removes the first occurrence of `item` from `items`, if any. */
function removeItem<T>(items: T[], item: T): void {
  const index = items.indexOf(item);
  if (index !== -1) {
    items.splice(index, 1);
  }
}

/**
 * Splits `componentName.portName` into its parts.
 *
 * @throws Error when the identifier does not contain both parts.
 */
function parsePortIdentifier(portIdentifier: string): ParsedPortIdentifier {
  const separatorIndex = portIdentifier.indexOf('.');
  const componentName = portIdentifier.slice(0, separatorIndex);
  const portName = portIdentifier.slice(separatorIndex + 1);

  if (separatorIndex <= 0 || portName.length === 0) {
    throw new Error(
      `Invalid port identifier: '${portIdentifier}'. Use the format 'componentName.portName'.`
    );
  }

  return { componentName, portName };
}

/**
 * Reads the default output port name from a component, if it declares one.
 */
function getDefaultOutputPortName(component: Node<object>): string | undefined {
  const candidate = 'outPort' in component ? component.outPort : undefined;
  if (typeof candidate === 'object' && candidate !== null && 'name' in candidate) {
    const { name } = candidate;
    return typeof name === 'string' && name.length > 0 ? name : undefined;
  }
  return undefined;
}

/**
 * Pipeline orchestrates the execution of connected components in a reactive flow.
 *
 * Architecture:
 * - Built on the HLang reactive flow-based programming runtime.
 * - Uses virtual START (readable) and END (writable) components: one START per trigger
 *   port, so a run reaches only the port it names.
 * - Only START and END are implicit conventions; every other connection is explicit.
 * - The topology is built once per route and reused across executions.
 * - One Flow instance per Pipeline, one END component per route.
 * - A failure on a component's error port rejects a run: the run whose input is being
 *   delivered when the component fails synchronously, otherwise the oldest run still waiting.
 */
class Pipeline {
  private readonly components = new Map<string, Node<object>>();
  private readonly connectPairs: [string, string][] = [];
  private readonly singleRouteQueues = new Map<string, SingleResolver[]>();
  private readonly multiRouteQueues = new Map<string, MultiOutputContext[]>();
  private readonly routeEndNames = new Map<string, string>();
  private readonly virtualComponents = new Set<string>();
  private readonly startComponents = new Map<string, BaseProducer>();
  private multiConsumerCount = 0;
  private flow: Flow | null = null;
  private readonly pendingRuns: PendingRun[] = [];
  private deliveringRun: PendingRun | undefined;

  /**
   * Registers a component under a unique name. A second call with the same name is ignored.
   *
   * The pipeline listens on the component's error port: an error a component throws, or
   * sends with `throw()`, rejects the run it belongs to.
   */
  addComponent(name: string, instance: Node<object>): void {
    if (this.components.has(name)) {
      return;
    }
    this.components.set(name, instance);
    instance.E()?.receive(error => {
      this.failRun(toError(error));
    });
  }

  /**
   * Returns the component registered under `name`, if any.
   */
  getComponent(name: string): Node<object> | undefined {
    return this.components.get(name);
  }

  /**
   * Connects an output port to an input port. Duplicate connections are ignored.
   *
   * @param sourceName - Output port identifier, for example `splitter.out`.
   * @param sinkName - Input port identifier, for example `embedder.in`.
   */
  connect(sourceName: string, sinkName: string): void {
    const exists = this.connectPairs.some(([src, snk]) => src === sourceName && snk === sinkName);
    if (exists) {
      return;
    }

    this.outputPort(sourceName).connect(this.inputPort(sinkName));
    this.connectPairs.push([sourceName, sinkName]);
  }

  /**
   * Sends `params` to `triggerName` and resolves with the value emitted by `endpoint`.
   *
   * When `endpoint` is omitted, the pipeline infers it from the topology. Ports are wired
   * at run time, so the result is `unknown`: narrow it before you use it.
   *
   * @throws Error (as a rejection) when a component on the route fails.
   */
  run(triggerName: string, params: unknown, endpoint?: string): Promise<unknown>;
  /**
   * Sends `params` to `triggerName` and resolves once every listed output has emitted,
   * with each output's value under its port identifier.
   *
   * @throws Error (as a rejection) when a component on the route fails.
   */
  run(triggerName: string, params: unknown, options: RunOptions): Promise<Record<string, unknown>>;
  run(
    triggerName: string,
    params: unknown,
    endpointOrOptions?: string | RunOptions
  ): Promise<unknown> {
    return new Promise<unknown>((resolve, reject) => {
      try {
        parsePortIdentifier(triggerName);
        const flow = this.ensureFlow();
        const pending: PendingRun = { reject, cancel: () => undefined };
        const settle = (value: unknown): void => {
          this.forgetRun(pending);
          resolve(value);
        };

        if (typeof endpointOrOptions === 'string') {
          pending.cancel = this.enqueueSingleRoute(triggerName, endpointOrOptions, settle);
        } else if (endpointOrOptions !== undefined) {
          pending.cancel = this.enqueueMultiRoute(
            triggerName,
            endpointOrOptions.includeOutputsFrom,
            settle
          );
        } else {
          pending.cancel = this.enqueueSingleRoute(
            triggerName,
            this.inferEndpoint(triggerName),
            settle
          );
        }

        let startComponent: BaseProducer;
        try {
          startComponent = this.startComponentFor(triggerName);
        } catch (error) {
          pending.cancel();
          throw error;
        }

        this.pendingRuns.push(pending);
        flow.run(startComponent);
        this.deliveringRun = pending;
        try {
          startComponent.produce(params);
        } finally {
          this.deliveringRun = undefined;
        }
      } catch (error) {
        reject(toError(error));
      }
    });
  }

  /**
   * Rejects the run a component failure belongs to. While an input is being delivered,
   * that is its run; afterwards, it is the oldest run still waiting. A failure after its
   * run has already resolved has nothing left to reject.
   */
  private failRun(error: Error): void {
    const run = this.deliveringRun ?? this.pendingRuns[0];
    if (run === undefined || !this.pendingRuns.includes(run)) {
      return;
    }
    this.forgetRun(run);
    run.cancel();
    run.reject(error);
  }

  private forgetRun(run: PendingRun): void {
    removeItem(this.pendingRuns, run);
  }

  private outputPort(portIdentifier: string): HlangPort {
    const { componentName, portName } = parsePortIdentifier(portIdentifier);
    const component = this.components.get(componentName);
    if (!component) {
      throw new Error(`Source component not found: ${componentName}`);
    }
    return component.O(portName);
  }

  private inputPort(portIdentifier: string): HlangPort {
    const { componentName, portName } = parsePortIdentifier(portIdentifier);
    const component = this.components.get(componentName);
    if (!component) {
      throw new Error(`Destination component not found: ${componentName}`);
    }
    return component.I(portName);
  }

  /**
   * Returns the START component that feeds `triggerName`, creating it on first use. Each
   * trigger has its own, so a run reaches only the port it names.
   */
  private startComponentFor(triggerName: string): BaseProducer {
    const existing = this.startComponents.get(triggerName);
    if (existing !== undefined) {
      return existing;
    }
    this.inputPort(triggerName);
    const startName = `${START_COMPONENT_NAME}_${String(this.startComponents.size)}`;
    const startComponent = new BaseProducer({});
    this.addVirtualComponent(startName, startComponent);
    this.connect(`${startName}.out`, triggerName);
    this.startComponents.set(triggerName, startComponent);
    return startComponent;
  }

  private addVirtualComponent(name: string, instance: Node<object>): void {
    this.virtualComponents.add(name);
    this.addComponent(name, instance);
  }

  private ensureFlow(): Flow {
    this.flow ??= new Flow({});
    return this.flow;
  }

  /**
   * Returns a stable END component name for a route.
   */
  private getOrCreateEndName(routeKey: string): string {
    let endName = this.routeEndNames.get(routeKey);
    if (endName === undefined) {
      endName = `${END_COMPONENT_NAME}_${String(this.routeEndNames.size)}`;
      this.routeEndNames.set(routeKey, endName);
    }
    return endName;
  }

  /**
   * Builds the single-endpoint route once, then queues the resolver for this execution.
   */
  private enqueueSingleRoute(
    triggerName: string,
    endpoint: string,
    resolve: SingleResolver
  ): () => void {
    const routeKey = `${triggerName}->${endpoint}`;
    let queue = this.singleRouteQueues.get(routeKey);

    if (queue === undefined) {
      const routeQueue: SingleResolver[] = [];
      const endName = this.getOrCreateEndName(routeKey);
      const endComponent = new BaseConsumer({});
      this.addVirtualComponent(endName, endComponent);

      endComponent.consume((value: unknown) => {
        routeQueue.shift()?.(value);
      });

      this.connect(endpoint, `${endName}.in`);
      this.singleRouteQueues.set(routeKey, routeQueue);
      queue = routeQueue;
    }

    const routeQueue = queue;
    routeQueue.push(resolve);
    return () => {
      removeItem(routeQueue, resolve);
    };
  }

  /**
   * Builds the multi-output route once, then queues a result accumulator for this execution.
   */
  private enqueueMultiRoute(
    triggerName: string,
    outputs: readonly string[],
    resolve: (value: Record<string, unknown>) => void
  ): () => void {
    if (outputs.length === 0) {
      throw new Error('includeOutputsFrom must list at least one output port.');
    }

    const targetOutputs = [...new Set(outputs)].sort();
    const routeKey = `${triggerName}->multi:${targetOutputs.join(',')}`;
    let queue = this.multiRouteQueues.get(routeKey);

    if (queue === undefined) {
      const routeQueue: MultiOutputContext[] = [];

      for (const outputPort of targetOutputs) {
        const consumerName = `${END_COMPONENT_NAME}_multi_${String(this.multiConsumerCount)}`;
        this.multiConsumerCount += 1;
        const consumer = new BaseConsumer({});
        this.addVirtualComponent(consumerName, consumer);
        this.connect(outputPort, `${consumerName}.in`);

        consumer.consume((value: unknown) => {
          const current = routeQueue[0];
          if (current === undefined) {
            return;
          }
          if (!(outputPort in current.results)) {
            current.count += 1;
          }
          current.results[outputPort] = value;

          if (current.count === targetOutputs.length) {
            routeQueue.shift();
            current.resolve(current.results);
          }
        });
      }

      this.multiRouteQueues.set(routeKey, routeQueue);
      queue = routeQueue;
    }

    const routeQueue = queue;
    const context: MultiOutputContext = { resolve, results: {}, count: 0 };
    routeQueue.push(context);
    return () => {
      removeItem(routeQueue, context);
    };
  }

  /**
   * Infers the endpoint when the caller did not pass one.
   *
   * The endpoint is the default output port of the only terminal component, which is a
   * component that receives data but sends nothing to other user components.
   *
   * @throws Error when the topology has zero or several terminal components.
   */
  private inferEndpoint(triggerName: string): string {
    const userPairs = this.connectPairs.filter(
      ([source, sink]) =>
        !this.virtualComponents.has(parsePortIdentifier(source).componentName) &&
        !this.virtualComponents.has(parsePortIdentifier(sink).componentName)
    );

    const terminalComponents =
      userPairs.length === 0
        ? [parsePortIdentifier(triggerName).componentName]
        : this.detectTerminalComponents(userPairs);

    if (terminalComponents.length === 0) {
      throw new Error(
        'Circular topology detected. Cannot determine endpoint.\n' +
          'Please specify endpoint explicitly:\n' +
          `  pipeline.run('${triggerName}', params, 'componentName.portName')\n` +
          "Example: pipeline.run('gateway.input', data, 'gateway.result')"
      );
    }

    const endpoints = terminalComponents.map(name => this.defaultEndpointOf(name, triggerName));
    const [onlyEndpoint] = endpoints;
    if (endpoints.length === 1 && onlyEndpoint !== undefined) {
      return onlyEndpoint;
    }

    throw new Error(
      `Multiple leaf outputs detected: [${endpoints.join(', ')}].\n` +
        'Please choose one of the following:\n' +
        '  1. Single output:\n' +
        `     pipeline.run('${triggerName}', params, '${endpoints[0] ?? ''}')\n` +
        '  2. Multiple outputs:\n' +
        `     pipeline.run('${triggerName}', params, {\n` +
        `       includeOutputsFrom: [${endpoints.map(p => `'${p}'`).join(', ')}]\n` +
        '     })'
    );
  }

  /**
   * Returns `componentName.<default output port>` for a registered component.
   */
  private defaultEndpointOf(componentName: string, triggerName: string): string {
    const component = this.components.get(componentName);
    if (!component) {
      throw new Error(`Trigger component not found: ${componentName}`);
    }

    const outputPortName = getDefaultOutputPortName(component);
    if (outputPortName === undefined) {
      throw new Error(
        `Cannot infer the output port of component '${componentName}'.\n` +
          'Please specify endpoint explicitly:\n' +
          `  pipeline.run('${triggerName}', params, 'componentName.portName')`
      );
    }
    return `${componentName}.${outputPortName}`;
  }

  /**
   * Returns components that receive data but have no outgoing user connection, in
   * connection order.
   */
  private detectTerminalComponents(pairs: readonly [string, string][]): string[] {
    const sourceComponents = new Set(
      pairs.map(([source]) => parsePortIdentifier(source).componentName)
    );
    const sinkComponents = new Set(
      pairs.map(([, sink]) => parsePortIdentifier(sink).componentName)
    );

    return [...sinkComponents].filter(name => !sourceComponents.has(name));
  }
}

export default Pipeline;
