# Interface: ModelProvider

Defined in: [packages/components/src/agents/types.ts:112](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L112)

Contract that a model component must meet to drive an agent.
`Deepseek` from `@astack-tech/integrations` implements it.

## Methods

### chatCompletion()

```ts
chatCompletion(messages, options?): Promise<AgentMessage>;
```

Defined in: [packages/components/src/agents/types.ts:114](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L114)

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

Defined in: [packages/components/src/agents/types.ts:119](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L119)

Optional. Streams the reply as partial messages: text deltas, tool-call deltas and usage. Without it, `StreamingAgent` falls back to `chatCompletion`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `messages` | [`AgentMessage`](AgentMessage.md)[] |
| `options?` | [`ModelProviderOptions`](ModelProviderOptions.md) |

#### Returns

`AsyncGenerator`\<`Partial`\<[`AgentMessage`](AgentMessage.md)\>\>
