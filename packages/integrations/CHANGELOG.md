# @astack-tech/integrations

## 0.2.0-beta.8

### Minor Changes

- 9aab43a: Add `ModelProvider.OpenAICompatible`, a provider for any API that speaks the OpenAI chat completions protocol: OpenAI and the compatible endpoints of DeepSeek, Qwen, Moonshot, Ollama, vLLM and others. Pass `model`, and `baseURL` for providers other than OpenAI; `name` labels errors and logs. `Deepseek` is now this provider with DeepSeek's defaults; its options, methods, ports and exported types are unchanged. The neutral message, tool and usage types are exported next to the `Deepseek*` names.

### Patch Changes

- Updated dependencies [1aba97f]
  - @astack-tech/core@0.2.0-beta.3

## 0.2.0-beta.7

### Minor Changes

- e71dd3b: Deepseek satisfies the `ModelProvider` interface of `@astack-tech/components` without a cast. Unset request options are omitted, an empty `choices` array fails with a clear error, non-object tool arguments become `{}`, and the pipeline fallback text is `API call failed`. API errors are logged only when `verbose` is set. Node.js 20 or later is required.

### Patch Changes

- Updated dependencies [e71dd3b]
  - @astack-tech/core@0.2.0-beta.2

## 0.1.1-beta.6

### Patch Changes

- Updated dependencies
  - @astack-tech/core@0.2.0-beta.1

## 0.1.1-beta.2

### Patch Changes

- rebuild package

## 0.1.1-beta.1

### Patch Changes

- fix agent tool finder

## 0.1.1-beta.0

### Patch Changes

- beta release
- Updated dependencies
  - @astack-tech/core@0.1.1-beta.0
