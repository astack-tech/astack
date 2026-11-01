# Class: TextSplitter

Defined in: [packages/components/src/text/index.ts:38](https://github.com/astack-tech/astack/blob/master/packages/components/src/text/index.ts#L38)

Splits long text into chunks for further processing.

Ports:
- input `text`: the text to split.
- output `out`: the array of chunks.

With a separator, whole segments are packed into chunks, and trailing segments that fit in
`overlap` are repeated at the start of the next chunk. Segments longer than `chunkSize` are
split by characters. Every chunk is at most `chunkSize` code points long.

## Extends

- `Component`

## Constructors

### Constructor

```ts
new TextSplitter(config?): TextSplitter;
```

Defined in: [packages/components/src/text/index.ts:47](https://github.com/astack-tech/astack/blob/master/packages/components/src/text/index.ts#L47)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config?` | [`TextSplitterConfig`](../interfaces/TextSplitterConfig.md) |

#### Returns

`TextSplitter`

#### Throws

RangeError when `chunkSize` is not a positive integer or `overlap` is not in
`[0, chunkSize)`.

#### Overrides

`Component.constructor`

## Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="property-flow"></a> `flow` | `public` | `Flow` \| `null` | - | [`Agent`](Agent.md).[`flow`](Agent.md#property-flow) | node\_modules/.pnpm/@hlang-org+runtime@1.0.5/node\_modules/@hlang-org/runtime/lib/node/node.d.ts:24 |
| <a id="property-i"></a> `I` | `public` | (`name`) => `Port` | - | `Component.I` | node\_modules/.pnpm/@hlang-org+runtime@1.0.5/node\_modules/@hlang-org/runtime/lib/node/node.d.ts:26 |
| <a id="property-id"></a> `id` | `public` | `string` | - | `Component.id` | node\_modules/.pnpm/@hlang-org+runtime@1.0.5/node\_modules/@hlang-org/runtime/lib/node/node.d.ts:18 |
| <a id="property-identity"></a> `identity` | `public` | `Symbol` | - | `Component.identity` | node\_modules/.pnpm/@hlang-org+runtime@1.0.5/node\_modules/@hlang-org/runtime/lib/node/node.d.ts:25 |
| <a id="property-inport"></a> `inPort` | `protected readonly` | `Port` | The default `in` input port. | `Component.inPort` | packages/core/dist/component/index.d.ts:49 |
| <a id="property-isrunning"></a> `isRunning` | `public` | `boolean` | - | `Component.isRunning` | node\_modules/.pnpm/@hlang-org+runtime@1.0.5/node\_modules/@hlang-org/runtime/lib/node/node.d.ts:23 |
| <a id="property-o"></a> `O` | `public` | (`name`) => `Port` | - | `Component.O` | node\_modules/.pnpm/@hlang-org+runtime@1.0.5/node\_modules/@hlang-org/runtime/lib/node/node.d.ts:27 |
| <a id="property-opts"></a> `opts` | `public` | `object` | - | `Component.opts` | node\_modules/.pnpm/@hlang-org+runtime@1.0.5/node\_modules/@hlang-org/runtime/lib/node/node.d.ts:19 |
| <a id="property-outport"></a> `outPort` | `protected readonly` | `Port` | The default `out` output port. A pipeline uses it to infer the endpoint. | `Component.outPort` | packages/core/dist/component/index.d.ts:51 |
| <a id="property-portmap"></a> `portMap` | `public` | `PortMap` | - | `Component.portMap` | node\_modules/.pnpm/@hlang-org+runtime@1.0.5/node\_modules/@hlang-org/runtime/lib/node/node.d.ts:22 |
| <a id="property-type"></a> `type` | `public` | `Symbol` | - | `Component.type` | node\_modules/.pnpm/@hlang-org+runtime@1.0.5/node\_modules/@hlang-org/runtime/lib/node/node.d.ts:17 |
| <a id="property-port"></a> `Port` | `static` | *typeof* `Port` | Port factory from the HLang runtime. `Component.Port.I(name)` and `Component.Port.O(name)` create input and output ports; call `.attach(this)` in the constructor. | `Component.Port` | packages/core/dist/component/index.d.ts:47 |

## Methods

### \_transform()

```ts
_transform($i, $o): void;
```

Defined in: [packages/components/src/text/index.ts:95](https://github.com/astack-tech/astack/blob/master/packages/components/src/text/index.ts#L95)

Reads text from the `text` port and sends chunks to the `out` port.

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

Defined in: node\_modules/.pnpm/@hlang-org+runtime@1.0.5/node\_modules/@hlang-org/runtime/lib/node/node.d.ts:31

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

Defined in: node\_modules/.pnpm/@hlang-org+runtime@1.0.5/node\_modules/@hlang-org/runtime/lib/node/node.d.ts:32

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

Defined in: node\_modules/.pnpm/@hlang-org+runtime@1.0.5/node\_modules/@hlang-org/runtime/lib/node/node.d.ts:30

#### Returns

`Port`

#### Inherited from

`Component.E`

***

### executeOnce()

```ts
executeOnce(type, ...args): void;
```

Defined in: node\_modules/.pnpm/@hlang-org+runtime@1.0.5/node\_modules/@hlang-org/runtime/lib/node/node.d.ts:29

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
run(input): string[];
```

Defined in: [packages/components/src/text/index.ts:88](https://github.com/astack-tech/astack/blob/master/packages/components/src/text/index.ts#L88)

Splits input in standalone mode. Non-string input is converted with `String()`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | `unknown` |

#### Returns

`string`[]

#### Overrides

`Component.run`

***

### splitText()

```ts
splitText(text): string[];
```

Defined in: [packages/components/src/text/index.ts:72](https://github.com/astack-tech/astack/blob/master/packages/components/src/text/index.ts#L72)

Splits `text` into chunks.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

#### Returns

`string`[]

***

### throw()

```ts
throw(error): void;
```

Defined in: node\_modules/.pnpm/@hlang-org+runtime@1.0.5/node\_modules/@hlang-org/runtime/lib/node/transform.d.ts:4

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `any` |

#### Returns

`void`

#### Inherited from

`Component.throw`
