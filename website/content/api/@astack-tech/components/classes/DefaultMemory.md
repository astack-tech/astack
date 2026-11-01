# Class: DefaultMemory

Defined in: [packages/components/src/agents/memory.ts:6](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/memory.ts#L6)

In-memory message history.

## Implements

- [`Memory`](../interfaces/Memory.md)

## Constructors

### Constructor

```ts
new DefaultMemory(): DefaultMemory;
```

#### Returns

`DefaultMemory`

## Methods

### addMessage()

```ts
addMessage(message): void;
```

Defined in: [packages/components/src/agents/memory.ts:10](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/memory.ts#L10)

Stores a message at the end of the history.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | [`AgentMessage`](../interfaces/AgentMessage.md) |

#### Returns

`void`

#### Implementation of

[`Memory`](../interfaces/Memory.md).[`addMessage`](../interfaces/Memory.md#addmessage)

***

### clear()

```ts
clear(): void;
```

Defined in: [packages/components/src/agents/memory.ts:27](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/memory.ts#L27)

Removes every stored message.

#### Returns

`void`

#### Implementation of

[`Memory`](../interfaces/Memory.md).[`clear`](../interfaces/Memory.md#clear)

***

### getFormattedMemory()

```ts
getFormattedMemory(): AgentMessage[];
```

Defined in: [packages/components/src/agents/memory.ts:22](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/memory.ts#L22)

Returns every stored message. `DefaultMemory` does not truncate by token count.

#### Returns

[`AgentMessage`](../interfaces/AgentMessage.md)[]

#### Implementation of

[`Memory`](../interfaces/Memory.md).[`getFormattedMemory`](../interfaces/Memory.md#getformattedmemory)

***

### getMessages()

```ts
getMessages(): AgentMessage[];
```

Defined in: [packages/components/src/agents/memory.ts:15](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/memory.ts#L15)

Returns a copy of every stored message, oldest first.

#### Returns

[`AgentMessage`](../interfaces/AgentMessage.md)[]

#### Implementation of

[`Memory`](../interfaces/Memory.md).[`getMessages`](../interfaces/Memory.md#getmessages)
