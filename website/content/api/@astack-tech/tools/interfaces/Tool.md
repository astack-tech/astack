# Interface: Tool

Defined in: [tool.ts:41](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool.ts#L41)

A capability that an agent can call by name.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-description"></a> `description` | `string` | Description that tells the model when to use the tool. | [tool.ts:45](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool.ts#L45) |
| <a id="property-name"></a> `name` | `string` | Unique tool name. | [tool.ts:43](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool.ts#L43) |
| <a id="property-parameters"></a> `parameters?` | [`ToolParameters`](ToolParameters.md) | JSON Schema of the arguments. | [tool.ts:47](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool.ts#L47) |

## Methods

### invoke()

```ts
invoke(args): Promise<unknown>;
```

Defined in: [tool.ts:52](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool.ts#L52)

Runs the tool.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `Record`\<`string`, `unknown`\> | Arguments that match `parameters`. |

#### Returns

`Promise`\<`unknown`\>
