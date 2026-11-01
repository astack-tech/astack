---
'@astack-tech/integrations': patch
---

`OpenAICompatible` and `Deepseek` check messages before sending a request. A message with a role other than `system`, `user`, `assistant` or `tool`, or a `tool` message without `tool_call_id`, now fails with a clear error instead of an API error. Omitted content is sent as empty text, except on `assistant` messages. Tools given in the OpenAI format are validated field by field.
