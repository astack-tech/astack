# Interface: SubLLMCall

Defined in: [packages/components/src/agents/rlm/RLMCore.ts:56](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L56)

Sub-LLM call details
Full prompt/result content is offloaded to temporary log files to prevent OOM

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-depth"></a> `depth` | `number` | Depth of the sub-model call. Calls made by the root run have depth 1. | [packages/components/src/agents/rlm/RLMCore.ts:58](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L58) |
| <a id="property-duration"></a> `duration` | `number` | Call duration in milliseconds. | [packages/components/src/agents/rlm/RLMCore.ts:66](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L66) |
| <a id="property-logfile"></a> `logFile` | `string` | Temporary JSON file with the full prompt and result of the call. Kept outside memory to bound memory use. | [packages/components/src/agents/rlm/RLMCore.ts:60](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L60) |
| <a id="property-promptlength"></a> `promptLength` | `number` | Prompt length in characters. | [packages/components/src/agents/rlm/RLMCore.ts:62](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L62) |
| <a id="property-resultlength"></a> `resultLength` | `number` | Result length in characters. | [packages/components/src/agents/rlm/RLMCore.ts:64](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L64) |
| <a id="property-timestamp"></a> `timestamp` | `number` | Time the call finished, in milliseconds since the Unix epoch. | [packages/components/src/agents/rlm/RLMCore.ts:68](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L68) |
