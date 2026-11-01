# Interface: MCPClient

Defined in: [mcp-tool.ts:6](https://github.com/astack-tech/astack/blob/master/packages/tools/src/mcp-tool.ts#L6)

Minimal client interface that `MCPTool` needs. Adapt your MCP SDK client to it.

## Methods

### call()

```ts
call(
   serviceName, 
   methodName, 
   args
): unknown;
```

Defined in: [mcp-tool.ts:8](https://github.com/astack-tech/astack/blob/master/packages/tools/src/mcp-tool.ts#L8)

Calls `methodName` on the MCP service `serviceName`. May return a value or a promise.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `serviceName` | `string` |
| `methodName` | `string` |
| `args` | `unknown` |

#### Returns

`unknown`
