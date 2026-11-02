---
title: 智能体
description: 让模型循环调用工具，直到能够给出回答。
order: 8
examples: [agent]
api: [components/classes/Agent, components/interfaces/AgentConfig, components/interfaces/AgentOutput, tools/interfaces/Tool]
source: d4639ccabc2121f943e819baa847cb12c08faf19ad9d8a83ba362eb0d78a85fa
---

`@astack-tech/components` 中的 `Agent` 运行这样一个循环：

1. 把对话和工具列表发送给模型。
2. 如果回复中没有工具调用，就停止并返回该回复。
3. 否则执行模型请求的每个工具，把结果加入对话，然后回到第 1 步。

即使模型一直请求工具，循环也会在模型被调用 `maxIterations` 次后停止。

```typescript
import { Agent } from '@astack-tech/components';
import { ModelProvider } from '@astack-tech/integrations';

const agent = new Agent({
  // Any model works: OpenAICompatible (OpenAI, Qwen, Ollama, ...), Deepseek or your own.
  model: new ModelProvider.Deepseek({ apiKey }),
  tools: [multiply],
  systemPrompt: 'Use tools for arithmetic.',
});

const output = await agent.run('What is 37 times 43?');
```

## 配置

| 选项 | 默认值 | 含义 |
| --- | --- | --- |
| `model` | — | 任意[模型提供方](/zh/docs/model-providers)：一个带 `chatCompletion()` 的对象 |
| `tools` | `[]` | 提供 `invoke(args)` 或 `execute(args)` 的工具 |
| `systemPrompt` | `You are a helpful assistant.` | 工具列表会追加在它后面 |
| `maxIterations` | `10` | 每次运行最多调用模型的次数 |
| `memory` | `DefaultMemory` | 每次运行时清空，并以系统提示词作为开头 |
| `verbose` | `false` | 在控制台输出每一步 |

## 输入与输出

`run()` 接受一个字符串，或 `{ messages, context }`。对于没有 `metadata` 的消息，`context` 会成为它的 `metadata`。

`run()` 返回的结果包含：

| 字段 | 内容 |
| --- | --- |
| `message` | 最后一段 assistant 文本 |
| `toolCalls` | 每个执行过的工具的 `{ tool, args, result }`，包括失败的调用 |
| `history` | 完整对话，包括工具调用的各轮 |
| `usage` | 所有模型调用的 token 用量之和 |

## 工具错误

智能体不会因为工具而抛出错误。未知的工具、无效的 JSON 参数，或者工具本身抛出的错误，都会变成结果消息中的一行错误信息，由模型决定下一步怎么做。模型本身的错误则会使 `run()` 被拒绝。

## 在管道中

智能体在 `in` 上读取字符串或 `AgentInput`，在 `out` 上发送 `AgentOutput`。如果运行失败，它会发送一个 `error` 字段带有错误信息的输出。
