---
'@astack-tech/integrations': patch
---

The `prompt` and `messages` ports of `Deepseek` and `OpenAICompatible` check their input. A value of the wrong type rejects the pipeline run with a `TypeError` before the API is called.
