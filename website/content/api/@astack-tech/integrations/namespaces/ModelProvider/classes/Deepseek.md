# Class: Deepseek

Defined in: [packages/integrations/src/model-provider/deepseek/index.ts:38](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L38)

DeepSeek model provider: `OpenAICompatible` set up for the DeepSeek API.

Ports:
- `prompt` (in): a text prompt. The answer is sent on `completion`.
- `messages` (in): a list of chat messages. The reply is sent on `message`.

## Extends

- [`OpenAICompatible`](OpenAICompatible.md)

## Constructors

### Constructor

```ts
new Deepseek(config): Deepseek;
```

Defined in: [packages/integrations/src/model-provider/deepseek/index.ts:39](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L39)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`DeepseekConfig`](../interfaces/DeepseekConfig.md) |

#### Returns

`Deepseek`

#### Overrides

[`OpenAICompatible`](OpenAICompatible.md).[`constructor`](OpenAICompatible.md#constructor)

## Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="property-closeswithinputs"></a> `closesWithInputs` | `readonly` | `boolean` | Whether the node closes its outputs once all its inputs have ended (RFC 0001), so the end of a stream travels on. A node that keeps producing after its inputs end (a timer) overrides it with `false` and closes its outputs itself. | [`OpenAICompatible`](OpenAICompatible.md).[`closesWithInputs`](OpenAICompatible.md#property-closeswithinputs) | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:204 |
| <a id="property-i"></a> `I` | `readonly` | `PortAccessor` | Resolves an input port. Bound to the node, so it can be passed around as `$i`. | [`OpenAICompatible`](OpenAICompatible.md).[`I`](OpenAICompatible.md#property-i) | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:167 |
| <a id="property-id"></a> `id` | `readonly` | `string` | - | [`OpenAICompatible`](OpenAICompatible.md).[`id`](OpenAICompatible.md#property-id) | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:163 |
| <a id="property-identity"></a> `identity` | `readonly` | `symbol` | - | [`OpenAICompatible`](OpenAICompatible.md).[`identity`](OpenAICompatible.md#property-identity) | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:164 |
| <a id="property-inport"></a> `inPort` | `protected readonly` | `Port` | The default `in` input port. | [`OpenAICompatible`](OpenAICompatible.md).[`inPort`](OpenAICompatible.md#property-inport) | packages/core/dist/component/index.d.ts:51 |
| <a id="property-o"></a> `O` | `readonly` | `PortAccessor` | Resolves an output port. Bound to the node, so it can be passed around as `$o`. | [`OpenAICompatible`](OpenAICompatible.md).[`O`](OpenAICompatible.md#property-o) | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:169 |
| <a id="property-opts"></a> `opts` | `public` | `object` | - | [`OpenAICompatible`](OpenAICompatible.md).[`opts`](OpenAICompatible.md#property-opts) | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:165 |
| <a id="property-outport"></a> `outPort` | `protected readonly` | `Port` | The default `out` output port. A pipeline uses it to infer the endpoint. | [`OpenAICompatible`](OpenAICompatible.md).[`outPort`](OpenAICompatible.md#property-outport) | packages/core/dist/component/index.d.ts:53 |
| <a id="property-type"></a> `type` | `readonly` | *typeof* `TRANSFORM` | - | [`OpenAICompatible`](OpenAICompatible.md).[`type`](OpenAICompatible.md#property-type) | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:197 |
| <a id="property-port"></a> `Port` | `static` | *typeof* `Port` | Port factory from the HLang runtime. `Component.Port.I(name)` and `Component.Port.O(name)` create input and output ports; call `.attach(this)` in the constructor. | [`OpenAICompatible`](OpenAICompatible.md).[`Port`](OpenAICompatible.md#property-port) | packages/core/dist/component/index.d.ts:49 |

## Methods

### \_transform()

```ts
_transform($i, $o): void;
```

Defined in: [packages/integrations/src/model-provider/openai-compatible/index.ts:461](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L461)

Connects the `prompt` and `messages` input ports to the model.
API errors produce a fallback value so the pipeline keeps flowing. Input of the wrong
type fails the pipeline run with a `TypeError` before the API is called.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `$i` | `Port` |
| `$o` | `Port` |

#### Returns

`void`

#### Inherited from

[`OpenAICompatible`](OpenAICompatible.md).[`_transform`](OpenAICompatible.md#_transform)

***

### chatCompletion()

```ts
chatCompletion(messages, options?): Promise<DeepseekAssistantMessage>;
```

Defined in: [packages/integrations/src/model-provider/openai-compatible/index.ts:362](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L362)

Sends a conversation and returns the assistant reply.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `messages` | [`DeepseekMessage`](../interfaces/DeepseekMessage.md)[] |
| `options?` | [`DeepseekChatCompletionOptions`](../interfaces/DeepseekChatCompletionOptions.md) |

#### Returns

`Promise`\<[`DeepseekAssistantMessage`](../interfaces/DeepseekAssistantMessage.md)\>

#### Inherited from

[`OpenAICompatible`](OpenAICompatible.md).[`chatCompletion`](OpenAICompatible.md#chatcompletion)

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

[`OpenAICompatible`](OpenAICompatible.md).[`E`](OpenAICompatible.md#e)

***

### generateCompletion()

```ts
generateCompletion(prompt): Promise<string>;
```

Defined in: [packages/integrations/src/model-provider/openai-compatible/index.ts:345](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L345)

Generates a completion for a single prompt.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `prompt` | `string` |

#### Returns

`Promise`\<`string`\>

The text answer, or the JSON-encoded assistant message when it contains tool calls.

#### Inherited from

[`OpenAICompatible`](OpenAICompatible.md).[`generateCompletion`](OpenAICompatible.md#generatecompletion)

***

### run()

```ts
run(input): Promise<
  | string
| DeepseekAssistantMessage>;
```

Defined in: [packages/integrations/src/model-provider/openai-compatible/index.ts:452](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L452)

Runs the model outside a pipeline.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` \| [`DeepseekMessage`](../interfaces/DeepseekMessage.md)[] | A prompt string or a list of messages. |

#### Returns

`Promise`\<
  \| `string`
  \| [`DeepseekAssistantMessage`](../interfaces/DeepseekAssistantMessage.md)\>

#### Inherited from

[`OpenAICompatible`](OpenAICompatible.md).[`run`](OpenAICompatible.md#run)

***

### streamChatCompletion()

```ts
streamChatCompletion(messages, options?): AsyncGenerator<DeepseekStreamChunk>;
```

Defined in: [packages/integrations/src/model-provider/openai-compatible/index.ts:404](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L404)

Streams the assistant reply. Each chunk holds a text delta, tool-call deltas, or usage.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `messages` | [`DeepseekMessage`](../interfaces/DeepseekMessage.md)[] |
| `options?` | [`DeepseekChatCompletionOptions`](../interfaces/DeepseekChatCompletionOptions.md) |

#### Returns

`AsyncGenerator`\<[`DeepseekStreamChunk`](../interfaces/DeepseekStreamChunk.md)\>

#### Inherited from

[`OpenAICompatible`](OpenAICompatible.md).[`streamChatCompletion`](OpenAICompatible.md#streamchatcompletion)

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

[`OpenAICompatible`](OpenAICompatible.md).[`throw`](OpenAICompatible.md#throw)
