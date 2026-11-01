# Interface: AgentOutput

Defined in: [packages/components/src/agents/types.ts:139](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L139)

Agent result.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-error"></a> `error?` | `string` | Set when the agent failed inside a pipeline. | [packages/components/src/agents/types.ts:151](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L151) |
| <a id="property-history"></a> `history` | [`AgentMessage`](AgentMessage.md)[] | Full message history, including tool rounds. | [packages/components/src/agents/types.ts:147](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L147) |
| <a id="property-message"></a> `message` | `string` | Final assistant text. | [packages/components/src/agents/types.ts:141](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L141) |
| <a id="property-thinking"></a> `thinking?` | `string` | Reserved for providers that expose reasoning text. | [packages/components/src/agents/types.ts:143](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L143) |
| <a id="property-toolcalls"></a> `toolCalls?` | [`ToolCallRecord`](ToolCallRecord.md)[] | Tool calls that ran, including failed ones. | [packages/components/src/agents/types.ts:145](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L145) |
| <a id="property-usage"></a> `usage?` | [`TokenUsage`](TokenUsage.md) | Token usage summed over every model call. | [packages/components/src/agents/types.ts:149](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L149) |
