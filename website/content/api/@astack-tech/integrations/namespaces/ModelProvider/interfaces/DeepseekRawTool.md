# Interface: DeepseekRawTool

Defined in: [packages/integrations/src/model-provider/openai-compatible/index.ts:41](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L41)

Tool description accepted by `rawTools` and `temporaryTools`.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-description"></a> `description` | `string` | Description that tells the model when to use the tool. | [packages/integrations/src/model-provider/openai-compatible/index.ts:45](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L45) |
| <a id="property-name"></a> `name` | `string` | Unique tool name. | [packages/integrations/src/model-provider/openai-compatible/index.ts:43](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L43) |
| <a id="property-parameters"></a> `parameters?` | `Record`\<`string`, `unknown`\> | JSON Schema of the arguments. Defaults to `{}`. | [packages/integrations/src/model-provider/openai-compatible/index.ts:47](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L47) |
