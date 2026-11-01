# Interface: DeepseekMessage

Defined in: [packages/integrations/src/model-provider/deepseek/index.ts:128](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L128)

Chat message accepted as input. It matches the agent message contract in
`@astack-tech/components`, so agent histories can be passed directly.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-content"></a> `content?` | `string` | Text content. Omitted content is sent as no content. | [packages/integrations/src/model-provider/deepseek/index.ts:132](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L132) |
| <a id="property-role"></a> `role` | `string` | One of `system`, `user`, `assistant` or `tool` (see `MessageRole`). | [packages/integrations/src/model-provider/deepseek/index.ts:130](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L130) |
| <a id="property-tool_call_id"></a> `tool_call_id?` | `string` | Identifier of the call that a `tool` message answers. | [packages/integrations/src/model-provider/deepseek/index.ts:136](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L136) |
| <a id="property-tool_calls"></a> `tool_calls?` | readonly `unknown`[] | Accepted for compatibility. Assistant tool calls are not forwarded to the API. | [packages/integrations/src/model-provider/deepseek/index.ts:134](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L134) |
| <a id="property-usage"></a> `usage?` | [`DeepseekTokenUsage`](DeepseekTokenUsage.md) | Ignored on input. Present so agent histories can be passed unchanged. | [packages/integrations/src/model-provider/deepseek/index.ts:138](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L138) |
