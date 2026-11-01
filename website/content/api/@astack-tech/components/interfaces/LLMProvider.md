# Interface: LLMProvider

Defined in: [packages/components/src/agents/rlm/RLMCore.ts:98](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L98)

LLM provider interface for RLM

## Methods

### generate()

```ts
generate(prompt): Promise<string>;
```

Defined in: [packages/components/src/agents/rlm/RLMCore.ts:100](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L100)

Sends a prompt and resolves with the complete text response.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `prompt` | `string` |

#### Returns

`Promise`\<`string`\>

***

### generateStream()?

```ts
generateStream?(prompt): AsyncGenerator<string>;
```

Defined in: [packages/components/src/agents/rlm/RLMCore.ts:102](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts#L102)

Optional. Streams the response as text fragments. When present, `runStream()` streams generated code as it arrives.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `prompt` | `string` |

#### Returns

`AsyncGenerator`\<`string`\>
