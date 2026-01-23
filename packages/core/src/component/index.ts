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

class Component extends TransformNode {
  static Port: typeof HlangPort;
  protected readonly inPort: ReturnType<typeof HlangPort.I>;
  protected readonly outPort: ReturnType<typeof HlangPort.O>;

  constructor(opts: unknown) {
    super(opts);

    // default in & out
    this.inPort = Component.Port.I('in');
    this.outPort = Component.Port.O('out');

    this.inPort.attach(this);
    this.outPort.attach(this);
  }

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
  _transform($i: Port, $o: Port): void {
    $i('in').receive((input: unknown) => {
      const output = this.run(input);
      $o('out').send(output);
    });
  }
}

Component.Port = HlangPort;

export default Component;
