# Interface: TokenUsage

Defined in: [packages/components/src/agents/types.ts:4](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L4)

Token usage reported by a model provider.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-completion_tokens"></a> `completion_tokens` | `number` | Tokens in the generated reply. | [packages/components/src/agents/types.ts:6](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L6) |
| <a id="property-prompt_cache_hit_tokens"></a> `prompt_cache_hit_tokens?` | `number` | Prompt tokens served from the provider's cache, when the provider reports it. | [packages/components/src/agents/types.ts:10](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L10) |
| <a id="property-prompt_cache_miss_tokens"></a> `prompt_cache_miss_tokens?` | `number` | Prompt tokens not served from the cache, when the provider reports it. | [packages/components/src/agents/types.ts:12](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L12) |
| <a id="property-prompt_tokens"></a> `prompt_tokens` | `number` | Tokens in the request, including the conversation history. | [packages/components/src/agents/types.ts:8](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L8) |
| <a id="property-total_tokens"></a> `total_tokens` | `number` | Sum of prompt and completion tokens. | [packages/components/src/agents/types.ts:14](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L14) |
