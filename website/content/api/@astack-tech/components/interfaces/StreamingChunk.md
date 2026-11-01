# Interface: StreamingChunk

Defined in: [packages/components/src/agents/StreamingAgent.ts:26](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L26)

Event emitted by `StreamingAgent.runStream()`.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-alltoolcalls"></a> `allToolCalls?` | [`ToolCallRecord`](ToolCallRecord.md)[] | `completed`: every tool call that ran. | [packages/components/src/agents/StreamingAgent.ts:51](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L51) |
| <a id="property-content"></a> `content?` | `string` | `assistant_message`: text accumulated so far in this iteration. | [packages/components/src/agents/StreamingAgent.ts:39](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L39) |
| <a id="property-error"></a> `error?` | `string` | `error`: error message. | [packages/components/src/agents/StreamingAgent.ts:53](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L53) |
| <a id="property-finalmessage"></a> `finalMessage?` | `string` | `completed`: final assistant text. | [packages/components/src/agents/StreamingAgent.ts:47](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L47) |
| <a id="property-history"></a> `history?` | [`AgentMessage`](AgentMessage.md)[] | `completed`: full message history. | [packages/components/src/agents/StreamingAgent.ts:49](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L49) |
| <a id="property-iteration"></a> `iteration?` | `number` | `iteration_start`: 1-based iteration number. | [packages/components/src/agents/StreamingAgent.ts:37](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L37) |
| <a id="property-result"></a> `result?` | `unknown` | `tool_result`: tool result, or `{ error }`. | [packages/components/src/agents/StreamingAgent.ts:45](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L45) |
| <a id="property-toolcalls"></a> `toolCalls?` | [`AgentToolCall`](AgentToolCall.md)[] | `assistant_message`: tool calls accumulated so far in this iteration. | [packages/components/src/agents/StreamingAgent.ts:41](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L41) |
| <a id="property-toolname"></a> `toolName?` | `string` | `tool_start` and `tool_result`: tool name. | [packages/components/src/agents/StreamingAgent.ts:43](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L43) |
| <a id="property-type"></a> `type` | \| `"error"` \| `"iteration_start"` \| `"model_thinking"` \| `"assistant_message"` \| `"tool_start"` \| `"tool_result"` \| `"completed"` | Event kind. Each kind sets the fields documented below. | [packages/components/src/agents/StreamingAgent.ts:28](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L28) |
| <a id="property-usage"></a> `usage?` | [`TokenUsage`](TokenUsage.md) | `completed`: token usage summed over every model call. | [packages/components/src/agents/StreamingAgent.ts:55](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L55) |
