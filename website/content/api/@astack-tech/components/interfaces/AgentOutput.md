# Interface: AgentOutput

Defined in: [packages/components/src/agents/types.ts:151](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L151)

Agent result.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-error"></a> `error?` | `string` | Set when the agent failed inside a pipeline. | [packages/components/src/agents/types.ts:163](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L163) |
| <a id="property-history"></a> `history` | [`AgentMessage`](AgentMessage.md)[] | Full message history, including tool rounds. | [packages/components/src/agents/types.ts:159](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L159) |
| <a id="property-message"></a> `message` | `string` | Final assistant text. | [packages/components/src/agents/types.ts:153](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L153) |
| <a id="property-thinking"></a> `thinking?` | `string` | Reserved for providers that expose reasoning text. | [packages/components/src/agents/types.ts:155](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L155) |
| <a id="property-toolcalls"></a> `toolCalls?` | [`ToolCallRecord`](ToolCallRecord.md)[] | Tool calls that ran, including failed ones. | [packages/components/src/agents/types.ts:157](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L157) |
| <a id="property-usage"></a> `usage?` | [`TokenUsage`](TokenUsage.md) | Token usage summed over every model call. | [packages/components/src/agents/types.ts:161](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L161) |
