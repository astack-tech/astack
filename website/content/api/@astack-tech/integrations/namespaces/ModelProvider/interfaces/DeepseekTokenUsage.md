# Interface: DeepseekTokenUsage

Defined in: [packages/integrations/src/model-provider/openai-compatible/index.ts:113](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L113)

Token usage reported by the API.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-completion_tokens"></a> `completion_tokens` | `number` | Tokens in the generated reply. | [packages/integrations/src/model-provider/openai-compatible/index.ts:115](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L115) |
| <a id="property-prompt_cache_hit_tokens"></a> `prompt_cache_hit_tokens?` | `number` | Prompt tokens served from the provider's context cache (reported by DeepSeek). | [packages/integrations/src/model-provider/openai-compatible/index.ts:119](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L119) |
| <a id="property-prompt_cache_miss_tokens"></a> `prompt_cache_miss_tokens?` | `number` | Prompt tokens not served from the cache. | [packages/integrations/src/model-provider/openai-compatible/index.ts:121](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L121) |
| <a id="property-prompt_tokens"></a> `prompt_tokens` | `number` | Tokens in the request. | [packages/integrations/src/model-provider/openai-compatible/index.ts:117](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L117) |
| <a id="property-total_tokens"></a> `total_tokens` | `number` | Sum of prompt and completion tokens. | [packages/integrations/src/model-provider/openai-compatible/index.ts:123](https://github.com/astack-tech/astack/blob/master/packages/integrations/src/model-provider/openai-compatible/index.ts#L123) |
