# Interface: Memory

Defined in: [packages/components/src/agents/types.ts:89](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L89)

Conversation memory used by an agent.

## Methods

### addMessage()

```ts
addMessage(message): void;
```

Defined in: [packages/components/src/agents/types.ts:91](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L91)

Stores a message at the end of the history.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | [`AgentMessage`](AgentMessage.md) |

#### Returns

`void`

***

### clear()

```ts
clear(): void;
```

Defined in: [packages/components/src/agents/types.ts:97](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L97)

Removes every stored message.

#### Returns

`void`

***

### getFormattedMemory()

```ts
getFormattedMemory(maxTokens?): string | AgentMessage[];
```

Defined in: [packages/components/src/agents/types.ts:95](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L95)

Returns the history prepared for a model request, optionally limited to `maxTokens`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `maxTokens?` | `number` |

#### Returns

`string` \| [`AgentMessage`](AgentMessage.md)[]

***

### getMessages()

```ts
getMessages(): AgentMessage[];
```

Defined in: [packages/components/src/agents/types.ts:93](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L93)

Returns a copy of every stored message, oldest first.

#### Returns

[`AgentMessage`](AgentMessage.md)[]
