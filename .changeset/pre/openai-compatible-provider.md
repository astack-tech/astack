---
'@astack-tech/integrations': minor
---

Add `ModelProvider.OpenAICompatible`, a provider for any API that speaks the OpenAI chat completions protocol: OpenAI and the compatible endpoints of DeepSeek, Qwen, Moonshot, Ollama, vLLM and others. Pass `model`, and `baseURL` for providers other than OpenAI; `name` labels errors and logs. `Deepseek` is now this provider with DeepSeek's defaults; its options, methods, ports and exported types are unchanged. The neutral message, tool and usage types are exported next to the `Deepseek*` names.
