# Interface: RLMResult

Defined in: [packages/components/src/agents/rlm/RLMCore.ts:29](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L29)

RLM execution result

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-answer"></a> `answer` | `string` | Final answer passed to `FINAL()` by the generated code. | [packages/components/src/agents/rlm/RLMCore.ts:31](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L31) |
| <a id="property-code"></a> `code` | `string` | JavaScript that the root model generated and the sandbox ran. | [packages/components/src/agents/rlm/RLMCore.ts:33](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L33) |
| <a id="property-depth"></a> `depth` | `number` | Recursion depth of this run. The root run reports 0. | [packages/components/src/agents/rlm/RLMCore.ts:35](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L35) |
| <a id="property-error"></a> `error?` | `string` | Error message when the run failed inside a pipeline. | [packages/components/src/agents/rlm/RLMCore.ts:37](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L37) |
