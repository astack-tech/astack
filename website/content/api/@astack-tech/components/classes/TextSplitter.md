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
| <a id="property-closeswithinputs"></a> `closesWithInputs` | `readonly` | `boolean` | Whether the node closes its outputs once all its inputs have ended (RFC 0001), so the end of a stream travels on. A node that keeps producing after its inputs end (a timer) overrides it with `false` and closes its outputs itself. | [`Agent`](Agent.md).[`closesWithInputs`](Agent.md#property-closeswithinputs) | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:204 |
| <a id="property-i"></a> `I` | `readonly` | `PortAccessor` | Resolves an input port. Bound to the node, so it can be passed around as `$i`. | [`Agent`](Agent.md).[`I`](Agent.md#property-i) | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:167 |
| <a id="property-id"></a> `id` | `readonly` | `string` | - | [`Agent`](Agent.md).[`id`](Agent.md#property-id) | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:163 |
| <a id="property-identity"></a> `identity` | `readonly` | `symbol` | - | [`Agent`](Agent.md).[`identity`](Agent.md#property-identity) | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:164 |
| <a id="property-inport"></a> `inPort` | `protected readonly` | `Port` | The default `in` input port. | `Component.inPort` | packages/core/dist/component/index.d.ts:51 |
| <a id="property-o"></a> `O` | `readonly` | `PortAccessor` | Resolves an output port. Bound to the node, so it can be passed around as `$o`. | [`Agent`](Agent.md).[`O`](Agent.md#property-o) | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:169 |
| <a id="property-opts"></a> `opts` | `public` | `object` | - | `Component.opts` | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:165 |
| <a id="property-outport"></a> `outPort` | `protected readonly` | `Port` | The default `out` output port. A pipeline uses it to infer the endpoint. | `Component.outPort` | packages/core/dist/component/index.d.ts:53 |
| <a id="property-type"></a> `type` | `readonly` | *typeof* `TRANSFORM` | - | [`Agent`](Agent.md).[`type`](Agent.md#property-type) | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:197 |
| <a id="property-port"></a> `Port` | `static` | *typeof* `Port` | Port factory from the HLang runtime. `Component.Port.I(name)` and `Component.Port.O(name)` create input and output ports; call `.attach(this)` in the constructor. | `Component.Port` | packages/core/dist/component/index.d.ts:49 |

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
