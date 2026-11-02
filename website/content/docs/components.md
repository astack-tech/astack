---
title: Components
description: The Component class, its ports, and its two execution modes.
order: 3
examples: [component, text-splitter]
api: [core/classes/Component, core/type-aliases/Port, components/classes/TextSplitter, components/classes/ToolInvoker]
---

A component is a class that extends `Component` from `@astack-tech/core`.

## Ports

Every component has two default ports: `in` (input) and `out` (output). Add more ports in the constructor:

```typescript
import { Component } from '@astack-tech/core';

class Classifier extends Component {
  constructor() {
    super({});
    Component.Port.I('text').attach(this); // extra input port
    Component.Port.O('question').attach(this); // extra output port
    Component.Port.O('statement').attach(this);
  }
}
```

A port is addressed as `componentName.portName` inside a pipeline, for example `classify.question`.

## Two execution modes

**Standalone.** `run(input)` processes one value and returns the result, or a promise of it. The default implementation returns the input unchanged.

**Pipeline.** When a component is added to a pipeline, the runtime calls `_transform($i, $o)`. The default `_transform` calls `run()` for every value on `in` and sends the result to `out`. So a component that only overrides `run()` already works in a pipeline.

Override `_transform` when you need more than one input or output, or when the output port depends on the data:

```typescript
import type { Port } from '@astack-tech/core';

override _transform($i: Port, $o: Port): void {
  $i('in').receive(text => {
    if (typeof text !== 'string') {
      throw new TypeError('Expected a string.');
    }
    $o(text.endsWith('?') ? 'question' : 'statement').send(text);
  });
}
```

`$i(name).receive(callback)` subscribes to an input port. `$o(name).send(value)` emits on an output port. A component can send zero, one or many values for each input.

Ports are connected at run time, so a callback receives `unknown`. Check the value before you use it. A callback that throws rejects the pipeline run that sent the value, and the port keeps delivering later values.

## Asynchronous work

Start the async work, send when it completes, and return the promise. The port does not wait for it before it delivers the next value, but a rejected promise rejects the run, like a throw:

```typescript
override _transform($i: Port, $o: Port): void {
  $i('in').receive(prompt => {
    if (typeof prompt !== 'string') {
      throw new TypeError('Expected a string.');
    }
    return model.generateCompletion(prompt).then(answer => {
      $o('out').send(answer);
    });
  });
}
```

The built-in components check their input the same way: a value of the wrong type rejects the run with a `TypeError` before any model or tool is called.

## Built-in components

| Component | Package | Ports | Purpose |
| --- | --- | --- | --- |
| `TextSplitter` | components | `text` → `out` | Split text into chunks of at most `chunkSize` characters, with overlap. |
| `ToolInvoker` | components | `in` → `out` | Run the tool calls found in a list of messages. See [Tools](/docs/tools). |
| `Agent` | components | `in` → `out` | Run a model with tools in a loop. See [Agents](/docs/agents). |
| `StreamingAgent` | components | `in` → `out` | Same loop, emitting progress events. See [Streaming](/docs/streaming). |
| `RLMAgent` | components | `in` → `out` | Answer questions over large contexts. See [RLM](/docs/rlm). |
| `OpenAICompatible` | integrations | `prompt` → `completion`, `messages` → `message` | Call OpenAI or any OpenAI-compatible API (Qwen, Ollama, ...). See [Model providers](/docs/model-providers). |
| `Deepseek` | integrations | `prompt` → `completion`, `messages` → `message` | `OpenAICompatible` with DeepSeek's defaults. |
