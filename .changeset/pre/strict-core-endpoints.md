---
'@astack-tech/core': minor
---

Pipeline endpoint inference now returns the default output of the terminal component. Previously, a chain `a -> b` resolved with `a.out` instead of `b.out`. Separate `includeOutputsFrom` routes no longer share END consumers, `run()` no longer sorts the caller's array, and invalid identifiers reject the returned promise. `RunOptions` is exported. Node.js 20 or later is required.
