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
| <a id="property-flow"></a> `flow` | `public` | `Flow` \| `null` | - | [`OpenAICompatible`](OpenAICompatible.md).[`flow`](OpenAICompatible.md#property-flow) | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:63 |
| <a id="property-i"></a> `I` | `public` | (`name`) => `Port` | - | [`OpenAICompatible`](OpenAICompatible.md).[`I`](OpenAICompatible.md#property-i) | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:65 |
| <a id="property-id"></a> `id` | `public` | `string` | - | [`OpenAICompatible`](OpenAICompatible.md).[`id`](OpenAICompatible.md#property-id) | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:57 |
| <a id="property-identity"></a> `identity` | `public` | `Symbol` | - | [`OpenAICompatible`](OpenAICompatible.md).[`identity`](OpenAICompatible.md#property-identity) | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:64 |
| <a id="property-inport"></a> `inPort` | `protected readonly` | `Port` | The default `in` input port. | [`OpenAICompatible`](OpenAICompatible.md).[`inPort`](OpenAICompatible.md#property-inport) | packages/core/dist/component/index.d.ts:49 |
| <a id="property-isrunning"></a> `isRunning` | `public` | `boolean` | - | [`OpenAICompatible`](OpenAICompatible.md).[`isRunning`](OpenAICompatible.md#property-isrunning) | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:62 |
| <a id="property-o"></a> `O` | `public` | (`name`) => `Port` | - | [`OpenAICompatible`](OpenAICompatible.md).[`O`](OpenAICompatible.md#property-o) | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:66 |
| <a id="property-opts"></a> `opts` | `public` | `object` | - | [`OpenAICompatible`](OpenAICompatible.md).[`opts`](OpenAICompatible.md#property-opts) | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:58 |
| <a id="property-outport"></a> `outPort` | `protected readonly` | `Port` | The default `out` output port. A pipeline uses it to infer the endpoint. | [`OpenAICompatible`](OpenAICompatible.md).[`outPort`](OpenAICompatible.md#property-outport) | packages/core/dist/component/index.d.ts:51 |
| <a id="property-portmap"></a> `portMap` | `public` | `PortMap` | - | [`OpenAICompatible`](OpenAICompatible.md).[`portMap`](OpenAICompatible.md#property-portmap) | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:61 |
| <a id="property-type"></a> `type` | `public` | `Symbol` | - | [`OpenAICompatible`](OpenAICompatible.md).[`type`](OpenAICompatible.md#property-type) | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:56 |
| <a id="property-port"></a> `Port` | `static` | *typeof* `Port` | Port factory from the HLang runtime. `Component.Port.I(name)` and `Component.Port.O(name)` create input and output ports; call `.attach(this)` in the constructor. | [`OpenAICompatible`](OpenAICompatible.md).[`Port`](OpenAICompatible.md#property-port) | packages/core/dist/component/index.d.ts:47 |

## Methods

### \_transform()

```ts
_transform($i, $o): void;
```

Defined in: [packages/integrations/src/model-provider/openai-compatible/index.ts:414](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L414)

Connects the `prompt` and `messages` input ports to the model.
API errors produce a fallback value so the pipeline keeps flowing.

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

[`OpenAICompatible`](OpenAICompatible.md).[`attach`](OpenAICompatible.md#attach)

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

[`OpenAICompatible`](OpenAICompatible.md).[`attachPort`](OpenAICompatible.md#attachport)

***

### chatCompletion()

```ts
chatCompletion(messages, options?): Promise<DeepseekAssistantMessage>;
```

Defined in: [packages/integrations/src/model-provider/openai-compatible/index.ts:317](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L317)

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

Defined in: node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:69

#### Returns

`Port`

#### Inherited from

[`OpenAICompatible`](OpenAICompatible.md).[`E`](OpenAICompatible.md#e)

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

[`OpenAICompatible`](OpenAICompatible.md).[`executeOnce`](OpenAICompatible.md#executeonce)

***

### generateCompletion()

```ts
generateCompletion(prompt): Promise<string>;
```

Defined in: [packages/integrations/src/model-provider/openai-compatible/index.ts:300](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L300)

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

Defined in: [packages/integrations/src/model-provider/openai-compatible/index.ts:406](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L406)

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

Defined in: [packages/integrations/src/model-provider/openai-compatible/index.ts:359](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L359)

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

Defined in: node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:87

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `any` |

#### Returns

`void`

#### Inherited from

[`OpenAICompatible`](OpenAICompatible.md).[`throw`](OpenAICompatible.md#throw)
