import { TransformNode, Port } from "@hlang-org/runtime";

class Component extends TransformNode {
  protected readonly inPort: ReturnType<typeof Port.I>;
  protected readonly outPort: ReturnType<typeof Port.O>;
  
  constructor(opts: unknown) {
    super(opts);
    
    this.inPort = Port.I("in");
    this.outPort = Port.O("out");
    
    this.inPort.attach(this);
    this.outPort.attach(this);
  }

  process(data: unknown): unknown {
    return data;
  }

  _transform($i: any, $o: any) {
    $i('in').receive((input: unknown) => {
      const output = this.process(input);
      $o('out').send(output);
    });
  }
}

export default Component;
