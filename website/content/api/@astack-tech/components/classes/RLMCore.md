# Class: RLMCore

Defined in: [packages/components/src/agents/rlm/RLMCore.ts:144](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L144)

RLM Core - Recursive Language Model with REPL environment
Based on the paper arXiv:2512.24601

Handles long contexts by allowing the LLM to generate code that orchestrates
multiple sub-LLM calls for chunking and analysis tasks.

Supports true recursion: Sub-LLM can itself be an RLM instance with REPL capabilities.

## Example

```typescript
const rlm = new RLMCore(rootLLM, subLLM, 2); // depth=2 enables recursive RLM
const result = await rlm.executeStream({
  context: fileSystemContext,
  query: "Analyze this codebase architecture"
});
```

## Implements

- [`LLMProvider`](../interfaces/LLMProvider.md)

## Constructors

### Constructor

```ts
new RLMCore(
   rootLLM, 
   subLLM, 
   maxDepth?, 
   sharedContext?, 
   customPrompt?, 
   options?
): RLMCore;
```

Defined in: [packages/components/src/agents/rlm/RLMCore.ts:172](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L172)

Create an RLM instance with optional recursive nesting

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `rootLLM` | [`LLMProvider`](../interfaces/LLMProvider.md) | `undefined` | LLM for generating orchestration code at this level |
| `subLLM` | [`LLMProvider`](../interfaces/LLMProvider.md) | `undefined` | LLM for answering sub-queries (can be another RLM for recursion) |
| `maxDepth?` | `number` | `1` | Maximum nesting depth (default: 1) |
| `sharedContext?` | [`FileSystemContext`](FileSystemContext.md) | `undefined` | Shared FileSystemContext across all recursion levels (internal use) |
| `customPrompt?` | \| `string` \| [`CustomPromptBuilder`](../type-aliases/CustomPromptBuilder.md) | `undefined` | Additional task-specific prompt (appended to default) |
| `options?` | [`RLMCoreOptions`](../interfaces/RLMCoreOptions.md) | `{}` | Additional options, such as `verbose` |

#### Returns

`RLMCore`

#### Remarks

When `maxDepth > 1`, the constructor automatically creates nested RLM instances:
- depth=2: Root RLM → Sub RLM → Base LLM
- depth=3: Root RLM → Sub RLM → Sub RLM → Base LLM

All nested RLMs share the same FileSystemContext (if provided) to avoid redundant file reads.

For most tasks, depth=1 is sufficient. Use a greater depth only for complex multi-layer analysis.

## Methods

### execute()

```ts
execute(input): Promise<RLMResult>;
```

Defined in: [packages/components/src/agents/rlm/RLMCore.ts:199](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L199)

Execute RLM with given context and query

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`RLMInput`](../interfaces/RLMInput.md) |

#### Returns

`Promise`\<[`RLMResult`](../interfaces/RLMResult.md)\>

***

### executeStream()

```ts
executeStream(input): AsyncGenerator<RLMChunk>;
```

Defined in: [packages/components/src/agents/rlm/RLMCore.ts:220](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L220)

Execute RLM with streaming output

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`RLMInput`](../interfaces/RLMInput.md) |

#### Returns

`AsyncGenerator`\<[`RLMChunk`](../interfaces/RLMChunk.md)\>

***

### generate()

```ts
generate(prompt): Promise<string>;
```

Defined in: [packages/components/src/agents/rlm/RLMCore.ts:708](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L708)

Implement LLMProvider.generate - allows RLM to be used as sub-LLM
This enables true recursive RLM where Sub-LLM is itself an RLM instance

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `prompt` | `string` |

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`LLMProvider`](../interfaces/LLMProvider.md).[`generate`](../interfaces/LLMProvider.md#generate)

***

### generateStream()

```ts
generateStream(prompt): AsyncGenerator<string>;
```

Defined in: [packages/components/src/agents/rlm/RLMCore.ts:718](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L718)

Implement LLMProvider.generateStream - streaming variant for recursive RLM

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `prompt` | `string` |

#### Returns

`AsyncGenerator`\<`string`\>

#### Implementation of

[`LLMProvider`](../interfaces/LLMProvider.md).[`generateStream`](../interfaces/LLMProvider.md#generatestream)
