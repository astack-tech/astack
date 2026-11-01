import { TransformNode, Port as HlangPort } from '@hlang-org/runtime';
import type { Observable, Subscription } from 'rxjs';

/**
 * Port accessor passed to `Component._transform()` as `$i` and `$o`. Call it with a port
 * name to read from an input port (`receive`) or write to an output port (`send`).
 *
 * @example
 * ```typescript
 * // Receive from an input port. Messages are `unknown`: narrow them first.
 * $i('in').receive(data => {
 *   if (typeof data === 'string') {
 *     $o('out').send(data.toUpperCase());
 *   }
 * });
 *
 * // Read the port's stream with RxJS
 * const stream = $i('in').$;
 * ```
 */
export type Port = (portName: string) => {
  /**
   * Subscribes `callback` to every message the port delivers. Ports are wired at run
   * time, so a message is `unknown` until the callback narrows it. A callback that
   * throws sends the error on the component's error port and the port keeps delivering.
   * A callback that returns a promise works on the message until the promise settles.
   * @param callback - Called with each message.
   * @returns The RxJS subscription.
   */
  receive: (callback: (data: unknown) => unknown) => Subscription;
  /**
   * Sends `data` on the port.
   * @param data - The message to send.
   */
  send: (data: unknown) => void;
  /**
   * The port's messages as a read-only RxJS stream.
   */
  $: Observable<unknown>;
};

/**
 * Base class for every AStack component.
 *
 * A component has a default `in` and `out` port. Call `run()` to use it on its own,
 * or add it to a `Pipeline`, which calls `_transform()` for reactive execution.
 */
class Component extends TransformNode<object> {
  /** Port factory from the HLang runtime. `Component.Port.I(name)` and `Component.Port.O(name)` create input and output ports; call `.attach(this)` in the constructor. */
  static Port: typeof HlangPort = HlangPort;
  /** The default `in` input port. */
  protected readonly inPort: HlangPort;
  /** The default `out` output port. A pipeline uses it to infer the endpoint. */
  protected readonly outPort: HlangPort;

  /**
   * @param opts - The component's options, stored as `this.opts`.
   */
  constructor(opts: object) {
    super(opts);

    // Default ports.
    this.inPort = Component.Port.I('in');
    this.outPort = Component.Port.O('out');

    this.inPort.attach(this);
    this.outPort.attach(this);
  }

  /**
   * Processes one input outside a pipeline. The default implementation returns the input.
   */
  run(data: unknown): unknown {
    return data;
  }

  /**
   * Run component in pipeline
   *
   * Override this method in subclasses to implement custom data processing logic
   *
   * @param $i - Input port accessor. Call `$i('portName').receive(callback)` to read data.
   * @param $o - Output port accessor. Call `$o('portName').send(value)` to emit data.
   *
   * @example
   * Basic component with single input and output
   * ```typescript
   * import type { Port } from '@astack-tech/core';
   *
   * _transform($i: Port, $o: Port) {
   *   $i('in').receive(data => {
   *     if (typeof data !== 'string') {
   *       throw new TypeError('Expected a string');
   *     }
   *     $o('out').send({ processed: data.toUpperCase() });
   *   });
   * }
   * ```
   *
   * @example
   * Multi-port component with conditional routing
   * ```typescript
   * import type { Port } from '@astack-tech/core';
   *
   * _transform($i: Port, $o: Port) {
   *   $i('in').receive(data => {
   *     if (typeof data !== 'number') {
   *       throw new TypeError('Expected a number');
   *     }
   *     $o(data % 2 === 0 ? 'even' : 'odd').send(data);
   *   });
   * }
   * ```
   */
  override _transform($i: Port, $o: Port): void {
    $i('in').receive((input: unknown) => {
      const output = this.run(input);
      $o('out').send(output);
    });
  }
}

export default Component;
