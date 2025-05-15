import { TransformNode, Port } from "@hlang-org/runtime";

class Component extends TransformNode {
  protected readonly inPort: ReturnType<typeof Port.I>;
  protected readonly outPort: ReturnType<typeof Port.O>;
  protected readonly Port: typeof Port;
  
  constructor(opts: unknown) {
    super(opts);

    // mount Port
    this.Port = Port;
    
    // default in & out
    this.inPort = this.Port.I("in");
    this.outPort = this.Port.O("out");
    
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
