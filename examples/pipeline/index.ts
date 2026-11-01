import { Component, Pipeline } from '@astack-tech/core';

class Trim extends Component {
  constructor() {
    super({});
  }

  override run(text: unknown): string {
    return String(text).trim();
  }
}

class Uppercase extends Component {
  constructor() {
    super({});
  }

  override run(text: unknown): string {
    return String(text).toUpperCase();
  }
}

class Exclaim extends Component {
  constructor() {
    super({});
  }

  override run(text: unknown): string {
    return `${String(text)}!`;
  }
}

// Register components by name, then connect output ports to input ports.
const pipeline = new Pipeline();
pipeline.addComponent('trim', new Trim());
pipeline.addComponent('upper', new Uppercase());
pipeline.addComponent('exclaim', new Exclaim());

pipeline.connect('trim.out', 'upper.in');
pipeline.connect('upper.out', 'exclaim.in');

// The endpoint is inferred: `exclaim` is the only component with no downstream connection.
console.log(await pipeline.run('trim.in', '  hello  '));
// HELLO!

// Pass an endpoint to read an intermediate result.
console.log(await pipeline.run('trim.in', '  hello  ', 'upper.out'));
// HELLO

// The topology is built once. Concurrent runs resolve in order.
console.log(await Promise.all(['a', 'b', 'c'].map(text => pipeline.run('trim.in', text))));
// [ 'A!', 'B!', 'C!' ]
