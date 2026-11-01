# Interface: StreamingChunk

Defined in: [packages/components/src/agents/StreamingAgent.ts:27](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L27)

Event emitted by `StreamingAgent.runStream()`.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-alltoolcalls"></a> `allToolCalls?` | [`ToolCallRecord`](ToolCallRecord.md)[] | `completed`: every tool call that ran. | [packages/components/src/agents/StreamingAgent.ts:52](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L52) |
| <a id="property-content"></a> `content?` | `string` | `assistant_message`: text accumulated so far in this iteration. | [packages/components/src/agents/StreamingAgent.ts:40](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L40) |
| <a id="property-error"></a> `error?` | `string` | `error`: error message. | [packages/components/src/agents/StreamingAgent.ts:54](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L54) |
| <a id="property-finalmessage"></a> `finalMessage?` | `string` | `completed`: final assistant text. | [packages/components/src/agents/StreamingAgent.ts:48](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L48) |
| <a id="property-history"></a> `history?` | [`AgentMessage`](AgentMessage.md)[] | `completed`: full message history. | [packages/components/src/agents/StreamingAgent.ts:50](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L50) |
| <a id="property-iteration"></a> `iteration?` | `number` | `iteration_start`: 1-based iteration number. | [packages/components/src/agents/StreamingAgent.ts:38](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L38) |
| <a id="property-result"></a> `result?` | `unknown` | `tool_result`: tool result, or `{ error }`. | [packages/components/src/agents/StreamingAgent.ts:46](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L46) |
| <a id="property-toolcalls"></a> `toolCalls?` | [`AgentToolCall`](AgentToolCall.md)[] | `assistant_message`: tool calls accumulated so far in this iteration. | [packages/components/src/agents/StreamingAgent.ts:42](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L42) |
| <a id="property-toolname"></a> `toolName?` | `string` | `tool_start` and `tool_result`: tool name. | [packages/components/src/agents/StreamingAgent.ts:44](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L44) |
| <a id="property-type"></a> `type` | \| `"error"` \| `"iteration_start"` \| `"model_thinking"` \| `"assistant_message"` \| `"tool_start"` \| `"tool_result"` \| `"completed"` | Event kind. Each kind sets the fields documented below. | [packages/components/src/agents/StreamingAgent.ts:29](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L29) |
| <a id="property-usage"></a> `usage?` | [`TokenUsage`](TokenUsage.md) | `completed`: token usage summed over every model call. | [packages/components/src/agents/StreamingAgent.ts:56](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/StreamingAgent.ts#L56) |
