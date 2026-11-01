---
title: 快速开始
description: 安装 AStack，编写一个组件，并把它连接进管道。
order: 2
examples: [component, pipeline]
api: [core/classes/Component, core/classes/Pipeline]
source: 71ca7d383f29a5fdd3cf69f5107b7f10c3c6b6607dbae2a1b4d917f0160fbe69
---

## 安装

AStack 需要 Node.js 20 或更高版本。

```bash
npm install @astack-tech/core @astack-tech/components
```

需要模型提供方时再安装 `@astack-tech/integrations`，需要工具时再安装 `@astack-tech/tools`。

## 编写组件

组件继承 `Component`。重写 `run()` 即可让它可以独立运行。

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

## 连接组件

在管道中注册组件，把输出端口连接到输入端口，然后运行。

```typescript
import { Pipeline } from '@astack-tech/core';

const pipeline = new Pipeline();
pipeline.addComponent('trim', new Trim());
pipeline.addComponent('upper', new Uppercase());
pipeline.connect('trim.out', 'upper.in');

const result = await pipeline.run('trim.in', '  hello  '); // 'HELLO'
```

每个组件默认都有一个 `in` 端口和一个 `out` 端口。`run()` 把输入发送到触发端口（`trim.in`），并以到达终点的值作为结果。这里的终点是自动推断的：`upper` 是唯一一个没有下游连接的组件。

## 下一步

- 阅读[组件](/zh/docs/components)和[管道](/zh/docs/pipelines)。
- 按顺序学习[示例](/examples)，每个示例只引入一个新概念。
