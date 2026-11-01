---
'@astack-tech/components': minor
---

Agent and StreamingAgent share one runtime. StreamingAgent now sums token usage across iterations, includes `usage` in its output, emits a single `error` event, sends real newlines in tool results, and falls back to `chatCompletion` when the model cannot stream. Console output is opt-in through `verbose`, and prompts and messages are in English. TextSplitter keeps every chunk within `chunkSize` and honors `overlap`. ToolInvoker reports unknown tools per call and clears its timeout. RLMAgent, RLMCore and FileSystemContext are exported from the package root, multi-line answers are kept, and RLMAgent works inside a pipeline. Node.js 20 or later is required.
