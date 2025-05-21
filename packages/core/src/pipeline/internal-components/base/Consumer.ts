import { WriteableNode, Port } from "@hlang-org/runtime";

class Consumer extends WriteableNode {
  private in: ReturnType<typeof Port.I>

  constructor (opt: unknown) {
    super(opt);

    this.in = Port.I("in");
    this.in.attach(this);
  }

  consume (sink: unknown) {
    this.in.receive(sink);
  }
}

export default Consumer;
