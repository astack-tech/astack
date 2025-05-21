import { Component, Pipeline } from '@astack/core';

class Agent extends Component {
  protected readonly pipeline: Pipeline;

  constructor (opts: unknown) {
    super(opts);

    this.pipeline = new Pipeline();
  }

  async run () {
    
  }

  _transform($i: any, $o: any): void {
    
  }
}

export default Agent;
