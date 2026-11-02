# Interface: AgentInput

Defined in: [packages/components/src/agents/types.ts:129](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L129)

Structured agent input.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-context"></a> `context?` | `Record`\<`string`, `unknown`\> | Attached as `metadata` to every message that has none. | [packages/components/src/agents/types.ts:133](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L133) |
| <a id="property-messages"></a> `messages` | [`AgentMessage`](AgentMessage.md)[] | Conversation to send. A string input to `run()` becomes one `user` message. | [packages/components/src/agents/types.ts:131](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L131) |
