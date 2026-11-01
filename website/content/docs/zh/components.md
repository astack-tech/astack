---
title: 组件
description: Component 类、它的端口，以及两种执行模式。
order: 3
examples: [component, text-splitter]
api: [core/classes/Component, core/type-aliases/Port, components/classes/TextSplitter, components/classes/ToolInvoker]
source: 6aa681ff34a2e2a95900594d1ba3e0923f2575f0ae13a80cb1d568f713ea2f2b
---

组件是继承自 `@astack-tech/core` 中 `Component` 的类。

## 端口

每个组件都有两个默认端口：`in`（输入）和 `out`（输出）。可以在构造函数中添加更多端口：

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

在管道中，端口用 `组件名.端口名` 的形式表示，例如 `classify.question`。

## 两种执行模式

**独立运行。** `run(input)` 处理一个值并返回结果，或返回结果的 Promise。默认实现原样返回输入。

**在管道中。** 组件被加入管道后，运行时会调用 `_transform($i, $o)`。默认的 `_transform` 会对 `in` 上的每个值调用 `run()`，并把结果发送到 `out`。所以只重写了 `run()` 的组件已经可以在管道中使用。

当你需要多个输入或输出，或者输出端口取决于数据本身时，重写 `_transform`：

```typescript
import type { Port } from '@astack-tech/core';

override _transform($i: Port, $o: Port): void {
  $i('in').receive((text: string) => {
    $o(text.endsWith('?') ? 'question' : 'statement').send(text);
  });
}
```

`$i(name).receive(callback)` 订阅一个输入端口，`$o(name).send(value)` 向一个输出端口发送数据。对每个输入，组件可以发送零个、一个或多个值。

## 异步处理

`receive` 的回调不会被等待（await）。先启动异步任务，在任务完成时再发送结果：

```typescript
override _transform($i: Port, $o: Port): void {
  $i('in').receive((prompt: string) => {
    void model.generateCompletion(prompt).then(answer => {
      $o('out').send(answer);
    });
  });
}
```

## 内置组件

| 组件 | 软件包 | 端口 | 用途 |
| --- | --- | --- | --- |
| `TextSplitter` | components | `text` → `out` | 把文本切分成最多 `chunkSize` 个字符的块，块之间可以重叠。 |
| `ToolInvoker` | components | `in` → `out` | 执行消息列表中的工具调用。参见[工具](/zh/docs/tools)。 |
| `Agent` | components | `in` → `out` | 让模型循环调用工具。参见[智能体](/zh/docs/agents)。 |
| `StreamingAgent` | components | `in` → `out` | 同样的循环，并在过程中发出进度事件。参见[流式输出](/zh/docs/streaming)。 |
| `RLMAgent` | components | `in` → `out` | 在超大上下文上回答问题。参见 [RLM](/zh/docs/rlm)。 |
| `Deepseek` | integrations | `prompt` → `completion`、`messages` → `message` | 调用 DeepSeek API。参见[模型提供方](/zh/docs/model-providers)。 |
