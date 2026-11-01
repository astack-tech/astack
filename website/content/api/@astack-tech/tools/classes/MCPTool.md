# Class: MCPTool

Defined in: [mcp-tool.ts:38](https://github.com/astack-tech/astack/blob/master/packages/tools/src/mcp-tool.ts#L38)

Exposes one MCP service method as a tool.

## Implements

- [`Tool`](../interfaces/Tool.md)

## Constructors

### Constructor

```ts
new MCPTool(config): MCPTool;
```

Defined in: [mcp-tool.ts:49](https://github.com/astack-tech/astack/blob/master/packages/tools/src/mcp-tool.ts#L49)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`MCPToolConfig`](../interfaces/MCPToolConfig.md) |

#### Returns

`MCPTool`

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-description"></a> `description` | `readonly` | `string` | Description that tells the model when to use the tool. | [mcp-tool.ts:40](https://github.com/astack-tech/astack/blob/master/packages/tools/src/mcp-tool.ts#L40) |
| <a id="property-name"></a> `name` | `readonly` | `string` | Unique tool name. | [mcp-tool.ts:39](https://github.com/astack-tech/astack/blob/master/packages/tools/src/mcp-tool.ts#L39) |
| <a id="property-parameters"></a> `parameters` | `readonly` | [`ToolParameters`](../interfaces/ToolParameters.md) \| `undefined` | JSON Schema of the arguments. | [mcp-tool.ts:41](https://github.com/astack-tech/astack/blob/master/packages/tools/src/mcp-tool.ts#L41) |

## Methods

### invoke()

```ts
invoke(args): Promise<unknown>;
```

Defined in: [mcp-tool.ts:65](https://github.com/astack-tech/astack/blob/master/packages/tools/src/mcp-tool.ts#L65)

Calls the MCP method.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | `Record`\<`string`, `unknown`\> |

#### Returns

`Promise`\<`unknown`\>

#### Throws

Error that wraps the client error message.

#### Implementation of

[`Tool`](../interfaces/Tool.md).[`invoke`](../interfaces/Tool.md#invoke)
