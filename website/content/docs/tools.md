---
title: Tools
description: Turn functions, components and MCP methods into tools that agents can call.
order: 6
examples: [tools, agent]
---

A tool has a name, a description, a JSON Schema for its arguments, and an `invoke(args)` method that returns a promise.

## createTool

```typescript
import { createTool } from '@astack-tech/tools';

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

await add.invoke({ a: 2, b: 3 }); // 5
```

The function can be synchronous or asynchronous. Errors it throws reject `invoke()`.

## Tool sets

`createToolSet(tools)` returns a `ToolSet` with `getTool`, `addTool`, `removeTool`, `getTools` and `size`. When two tools share a name, the first one is kept.

## Components as tools

`createComponentTool` exposes a component's `run()` as a tool. Use `transformArgs` and `transformResult` to adapt the shapes:

```typescript
import { createComponentTool } from '@astack-tech/tools';

const splitTool = createComponentTool({
  name: 'split_text',
  description: 'Split text into chunks.',
  component: new TextSplitter({ chunkSize: 500 }),
  transformArgs: args => args['text'],
});
```

## MCP tools

`createMCPTool` calls one method on an MCP service. It needs a client with a `call(serviceName, methodName, args)` method; adapt your MCP SDK client to that interface. Client errors are rethrown as `MCP call failed: ...` with the original error as `cause`.

## Running tool calls

`ToolInvoker` runs the tool calls in an assistant message and returns one `tool` message per call:

```typescript
const invoker = new ToolInvoker({ tools: [add] });
const { tool_messages } = await invoker.run({
  messages: [
    { role: 'assistant', tool_calls: [{ id: '1', tool_name: 'add', arguments: { a: 2, b: 3 } }] },
  ],
});
// [{ role: 'tool', content: '5', tool_call_id: '1' }]
```

| Option | Default | Meaning |
| --- | --- | --- |
| `tools` | — | An array of tools or a `ToolSet` |
| `parallel` | `false` | Run calls concurrently |
| `timeout` | `30000` | Timeout for each call, in milliseconds |
| `verbose` | `false` | Log progress to the console |

An unknown tool, a failure or a timeout becomes an error text in that call's tool message. The other calls still run.

Agents run tools themselves, so you only need `ToolInvoker` when you build your own loop.
