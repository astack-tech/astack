# Interface: DeepseekConfig

Defined in: [packages/integrations/src/model-provider/deepseek/index.ts:8](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L8)

Options for the DeepSeek model provider.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-apikey"></a> `apiKey` | `string` | DeepSeek API key. | [packages/integrations/src/model-provider/deepseek/index.ts:10](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L10) |
| <a id="property-baseurl"></a> `baseURL?` | `string` | API base URL. Defaults to `https://api.deepseek.com/v1`. | [packages/integrations/src/model-provider/deepseek/index.ts:14](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L14) |
| <a id="property-dangerouslyallowbrowser"></a> `dangerouslyAllowBrowser?` | `boolean` | Allows the OpenAI client to run in a browser. Defaults to `false`. | [packages/integrations/src/model-provider/deepseek/index.ts:31](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L31) |
| <a id="property-maxtokens"></a> `maxTokens?` | `number` | Maximum number of generated tokens. | [packages/integrations/src/model-provider/deepseek/index.ts:18](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L18) |
| <a id="property-model"></a> `model?` | `string` | Model name. Defaults to `deepseek-chat`. | [packages/integrations/src/model-provider/deepseek/index.ts:12](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L12) |
| <a id="property-rawtools"></a> `rawTools?` | [`DeepseekRawTool`](DeepseekRawTool.md)[] | Tools given as `{ name, description, parameters }` objects. When this list is not empty, it takes precedence over `tools`. | [packages/integrations/src/model-provider/deepseek/index.ts:27](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L27) |
| <a id="property-systemprompt"></a> `systemPrompt?` | `string` | System prompt added before every request. | [packages/integrations/src/model-provider/deepseek/index.ts:22](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L22) |
| <a id="property-temperature"></a> `temperature?` | `number` | Sampling temperature. Defaults to `0.7`. | [packages/integrations/src/model-provider/deepseek/index.ts:16](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L16) |
| <a id="property-tools"></a> `tools?` | `unknown`[] | Tools in the OpenAI-compatible `{ type: 'function', function }` format. | [packages/integrations/src/model-provider/deepseek/index.ts:29](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L29) |
| <a id="property-topp"></a> `topP?` | `number` | Nucleus sampling probability. | [packages/integrations/src/model-provider/deepseek/index.ts:20](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L20) |
| <a id="property-verbose"></a> `verbose?` | `boolean` | Logs API errors to the console. Defaults to `false`. | [packages/integrations/src/model-provider/deepseek/index.ts:33](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/deepseek/index.ts#L33) |
