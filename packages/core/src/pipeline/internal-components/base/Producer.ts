import { ReadableNode, Port as HlangPort } from '@hlang-org/runtime';

class BaseProducer extends ReadableNode {
  private out: ReturnType<typeof HlangPort.O>;

  constructor(opt: unknown) {
    super(opt);

    this.out = HlangPort.O('out');
    this.out.attach(this);
  }

  produce(value: unknown) {
    this.out.send(value);
  }
}

export default BaseProducer;
