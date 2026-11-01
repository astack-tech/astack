---
title: Getting started
description: Install AStack, write a component and connect it into a pipeline.
order: 2
examples: [component, pipeline]
---

## Install

AStack needs Node.js 20 or later.

```bash
npm install @astack-tech/core @astack-tech/components
```

Add `@astack-tech/integrations` for model providers and `@astack-tech/tools` for tools.

## Write a component

A component extends `Component`. Override `run()` to give it standalone behavior.

```typescript
import { Component } from '@astack-tech/core';

class Uppercase extends Component {
  constructor() {
    super({});
  }

  override run(text: unknown): string {
    return String(text).toUpperCase();
  }
}

console.log(new Uppercase().run('hello')); // HELLO
```

## Connect components

Register components in a pipeline, connect an output port to an input port, and run it.

```typescript
import { Pipeline } from '@astack-tech/core';

const pipeline = new Pipeline();
pipeline.addComponent('trim', new Trim());
pipeline.addComponent('upper', new Uppercase());
pipeline.connect('trim.out', 'upper.in');

const result = await pipeline.run<string>('trim.in', '  hello  '); // 'HELLO'
```

Every component has an `in` and an `out` port by default. `run()` sends the input to the trigger port (`trim.in`) and resolves with the value that reaches the endpoint. Here the endpoint is inferred: `upper` is the only component with no downstream connection.

## Next steps

- Read [Components](/docs/components) and [Pipelines](/docs/pipelines).
- Work through the [examples](/examples) in order. Each one adds one idea.
