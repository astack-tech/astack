import { Port as HlangPort, ReadableNode } from '@hlang-org/runtime';

/**
 * Virtual START component. It pushes pipeline input into the flow through its `out` port.
 */
class BaseProducer extends ReadableNode {
  private readonly outPort: HlangPort;

  constructor(opts: unknown) {
    super(opts);

    this.outPort = HlangPort.O('out');
    this.outPort.attach(this);
  }

  /**
   * Emits `value` on the `out` port.
   */
  produce(value: unknown): void {
    this.outPort.send(value);
  }
}

export default BaseProducer;
