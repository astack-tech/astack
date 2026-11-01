# Class: ToolInvoker

Defined in: [packages/components/src/tool-invoker/index.ts:98](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L98)

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

Defined in: [packages/components/src/tool-invoker/index.ts:104](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L104)

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

Defined in: [packages/components/src/tool-invoker/index.ts:143](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L143)

Reads `ToolInvokerInput` from the `in` port and sends `ToolInvokerOutput` to `out`.
Input that is not a `ToolInvokerInput` fails the pipeline run with a `TypeError`.

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
run(input): Promise<ToolInvokerOutput>;
```

Defined in: [packages/components/src/tool-invoker/index.ts:122](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L122)

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
