# Interface: AgentTool

Defined in: [packages/components/src/agents/types.ts:67](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L67)

Tool shape accepted by agents. A tool runs through `execute(args)` or, when that is
absent, `invoke(args)` (as in `@astack-tech/tools`). A tool with neither is reported
to the model as an error when it is called.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-description"></a> `description` | `string` | Description that tells the model when to use the tool. | [packages/components/src/agents/types.ts:71](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L71) |
| <a id="property-execute"></a> `execute?` | (`args`) => `unknown` | Runs the tool. Takes precedence over `invoke`. | [packages/components/src/agents/types.ts:78](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L78) |
| <a id="property-invoke"></a> `invoke?` | (`args`) => `unknown` | Runs the tool when `execute` is absent. | [packages/components/src/agents/types.ts:83](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L83) |
| <a id="property-name"></a> `name` | `string` | Unique tool name. | [packages/components/src/agents/types.ts:69](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L69) |
| <a id="property-parameters"></a> `parameters?` | `Record`\<`string`, `unknown`\> | JSON Schema of the arguments. | [packages/components/src/agents/types.ts:73](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L73) |
