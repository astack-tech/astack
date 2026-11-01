# Interface: DeepseekAssistantMessage

Defined in: [packages/integrations/src/model-provider/deepseek/index.ts:144](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L144)

Assistant message returned by `chatCompletion`.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-content"></a> `content` | `string` | Reply text. Empty when the model only calls tools. | [packages/integrations/src/model-provider/deepseek/index.ts:148](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L148) |
| <a id="property-role"></a> `role` | `"assistant"` | Always `assistant`. | [packages/integrations/src/model-provider/deepseek/index.ts:146](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L146) |
| <a id="property-tool_calls"></a> `tool_calls?` | [`DeepseekResponseToolCall`](DeepseekResponseToolCall.md)[] | Tool calls requested by the model, if any. | [packages/integrations/src/model-provider/deepseek/index.ts:150](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L150) |
| <a id="property-usage"></a> `usage?` | [`DeepseekTokenUsage`](DeepseekTokenUsage.md) | Token usage of this request, when the API reports it. | [packages/integrations/src/model-provider/deepseek/index.ts:152](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L152) |
