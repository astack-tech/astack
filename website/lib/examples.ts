/** Examples checked against the local package export maps and component interfaces. */
export const agentCode = `import { Agent } from '@astack-tech/components';
import { Deepseek } from '@astack-tech/integrations/model-provider';

const apiKey = process.env.DEEPSEEK_API_KEY;
if (!apiKey) throw new Error('Set DEEPSEEK_API_KEY');

const agent = new Agent({
  model: new Deepseek({ apiKey, model: 'deepseek-chat' }),
  systemPrompt: 'Explain ideas clearly and precisely.',
  maxIterations: 10,
});

const result = await agent.run('Explain flow-based programming');
console.log(result.message);`;

export const componentCode = `import { Component, type Port } from '@astack-tech/core';

class Uppercase extends Component {
  constructor() { super({}); }

  run(data: string): string {
    return data.toUpperCase();
  }

  _transform($i: Port, $o: Port): void {
    $i('in').receive<string>((data) => {
      $o('out').send(this.run(data));
    });
  }
}

const result = new Uppercase().run('hello');`;

export const pipelineCode = `import { Pipeline } from '@astack-tech/core';

// splitter, embedder, and store are application components.
const pipeline = new Pipeline();
pipeline.addComponent('splitter', splitter);
pipeline.addComponent('embedder', embedder);
pipeline.addComponent('store', store);

pipeline.connect('splitter.out', 'embedder.in');
pipeline.connect('embedder.out', 'store.in');

// Auto-infer a single leaf endpoint.
await pipeline.run('splitter.in', document);
// Select an explicit endpoint.
await pipeline.run('splitter.in', document, 'store.out');
// Collect multiple outputs.
await pipeline.run('splitter.in', document, {
  includeOutputsFrom: ['embedder.out', 'store.out'],
});`;

export const streamingCode = `import { StreamingAgent } from '@astack-tech/components';
import { Deepseek } from '@astack-tech/integrations/model-provider';

const apiKey = process.env.DEEPSEEK_API_KEY;
if (!apiKey) throw new Error('Set DEEPSEEK_API_KEY');

const agent = new StreamingAgent({
  model: new Deepseek({ apiKey, model: 'deepseek-chat' }),
});

for await (const chunk of agent.runStream('Explain AStack')) {
  if (chunk.type === 'assistant_message' && chunk.content) {
    process.stdout.write(chunk.content);
  }
}`;
