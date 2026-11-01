# Interface: AgentOutput

Defined in: [packages/components/src/agents/types.ts:150](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L150)

Agent result.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-error"></a> `error?` | `string` | Set when the agent failed inside a pipeline. | [packages/components/src/agents/types.ts:162](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L162) |
| <a id="property-history"></a> `history` | [`AgentMessage`](AgentMessage.md)[] | Full message history, including tool rounds. | [packages/components/src/agents/types.ts:158](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L158) |
| <a id="property-message"></a> `message` | `string` | Final assistant text. | [packages/components/src/agents/types.ts:152](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L152) |
| <a id="property-thinking"></a> `thinking?` | `string` | Reserved for providers that expose reasoning text. | [packages/components/src/agents/types.ts:154](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L154) |
| <a id="property-toolcalls"></a> `toolCalls?` | [`ToolCallRecord`](ToolCallRecord.md)[] | Tool calls that ran, including failed ones. | [packages/components/src/agents/types.ts:156](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L156) |
| <a id="property-usage"></a> `usage?` | [`TokenUsage`](TokenUsage.md) | Token usage summed over every model call. | [packages/components/src/agents/types.ts:160](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L160) |
