# Class: Pipeline

Defined in: [packages/core/src/pipeline/index.ts:73](https://github.com/astack-tech/astack/blob/master/packages/core/src/pipeline/index.ts#L73)

Pipeline orchestrates the execution of connected components in a reactive flow.

Architecture:
- Built on the HLang reactive flow-based programming runtime.
- Uses virtual START (readable) and END (writable) components.
- Only START and END are implicit conventions; every other connection is explicit.
- The topology is built once per route and reused across executions.
- One Flow instance per Pipeline, one END component per route.

## Constructors

### Constructor

```ts
new Pipeline(): Pipeline;
```

#### Returns

`Pipeline`

## Methods

### addComponent()

```ts
addComponent(name, instance): void;
```

Defined in: [packages/core/src/pipeline/index.ts:86](https://github.com/astack-tech/astack/blob/master/packages/core/src/pipeline/index.ts#L86)

Registers a component under a unique name. A second call with the same name is ignored.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `instance` | `Node` |

#### Returns

`void`

***

### connect()

```ts
connect(sourceName, sinkName): void;
```

Defined in: [packages/core/src/pipeline/index.ts:106](https://github.com/astack-tech/astack/blob/master/packages/core/src/pipeline/index.ts#L106)

Connects an output port to an input port. Duplicate connections are ignored.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sourceName` | `string` | Output port identifier, for example `splitter.out`. |
| `sinkName` | `string` | Input port identifier, for example `embedder.in`. |

#### Returns

`void`

***

### getComponent()

```ts
getComponent(name): Node | undefined;
```

Defined in: [packages/core/src/pipeline/index.ts:96](https://github.com/astack-tech/astack/blob/master/packages/core/src/pipeline/index.ts#L96)

Returns the component registered under `name`, if any.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

`Node` \| `undefined`

***

### run()

#### Call Signature

```ts
run<T>(
   triggerName, 
   params, 
   endpoint?
): Promise<T>;
```

Defined in: [packages/core/src/pipeline/index.ts:121](https://github.com/astack-tech/astack/blob/master/packages/core/src/pipeline/index.ts#L121)

Sends `params` to `triggerName` and resolves with the value emitted by `endpoint`.

When `endpoint` is omitted, the pipeline infers it from the topology.

##### Type Parameters

| Type Parameter |
| ------ |
| <a id="type-parameter-t"></a> `T` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `triggerName` | `string` |
| `params` | `unknown` |
| `endpoint?` | `string` |

##### Returns

`Promise`\<`T`\>

#### Call Signature

```ts
run<T>(
   triggerName, 
   params, 
   options
): Promise<Record<string, T>>;
```

Defined in: [packages/core/src/pipeline/index.ts:125](https://github.com/astack-tech/astack/blob/master/packages/core/src/pipeline/index.ts#L125)

Sends `params` to `triggerName` and resolves once every listed output has emitted.

##### Type Parameters

| Type Parameter |
| ------ |
| <a id="type-parameter-t-1"></a> `T` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `triggerName` | `string` |
| `params` | `unknown` |
| `options` | [`RunOptions`](../interfaces/RunOptions.md) |

##### Returns

`Promise`\<`Record`\<`string`, `T`\>\>
