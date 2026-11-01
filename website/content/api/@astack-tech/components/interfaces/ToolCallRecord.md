# Interface: ToolCallRecord

Defined in: [packages/components/src/agents/types.ts:127](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L127)

One executed tool call.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-args"></a> `args` | `Record`\<`string`, `unknown`\> | Parsed arguments passed to the tool. | [packages/components/src/agents/types.ts:131](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L131) |
| <a id="property-result"></a> `result` | `unknown` | Value returned by the tool, or `{ error }` when it threw. | [packages/components/src/agents/types.ts:133](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L133) |
| <a id="property-tool"></a> `tool` | `string` | Name of the tool that ran. | [packages/components/src/agents/types.ts:129](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L129) |
