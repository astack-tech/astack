# Class: OpenAICompatible

Defined in: [packages/integrations/src/model-provider/openai-compatible/index.ts:257](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L257)

Model provider for any API that speaks the OpenAI chat completions protocol:
OpenAI itself, and the compatible endpoints of DeepSeek, Qwen, Moonshot, Ollama,
vLLM and others. Set `baseURL` and `model` for the provider you use.

Ports:
- `prompt` (in): a text prompt. The answer is sent on `completion`.
- `messages` (in): a list of chat messages. The reply is sent on `message`.

## Extends

- `Component`

## Extended by

- [`Deepseek`](Deepseek.md)

## Constructors

### Constructor

```ts
new OpenAICompatible(config): OpenAICompatible;
```

Defined in: [packages/integrations/src/model-provider/openai-compatible/index.ts:268](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L268)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`OpenAICompatibleConfig`](../interfaces/OpenAICompatibleConfig.md) |

#### Returns

`OpenAICompatible`

#### Overrides

`Component.constructor`

## Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="property-flow"></a> `flow` | `public` | `Flow` \| `null` | - | [`Deepseek`](Deepseek.md).[`flow`](Deepseek.md#property-flow) | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:63 |
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

#### Overrides

`Component.run`

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
