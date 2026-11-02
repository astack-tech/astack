# Interface: ModelProvider

Defined in: [packages/components/src/agents/types.ts:113](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L113)

Contract that a model component must meet to drive an agent.
Any object with `chatCompletion()` works. `OpenAICompatible` and `Deepseek` from
`@astack-tech/integrations` implement it; see the custom-model example for your own.

## Methods

### chatCompletion()

```ts
chatCompletion(messages, options?): Promise<AgentMessage>;
```

Defined in: [packages/components/src/agents/types.ts:115](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L115)

Sends the conversation and resolves with the assistant reply, including any tool calls and token usage.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `messages` | [`AgentMessage`](AgentMessage.md)[] |
| `options?` | [`ModelProviderOptions`](ModelProviderOptions.md) |

#### Returns

`Promise`\<[`AgentMessage`](AgentMessage.md)\>

***

### streamChatCompletion()?

```ts
streamChatCompletion?(messages, options?): AsyncGenerator<Partial<AgentMessage>>;
```

Defined in: [packages/components/src/agents/types.ts:120](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L120)

Optional. Streams the reply as partial messages: text deltas, tool-call deltas and usage. Without it, `StreamingAgent` falls back to `chatCompletion`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `messages` | [`AgentMessage`](AgentMessage.md)[] |
| `options?` | [`ModelProviderOptions`](ModelProviderOptions.md) |

#### Returns

`AsyncGenerator`\<`Partial`\<[`AgentMessage`](AgentMessage.md)\>\>
