# Class: StreamingAgent

Defined in: [packages/components/src/agents/StreamingAgent.ts:131](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L131)

Agent that reports its progress as a stream of `StreamingChunk` events.

It follows the same loop as `Agent`. When the model implements
`streamChatCompletion`, assistant text is streamed token by token; otherwise each
reply arrives as one `assistant_message`.

Ports: `in` receives a string or an `AgentInput`; `out` sends every `StreamingChunk`.

## Extends

- `Component`

## Constructors

### Constructor

```ts
new StreamingAgent(config): StreamingAgent;
```

Defined in: [packages/components/src/agents/StreamingAgent.ts:134](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L134)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`AgentConfig`](../interfaces/AgentConfig.md) |

#### Returns

`StreamingAgent`

#### Overrides

`Component.constructor`

## Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="property-flow"></a> `flow` | `public` | `Flow` \| `null` | - | `Component.flow` | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:63 |
| <a id="property-i"></a> `I` | `public` | (`name`) => `Port` | - | `Component.I` | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:65 |
| <a id="property-id"></a> `id` | `public` | `string` | - | `Component.id` | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:57 |
| <a id="property-identity"></a> `identity` | `public` | `Symbol` | - | `Component.identity` | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:64 |
| <a id="property-inport"></a> `inPort` | `protected readonly` | `Port` | The default `in` input port. | `Component.inPort` | packages/core/dist/component/index.d.ts:49 |
| <a id="property-isrunning"></a> `isRunning` | `public` | `boolean` | - | `Component.isRunning` | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:62 |
| <a id="property-o"></a> `O` | `public` | (`name`) => `Port` | - | `Component.O` | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:66 |
| <a id="property-opts"></a> `opts` | `public` | `object` | - | `Component.opts` | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:58 |
| <a id="property-outport"></a> `outPort` | `protected readonly` | `Port` | The default `out` output port. A pipeline uses it to infer the endpoint. | `Component.outPort` | packages/core/dist/component/index.d.ts:51 |
| <a id="property-portmap"></a> `portMap` | `public` | `PortMap` | - | `Component.portMap` | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:61 |
| <a id="property-type"></a> `type` | `public` | `Symbol` | - | `Component.type` | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:56 |
| <a id="property-port"></a> `Port` | `static` | *typeof* `Port` | Port factory from the HLang runtime. `Component.Port.I(name)` and `Component.Port.O(name)` create input and output ports; call `.attach(this)` in the constructor. | `Component.Port` | packages/core/dist/component/index.d.ts:47 |

## Methods

### \_transform()

```ts
_transform($i, $o): void;
```

Defined in: [packages/components/src/agents/StreamingAgent.ts:173](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L173)

Streams every event of a run to `out`. A failed run ends with one `error` event.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `$i` | `Port` |
| `$o` | `Port` |

#### Returns

`void`

#### Overrides

`Component._transform`

***

### attach()

```ts
attach(flow): void;
```

Defined in: node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:70

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `flow` | `any` |

#### Returns

`void`

#### Inherited from

`Component.attach`

***

### attachPort()

```ts
attachPort(port): void;
```

Defined in: node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:71

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `port` | `any` |

#### Returns

`void`

#### Inherited from

`Component.attachPort`

***

### E()

```ts
E(): Port;
```

Defined in: node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:69

#### Returns

`Port`

#### Inherited from

`Component.E`

***

### executeOnce()

```ts
executeOnce(type, ...args): void;
```

Defined in: node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:68

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `any` |
| ...`args` | `any`[] |

#### Returns

`void`

#### Inherited from

`Component.executeOnce`

***

### reset()

```ts
reset(): void;
```

Defined in: [packages/components/src/agents/StreamingAgent.ts:190](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L190)

Clears the memory and stores the system prompt again.

#### Returns

`void`

***

### run()

```ts
run(input): Promise<AgentOutput>;
```

Defined in: [packages/components/src/agents/StreamingAgent.ts:160](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L160)

Runs the agent to completion and returns the final output.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | `string` \| [`AgentInput`](../interfaces/AgentInput.md) |

#### Returns

`Promise`\<[`AgentOutput`](../interfaces/AgentOutput.md)\>

#### Overrides

`Component.run`

***

### runStream()

```ts
runStream(input): AsyncGenerator<StreamingChunk, AgentOutput>;
```

Defined in: [packages/components/src/agents/StreamingAgent.ts:144](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L144)

Runs the agent and yields progress events. The generator returns the final output.
On failure it yields one `error` event and rethrows.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | `string` \| [`AgentInput`](../interfaces/AgentInput.md) |

#### Returns

`AsyncGenerator`\<[`StreamingChunk`](../interfaces/StreamingChunk.md), [`AgentOutput`](../interfaces/AgentOutput.md)\>

***

### throw()

```ts
throw(error): void;
```

Defined in: node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:87

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `any` |

#### Returns

`void`

#### Inherited from

`Component.throw`
