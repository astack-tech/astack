# Interface: AgentConfig

Defined in: [packages/components/src/agents/types.ts:169](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L169)

Agent options.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-maxiterations"></a> `maxIterations?` | `number` | Maximum number of model calls per run. Defaults to `10`. | [packages/components/src/agents/types.ts:179](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L179) |
| <a id="property-memory"></a> `memory?` | [`Memory`](Memory.md) | Memory instance. Defaults to a new `DefaultMemory`. | [packages/components/src/agents/types.ts:177](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L177) |
| <a id="property-model"></a> `model` | [`ModelProvider`](ModelProvider.md) | Model provider, for example `new Deepseek({ apiKey })`. | [packages/components/src/agents/types.ts:171](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L171) |
| <a id="property-supportstoolcalls"></a> ~~`supportsToolCalls?`~~ | `boolean` | **Deprecated** Has no effect. Tools are always offered to the model when `tools` is not empty. | [packages/components/src/agents/types.ts:185](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L185) |
| <a id="property-systemprompt"></a> `systemPrompt?` | `string` | System prompt. Defaults to `You are a helpful assistant.`. | [packages/components/src/agents/types.ts:175](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L175) |
| <a id="property-tools"></a> `tools?` | [`AgentTool`](AgentTool.md)[] | Tools the model may call. | [packages/components/src/agents/types.ts:173](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L173) |
| <a id="property-verbose"></a> `verbose?` | `boolean` | Writes diagnostics to the console. Defaults to `false`. | [packages/components/src/agents/types.ts:181](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L181) |
