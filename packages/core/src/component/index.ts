// @ts-ignore
import { TransformNode, Port } from "@hlang-org/runtime";

class Component extends TransformNode {
  static Port: typeof Port;
  protected readonly inPort: ReturnType<typeof Port.I>;
  protected readonly outPort: ReturnType<typeof Port.O>;
  
  constructor(opts: unknown) {
    super(opts);
    
    // default in & out
    this.inPort = Component.Port.I("in");
    this.outPort = Component.Port.O("out");
    
    this.inPort.attach(this);
    this.outPort.attach(this);
  }

  run(data: unknown): unknown {
    return data;
  }

  _transform($i: any, $o: any) {
    $i('in').receive((input: unknown) => {
      const output = this.run(input);
      $o('out').send(output);
    });
  }
}

Component.Port = Port;

export default Component;
