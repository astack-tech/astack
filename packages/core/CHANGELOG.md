# @astack-tech/core

## 0.2.0-beta.5

### Minor Changes

- fa0689e: Run on the hlang runtime 2.1.
  
  - A component that throws, or returns a rejected promise from a `receive` callback, now rejects the pipeline run instead of leaving it pending forever. Later runs keep working.
  - A run now reaches only the trigger port it names. Before, once a pipeline had been run through two different trigger ports, every run sent its input to both.
  - Breaking: ports are connected at run time, so `receive` callbacks get `unknown` and `Pipeline.run()` resolves with `unknown`. Remove the type argument from `run<T>()` and the type annotation from `receive` callbacks, and check the value before you use it.
  - `Component` takes an `object` as its options, and `Port`'s `$` is a read-only RxJS `Observable`.

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
