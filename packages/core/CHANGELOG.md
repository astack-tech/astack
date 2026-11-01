# @astack-tech/core

## 0.2.0-beta.2

### Minor Changes

- e71dd3b: Pipeline endpoint inference now returns the default output of the terminal component. Previously, a chain `a -> b` resolved with `a.out` instead of `b.out`. Separate `includeOutputsFrom` routes no longer share END consumers, `run()` no longer sorts the caller's array, and invalid identifiers reject the returned promise. `RunOptions` is exported. Node.js 20 or later is required.

## 0.2.0-beta.1

### Minor Changes

- Introduce type-safe Port system and refactor Pipeline with backward compatibility

## 0.1.1-beta.0

### Patch Changes

- beta release
