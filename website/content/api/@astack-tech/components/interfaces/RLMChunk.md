# Interface: RLMChunk

Defined in: [packages/components/src/agents/rlm/RLMCore.ts:43](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L43)

RLM streaming chunk

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-content"></a> `content` | `string` | Text of this chunk. Empty for `metadata` chunks. | [packages/components/src/agents/rlm/RLMCore.ts:47](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L47) |
| <a id="property-metadata"></a> `metadata?` | [`RLMExecutionMetadata`](RLMExecutionMetadata.md) | Execution statistics, on `metadata` and `summary` chunks. | [packages/components/src/agents/rlm/RLMCore.ts:49](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L49) |
| <a id="property-type"></a> `type` | `"metadata"` \| `"error"` \| `"code"` \| `"execution"` \| `"answer"` \| `"summary"` | `code`: generated code. `execution`: sandbox console output. `answer`: the final answer. `error`: a failure. `metadata`: progress after each sub-model call. `summary`: totals at the end. | [packages/components/src/agents/rlm/RLMCore.ts:45](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L45) |
