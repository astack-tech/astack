---
'@astack-tech/core': minor
---

Run on the hlang runtime 2.1.

- A component that throws, or returns a rejected promise from a `receive` callback, now rejects the pipeline run instead of leaving it pending forever. Later runs keep working.
- A run now reaches only the trigger port it names. Before, once a pipeline had been run through two different trigger ports, every run sent its input to both.
- Breaking: ports are connected at run time, so `receive` callbacks get `unknown` and `Pipeline.run()` resolves with `unknown`. Remove the type argument from `run<T>()` and the type annotation from `receive` callbacks, and check the value before you use it.
- `Component` takes an `object` as its options, and `Port`'s `$` is a read-only RxJS `Observable`.
