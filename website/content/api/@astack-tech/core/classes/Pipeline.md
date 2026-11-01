# Class: Pipeline

Defined in: [packages/core/src/pipeline/index.ts:96](https://github.com/astack-tech/astack/blob/master/packages/core/src/pipeline/index.ts#L96)

Pipeline orchestrates the execution of connected components in a reactive flow.

Architecture:
- Built on the HLang reactive flow-based programming runtime.
- Uses virtual START (readable) and END (writable) components: one START per trigger
  port, so a run reaches only the port it names.
- Only START and END are implicit conventions; every other connection is explicit.
- The topology is built once per route and reused across executions.
- One Flow instance per Pipeline, one END component per route.
- A failure on a component's error port rejects a run: the run whose input is being
  delivered when the component fails synchronously, otherwise the oldest run still waiting.

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

Defined in: [packages/core/src/pipeline/index.ts:115](https://github.com/astack-tech/astack/blob/master/packages/core/src/pipeline/index.ts#L115)

Registers a component under a unique name. A second call with the same name is ignored.

The pipeline listens on the component's error port: an error a component throws, or
sends with `throw()`, rejects the run it belongs to.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `instance` | `Node`\<`object`\> |

#### Returns

`void`

***

### connect()

```ts
connect(sourceName, sinkName): void;
```

Defined in: [packages/core/src/pipeline/index.ts:138](https://github.com/astack-tech/astack/blob/master/packages/core/src/pipeline/index.ts#L138)

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
getComponent(name): Node<object> | undefined;
```

Defined in: [packages/core/src/pipeline/index.ts:128](https://github.com/astack-tech/astack/blob/master/packages/core/src/pipeline/index.ts#L128)

Returns the component registered under `name`, if any.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

`Node`\<`object`\> \| `undefined`

***

### run()

#### Call Signature

```ts
run(
   triggerName, 
   params, 
   endpoint?
): Promise<unknown>;
```

Defined in: [packages/core/src/pipeline/index.ts:156](https://github.com/astack-tech/astack/blob/master/packages/core/src/pipeline/index.ts#L156)

Sends `params` to `triggerName` and resolves with the value emitted by `endpoint`.

When `endpoint` is omitted, the pipeline infers it from the topology. Ports are wired
at run time, so the result is `unknown`: narrow it before you use it.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `triggerName` | `string` |
| `params` | `unknown` |
| `endpoint?` | `string` |

##### Returns

`Promise`\<`unknown`\>

##### Throws

Error (as a rejection) when a component on the route fails.

#### Call Signature

```ts
run(
   triggerName, 
   params, 
   options
): Promise<Record<string, unknown>>;
```

Defined in: [packages/core/src/pipeline/index.ts:163](https://github.com/astack-tech/astack/blob/master/packages/core/src/pipeline/index.ts#L163)

Sends `params` to `triggerName` and resolves once every listed output has emitted,
with each output's value under its port identifier.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `triggerName` | `string` |
| `params` | `unknown` |
| `options` | [`RunOptions`](../interfaces/RunOptions.md) |

##### Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

##### Throws

Error (as a rejection) when a component on the route fails.
