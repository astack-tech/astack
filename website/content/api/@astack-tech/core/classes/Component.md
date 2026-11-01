# Class: Component

Defined in: [packages/core/src/component/index.ts:47](https://github.com/astack-tech/astack/blob/master/packages/core/src/component/index.ts#L47)

Base class for every AStack component.

A component has a default `in` and `out` port. Call `run()` to use it on its own,
or add it to a `Pipeline`, which calls `_transform()` for reactive execution.

## Extends

- `TransformNode`

## Constructors

### Constructor

```ts
new Component(opts): Component;
```

Defined in: [packages/core/src/component/index.ts:55](https://github.com/astack-tech/astack/blob/master/packages/core/src/component/index.ts#L55)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | `unknown` |

#### Returns

`Component`

#### Overrides

`TransformNode.constructor`

## Properties

| Property | Modifier | Type | Default value | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="property-flow"></a> `flow` | `public` | `Flow` \| `null` | `undefined` | - | `TransformNode.flow` | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:63 |
| <a id="property-i"></a> `I` | `public` | (`name`) => `Port` | `undefined` | - | `TransformNode.I` | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:65 |
| <a id="property-id"></a> `id` | `public` | `string` | `undefined` | - | `TransformNode.id` | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:57 |
| <a id="property-identity"></a> `identity` | `public` | `Symbol` | `undefined` | - | `TransformNode.identity` | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:64 |
| <a id="property-inport"></a> `inPort` | `protected readonly` | `Port` | `undefined` | The default `in` input port. | - | [packages/core/src/component/index.ts:51](https://github.com/astack-tech/astack/blob/master/packages/core/src/component/index.ts#L51) |
| <a id="property-isrunning"></a> `isRunning` | `public` | `boolean` | `undefined` | - | `TransformNode.isRunning` | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:62 |
| <a id="property-o"></a> `O` | `public` | (`name`) => `Port` | `undefined` | - | `TransformNode.O` | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:66 |
| <a id="property-opts"></a> `opts` | `public` | `object` | `undefined` | - | `TransformNode.opts` | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:58 |
| <a id="property-outport"></a> `outPort` | `protected readonly` | `Port` | `undefined` | The default `out` output port. A pipeline uses it to infer the endpoint. | - | [packages/core/src/component/index.ts:53](https://github.com/astack-tech/astack/blob/master/packages/core/src/component/index.ts#L53) |
| <a id="property-portmap"></a> `portMap` | `public` | `PortMap` | `undefined` | - | `TransformNode.portMap` | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:61 |
| <a id="property-type"></a> `type` | `public` | `Symbol` | `undefined` | - | `TransformNode.type` | node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:56 |
| <a id="property-port"></a> `Port` | `static` | *typeof* `Port` | `HlangPort` | Port factory from the HLang runtime. `Component.Port.I(name)` and `Component.Port.O(name)` create input and output ports; call `.attach(this)` in the constructor. | - | [packages/core/src/component/index.ts:49](https://github.com/astack-tech/astack/blob/master/packages/core/src/component/index.ts#L49) |

## Methods

### \_transform()

```ts
_transform($i, $o): void;
```

Defined in: [packages/core/src/component/index.ts:110](https://github.com/astack-tech/astack/blob/master/packages/core/src/component/index.ts#L110)

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
  $i('in').receive((data: { text: string }) => {
    const result = { processed: data.text.toUpperCase() };
    $o('out').send(result);
  });
}
```

Multi-port component with conditional routing
```typescript
import type { Port } from '@astack-tech/core';

_transform($i: Port, $o: Port) {
  $i('in').receive((data: { value: number }) => {
    if (data.value % 2 === 0) {
      $o('even').send({ result: data.value * 2 });
    } else {
      $o('odd').send({ result: data.value * 3 });
    }
  });
}
```

#### Overrides

`TransformNode._transform`

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

`TransformNode.attach`

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

`TransformNode.attachPort`

***

### E()

```ts
E(): Port;
```

Defined in: node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:69

#### Returns

`Port`

#### Inherited from

`TransformNode.E`

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

`TransformNode.executeOnce`

***

### run()

```ts
run(data): unknown;
```

Defined in: [packages/core/src/component/index.ts:69](https://github.com/astack-tech/astack/blob/master/packages/core/src/component/index.ts#L69)

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

Defined in: node\_modules/.pnpm/@hlang-org+runtime@1.1.1/node\_modules/@hlang-org/runtime/lib/index.d.mts:87

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `any` |

#### Returns

`void`

#### Inherited from

`TransformNode.throw`
