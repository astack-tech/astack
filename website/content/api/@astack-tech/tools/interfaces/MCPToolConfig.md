# Interface: MCPToolConfig

Defined in: [mcp-tool.ts:14](https://github.com/astack-tech/astack/blob/master/packages/tools/src/mcp-tool.ts#L14)

Options for `MCPTool`.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-description"></a> `description` | `string` | Description that tells the model when to use the tool. | [mcp-tool.ts:18](https://github.com/astack-tech/astack/blob/master/packages/tools/src/mcp-tool.ts#L18) |
| <a id="property-mcpclient"></a> `mcpClient` | [`MCPClient`](MCPClient.md) | Client that performs the call. | [mcp-tool.ts:24](https://github.com/astack-tech/astack/blob/master/packages/tools/src/mcp-tool.ts#L24) |
| <a id="property-methodname"></a> `methodName` | `string` | MCP method name. | [mcp-tool.ts:22](https://github.com/astack-tech/astack/blob/master/packages/tools/src/mcp-tool.ts#L22) |
| <a id="property-name"></a> `name` | `string` | Unique tool name. | [mcp-tool.ts:16](https://github.com/astack-tech/astack/blob/master/packages/tools/src/mcp-tool.ts#L16) |
| <a id="property-parameters"></a> `parameters?` | [`ToolParameters`](ToolParameters.md) | JSON Schema of the arguments. | [mcp-tool.ts:26](https://github.com/astack-tech/astack/blob/master/packages/tools/src/mcp-tool.ts#L26) |
| <a id="property-servicename"></a> `serviceName` | `string` | MCP service name. | [mcp-tool.ts:20](https://github.com/astack-tech/astack/blob/master/packages/tools/src/mcp-tool.ts#L20) |
| <a id="property-transformargs"></a> `transformArgs?` | (`args`) => `unknown` | Converts tool arguments to MCP call arguments. Defaults to the identity function. | [mcp-tool.ts:28](https://github.com/astack-tech/astack/blob/master/packages/tools/src/mcp-tool.ts#L28) |
| <a id="property-transformresult"></a> `transformResult?` | (`result`) => `unknown` | Converts the MCP result to the tool result. Defaults to the identity function. | [mcp-tool.ts:30](https://github.com/astack-tech/astack/blob/master/packages/tools/src/mcp-tool.ts#L30) |
