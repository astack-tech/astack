import { Pipeline } from '@astack-tech/core';
import { ModelProvider } from '@astack-tech/integrations';

const apiKey = process.env['DEEPSEEK_API_KEY'];
if (apiKey === undefined || apiKey === '') {
  throw new Error('Set DEEPSEEK_API_KEY to run this example.');
}

// `Deepseek` is a preset of `OpenAICompatible`, which calls any OpenAI-compatible API:
//   OpenAI: new ModelProvider.OpenAICompatible({ apiKey, model: 'gpt-4o-mini' })
//   Ollama: new ModelProvider.OpenAICompatible({ apiKey: 'ollama', baseURL: 'http://localhost:11434/v1', model: 'llama3.1' })
// For any other API, implement ModelProvider (see the custom-model example).
const model = new ModelProvider.Deepseek({ apiKey, systemPrompt: 'Answer in one sentence.' });

// Standalone: a prompt in, text out.
console.log(await model.run('What is flow-based programming?'));

// Standalone: a conversation in, an assistant message out.
const reply = await model.chatCompletion([
  { role: 'user', content: 'Name one benefit of small components.' },
]);
console.log(reply.content);

// In a pipeline: the model reads `prompt` and writes `completion`.
const pipeline = new Pipeline();
pipeline.addComponent('llm', model);
console.log(await pipeline.run('llm.prompt', 'What is a port?', 'llm.completion'));
