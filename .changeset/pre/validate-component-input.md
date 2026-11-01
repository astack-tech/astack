---
'@astack-tech/components': minor
---

`Agent`, `StreamingAgent`, `RLMAgent` and `ToolInvoker` check the value on their `in` port. A value of the wrong type rejects the pipeline run with a `TypeError` before any model or tool is called. `ToolInvoker` used to send an empty `tool_messages` array for invalid input.
