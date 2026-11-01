# Class: Component

Defined in: [packages/core/src/component/index.ts:48](https://github.com/astack-tech/astack/blob/master/packages/core/src/component/index.ts#L48)

Base class for every AStack component.

A component has a default `in` and `out` port. Call `run()` to use it on its own,
or add it to a `Pipeline`, which calls `_transform()` for reactive execution.

## Extends

- `TransformNode`\<`object`\>

## Constructors

### Constructor

```ts
new Component(opts): Component;
```

Defined in: [packages/core/src/component/index.ts:59](https://github.com/astack-tech/astack/blob/master/packages/core/src/component/index.ts#L59)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `opts` | `object` | The component's options, stored as `this.opts`. |

#### Returns

`Component`

#### Overrides

`TransformNode<object>.constructor`

## Properties

| Property | Modifier | Type | Default value | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="property-closeswithinputs"></a> `closesWithInputs` | `readonly` | `boolean` | `undefined` | Whether the node closes its outputs once all its inputs have ended (RFC 0001), so the end of a stream travels on. A node that keeps producing after its inputs end (a timer) overrides it with `false` and closes its outputs itself. | `TransformNode.closesWithInputs` | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:204 |
| <a id="property-i"></a> `I` | `readonly` | `PortAccessor` | `undefined` | Resolves an input port. Bound to the node, so it can be passed around as `$i`. | `TransformNode.I` | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:167 |
| <a id="property-id"></a> `id` | `readonly` | `string` | `undefined` | - | `TransformNode.id` | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:163 |
| <a id="property-identity"></a> `identity` | `readonly` | `symbol` | `undefined` | - | `TransformNode.identity` | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:164 |
| <a id="property-inport"></a> `inPort` | `protected readonly` | `Port` | `undefined` | The default `in` input port. | - | [packages/core/src/component/index.ts:52](https://github.com/astack-tech/astack/blob/master/packages/core/src/component/index.ts#L52) |
| <a id="property-o"></a> `O` | `readonly` | `PortAccessor` | `undefined` | Resolves an output port. Bound to the node, so it can be passed around as `$o`. | `TransformNode.O` | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:169 |
| <a id="property-opts"></a> `opts` | `public` | `object` | `undefined` | - | `TransformNode.opts` | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:165 |
| <a id="property-outport"></a> `outPort` | `protected readonly` | `Port` | `undefined` | The default `out` output port. A pipeline uses it to infer the endpoint. | - | [packages/core/src/component/index.ts:54](https://github.com/astack-tech/astack/blob/master/packages/core/src/component/index.ts#L54) |
| <a id="property-type"></a> `type` | `readonly` | *typeof* `TRANSFORM` | `undefined` | - | `TransformNode.type` | node\_modules/.pnpm/@hlang-org+runtime@2.1.0\_rxjs@7.8.2/node\_modules/@hlang-org/runtime/lib/index.d.ts:197 |
| <a id="property-port"></a> `Port` | `static` | *typeof* `Port` | `HlangPort` | Port factory from the HLang runtime. `Component.Port.I(name)` and `Component.Port.O(name)` create input and output ports; call `.attach(this)` in the constructor. | - | [packages/core/src/component/index.ts:50](https://github.com/astack-tech/astack/blob/master/packages/core/src/component/index.ts#L50) |

## Methods

### \_transform()

```ts
_transform($i, $o): void;
```

Defined in: [packages/core/src/component/index.ts:115](https://github.com/astack-tech/astack/blob/master/packages/core/src/component/index.ts#L115)

Run component in pipeline

Override this method in subclasses to implement custom data processing logic

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `$i` | [`Port`](../type-aliases/Port.md) | Input port accessor. Call `$i('portName').receive(callback)` to read data. |
| `$o` | [`Port`](../type-aliases/Port.md) | Output port accessor. Call `$o('portName').send(value)` to emit data. |

#### Returns

`void`

#### Examples

Basic component with single input and output
```typescript
import type { Port } from '@astack-tech/core';

_transform($i: Port, $o: Port) {
  $i('in').receive(data => {
    if (typeof data !== 'string') {
      throw new TypeError('Expected a string');
    }
    $o('out').send({ processed: data.toUpperCase() });
  });
}
```

Multi-port component with conditional routing
```typescript
import type { Port } from '@astack-tech/core';

_transform($i: Port, $o: Port) {
  $i('in').receive(data => {
    if (typeof data !== 'number') {
      throw new TypeError('Expected a number');
    }
    $o(data % 2 === 0 ? 'even' : 'odd').send(data);
  });
}
```

#### Overrides

`TransformNode._transform`

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

`TransformNode.E`

***

### run()

```ts
run(data): unknown;
```

Defined in: [packages/core/src/component/index.ts:73](https://github.com/astack-tech/astack/blob/master/packages/core/src/component/index.ts#L73)

Processes one input outside a pipeline. The default implementation returns the input.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `unknown` |

#### Returns

`unknown`

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

`TransformNode.throw`
