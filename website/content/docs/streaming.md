---
title: Streaming
description: Stream agent progress to a terminal, a pipeline or an HTTP client.
order: 9
examples: [streaming-agent, http-server]
api: [components/classes/StreamingAgent, components/interfaces/StreamingChunk]
---

`StreamingAgent` runs the same loop as [`Agent`](/docs/agents) and reports each step as an event.

```typescript
for await (const event of agent.runStream('How many words are in this sentence?')) {
  if (event.type === 'assistant_message') {
    render(event.content);
  }
}
```

## Events

| `type` | Fields | When |
| --- | --- | --- |
| `iteration_start` | `iteration` | Before each model call |
| `model_thinking` | — | The request has been sent |
| `assistant_message` | `content`, `toolCalls` | Each text delta. `content` holds the text so far in this iteration. |
| `tool_start` | `toolName` | Before a tool runs |
| `tool_result` | `toolName`, `result` | After a tool runs. Failures have `result: { error }`. |
| `completed` | `finalMessage`, `history`, `allToolCalls`, `usage` | Once, at the end |
| `error` | `error` | Once, if the run fails. `runStream()` then throws. |

The generator's return value is the same `AgentOutput` that `Agent.run()` returns. `StreamingAgent.run()` consumes the stream and returns it.

When the model provider has no `streamChatCompletion`, each reply arrives as one `assistant_message`.

## In a pipeline

A streaming agent sends every event on `out`. Downstream components receive the events one by one.

## Over HTTP

Write each event as a Server-Sent Event:

```typescript
for await (const event of agent.runStream(body)) {
  response.write(`data: ${JSON.stringify(event)}\n\n`);
}
response.end();
```

The [HTTP server example](/examples/http-server) is a complete server in about 50 lines of `node:http`.
