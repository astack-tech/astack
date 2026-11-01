---
'@astack-tech/components': patch
---

The `Tool` type (`AgentTool`) now declares the optional `execute(args)` and `invoke(args)` methods that agents call, so a tool object with `execute` type-checks without a cast.
