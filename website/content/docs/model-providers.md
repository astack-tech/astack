---
title: Model providers
description: Use OpenAI, DeepSeek, Qwen, local models or any other API. An agent depends on an interface, not on a vendor.
order: 7
examples: [chat, custom-model]
api: [integrations/namespaces/ModelProvider/classes/OpenAICompatible, integrations/namespaces/ModelProvider/interfaces/OpenAICompatibleConfig, integrations/namespaces/ModelProvider/classes/Deepseek, integrations/namespaces/ModelProvider/interfaces/DeepseekConfig, components/interfaces/ModelProvider]
---

A model provider is a component that talks to a model API. Agents accept any object that satisfies the `ModelProvider` interface from `@astack-tech/components`, so AStack does not depend on any vendor:

```typescript
interface ModelProvider {
  chatCompletion(messages: Message[], options?: { temporaryTools?: unknown[] }): Promise<Message>;
  streamChatCompletion?(
    messages: Message[],
    options?: { temporaryTools?: unknown[] }
  ): AsyncGenerator<Partial<Message>>;
}
```

`streamChatCompletion` is optional. Without it, `StreamingAgent` falls back to `chatCompletion` and emits each reply in one piece.

## Choose a provider

| Model | Provider |
| --- | --- |
| OpenAI | `new ModelProvider.OpenAICompatible({ apiKey, model: 'gpt-4o-mini' })` |
| DeepSeek | `new ModelProvider.Deepseek({ apiKey })` |
| Qwen, Moonshot and other OpenAI-compatible APIs | `new ModelProvider.OpenAICompatible({ apiKey, baseURL, model })` |
| Local models through Ollama or vLLM | `new ModelProvider.OpenAICompatible({ apiKey: 'ollama', baseURL: 'http://localhost:11434/v1', model: 'llama3.1' })` |
| Any other API | Implement `chatCompletion` yourself. See [Writing a provider](#writing-a-provider). |

The examples use DeepSeek so they run as written. Every example creates its model in one line; change that line to use another provider.

## OpenAI-compatible APIs

`OpenAICompatible` calls any API that speaks the OpenAI chat completions protocol: OpenAI itself and the compatible endpoints of providers such as DeepSeek, Qwen, Moonshot, Ollama and vLLM.

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

You can also import it from the subpath: `import { OpenAICompatible } from '@astack-tech/integrations/model-provider'`.

| Option | Default | Meaning |
| --- | --- | --- |
| `apiKey` | — | API key of the provider |
| `model` | — | Model name (required) |
| `baseURL` | `https://api.openai.com/v1` | API base URL |
| `name` | `The model API` | Provider name in errors and logs |
| `temperature` | `0.7` | Sampling temperature |
| `maxTokens`, `topP` | not sent | Optional sampling limits |
| `systemPrompt` | none | Added before every request |
| `rawTools` | none | Tools as `{ name, description, parameters }` |
| `tools` | none | Tools in the OpenAI `{ type: 'function', function }` format |
| `verbose` | `false` | Log API errors to the console |

Tool calling and streaming depend on what the provider's endpoint supports.

## Deepseek

`Deepseek` is `OpenAICompatible` with DeepSeek's endpoint and model as defaults. The methods, ports and other options are the same.

```typescript
import { ModelProvider } from '@astack-tech/integrations';

const model = new ModelProvider.Deepseek({ apiKey: process.env['DEEPSEEK_API_KEY'] ?? '' });
```

| Option | Default | Meaning |
| --- | --- | --- |
| `apiKey` | — | DeepSeek API key |
| `model` | `deepseek-chat` | Model name |
| `baseURL` | `https://api.deepseek.com/v1` | API base URL |

## Methods and ports

Both providers have the same methods:

| Method | Returns |
| --- | --- |
| `run(prompt: string)` | The text answer |
| `run(messages)` / `chatCompletion(messages, options?)` | An assistant message with `content`, `tool_calls` and `usage` |
| `streamChatCompletion(messages, options?)` | Chunks with text deltas, tool-call deltas and usage |
| `generateCompletion(prompt)` | The text answer, or the JSON assistant message when the model calls tools |

`options.temporaryTools` replaces the configured tools for one call.

In a pipeline they read and write these ports:

| Input | Output |
| --- | --- |
| `prompt` (string) | `completion` (string) |
| `messages` (message list) | `message` (assistant message) |

If the API call fails inside a pipeline, the provider sends `'API call failed'` (on `completion`) or an assistant message with that text (on `message`), so the pipeline does not hang. Set `verbose: true` to log the error. A value of the wrong type on either input port rejects the run with a `TypeError` before the API is called.

Messages are checked before the request is sent. The role must be `system`, `user`, `assistant` or `tool`, and a `tool` message needs the `tool_call_id` of the call it answers; otherwise the call fails with an error that names the provider. Content that is omitted is sent as empty text, except on `assistant` messages.

## Writing a provider

If the API speaks the OpenAI protocol, use `OpenAICompatible`. Otherwise implement `chatCompletion` and, if the API streams, `streamChatCompletion`. A plain object is enough to drive an agent:

```typescript
import type { ModelProvider } from '@astack-tech/components';

const model: ModelProvider = {
  async chatCompletion(messages) {
    const text = await callYourApi(messages);
    return { role: 'assistant', content: text };
  },
};
```

To ask for a tool, return an assistant message with `tool_calls` (`id`, `type: 'function'`, `function: { name, arguments }`); the agent runs the tool and sends the result back. The [custom model example](/examples/custom-model) does this offline. Extend `Component` when you also want to use the provider as a pipeline step. The `OpenAICompatible` source in `packages/integrations` is a complete reference.
