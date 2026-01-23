import { WriteableNode, Port as HlangPort } from '@hlang-org/runtime';

class Consumer extends WriteableNode {
  private in: ReturnType<typeof HlangPort.I>;

  constructor(opt: unknown) {
    super(opt);

    this.in = HlangPort.I('in');
    this.in.attach(this);
  }

  consume(sink: unknown) {
    this.in.receive(sink);
  }
}

export default Consumer;
