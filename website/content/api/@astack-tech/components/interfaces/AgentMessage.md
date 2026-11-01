# Interface: AgentMessage

Defined in: [packages/components/src/agents/types.ts:42](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L42)

A chat message exchanged between an agent and its model.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-content"></a> `content` | `string` | Text content. | [packages/components/src/agents/types.ts:46](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L46) |
| <a id="property-metadata"></a> `metadata?` | `Record`\<`string`, `unknown`\> | Application data attached to the message. Models do not read it. | [packages/components/src/agents/types.ts:52](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L52) |
| <a id="property-role"></a> `role` | `string` | Message role, such as `system`, `user`, `assistant` or `tool`. | [packages/components/src/agents/types.ts:44](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L44) |
| <a id="property-tool_call_id"></a> `tool_call_id?` | `string` | For tool messages: the identifier of the call this message answers. | [packages/components/src/agents/types.ts:50](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L50) |
| <a id="property-tool_calls"></a> `tool_calls?` | [`AgentToolCall`](AgentToolCall.md)[] | Tool calls requested by an assistant message. | [packages/components/src/agents/types.ts:48](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L48) |
| <a id="property-usage"></a> `usage?` | [`TokenUsage`](TokenUsage.md) | Token usage of the reply that produced this message. | [packages/components/src/agents/types.ts:54](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L54) |
