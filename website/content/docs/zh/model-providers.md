---
title: 模型提供方
description: 使用 OpenAI、DeepSeek、通义千问、本地模型或其他任何 API。智能体依赖的是接口，而不是某个厂商。
order: 7
examples: [chat, custom-model]
api: [integrations/namespaces/ModelProvider/classes/OpenAICompatible, integrations/namespaces/ModelProvider/interfaces/OpenAICompatibleConfig, integrations/namespaces/ModelProvider/classes/Deepseek, integrations/namespaces/ModelProvider/interfaces/DeepseekConfig, components/interfaces/ModelProvider]
source: 70b36e19865009d689ea72fdc4b0c49bf71f0c3ea82fe7918f7672f2ab93df0d
---

模型提供方是与模型 API 通信的组件。智能体接受任何满足 `@astack-tech/components` 中 `ModelProvider` 接口的对象，所以 AStack 不依赖任何厂商：

```typescript
interface ModelProvider {
  chatCompletion(messages: Message[], options?: { temporaryTools?: unknown[] }): Promise<Message>;
  streamChatCompletion?(
    messages: Message[],
    options?: { temporaryTools?: unknown[] }
  ): AsyncGenerator<Partial<Message>>;
}
```

`streamChatCompletion` 是可选的。没有它时，`StreamingAgent` 会退回到 `chatCompletion`，把每条回复整段发出。

## 选择提供方

| 模型 | 写法 |
| --- | --- |
| OpenAI | `new ModelProvider.OpenAICompatible({ apiKey, model: 'gpt-4o-mini' })` |
| DeepSeek | `new ModelProvider.Deepseek({ apiKey })` |
| 通义千问、Moonshot 等兼容 OpenAI 的 API | `new ModelProvider.OpenAICompatible({ apiKey, baseURL, model })` |
| 通过 Ollama 或 vLLM 运行的本地模型 | `new ModelProvider.OpenAICompatible({ apiKey: 'ollama', baseURL: 'http://localhost:11434/v1', model: 'llama3.1' })` |
| 其他任何 API | 自己实现 `chatCompletion`，参见[编写提供方](#编写提供方)。 |

示例使用 DeepSeek，以便按原样直接运行。每个示例都只用一行代码创建模型，改掉这一行就能换成其他提供方。

## OpenAI 兼容接口

`OpenAICompatible` 可以调用任何遵循 OpenAI 聊天补全（chat completions）协议的 API：既包括 OpenAI 本身，也包括 DeepSeek、通义千问（Qwen）、Moonshot、Ollama、vLLM 等提供方的兼容端点。

```typescript
import { ModelProvider } from '@astack-tech/integrations';

// OpenAI
const openai = new ModelProvider.OpenAICompatible({
  apiKey: process.env['OPENAI_API_KEY'] ?? '',
  model: 'gpt-4o-mini',
});

// Qwen through DashScope's compatible mode
const qwen = new ModelProvider.OpenAICompatible({
  apiKey: process.env['DASHSCOPE_API_KEY'] ?? '',
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  model: 'qwen-plus',
  name: 'Qwen',
});

// A local model served by Ollama
const local = new ModelProvider.OpenAICompatible({
  apiKey: 'ollama',
  baseURL: 'http://localhost:11434/v1',
  model: 'llama3.1',
  name: 'Ollama',
});
```

也可以从子路径导入：`import { OpenAICompatible } from '@astack-tech/integrations/model-provider'`。

| 选项 | 默认值 | 含义 |
| --- | --- | --- |
| `apiKey` | — | 提供方的 API 密钥 |
| `model` | — | 模型名称（必填） |
| `baseURL` | `https://api.openai.com/v1` | API 基础地址 |
| `name` | `The model API` | 错误信息和日志中显示的提供方名称 |
| `temperature` | `0.7` | 采样温度 |
| `maxTokens`、`topP` | 不发送 | 可选的采样限制 |
| `systemPrompt` | 无 | 每次请求前添加的系统提示词 |
| `rawTools` | 无 | 以 `{ name, description, parameters }` 形式提供的工具 |
| `tools` | 无 | OpenAI `{ type: 'function', function }` 格式的工具 |
| `verbose` | `false` | 在控制台输出 API 错误 |

工具调用和流式输出是否可用，取决于提供方端点的支持情况。

## Deepseek

`Deepseek` 就是以 DeepSeek 的端点和模型为默认值的 `OpenAICompatible`，方法、端口和其他选项完全相同。

```typescript
import { ModelProvider } from '@astack-tech/integrations';

const model = new ModelProvider.Deepseek({ apiKey: process.env['DEEPSEEK_API_KEY'] ?? '' });
```

| 选项 | 默认值 | 含义 |
| --- | --- | --- |
| `apiKey` | — | DeepSeek API 密钥 |
| `model` | `deepseek-chat` | 模型名称 |
| `baseURL` | `https://api.deepseek.com/v1` | API 基础地址 |

## 方法与端口

两个提供方的方法相同：

| 方法 | 返回值 |
| --- | --- |
| `run(prompt: string)` | 文本回答 |
| `run(messages)` / `chatCompletion(messages, options?)` | 一条 assistant 消息，包含 `content`、`tool_calls` 和 `usage` |
| `streamChatCompletion(messages, options?)` | 包含文本增量、工具调用增量和用量的数据块 |
| `generateCompletion(prompt)` | 文本回答；当模型调用工具时，返回 JSON 形式的 assistant 消息 |

`options.temporaryTools` 会在单次调用中替换已配置的工具。

在管道中，它们读写以下端口：

| 输入 | 输出 |
| --- | --- |
| `prompt`（字符串） | `completion`（字符串） |
| `messages`（消息列表） | `message`（assistant 消息） |

如果在管道中 API 调用失败，提供方会发送 `'API call failed'`（在 `completion` 上），或一条内容为该文本的 assistant 消息（在 `message` 上），这样管道不会卡住。设置 `verbose: true` 可以输出错误信息。任一输入端口收到类型不对的值时，这次运行会以 `TypeError` 被拒绝，不会调用 API。

消息在发送请求之前会先经过检查：role 必须是 `system`、`user`、`assistant` 或 `tool`，`tool` 消息必须带上它所回应的调用的 `tool_call_id`；否则调用会失败，错误信息里带有提供方的名称。省略的 content 会以空文本发送，`assistant` 消息除外。

## 编写提供方

如果 API 遵循 OpenAI 协议，直接使用 `OpenAICompatible`。否则实现 `chatCompletion`；如果 API 支持流式输出，再实现 `streamChatCompletion`。一个普通对象就足以驱动智能体：

```typescript
import type { ModelProvider } from '@astack-tech/components';

const model: ModelProvider = {
  async chatCompletion(messages) {
    const text = await callYourApi(messages);
    return { role: 'assistant', content: text };
  },
};
```

如果要请求调用工具，就返回一条带 `tool_calls`（`id`、`type: 'function'`、`function: { name, arguments }`）的 assistant 消息；智能体会执行工具，再把结果发回给模型。[自定义模型示例](/examples/custom-model)离线演示了这一过程。如果还想把提供方作为管道中的一步，就继承 `Component`。`packages/integrations` 中 `OpenAICompatible` 的源码是一份完整的参考实现。
