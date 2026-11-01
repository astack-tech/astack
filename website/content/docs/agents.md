---
title: Agents
description: Let a model call tools in a loop until it can answer.
order: 8
examples: [agent]
---

`Agent` from `@astack-tech/components` runs this loop:

1. Send the conversation and the tool list to the model.
2. If the reply has no tool calls, stop and return it.
3. Otherwise run every requested tool, add the results to the conversation, and go back to step 1.

The loop stops after `maxIterations` model calls even if the model keeps asking for tools.

```typescript
import { Agent } from '@astack-tech/components';
import { ModelProvider } from '@astack-tech/integrations';

const agent = new Agent({
  model: new ModelProvider.Deepseek({ apiKey }),
  tools: [multiply],
  systemPrompt: 'Use tools for arithmetic.',
});

const output = await agent.run('What is 37 times 43?');
```

## Configuration

| Option | Default | Meaning |
| --- | --- | --- |
| `model` | — | A [model provider](/docs/model-providers) |
| `tools` | `[]` | Tools with `invoke(args)` or `execute(args)` |
| `systemPrompt` | `You are a helpful assistant.` | The tool list is appended to it |
| `maxIterations` | `10` | Maximum model calls per run |
| `memory` | `DefaultMemory` | Cleared and seeded with the system prompt on each run |
| `verbose` | `false` | Log each step to the console |

## Input and output

`run()` accepts a string or `{ messages, context }`. `context` becomes the `metadata` of every message that has none.

`run()` resolves with:

| Field | Contents |
| --- | --- |
| `message` | The last assistant text |
| `toolCalls` | `{ tool, args, result }` for every tool that ran, including failures |
| `history` | The full conversation, including tool rounds |
| `usage` | Token usage summed over every model call |

## Tool errors

The agent never throws because of a tool. An unknown tool, invalid JSON arguments, or a tool that throws becomes an error line in the results message, and the model decides what to do next. Model errors do reject `run()`.

## In a pipeline

An agent reads a string or `AgentInput` on `in` and sends `AgentOutput` on `out`. If the run fails, it sends an output whose `error` field holds the message.
