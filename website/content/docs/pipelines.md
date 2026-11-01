---
title: Pipelines
description: Connect components, run a graph, and choose which output to read.
order: 4
examples: [pipeline, workflow]
api: [core/classes/Pipeline, core/interfaces/RunOptions]
---

A `Pipeline` holds named components and the connections between their ports.

```typescript
import { Pipeline } from '@astack-tech/core';

const pipeline = new Pipeline();
pipeline.addComponent('trim', new Trim());
pipeline.addComponent('upper', new Uppercase());
pipeline.addComponent('exclaim', new Exclaim());

pipeline.connect('trim.out', 'upper.in');
pipeline.connect('upper.out', 'exclaim.in');
```

- `addComponent(name, component)` registers a component. A second call with the same name is ignored.
- `connect(source, sink)` connects an output port to an input port. Duplicate connections are ignored.
- `getComponent(name)` returns a registered component.

## Running

`run(trigger, input, endpoint?)` sends `input` to the trigger port and resolves with the first value that reaches the endpoint.

```typescript
await pipeline.run<string>('trim.in', '  hi  '); // 'HI!'  (endpoint inferred)
await pipeline.run<string>('trim.in', '  hi  ', 'upper.out'); // 'HI'   (explicit endpoint)
```

### Endpoint inference

When you omit the endpoint, the pipeline looks for **terminal components**: components that receive data but have no outgoing connection.

| Graph | Result |
| --- | --- |
| One component, no connections | The component's default output port |
| Exactly one terminal component | That component's default output port |
| Several terminal components | Rejects with "Multiple leaf outputs detected" and lists the candidates |
| No terminal component (a cycle) | Rejects with "Circular topology detected" |

Pass an explicit endpoint whenever the graph branches.

### Collecting several outputs

Pass `includeOutputsFrom` to wait for several ports. The result is keyed by port:

```typescript
const result = await pipeline.run<number>('fork.in', 2, {
  includeOutputsFrom: ['fork.left', 'fork.right'],
});
// { 'fork.left': 20, 'fork.right': 200 }
```

## Execution model

- The topology for each trigger and endpoint pair is built on the first run and reused afterwards.
- Runs are not isolated from each other. Concurrent runs of the same route resolve in the order they started.
- A run never times out by itself. If no value reaches the endpoint, the promise stays pending. Make sure every path sends a value, or use an explicit endpoint that always receives one.
- Errors thrown while validating the run (an unknown component, an invalid port name, an ambiguous endpoint) reject the promise.

## Workflows

A workflow is a pipeline whose components call a model. Each step builds a prompt from its input and sends the model's answer on. The [workflow example](/examples/workflow) chains outline, draft and edit steps.
