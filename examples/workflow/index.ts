import { Component, Pipeline } from '@astack-tech/core';
import type { Port } from '@astack-tech/core';
import { ModelProvider } from '@astack-tech/integrations';

const apiKey = process.env['DEEPSEEK_API_KEY'];
if (apiKey === undefined || apiKey === '') {
  throw new Error('Set DEEPSEEK_API_KEY to run this example.');
}

// Any model works here: OpenAICompatible for OpenAI, Qwen or Ollama, or your own ModelProvider.
const model = new ModelProvider.Deepseek({ apiKey });

/**
 * One workflow step: build a prompt from the input, ask the model, send the answer on.
 */
class Step extends Component {
  private readonly instruction: (input: string) => string;

  constructor(instruction: (input: string) => string) {
    super({});
    this.instruction = instruction;
  }

  override _transform($i: Port, $o: Port): void {
    $i('in').receive(input => {
      if (typeof input !== 'string') {
        throw new TypeError('Step expects a string.');
      }
      // Return the promise: if the model call fails, the pipeline run rejects with its error.
      return model.generateCompletion(this.instruction(input)).then(output => {
        $o('out').send(output);
      });
    });
  }
}

const pipeline = new Pipeline();
pipeline.addComponent('outline', new Step(topic => `Write a 3-point outline about: ${topic}`));
pipeline.addComponent(
  'draft',
  new Step(outline => `Write one short paragraph per point:\n${outline}`)
);
pipeline.addComponent('edit', new Step(draft => `Make this clearer and shorter:\n${draft}`));

pipeline.connect('outline.out', 'draft.in');
pipeline.connect('draft.out', 'edit.in');

// outline -> draft -> edit. The endpoint `edit.out` is inferred.
console.log(await pipeline.run('outline.in', 'why data flow suits LLM apps'));
