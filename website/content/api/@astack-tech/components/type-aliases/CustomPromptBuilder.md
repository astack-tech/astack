# Type Alias: CustomPromptBuilder

```ts
type CustomPromptBuilder = (context, query) => string;
```

Defined in: [packages/components/src/agents/rlm/RLMCore.ts:108](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L108)

Builds a task-specific prompt from the context and query.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`FileSystemContext`](../classes/FileSystemContext.md) |
| `query` | `string` |

## Returns

`string`
