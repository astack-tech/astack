# Interface: AgentTool

Defined in: [packages/components/src/agents/types.ts:66](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L66)

Tool shape accepted by agents. At run time, a tool must expose `invoke(args)`
(as in `@astack-tech/tools`) or `execute(args)`.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-description"></a> `description` | `string` | Description that tells the model when to use the tool. | [packages/components/src/agents/types.ts:70](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L70) |
| <a id="property-name"></a> `name` | `string` | Unique tool name. | [packages/components/src/agents/types.ts:68](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L68) |
| <a id="property-parameters"></a> `parameters?` | `Record`\<`string`, `unknown`\> | JSON Schema of the arguments. | [packages/components/src/agents/types.ts:72](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L72) |
