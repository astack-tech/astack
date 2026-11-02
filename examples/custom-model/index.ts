import { Agent } from '@astack-tech/components';
import type { AgentMessage, ModelProvider } from '@astack-tech/components';
import { createTool } from '@astack-tech/tools';

const multiply = createTool(
  'multiply',
  'Multiply two numbers.',
  args => Number(args['a']) * Number(args['b']),
  {
    type: 'object',
    properties: { a: { type: 'number' }, b: { type: 'number' } },
    required: ['a', 'b'],
  }
);

/**
 * To an agent, a model is any object with `chatCompletion()`. AStack does not care which
 * API answers. The built-in providers (`OpenAICompatible` for OpenAI, DeepSeek, Qwen,
 * Ollama and other OpenAI-compatible APIs) are objects of this shape, and so is this one.
 *
 * This model follows two rules, so the example runs offline: it asks for `multiply`
 * with the numbers in the question, then answers with the tool's result.
 */
const ruleModel: ModelProvider = {
  chatCompletion(messages: AgentMessage[]): Promise<AgentMessage> {
    const last = messages.at(-1)?.content ?? '';
    const result = /Result: (.+)$/.exec(last)?.[1];
    if (result !== undefined) {
      return Promise.resolve({ role: 'assistant', content: `The answer is ${result}.` });
    }

    const [a = 0, b = 0] = (last.match(/\d+/g) ?? []).map(Number);
    return Promise.resolve({
      role: 'assistant',
      content: '',
      tool_calls: [
        {
          id: 'call-1',
          type: 'function',
          function: { name: 'multiply', arguments: JSON.stringify({ a, b }) },
        },
      ],
    });
  },
};

// The same Agent as in the agent example. Only the model changed.
const agent = new Agent({ model: ruleModel, tools: [multiply] });

const output = await agent.run('What is 37 times 43?');

console.log(output.message);
// The answer is 1591.
console.log(output.toolCalls);
// [ { tool: 'multiply', args: { a: 37, b: 43 }, result: 1591 } ]
