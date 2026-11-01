import { Agent } from '@astack-tech/components';
import { ModelProvider } from '@astack-tech/integrations';
import { createTool } from '@astack-tech/tools';

const apiKey = process.env['DEEPSEEK_API_KEY'];
if (!apiKey) {
  throw new Error('Set DEEPSEEK_API_KEY to run this example.');
}

const multiply = createTool(
  'multiply',
  'Multiply two numbers.',
  args => Number(args['a']) * Number(args['b']),
  {
    type: 'object',
    properties: {
      a: { type: 'number', description: 'First factor' },
      b: { type: 'number', description: 'Second factor' },
    },
    required: ['a', 'b'],
  }
);

// The agent asks the model, runs the tools it requests, and repeats until the model answers.
const agent = new Agent({
  model: new ModelProvider.Deepseek({ apiKey }),
  tools: [multiply],
  systemPrompt: 'Use tools for arithmetic.',
  maxIterations: 5,
});

const output = await agent.run('What is 37 times 43?');

console.log(output.message);
console.log(output.toolCalls);
// [ { tool: 'multiply', args: { a: 37, b: 43 }, result: 1591 } ]
