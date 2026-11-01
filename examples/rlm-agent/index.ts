import { fileURLToPath } from 'node:url';

import { FileSystemContext, RLMAgent } from '@astack-tech/components';
import type { LLMProvider } from '@astack-tech/components';
import { ModelProvider } from '@astack-tech/integrations';

const apiKey = process.env['DEEPSEEK_API_KEY'];
if (!apiKey) {
  throw new Error('Set DEEPSEEK_API_KEY to run this example.');
}

// RLM needs a minimal text-in, text-out interface. Adapt Deepseek to it.
const model = new ModelProvider.Deepseek({ apiKey });
const llm: LLMProvider = {
  generate: prompt => model.generateCompletion(prompt),
};

// The context is a directory. The root model writes code that reads files on demand,
// so the whole directory never has to fit in one prompt.
const sourceDir = fileURLToPath(new URL('../../packages/core/src', import.meta.url));
const context = new FileSystemContext(sourceDir);

const agent = new RLMAgent({ rootLLM: llm, subLLM: llm });

const result = await agent.run({
  context,
  query: 'How does Pipeline decide which output to return when no endpoint is given?',
});

console.log(result.answer);
