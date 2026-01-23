import { type Node, Flow } from '@hlang-org/runtime';

import BaseProducer from './internal-components/base/Producer';
import BaseConsumer from './internal-components/base/Consumer';

import { START_COMPONENT_NAME, END_COMPONENT_NAME } from './constants';

/**
 * Options for running a pipeline with multiple outputs
 */
interface RunOptions {
  /**
   * List of output port identifiers to collect results from.
   * Format: 'componentName.portName'
   */
  includeOutputsFrom: string[];
}

/**
 * Resolver function type for single output
 */
type SingleResolver<T> = (value: T) => void;

/**
 * Multi-output execution context with accumulator
 */
interface MultiOutputContext<T> {
  resolve: SingleResolver<Record<string, T>>;
  results: Record<string, T>;
  count: number;
}

/**
 * Union type for resolver queue entries
 */
type QueueEntry<T> = SingleResolver<T> | MultiOutputContext<T>;

/**
 * Pipeline orchestrates the execution of connected components in a reactive flow.
 *
 * Architecture:
 * - Built on HLang's reactive FBP runtime
 * - Uses virtual START (READABLE) and END (WRITABLE) components
 * - Only START and END are implicit conventions, everything else is explicit
 * - Topology built once per route, reused across executions
 * - One Flow instance per Pipeline, one END component per route
 */
class Pipeline {
  private components: Map<string, Node> = new Map();
  private connectPairs: Array<[string, string]> = [];
  private topologyBuilt: Map<string, boolean> = new Map();
  // Use unknown for runtime flexibility with type safety at call sites
  private resolverQueues: Map<string, Array<QueueEntry<unknown>>> = new Map();
  private flow: Flow | null = null;
  private routeEndNames: Map<string, string> = new Map();

  constructor() {}

  /**
   * Generate a unique, safe END component name for a route
   * Uses a counter-based approach for simplicity and debuggability
   */
  private getOrCreateEndName(routeKey: string): string {
    if (!this.routeEndNames.has(routeKey)) {
      const index = this.routeEndNames.size;
      this.routeEndNames.set(routeKey, `${END_COMPONENT_NAME}_${index}`);
    }
    return this.routeEndNames.get(routeKey)!;
  }

  private from(portIdentifier: string) {
    const [componentName, portName] = portIdentifier.split('.');
    const component = this.components.get(componentName);

    if (!component) {
      throw new Error(`Source component not found: ${componentName}`);
    }

    return component.O(portName);
  }

  private to(portIdentifier: string) {
    const [componentName, portName] = portIdentifier.split('.');
    const component = this.components.get(componentName);

    if (!component) {
      throw new Error(`Destination component not found: ${componentName}`);
    }

    return component.I(portName);
  }

  addComponent(name: string, instance: Node) {
    if (this.components.has(name)) return;
    this.components.set(name, instance);
  }

  getComponent(name: string): Node | undefined {
    return this.components.get(name);
  }

  connect(sourceName: string, sinkName: string) {
    // Check if this connection already exists
    const exists = this.connectPairs.some(([src, snk]) => src === sourceName && snk === sinkName);

    if (exists) {
      return; // Skip duplicate connection
    }

    this.from(sourceName).connect(this.to(sinkName));
    this.connectPairs.push([sourceName, sinkName]);
  }

  /**
   * Detect leaf ports (outputs with no downstream connections)
   * Fixed logic: checks if source port's sink component has any outputs
   */
  private detectLeafPorts(): string[] {
    const allSourcePorts = new Set<string>();
    const sourcesWithDownstream = new Set<string>();

    for (const [source, sink] of this.connectPairs) {
      allSourcePorts.add(source);

      const [sinkComponent] = sink.split('.');

      // Check if sink component has ANY output ports in the topology
      const sinkHasOutput = this.connectPairs.some(([otherSource]) => {
        const [otherSourceComponent] = otherSource.split('.');
        return otherSourceComponent === sinkComponent;
      });

      if (sinkHasOutput) {
        sourcesWithDownstream.add(source);
      }
    }

    return Array.from(allSourcePorts).filter(source => !sourcesWithDownstream.has(source));
  }

  // Overload signatures
  run<T>(triggerName: string, params: unknown): Promise<T>;
  run<T>(triggerName: string, params: unknown, endpoint: string): Promise<T>;
  run<T>(triggerName: string, params: unknown, options: RunOptions): Promise<Record<string, T>>;

  run<T>(
    triggerName: string,
    params: unknown,
    endpointOrOptions?: string | RunOptions
  ): Promise<T | Record<string, T>> {
    return new Promise(resolve => {
      // Validate trigger name
      if (!triggerName || !triggerName.includes('.')) {
        throw new Error(
          `Invalid trigger name: ${triggerName}. Format should be 'componentName.portName'`
        );
      }

      // Get or create START component (only once)
      let startComponent: BaseProducer;
      if (!this.getComponent(START_COMPONENT_NAME)) {
        startComponent = new BaseProducer({});
        this.addComponent(START_COMPONENT_NAME, startComponent);
      } else {
        startComponent = this.getComponent(START_COMPONENT_NAME) as BaseProducer;
      }

      // Create Flow instance only once
      if (!this.flow) {
        this.flow = new Flow({});
      }

      // Priority 1: Explicit single endpoint
      if (typeof endpointOrOptions === 'string') {
        const endpoint = endpointOrOptions;
        const routeKey = `${triggerName}→${endpoint}`;

        // Build topology only once for this route
        if (!this.topologyBuilt.get(routeKey)) {
          const endName = this.getOrCreateEndName(routeKey);

          const endComponent = new BaseConsumer({});
          this.addComponent(endName, endComponent);

          // Initialize resolver queue for this route
          this.resolverQueues.set(routeKey, []);

          // Set up ONE-TIME subscription with dynamic resolver queue
          endComponent.consume((value: T) => {
            const queue = this.resolverQueues.get(routeKey);
            if (queue && queue.length > 0) {
              const currentResolver = queue.shift() as SingleResolver<T>;
              currentResolver(value);
            }
          });

          // Build topology
          this.connect(`${START_COMPONENT_NAME}.out`, triggerName);
          this.connect(endpoint, `${endName}.in`);

          this.topologyBuilt.set(routeKey, true);
        }

        // Add this execution's resolver to the queue
        const queue = this.resolverQueues.get(routeKey)!;
        queue.push(resolve as QueueEntry<unknown>);

        // Execute: Only trigger data flow
        this.flow.run(startComponent);
        startComponent.produce(params);
        return;
      }

      // Priority 2: Multiple output collection
      if (endpointOrOptions && 'includeOutputsFrom' in endpointOrOptions) {
        const targetOutputs = endpointOrOptions.includeOutputsFrom;
        const routeKey = `${triggerName}→multi:${targetOutputs.sort().join(',')}`;

        // Build topology only once for this multi-output route
        if (!this.topologyBuilt.get(routeKey)) {
          // Initialize resolver queue for this route
          this.resolverQueues.set(routeKey, []);

          targetOutputs.forEach((outputPort, index) => {
            const consumer = new BaseConsumer({});
            const consumerName = `${END_COMPONENT_NAME}_multi_${index}`;
            this.addComponent(consumerName, consumer);
            this.connect(outputPort, `${consumerName}.in`);

            // Set up ONE-TIME subscription for this consumer
            consumer.consume((value: T) => {
              const queue = this.resolverQueues.get(routeKey);
              if (queue && queue.length > 0) {
                // Store result in the current execution's result object
                const currentExecution = queue[0] as MultiOutputContext<T>;
                if (!currentExecution.results) {
                  currentExecution.results = {};
                  currentExecution.count = 0;
                }
                currentExecution.results[outputPort] = value;
                currentExecution.count++;

                // Resolve when all outputs are collected
                if (currentExecution.count === targetOutputs.length) {
                  const resolver = queue.shift() as MultiOutputContext<T>;
                  resolver.resolve(resolver.results);
                }
              }
            });
          });

          this.connect(`${START_COMPONENT_NAME}.out`, triggerName);
          this.topologyBuilt.set(routeKey, true);
        }

        // Add this execution's resolver to the queue with metadata
        const queue = this.resolverQueues.get(routeKey)!;
        const context: MultiOutputContext<T> = { resolve, results: {}, count: 0 };
        queue.push(context as QueueEntry<unknown>);

        // Execute: Only trigger data flow
        this.flow.run(startComponent);
        startComponent.produce(params);
        return;
      }

      // Priority 3: Auto-inference
      const leafPorts = this.detectLeafPorts();

      // Case 3.1: Single component with no connections
      if (leafPorts.length === 0 && this.connectPairs.length === 0) {
        const [triggerComponentName] = triggerName.split('.');
        const triggerComponent = this.components.get(triggerComponentName);

        if (!triggerComponent) {
          throw new Error(`Trigger component not found: ${triggerComponentName}`);
        }

        // @ts-expect-error - Accessing outPort property that exists on Component classes
        const outputPortName = triggerComponent?.outPort?.name;

        if (!outputPortName) {
          throw new Error(
            `Cannot infer output port for single-component pipeline.\n` +
              'Please specify endpoint explicitly:\n' +
              `  pipeline.run('${triggerName}', params, 'componentName.portName')`
          );
        }

        const inferredEndpoint = `${triggerComponentName}.${outputPortName}`;
        const routeKey = `${triggerName}→${inferredEndpoint}`;

        // Build topology only once
        if (!this.topologyBuilt.get(routeKey)) {
          const endName = this.getOrCreateEndName(routeKey);

          const endComponent = new BaseConsumer({});
          this.addComponent(endName, endComponent);

          this.resolverQueues.set(routeKey, []);

          endComponent.consume((value: T) => {
            const queue = this.resolverQueues.get(routeKey);
            if (queue && queue.length > 0) {
              const currentResolver = queue.shift() as SingleResolver<T>;
              currentResolver(value);
            }
          });

          this.connect(`${START_COMPONENT_NAME}.out`, triggerName);
          this.connect(inferredEndpoint, `${endName}.in`);

          this.topologyBuilt.set(routeKey, true);
        }

        const queue = this.resolverQueues.get(routeKey)!;
        queue.push(resolve as QueueEntry<unknown>);

        this.flow.run(startComponent);
        startComponent.produce(params);
        return;
      }

      // Case 3.2: Single leaf port
      if (leafPorts.length === 1) {
        const endpoint = leafPorts[0];
        const routeKey = `${triggerName}→${endpoint}`;

        // Build topology only once
        if (!this.topologyBuilt.get(routeKey)) {
          const endName = this.getOrCreateEndName(routeKey);

          const endComponent = new BaseConsumer({});
          this.addComponent(endName, endComponent);

          this.resolverQueues.set(routeKey, []);

          endComponent.consume((value: T) => {
            const queue = this.resolverQueues.get(routeKey);
            if (queue && queue.length > 0) {
              const currentResolver = queue.shift() as SingleResolver<T>;
              currentResolver(value);
            }
          });

          this.connect(`${START_COMPONENT_NAME}.out`, triggerName);
          this.connect(endpoint, `${endName}.in`);

          this.topologyBuilt.set(routeKey, true);
        }

        const queue = this.resolverQueues.get(routeKey)!;
        queue.push(resolve as QueueEntry<unknown>);

        this.flow.run(startComponent);
        startComponent.produce(params);
        return;
      }

      // Case 3.3: Multiple leaf ports
      if (leafPorts.length > 1) {
        throw new Error(
          `Multiple leaf outputs detected: [${leafPorts.join(', ')}].\n` +
            'Please choose one of the following:\n' +
            `  1. Single output:\n` +
            `     pipeline.run('${triggerName}', params, '${leafPorts[0]}')\n` +
            `  2. Multiple outputs:\n` +
            `     pipeline.run('${triggerName}', params, {\n` +
            `       includeOutputsFrom: [${leafPorts.map(p => `'${p}'`).join(', ')}]\n` +
            `     })`
        );
      }

      // Case 3.4: No leaf ports (circular topology)
      if (leafPorts.length === 0 && this.connectPairs.length > 0) {
        throw new Error(
          'Circular topology detected. Cannot determine endpoint.\n' +
            'Please specify endpoint explicitly:\n' +
            `  pipeline.run('${triggerName}', params, 'componentName.portName')\n` +
            "Example: pipeline.run('gateway.input', data, 'gateway.result')"
        );
      }

      // Should never reach here
      throw new Error(
        'Cannot determine pipeline endpoint.\n' +
          'Please specify endpoint explicitly:\n' +
          `  pipeline.run('${triggerName}', params, 'componentName.portName')`
      );
    });
  }
}

export default Pipeline;
