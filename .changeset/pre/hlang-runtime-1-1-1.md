---
'@astack-tech/core': patch
---

Require `@hlang-org/runtime` 1.1.1 or later. The runtime used to wire only one connection between any two components, so a pipeline with two connections between the same pair (two outputs of one component into two inputs of another, or one output into two inputs) never delivered on the other one and the run waited forever. Every connection now delivers. Runtime 1.1.0 also adds an ES module build, which ES module builds of AStack now load directly.
