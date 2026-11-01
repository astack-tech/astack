# Interface: DeepseekResponseToolCall

Defined in: [packages/integrations/src/model-provider/deepseek/index.ts:69](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L69)

Tool call returned by `chatCompletion`. It carries both the OpenAI shape
(`type`, `function`) and the internal shape (`tool_name`, `arguments`).

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-arguments"></a> `arguments` | `Record`\<`string`, `unknown`\> | Parsed arguments. JSON that is not an object becomes `{}`. | [packages/integrations/src/model-provider/deepseek/index.ts:84](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L84) |
| <a id="property-function"></a> `function` | `object` | The call in the OpenAI shape: function name and raw JSON arguments. An empty argument string is sent as `{}`. | [packages/integrations/src/model-provider/deepseek/index.ts:75](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L75) |
| `function.arguments` | `string` | Arguments as JSON text. | [packages/integrations/src/model-provider/deepseek/index.ts:79](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L79) |
| `function.name` | `string` | Name of the tool to call. | [packages/integrations/src/model-provider/deepseek/index.ts:77](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L77) |
| <a id="property-id"></a> `id` | `string` | Identifier assigned by the API. A `tool` message answers the call with it. | [packages/integrations/src/model-provider/deepseek/index.ts:71](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L71) |
| <a id="property-tool_name"></a> `tool_name` | `string` | Name of the tool, same as `function.name`. | [packages/integrations/src/model-provider/deepseek/index.ts:82](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L82) |
| <a id="property-type"></a> `type` | `"function"` | Always `function`. | [packages/integrations/src/model-provider/deepseek/index.ts:73](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L73) |
