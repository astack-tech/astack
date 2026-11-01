# Interface: ComponentToolConfig

Defined in: [component-tool.ts:8](https://github.com/astack-tech/astack/blob/master/packages/tools/src/component-tool.ts#L8)

Options for `ComponentTool`.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-component"></a> `component` | `Component` | Component that runs when the tool is called. | [component-tool.ts:14](https://github.com/astack-tech/astack/blob/master/packages/tools/src/component-tool.ts#L14) |
| <a id="property-description"></a> `description` | `string` | Description that tells the model when to use the tool. | [component-tool.ts:12](https://github.com/astack-tech/astack/blob/master/packages/tools/src/component-tool.ts#L12) |
| <a id="property-name"></a> `name` | `string` | Unique tool name. | [component-tool.ts:10](https://github.com/astack-tech/astack/blob/master/packages/tools/src/component-tool.ts#L10) |
| <a id="property-parameters"></a> `parameters?` | [`ToolParameters`](ToolParameters.md) | JSON Schema of the arguments. | [component-tool.ts:16](https://github.com/astack-tech/astack/blob/master/packages/tools/src/component-tool.ts#L16) |
| <a id="property-transformargs"></a> `transformArgs?` | (`args`) => `unknown` | Converts tool arguments to component input. Defaults to the identity function. | [component-tool.ts:18](https://github.com/astack-tech/astack/blob/master/packages/tools/src/component-tool.ts#L18) |
| <a id="property-transformresult"></a> `transformResult?` | (`result`) => `unknown` | Converts component output to the tool result. Defaults to the identity function. | [component-tool.ts:20](https://github.com/astack-tech/astack/blob/master/packages/tools/src/component-tool.ts#L20) |
