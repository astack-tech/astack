import { ReadableNode, Port } from "@hlang-org/runtime";

class Producer extends ReadableNode {
  private out: ReturnType<typeof Port.O>

  constructor (opt: unknown) {
    super(opt);

    this.out = Port.O("out");
    this.out.attach(this);
  }

  produce (value: unknown) {
    this.out.send(value);
  }
}

export default Producer;
