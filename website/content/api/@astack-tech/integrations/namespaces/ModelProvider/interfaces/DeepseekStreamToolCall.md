# Interface: DeepseekStreamToolCall

Defined in: [packages/integrations/src/model-provider/openai-compatible/index.ts:92](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L92)

Partial tool call emitted while streaming. `arguments` holds the raw JSON fragment.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-arguments"></a> `arguments` | `string` | Raw JSON fragment of this delta. Concatenate the fragments of a call to get its arguments. | [packages/integrations/src/model-provider/openai-compatible/index.ts:107](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L107) |
| <a id="property-function"></a> `function` | `object` | The delta in the OpenAI shape. `arguments` holds only this delta's JSON fragment. | [packages/integrations/src/model-provider/openai-compatible/index.ts:98](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L98) |
| `function.arguments` | `string` | Arguments as JSON text. | [packages/integrations/src/model-provider/openai-compatible/index.ts:102](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L102) |
| `function.name` | `string` | Name of the tool to call. | [packages/integrations/src/model-provider/openai-compatible/index.ts:100](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L100) |
| <a id="property-id"></a> `id` | `string` | Identifier assigned by the API. Only the first delta of a call carries it; later deltas have `''`. | [packages/integrations/src/model-provider/openai-compatible/index.ts:94](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L94) |
| <a id="property-tool_name"></a> `tool_name` | `string` | Name of the tool when this delta carries it, otherwise `''`. | [packages/integrations/src/model-provider/openai-compatible/index.ts:105](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L105) |
| <a id="property-type"></a> `type` | `"function"` | Always `function`. | [packages/integrations/src/model-provider/openai-compatible/index.ts:96](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L96) |
