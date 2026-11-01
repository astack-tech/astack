# Interface: AgentConfig

Defined in: [packages/components/src/agents/types.ts:168](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L168)

Agent options.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-maxiterations"></a> `maxIterations?` | `number` | Maximum number of model calls per run. Defaults to `10`. | [packages/components/src/agents/types.ts:178](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L178) |
| <a id="property-memory"></a> `memory?` | [`Memory`](Memory.md) | Memory instance. Defaults to a new `DefaultMemory`. | [packages/components/src/agents/types.ts:176](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L176) |
| <a id="property-model"></a> `model` | [`ModelProvider`](ModelProvider.md) | Model provider, for example `new Deepseek({ apiKey })`. | [packages/components/src/agents/types.ts:170](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L170) |
| <a id="property-supportstoolcalls"></a> ~~`supportsToolCalls?`~~ | `boolean` | **Deprecated** Has no effect. Tools are always offered to the model when `tools` is not empty. | [packages/components/src/agents/types.ts:184](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L184) |
| <a id="property-systemprompt"></a> `systemPrompt?` | `string` | System prompt. Defaults to `You are a helpful assistant.`. | [packages/components/src/agents/types.ts:174](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L174) |
| <a id="property-tools"></a> `tools?` | [`AgentTool`](AgentTool.md)[] | Tools the model may call. | [packages/components/src/agents/types.ts:172](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L172) |
| <a id="property-verbose"></a> `verbose?` | `boolean` | Writes diagnostics to the console. Defaults to `false`. | [packages/components/src/agents/types.ts:180](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L180) |
