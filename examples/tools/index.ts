import { ToolInvoker } from '@astack-tech/components';
import { createTool } from '@astack-tech/tools';

// A tool is a name, a description, a JSON Schema and a function.
const add = createTool(
  'add',
  'Add two numbers.',
  args => Number(args['a']) + Number(args['b']),
  {
    type: 'object',
    properties: { a: { type: 'number' }, b: { type: 'number' } },
    required: ['a', 'b'],
  }
);

const now = createTool('now', 'Return the current ISO date.', () => new Date().toISOString());

// ToolInvoker runs the tool calls found in a message. A model usually writes this message;
// here it is written by hand so the example runs without an API key.
const invoker = new ToolInvoker({ tools: [add, now] });

const { tool_messages } = await invoker.run({
  messages: [
    {
      role: 'assistant',
      tool_calls: [
        { id: 'call-1', tool_name: 'add', arguments: { a: 2, b: 3 } },
        { id: 'call-2', tool_name: 'missing', arguments: {} },
      ],
    },
  ],
});

console.log(tool_messages);
// [
//   { role: 'tool', content: '5', tool_call_id: 'call-1' },
//   { role: 'tool', content: '"Tool not found: missing"', tool_call_id: 'call-2' }
// ]
