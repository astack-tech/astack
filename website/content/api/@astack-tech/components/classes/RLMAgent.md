# Class: RLMAgent

Defined in: [packages/components/src/agents/rlm/RLMAgent.ts:101](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMAgent.ts#L101)

RLMAgent - Recursive Language Model Agent

Processes long contexts by allowing the LLM to generate code that orchestrates
multiple sub-LLM calls for chunking and analysis tasks.

Supports true recursive nesting where Sub-LLM can itself be an RLM instance.

## Examples

Basic usage (depth=1):
```typescript
const agent = new RLMAgent({ rootLLM, subLLM });
const result = await agent.runStream({
  context: fileSystemContext,
  query: "Analyze this codebase"
});
```

Recursive RLM (depth=2) with shared context:
```typescript
const fsContext = new FileSystemContext(basePath, files);
const agent = new RLMAgent({
  rootLLM,
  subLLM,
  maxDepth: 2,
  sharedContext: fsContext
});
```

## Extends

- `Component`

## Constructors

### Constructor

```ts
new RLMAgent(config): RLMAgent;
```

Defined in: [packages/components/src/agents/rlm/RLMAgent.ts:105](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMAgent.ts#L105)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`RLMAgentConfig`](../interfaces/RLMAgentConfig.md) |

#### Returns

`RLMAgent`

#### Overrides

`Component.constructor`

## Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="property-flow"></a> `flow` | `public` | `Flow` \| `null` | - | `Component.flow` | node\_modules/.pnpm/@hlang-org+runtime@1.0.7/node\_modules/@hlang-org/runtime/lib/node/node.d.ts:24 |
| <a id="property-i"></a> `I` | `public` | (`name`) => `Port` | - | `Component.I` | node\_modules/.pnpm/@hlang-org+runtime@1.0.7/node\_modules/@hlang-org/runtime/lib/node/node.d.ts:26 |
| <a id="property-id"></a> `id` | `public` | `string` | - | `Component.id` | node\_modules/.pnpm/@hlang-org+runtime@1.0.7/node\_modules/@hlang-org/runtime/lib/node/node.d.ts:18 |
| <a id="property-identity"></a> `identity` | `public` | `Symbol` | - | `Component.identity` | node\_modules/.pnpm/@hlang-org+runtime@1.0.7/node\_modules/@hlang-org/runtime/lib/node/node.d.ts:25 |
| <a id="property-inport"></a> `inPort` | `protected readonly` | `Port` | The default `in` input port. | `Component.inPort` | packages/core/dist/component/index.d.ts:49 |
| <a id="property-isrunning"></a> `isRunning` | `public` | `boolean` | - | `Component.isRunning` | node\_modules/.pnpm/@hlang-org+runtime@1.0.7/node\_modules/@hlang-org/runtime/lib/node/node.d.ts:23 |
| <a id="property-o"></a> `O` | `public` | (`name`) => `Port` | - | `Component.O` | node\_modules/.pnpm/@hlang-org+runtime@1.0.7/node\_modules/@hlang-org/runtime/lib/node/node.d.ts:27 |
| <a id="property-opts"></a> `opts` | `public` | `object` | - | `Component.opts` | node\_modules/.pnpm/@hlang-org+runtime@1.0.7/node\_modules/@hlang-org/runtime/lib/node/node.d.ts:19 |
| <a id="property-outport"></a> `outPort` | `protected readonly` | `Port` | The default `out` output port. A pipeline uses it to infer the endpoint. | `Component.outPort` | packages/core/dist/component/index.d.ts:51 |
| <a id="property-portmap"></a> `portMap` | `public` | `PortMap` | - | `Component.portMap` | node\_modules/.pnpm/@hlang-org+runtime@1.0.7/node\_modules/@hlang-org/runtime/lib/node/node.d.ts:22 |
| <a id="property-type"></a> `type` | `public` | `Symbol` | - | `Component.type` | node\_modules/.pnpm/@hlang-org+runtime@1.0.7/node\_modules/@hlang-org/runtime/lib/node/node.d.ts:17 |
| <a id="property-port"></a> `Port` | `static` | *typeof* `Port` | Port factory from the HLang runtime. `Component.Port.I(name)` and `Component.Port.O(name)` create input and output ports; call `.attach(this)` in the constructor. | `Component.Port` | packages/core/dist/component/index.d.ts:47 |

## Methods

### \_transform()

```ts
_transform($i, $o): void;
```

Defined in: [packages/components/src/agents/rlm/RLMAgent.ts:130](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMAgent.ts#L130)

Pipeline mode: receives `RLMInput` on `in` and sends the resolved `RLMResult` on `out`.
A failed run sends a result with an empty answer and an `error` message.

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

Defined in: node\_modules/.pnpm/@hlang-org+runtime@1.0.7/node\_modules/@hlang-org/runtime/lib/node/node.d.ts:31

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

Defined in: node\_modules/.pnpm/@hlang-org+runtime@1.0.7/node\_modules/@hlang-org/runtime/lib/node/node.d.ts:32

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

Defined in: node\_modules/.pnpm/@hlang-org+runtime@1.0.7/node\_modules/@hlang-org/runtime/lib/node/node.d.ts:30

#### Returns

`Port`

#### Inherited from

`Component.E`

***

### executeOnce()

```ts
executeOnce(type, ...args): void;
```

Defined in: node\_modules/.pnpm/@hlang-org+runtime@1.0.7/node\_modules/@hlang-org/runtime/lib/node/node.d.ts:29

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

### run()

```ts
run(data): Promise<RLMResult>;
```

Defined in: [packages/components/src/agents/rlm/RLMAgent.ts:122](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMAgent.ts#L122)

Process input through RLM

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`RLMInput`](../interfaces/RLMInput.md) |

#### Returns

`Promise`\<[`RLMResult`](../interfaces/RLMResult.md)\>

#### Overrides

`Component.run`

***

### runStream()

```ts
runStream(data): AsyncGenerator<RLMChunk>;
```

Defined in: [packages/components/src/agents/rlm/RLMAgent.ts:149](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMAgent.ts#L149)

Process input through RLM with streaming output

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`RLMInput`](../interfaces/RLMInput.md) |

#### Returns

`AsyncGenerator`\<[`RLMChunk`](../interfaces/RLMChunk.md)\>

***

### throw()

```ts
throw(error): void;
```

Defined in: node\_modules/.pnpm/@hlang-org+runtime@1.0.7/node\_modules/@hlang-org/runtime/lib/node/transform.d.ts:4

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `any` |

#### Returns

`void`

#### Inherited from

`Component.throw`
