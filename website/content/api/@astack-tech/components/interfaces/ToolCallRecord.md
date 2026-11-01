# Interface: ToolCallRecord

Defined in: [packages/components/src/agents/types.ts:138](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L138)

One executed tool call.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-args"></a> `args` | `Record`\<`string`, `unknown`\> | Parsed arguments passed to the tool. | [packages/components/src/agents/types.ts:142](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L142) |
| <a id="property-result"></a> `result` | `unknown` | Value returned by the tool, or `{ error }` when it threw. | [packages/components/src/agents/types.ts:144](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L144) |
| <a id="property-tool"></a> `tool` | `string` | Name of the tool that ran. | [packages/components/src/agents/types.ts:140](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L140) |
