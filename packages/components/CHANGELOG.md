# @astack-tech/components

## 0.2.0-beta.11

### Patch Changes

- a395d53: The READMEs lead with the model you choose: `OpenAICompatible` for OpenAI, Qwen, local models through Ollama and any other OpenAI-compatible API, `Deepseek` as a preset, and any object with `chatCompletion()` for everything else.

## 0.2.0-beta.10

### Minor Changes

- 0178c3c: `Agent`, `StreamingAgent`, `RLMAgent` and `ToolInvoker` check the value on their `in` port. A value of the wrong type rejects the pipeline run with a `TypeError` before any model or tool is called. `ToolInvoker` used to send an empty `tool_messages` array for invalid input.

### Patch Changes

- Updated dependencies [fa0689e]
  - @astack-tech/core@0.2.0-beta.5
  - @astack-tech/tools@0.2.0-beta.4

## 0.2.0-beta.9

### Patch Changes

- 149aa02: The `Tool` type (`AgentTool`) now declares the optional `execute(args)` and `invoke(args)` methods that agents call, so a tool object with `execute` type-checks without a cast.

## 0.2.0-beta.8

### Patch Changes

- Updated dependencies [1eb93f0]
  - @astack-tech/core@0.2.0-beta.4
  - @astack-tech/tools@0.2.0-beta.3

## 0.2.0-beta.7

### Patch Changes

- da7486c: Export the `AgentToolCall`, `ToolInvokerMessageRole` and `MemoryLimits` types, which public types already referenced. Every export now has TSDoc documentation, published in the API reference at https://astack.tech/docs/api.
- Updated dependencies [1aba97f]
  - @astack-tech/core@0.2.0-beta.3
  - @astack-tech/tools@0.2.0-beta.2

## 0.2.0-beta.6

### Minor Changes

- e71dd3b: Agent and StreamingAgent share one runtime. StreamingAgent now sums token usage across iterations, includes `usage` in its output, emits a single `error` event, sends real newlines in tool results, and falls back to `chatCompletion` when the model cannot stream. Console output is opt-in through `verbose`, and prompts and messages are in English. TextSplitter keeps every chunk within `chunkSize` and honors `overlap`. ToolInvoker reports unknown tools per call and clears its timeout. RLMAgent, RLMCore and FileSystemContext are exported from the package root, multi-line answers are kept, and RLMAgent works inside a pipeline. Node.js 20 or later is required.

### Patch Changes

- Updated dependencies [e71dd3b]
- Updated dependencies [e71dd3b]
  - @astack-tech/core@0.2.0-beta.2
  - @astack-tech/tools@0.2.0-beta.1

## 0.1.1-beta.5

### Patch Changes

- Updated dependencies
  - @astack-tech/core@0.2.0-beta.1

## 0.1.1-beta.0

### Patch Changes

- beta release
- Updated dependencies
  - @astack-tech/core@0.1.1-beta.0
  - @astack-tech/tools@0.1.1-beta.0
