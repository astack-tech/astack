# Interface: RLMExecutionMetadata

Defined in: [packages/components/src/agents/rlm/RLMCore.ts:74](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L74)

RLM execution metadata

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-actualdepth"></a> `actualDepth` | `number` | Deepest nesting level reached during the run. | [packages/components/src/agents/rlm/RLMCore.ts:78](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L78) |
| <a id="property-codegentime"></a> `codeGenTime` | `number` | Time the root model spent generating code, in milliseconds. | [packages/components/src/agents/rlm/RLMCore.ts:86](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L86) |
| <a id="property-contextlength"></a> `contextLength` | `number` | Total size of the context in characters. | [packages/components/src/agents/rlm/RLMCore.ts:90](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L90) |
| <a id="property-generatedcodelength"></a> `generatedCodeLength` | `number` | Length of the generated code in characters. | [packages/components/src/agents/rlm/RLMCore.ts:92](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L92) |
| <a id="property-maxdepth"></a> `maxDepth` | `number` | Maximum nesting depth configured for this RLM. | [packages/components/src/agents/rlm/RLMCore.ts:76](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L76) |
| <a id="property-replexecutiontime"></a> `replExecutionTime` | `number` | Time spent running the generated code, in milliseconds. | [packages/components/src/agents/rlm/RLMCore.ts:88](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L88) |
| <a id="property-subllmcalldetails"></a> `subLLMCallDetails` | [`SubLLMCall`](SubLLMCall.md)[] | One record per sub-model call. | [packages/components/src/agents/rlm/RLMCore.ts:82](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L82) |
| <a id="property-subllmcalls"></a> `subLLMCalls` | `number` | Number of sub-model calls made so far. | [packages/components/src/agents/rlm/RLMCore.ts:80](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L80) |
| <a id="property-totalexecutiontime"></a> `totalExecutionTime` | `number` | Total run time in milliseconds. | [packages/components/src/agents/rlm/RLMCore.ts:84](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L84) |
