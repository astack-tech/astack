# Class: RLMAgent

Defined in: [packages/components/src/agents/rlm/RLMAgent.ts:111](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMAgent.ts#L111)

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

Defined in: [packages/components/src/agents/rlm/RLMAgent.ts:115](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMAgent.ts#L115)

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
| <a id="property-closeswithinputs"></a> `closesWithInputs` | `readonly` | `boolean` | Whether the node closes its outputs once all its inputs have ended (RFC 0001), so the end of a stream travels on. A node that keeps producing after its inputs end (a timer) overrides it with `false` and closes its outputs itself. | `Component.closesWithInputs` | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:204 |
| <a id="property-i"></a> `I` | `readonly` | `PortAccessor` | Resolves an input port. Bound to the node, so it can be passed around as `$i`. | `Component.I` | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:167 |
| <a id="property-id"></a> `id` | `readonly` | `string` | - | `Component.id` | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:163 |
| <a id="property-identity"></a> `identity` | `readonly` | `symbol` | - | `Component.identity` | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:164 |
| <a id="property-inport"></a> `inPort` | `protected readonly` | `Port` | The default `in` input port. | `Component.inPort` | packages/core/dist/component/index.d.ts:51 |
| <a id="property-o"></a> `O` | `readonly` | `PortAccessor` | Resolves an output port. Bound to the node, so it can be passed around as `$o`. | `Component.O` | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:169 |
| <a id="property-opts"></a> `opts` | `public` | `object` | - | `Component.opts` | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:165 |
| <a id="property-outport"></a> `outPort` | `protected readonly` | `Port` | The default `out` output port. A pipeline uses it to infer the endpoint. | `Component.outPort` | packages/core/dist/component/index.d.ts:53 |
| <a id="property-type"></a> `type` | `readonly` | *typeof* `TRANSFORM` | - | `Component.type` | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:197 |
| <a id="property-port"></a> `Port` | `static` | *typeof* `Port` | Port factory from the HLang runtime. `Component.Port.I(name)` and `Component.Port.O(name)` create input and output ports; call `.attach(this)` in the constructor. | `Component.Port` | packages/core/dist/component/index.d.ts:49 |

## Methods

### \_transform()

```ts
_transform($i, $o): void;
```

Defined in: [packages/components/src/agents/rlm/RLMAgent.ts:141](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMAgent.ts#L141)

Pipeline mode: receives `RLMInput` on `in` and sends the resolved `RLMResult` on `out`.
A failed run sends a result with an empty answer and an `error` message. Input that is
not an `RLMInput` fails the pipeline run with a `TypeError`.

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

### E()

```ts
E(): Port;
```

Defined in: node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:208

The error output (`@node/error`); Readable and Transform nodes have one.

#### Returns

`Port`

#### Inherited from

`Component.E`

***

### run()

```ts
run(data): Promise<RLMResult>;
```

Defined in: [packages/components/src/agents/rlm/RLMAgent.ts:132](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMAgent.ts#L132)

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

Defined in: [packages/components/src/agents/rlm/RLMAgent.ts:165](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMAgent.ts#L165)

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

Defined in: node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:207

Sends `error` on the error output.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

#### Returns

`void`

#### Inherited from

`Component.throw`
