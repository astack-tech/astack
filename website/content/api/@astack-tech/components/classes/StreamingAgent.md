# Class: StreamingAgent

Defined in: [packages/components/src/agents/StreamingAgent.ts:138](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L138)

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

Defined in: [packages/components/src/agents/StreamingAgent.ts:141](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L141)

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

Defined in: [packages/components/src/agents/StreamingAgent.ts:182](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L182)

Streams every event of a run to `out`. A failed run ends with one `error` event.
Input that is neither a string nor an `AgentInput` fails the pipeline run with a
`TypeError`.

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

### reset()

```ts
reset(): void;
```

Defined in: [packages/components/src/agents/StreamingAgent.ts:204](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L204)

Clears the memory and stores the system prompt again.

#### Returns

`void`

***

### run()

```ts
run(input): Promise<AgentOutput>;
```

Defined in: [packages/components/src/agents/StreamingAgent.ts:167](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L167)

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

Defined in: [packages/components/src/agents/StreamingAgent.ts:151](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L151)

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
