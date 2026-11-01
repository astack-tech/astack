# @astack-tech/core

## 0.2.0-beta.4

### Patch Changes

- 1eb93f0: Require `@hlang-org/runtime` 1.1.1 or later. The runtime used to wire only one connection between any two components, so a pipeline with two connections between the same pair (two outputs of one component into two inputs of another, or one output into two inputs) never delivered on the other one and the run waited forever. Every connection now delivers. Runtime 1.1.0 also adds an ES module build, which ES module builds of AStack now load directly.

## 0.2.0-beta.3

### Patch Changes

- 1aba97f: Require `@hlang-org/runtime` 1.0.7 or later. That release depends on `uuid` 11.1.1, which fixes GHSA-w5hq-g745-h8pq, so installs no longer need an override for it.

## 0.2.0-beta.2

### Minor Changes

- e71dd3b: Pipeline endpoint inference now returns the default output of the terminal component. Previously, a chain `a -> b` resolved with `a.out` instead of `b.out`. Separate `includeOutputsFrom` routes no longer share END consumers, `run()` no longer sorts the caller's array, and invalid identifiers reject the returned promise. `RunOptions` is exported. Node.js 20 or later is required.

## 0.2.0-beta.1

### Minor Changes

- Introduce type-safe Port system and refactor Pipeline with backward compatibility

## 0.1.1-beta.0

### Patch Changes

- beta release
