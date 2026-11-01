# Interface: DeepseekStreamChunk

Defined in: [packages/integrations/src/model-provider/deepseek/index.ts:158](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L158)

Chunk yielded by `streamChatCompletion`.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-content"></a> `content` | `string` | Text delta. Empty in chunks that carry tool calls or usage. | [packages/integrations/src/model-provider/deepseek/index.ts:162](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L162) |
| <a id="property-role"></a> `role` | `"assistant"` | Always `assistant`. | [packages/integrations/src/model-provider/deepseek/index.ts:160](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L160) |
| <a id="property-tool_calls"></a> `tool_calls?` | [`DeepseekStreamToolCall`](DeepseekStreamToolCall.md)[] | Tool-call deltas in this chunk. | [packages/integrations/src/model-provider/deepseek/index.ts:164](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L164) |
| <a id="property-usage"></a> `usage?` | [`DeepseekTokenUsage`](DeepseekTokenUsage.md) | Token usage. Sent once, in the final chunk, when the API reports it. | [packages/integrations/src/model-provider/deepseek/index.ts:166](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L166) |
