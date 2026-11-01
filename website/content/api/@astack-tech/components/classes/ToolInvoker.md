# Class: ToolInvoker

Defined in: [packages/components/src/tool-invoker/index.ts:67](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L67)

Runs the tool calls found in a list of messages and returns one `tool` message per call.

A failed, timed-out or unknown tool produces an error text in its tool message, so the
model can see the failure and other calls in the batch still complete.

## Extends

- `Component`

## Constructors

### Constructor

```ts
new ToolInvoker(config): ToolInvoker;
```

Defined in: [packages/components/src/tool-invoker/index.ts:73](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L73)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`ToolInvokerConfig`](../interfaces/ToolInvokerConfig.md) |

#### Returns

`ToolInvoker`

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

Defined in: [packages/components/src/tool-invoker/index.ts:112](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L112)

Reads `ToolInvokerInput` from the `in` port and sends `ToolInvokerOutput` to `out`.
Invalid input produces an empty `tool_messages` array.

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

### run()

```ts
run(input): Promise<ToolInvokerOutput>;
```

Defined in: [packages/components/src/tool-invoker/index.ts:91](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L91)

Runs every tool call in `input.messages`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`ToolInvokerInput`](../interfaces/ToolInvokerInput.md) |

#### Returns

`Promise`\<[`ToolInvokerOutput`](../interfaces/ToolInvokerOutput.md)\>

#### Overrides

`Component.run`

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
