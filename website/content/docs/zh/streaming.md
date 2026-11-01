---
title: 流式输出
description: 把智能体的进度以流的形式输出到终端、管道或 HTTP 客户端。
order: 9
examples: [streaming-agent, http-server]
api: [components/classes/StreamingAgent, components/interfaces/StreamingChunk]
source: e8addf157609b208cb7ef0be7ab69656bc566c45eec4dc77117290604070548c
---

`StreamingAgent` 运行与 [`Agent`](/zh/docs/agents) 相同的循环，并把每一步作为事件报告出来。

```typescript
for await (const event of agent.runStream('How many words are in this sentence?')) {
  if (event.type === 'assistant_message') {
    render(event.content);
  }
}
```

## 事件

| `type` | 字段 | 触发时机 |
| --- | --- | --- |
| `iteration_start` | `iteration` | 每次调用模型之前 |
| `model_thinking` | — | 请求已发出 |
| `assistant_message` | `content`、`toolCalls` | 每个文本增量。`content` 是本轮迭代到目前为止的文本。 |
| `tool_start` | `toolName` | 工具执行之前 |
| `tool_result` | `toolName`、`result` | 工具执行之后。失败时为 `result: { error }`。 |
| `completed` | `finalMessage`、`history`、`allToolCalls`、`usage` | 最后一次，结束时 |
| `error` | `error` | 运行失败时发出一次，随后 `runStream()` 抛出错误。 |

生成器的返回值与 `Agent.run()` 返回的 `AgentOutput` 相同。`StreamingAgent.run()` 会消费整个流并返回该结果。

如果模型提供方没有 `streamChatCompletion`，每条回复会作为一个完整的 `assistant_message` 到达。

## 在管道中

流式智能体会在 `out` 上发送每个事件，下游组件逐个接收这些事件。

## 通过 HTTP

把每个事件写成一个 Server-Sent Event：

```typescript
for await (const event of agent.runStream(body)) {
  response.write(`data: ${JSON.stringify(event)}\n\n`);
}
response.end();
```

[HTTP 服务器示例](/examples/http-server)用大约 50 行 `node:http` 代码实现了一个完整的服务器。
