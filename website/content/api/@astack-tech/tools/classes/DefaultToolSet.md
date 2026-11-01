# Class: DefaultToolSet

Defined in: [tool-set.ts:22](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool-set.ts#L22)

Map-backed `ToolSet` implementation.

## Implements

- [`ToolSet`](../interfaces/ToolSet.md)

## Constructors

### Constructor

```ts
new DefaultToolSet(tools?): DefaultToolSet;
```

Defined in: [tool-set.ts:28](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool-set.ts#L28)

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `tools?` | [`Tool`](../interfaces/Tool.md)[] | `[]` | Initial tools. Later duplicates of a name are ignored. |

#### Returns

`DefaultToolSet`

## Methods

### addTool()

```ts
addTool(tool): void;
```

Defined in: [tool-set.ts:42](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool-set.ts#L42)

Adds a tool. When the name is already registered, the first tool is kept.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `tool` | [`Tool`](../interfaces/Tool.md) |

#### Returns

`void`

#### Implementation of

[`ToolSet`](../interfaces/ToolSet.md).[`addTool`](../interfaces/ToolSet.md#addtool)

***

### getTool()

```ts
getTool(name): Tool | undefined;
```

Defined in: [tool-set.ts:38](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool-set.ts#L38)

Returns the tool named `name`, or `undefined`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

[`Tool`](../interfaces/Tool.md) \| `undefined`

#### Implementation of

[`ToolSet`](../interfaces/ToolSet.md).[`getTool`](../interfaces/ToolSet.md#gettool)

***

### getTools()

```ts
getTools(): Tool[];
```

Defined in: [tool-set.ts:34](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool-set.ts#L34)

Returns every tool in insertion order.

#### Returns

[`Tool`](../interfaces/Tool.md)[]

#### Implementation of

[`ToolSet`](../interfaces/ToolSet.md).[`getTools`](../interfaces/ToolSet.md#gettools)

***

### removeTool()

```ts
removeTool(name): boolean;
```

Defined in: [tool-set.ts:49](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool-set.ts#L49)

Removes the tool named `name`. Returns `true` when a tool was removed.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

`boolean`

#### Implementation of

[`ToolSet`](../interfaces/ToolSet.md).[`removeTool`](../interfaces/ToolSet.md#removetool)

***

### size()

```ts
size(): number;
```

Defined in: [tool-set.ts:53](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool-set.ts#L53)

Returns the number of tools.

#### Returns

`number`

#### Implementation of

[`ToolSet`](../interfaces/ToolSet.md).[`size`](../interfaces/ToolSet.md#size)
