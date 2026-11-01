import { Component, Pipeline } from '@astack-tech/core';
import type { Port } from '@astack-tech/core';

/**
 * Sends questions to `question` and everything else to `statement`.
 * Override `_transform()` to use named ports inside a pipeline.
 */
class Classifier extends Component {
  constructor() {
    super({});
    Component.Port.O('question').attach(this);
    Component.Port.O('statement').attach(this);
  }

  override _transform($i: Port, $o: Port): void {
    $i('in').receive((text: string) => {
      $o(text.trim().endsWith('?') ? 'question' : 'statement').send(text);
    });
  }
}

class Answer extends Component {
  constructor() {
    super({});
  }

  override run(text: unknown): string {
    return `Answering: ${String(text)}`;
  }
}

class Note extends Component {
  constructor() {
    super({});
  }

  override run(text: unknown): string {
    return `Noted: ${String(text)}`;
  }
}

const pipeline = new Pipeline();
pipeline.addComponent('classify', new Classifier());
pipeline.addComponent('answer', new Answer());
pipeline.addComponent('note', new Note());

pipeline.connect('classify.question', 'answer.in');
pipeline.connect('classify.statement', 'note.in');

// With two branches there are two possible endpoints, so name the one you expect.
console.log(await pipeline.run<string>('classify.in', 'What is AStack?', 'answer.out'));
// Answering: What is AStack?

console.log(await pipeline.run<string>('classify.in', 'AStack is a framework.', 'note.out'));
// Noted: AStack is a framework.
