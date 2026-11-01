import { Port as HlangPort, WriteableNode } from '@hlang-org/runtime';

/**
 * Virtual END component. It forwards every value on its `in` port to a sink callback.
 */
class BaseConsumer extends WriteableNode {
  private readonly inPort: HlangPort;

  constructor(opts: unknown) {
    super(opts);

    this.inPort = HlangPort.I('in');
    this.inPort.attach(this);
  }

  /**
   * Subscribes `sink` to values that arrive on the `in` port.
   */
  consume(sink: (value: unknown) => void): void {
    this.inPort.receive(sink);
  }
}

export default BaseConsumer;
