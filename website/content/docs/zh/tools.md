---
title: 工具
description: 把函数、组件和 MCP 方法变成智能体可以调用的工具。
order: 6
examples: [tools, agent]
api: [tools/functions/createTool, tools/functions/createToolSet, tools/functions/createComponentTool, tools/functions/createMCPTool, components/classes/ToolInvoker]
source: c0bf80768bbb711910bf312864b9bbcb25ad060ea3977d3d62830bd865aa31d8
---

一个工具包含名称、描述、描述参数的 JSON Schema，以及一个返回 Promise 的 `invoke(args)` 方法。

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

函数可以是同步的，也可以是异步的。函数抛出的错误会让 `invoke()` 被拒绝。

## 工具集

`createToolSet(tools)` 返回一个 `ToolSet`，提供 `getTool`、`addTool`、`removeTool`、`getTools` 和 `size`。如果两个工具同名，保留第一个。

## 把组件作为工具

`createComponentTool` 把组件的 `run()` 暴露为工具。用 `transformArgs` 和 `transformResult` 适配参数和结果的形状：

```typescript
import { createComponentTool } from '@astack-tech/tools';

const splitTool = createComponentTool({
  name: 'split_text',
  description: 'Split text into chunks.',
  component: new TextSplitter({ chunkSize: 500 }),
  transformArgs: args => args['text'],
});
```

## MCP 工具

`createMCPTool` 调用 MCP 服务上的一个方法。它需要一个带有 `call(serviceName, methodName, args)` 方法的客户端，请把你使用的 MCP SDK 客户端适配成这个接口。客户端的错误会被重新抛出为 `MCP call failed: ...`，原始错误放在 `cause` 中。

## 执行工具调用

`ToolInvoker` 执行一条 assistant 消息中的工具调用，并为每个调用返回一条 `tool` 消息：

```typescript
const invoker = new ToolInvoker({ tools: [add] });
const { tool_messages } = await invoker.run({
  messages: [
    { role: 'assistant', tool_calls: [{ id: '1', tool_name: 'add', arguments: { a: 2, b: 3 } }] },
  ],
});
// [{ role: 'tool', content: '5', tool_call_id: '1' }]
```

| 选项 | 默认值 | 含义 |
| --- | --- | --- |
| `tools` | — | 工具数组，或一个 `ToolSet` |
| `parallel` | `false` | 并发执行调用 |
| `timeout` | `30000` | 每个调用的超时时间，单位为毫秒 |
| `verbose` | `false` | 在控制台输出执行过程 |

未知的工具、执行失败或超时，都会变成该调用的 tool 消息中的错误文本，其他调用照常执行。

智能体会自己执行工具，所以只有在自己编写循环时才需要 `ToolInvoker`。
