# Class: ComponentTool

Defined in: [component-tool.ts:28](https://github.com/astack-tech/astack/blob/master/packages/tools/src/component-tool.ts#L28)

Exposes a component as a tool. The component runs in standalone mode through `run()`.

## Implements

- [`Tool`](../interfaces/Tool.md)

## Constructors

### Constructor

```ts
new ComponentTool(config): ComponentTool;
```

Defined in: [component-tool.ts:37](https://github.com/astack-tech/astack/blob/master/packages/tools/src/component-tool.ts#L37)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`ComponentToolConfig`](../interfaces/ComponentToolConfig.md) |

#### Returns

`ComponentTool`

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-description"></a> `description` | `readonly` | `string` | Description that tells the model when to use the tool. | [component-tool.ts:30](https://github.com/astack-tech/astack/blob/master/packages/tools/src/component-tool.ts#L30) |
| <a id="property-name"></a> `name` | `readonly` | `string` | Unique tool name. | [component-tool.ts:29](https://github.com/astack-tech/astack/blob/master/packages/tools/src/component-tool.ts#L29) |
| <a id="property-parameters"></a> `parameters` | `readonly` | [`ToolParameters`](../interfaces/ToolParameters.md) \| `undefined` | JSON Schema of the arguments. | [component-tool.ts:31](https://github.com/astack-tech/astack/blob/master/packages/tools/src/component-tool.ts#L31) |

## Methods

### invoke()

```ts
invoke(args): Promise<unknown>;
```

Defined in: [component-tool.ts:46](https://github.com/astack-tech/astack/blob/master/packages/tools/src/component-tool.ts#L46)

Runs the tool.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `Record`\<`string`, `unknown`\> | Arguments that match `parameters`. |

#### Returns

`Promise`\<`unknown`\>

#### Implementation of

[`Tool`](../interfaces/Tool.md).[`invoke`](../interfaces/Tool.md#invoke)
