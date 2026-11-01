import { Component } from '@astack-tech/core';

/**
 * A component is a class with input and output ports.
 * `run()` is its standalone mode: call it like a function.
 */
class Uppercase extends Component {
  constructor() {
    super({});
  }

  override run(text: unknown): string {
    return String(text).toUpperCase();
  }
}

const uppercase = new Uppercase();

console.log(uppercase.run('hello, astack'));
// HELLO, ASTACK
