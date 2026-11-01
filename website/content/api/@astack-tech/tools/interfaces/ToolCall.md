# Interface: ToolCall

Defined in: [tool.ts:19](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool.ts#L19)

A tool call requested by a model.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-arguments"></a> `arguments` | `Record`\<`string`, `unknown`\> | Arguments for the tool. | [tool.ts:25](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool.ts#L25) |
| <a id="property-id"></a> `id?` | `string` | Identifier assigned by the model provider. | [tool.ts:21](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool.ts#L21) |
| <a id="property-tool_name"></a> `tool_name` | `string` | Name of the tool to call. | [tool.ts:23](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool.ts#L23) |
