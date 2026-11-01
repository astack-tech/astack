import { TransformNode, Port as HlangPort } from '@hlang-org/runtime';
import type { Subscription, Subject } from 'rxjs';

/**
 * Port type
 *
 * Used to access ports by name in _transform method
 *
 * @example
 * ```typescript
 * // Get input port and receive data
 * $i('in').receive((data: { text: string }) => {
 *   console.log(data.text);
 * });
 *
 * // Get output port and send data
 * $o('out').send({ result: 'processed' });
 *
 * // Access raw RxJS Subject
 * const subject = $i('in').$;
 * ```
 */
export type Port = (portName: string) => {
  /**
   * Receive data from port
   * @param callback Data receive callback function
   * @returns RxJS Subscription object
   */
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- lets callers annotate the payload type of a port.
  receive: <T = unknown>(callback: (data: T) => void) => Subscription;
  /**
   * Send data to port
   * @param data Data to send
   */
  send: (data: unknown) => void;
  /**
   * Access raw RxJS Subject
   */
  $: Subject<unknown>;
};

/**
 * Base class for every AStack component.
 *
 * A component has a default `in` and `out` port. Call `run()` to use it on its own,
 * or add it to a `Pipeline`, which calls `_transform()` for reactive execution.
 */
class Component extends TransformNode {
  static Port: typeof HlangPort = HlangPort;
  protected readonly inPort: HlangPort;
  protected readonly outPort: HlangPort;

  constructor(opts: unknown) {
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
   * @param $i Input port mapper function - call $i('portName') to get input port, then call .receive() to receive data
   * @param $o Output port mapper function - call $o('portName') to get output port, then call .send() to send data
   *
   * @example
   * Basic component with single input and output
   * ```typescript
   * import type { Port } from '@astack-tech/core';
   *
   * _transform($i: Port, $o: Port) {
   *   $i('in').receive((data: { text: string }) => {
   *     const result = { processed: data.text.toUpperCase() };
   *     $o('out').send(result);
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
   *   $i('in').receive((data: { value: number }) => {
   *     if (data.value % 2 === 0) {
   *       $o('even').send({ result: data.value * 2 });
   *     } else {
   *       $o('odd').send({ result: data.value * 3 });
   *     }
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
