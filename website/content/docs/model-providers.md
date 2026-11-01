---
title: Model providers
description: Call DeepSeek, and write a provider for any other model.
order: 7
examples: [chat]
---

A model provider is a component that talks to a model API. Agents accept any object that satisfies the `ModelProvider` interface from `@astack-tech/components`:

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

## Deepseek

```typescript
import { ModelProvider } from '@astack-tech/integrations';

const model = new ModelProvider.Deepseek({ apiKey: process.env['DEEPSEEK_API_KEY'] ?? '' });
```

You can also import it from the subpath: `import { Deepseek } from '@astack-tech/integrations/model-provider'`.

| Option | Default | Meaning |
| --- | --- | --- |
| `apiKey` | — | DeepSeek API key |
| `model` | `deepseek-chat` | Model name |
| `baseURL` | `https://api.deepseek.com/v1` | API base URL |
| `temperature` | `0.7` | Sampling temperature |
| `maxTokens`, `topP` | not sent | Optional sampling limits |
| `systemPrompt` | none | Added before every request |
| `rawTools` | none | Tools as `{ name, description, parameters }` |
| `tools` | none | Tools in the OpenAI `{ type: 'function', function }` format |
| `verbose` | `false` | Log API errors to the console |

### Methods

| Method | Returns |
| --- | --- |
| `run(prompt: string)` | The text answer |
| `run(messages)` / `chatCompletion(messages, options?)` | An assistant message with `content`, `tool_calls` and `usage` |
| `streamChatCompletion(messages, options?)` | Chunks with text deltas, tool-call deltas and usage |
| `generateCompletion(prompt)` | The text answer, or the JSON assistant message when the model calls tools |

`options.temporaryTools` replaces the configured tools for one call.

### Ports

| Input | Output |
| --- | --- |
| `prompt` (string) | `completion` (string) |
| `messages` (message list) | `message` (assistant message) |

If the API call fails inside a pipeline, the provider sends `'API call failed'` (on `completion`) or an assistant message with that text (on `message`), so the pipeline does not hang. Set `verbose: true` to log the error.

## Writing a provider

Implement `chatCompletion` and, if the API streams, `streamChatCompletion`. Extend `Component` when you also want to use the provider as a pipeline step. The `Deepseek` source in `packages/integrations` is a complete reference.
