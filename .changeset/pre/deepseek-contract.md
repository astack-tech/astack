---
'@astack-tech/integrations': minor
---

Deepseek satisfies the `ModelProvider` interface of `@astack-tech/components` without a cast. Unset request options are omitted, an empty `choices` array fails with a clear error, non-object tool arguments become `{}`, and the pipeline fallback text is `API call failed`. API errors are logged only when `verbose` is set. Node.js 20 or later is required.
