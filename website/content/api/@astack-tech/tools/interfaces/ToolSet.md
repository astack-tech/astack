# Interface: ToolSet

Defined in: [tool-set.ts:6](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool-set.ts#L6)

A collection of tools indexed by name.

## Methods

### addTool()

```ts
addTool(tool): void;
```

Defined in: [tool-set.ts:12](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool-set.ts#L12)

Adds a tool. When the name is already registered, the first tool is kept.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `tool` | [`Tool`](Tool.md) |

#### Returns

`void`

***

### getTool()

```ts
getTool(name): Tool | undefined;
```

Defined in: [tool-set.ts:10](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool-set.ts#L10)

Returns the tool named `name`, or `undefined`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

[`Tool`](Tool.md) \| `undefined`

***

### getTools()

```ts
getTools(): Tool[];
```

Defined in: [tool-set.ts:8](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool-set.ts#L8)

Returns every tool in insertion order.

#### Returns

[`Tool`](Tool.md)[]

***

### removeTool()

```ts
removeTool(name): boolean;
```

Defined in: [tool-set.ts:14](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool-set.ts#L14)

Removes the tool named `name`. Returns `true` when a tool was removed.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

`boolean`

***

### size()

```ts
size(): number;
```

Defined in: [tool-set.ts:16](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool-set.ts#L16)

Returns the number of tools.

#### Returns

`number`
