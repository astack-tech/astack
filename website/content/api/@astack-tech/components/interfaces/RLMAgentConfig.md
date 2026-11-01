# Interface: RLMAgentConfig

Defined in: [packages/components/src/agents/rlm/RLMAgent.ts:29](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMAgent.ts#L29)

RLMAgent configuration

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-maxdepth"></a> `maxDepth?` | `number` | Maximum nesting depth for RLM instances (default: 1) **Remarks** - depth=1: Root RLM → Base LLM (recommended for most tasks) - depth=2: Root RLM → Sub RLM → Base LLM (complex multi-layer analysis) - depth=3+: Multiple nested RLM layers (experimental) When `maxDepth` is greater than 1, nested RLM instances are created automatically. | [packages/components/src/agents/rlm/RLMAgent.ts:44](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMAgent.ts#L44) |
| <a id="property-rootllm"></a> `rootLLM` | [`LLMProvider`](LLMProvider.md) | LLM for generating orchestration code | [packages/components/src/agents/rlm/RLMAgent.ts:31](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMAgent.ts#L31) |
| <a id="property-sharedcontext"></a> `sharedContext?` | [`FileSystemContext`](../classes/FileSystemContext.md) | Shared FileSystemContext for all recursion levels (optional) **Remarks** When provided, all nested RLM instances share the same FileSystemContext, avoiding redundant file reads through shared LRU cache. | [packages/components/src/agents/rlm/RLMAgent.ts:52](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMAgent.ts#L52) |
| <a id="property-subllm"></a> `subLLM` | [`LLMProvider`](LLMProvider.md) | LLM for answering sub-queries | [packages/components/src/agents/rlm/RLMAgent.ts:33](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMAgent.ts#L33) |
| <a id="property-systemprompt"></a> `systemPrompt?` | \| `string` \| [`SystemPromptBuilder`](../type-aliases/SystemPromptBuilder.md) | Task-specific additional prompt (optional) **Remarks** This prompt is APPENDED to the default RLM system prompt. The default prompt describes REPL environment basics (tools, FINAL(), etc.). Your custom prompt should add task-specific strategies and examples. - String: Additional task-specific instructions - Function: Dynamic prompt generation based on context and query - Undefined: Uses only the default REPL environment prompt **Example** `// Static task-specific prompt systemPrompt: "OOLONG-Pairs Strategy: Find all user pairs where both have entity/location..." // Dynamic prompt builder systemPrompt: (context, query) => `Task-specific guidance for: ${query}`` | [packages/components/src/agents/rlm/RLMAgent.ts:74](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMAgent.ts#L74) |
| <a id="property-verbose"></a> `verbose?` | `boolean` | Mirror sandbox console output and errors to the real console. Default: false. | [packages/components/src/agents/rlm/RLMAgent.ts:78](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMAgent.ts#L78) |
