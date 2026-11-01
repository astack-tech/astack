---
title: 管道
description: 连接组件、运行一张图，并选择读取哪个输出。
order: 4
examples: [pipeline, workflow]
api: [core/classes/Pipeline, core/interfaces/RunOptions]
source: 2ae611ac0148ffef7b51e189cbf581826e69341619eb8ce55abf8d309fdc02c7
---

`Pipeline` 保存具名的组件，以及它们端口之间的连接。

```typescript
import { Pipeline } from '@astack-tech/core';

const pipeline = new Pipeline();
pipeline.addComponent('trim', new Trim());
pipeline.addComponent('upper', new Uppercase());
pipeline.addComponent('exclaim', new Exclaim());

pipeline.connect('trim.out', 'upper.in');
pipeline.connect('upper.out', 'exclaim.in');
```

- `addComponent(name, component)` 注册一个组件。用同一个名字再次调用会被忽略。
- `connect(source, sink)` 把一个输出端口连接到一个输入端口。重复的连接会被忽略。
- `getComponent(name)` 返回一个已注册的组件。

## 运行

`run(trigger, input, endpoint?)` 把 `input` 发送到触发端口，并以第一个到达终点的值作为结果。

```typescript
await pipeline.run('trim.in', '  hi  '); // 'HI!'  (endpoint inferred)
await pipeline.run('trim.in', '  hi  ', 'upper.out'); // 'HI'   (explicit endpoint)
```

图在运行时才连接，所以结果是 `unknown`，使用前先检查：

```typescript
const result = await pipeline.run('trim.in', '  hi  ');
if (typeof result !== 'string') {
  throw new TypeError('Expected a string.');
}
```

### 终点推断

省略终点时，管道会寻找**终端组件**：接收数据、但没有任何向外连接的组件。

| 图 | 结果 |
| --- | --- |
| 只有一个组件，没有连接 | 该组件的默认输出端口 |
| 恰好有一个终端组件 | 该组件的默认输出端口 |
| 有多个终端组件 | 以 "Multiple leaf outputs detected" 拒绝，并列出候选端口 |
| 没有终端组件（存在环） | 以 "Circular topology detected" 拒绝 |

只要图中存在分支，就显式传入终点。

### 收集多个输出

传入 `includeOutputsFrom` 可以等待多个端口，结果以端口为键：

```typescript
const result = await pipeline.run('fork.in', 2, {
  includeOutputsFrom: ['fork.left', 'fork.right'],
});
// { 'fork.left': 20, 'fork.right': 200 }
```

## 执行模型

- 每一组“触发端口 + 终点”的拓扑在第一次运行时构建，之后重复使用。
- 各次运行之间并不隔离。同一路由的并发运行按开始的顺序返回结果。
- 运行本身不会超时。如果没有值到达终点，Promise 会一直处于等待状态。请确保每条路径都会发送值，或者使用一个一定会收到值的显式终点。
- 校验运行参数时抛出的错误（未知组件、无效的端口名、有歧义的终点）会使 Promise 被拒绝。
- 组件抛出错误，或在 `receive` 回调中返回被拒绝的 Promise，会以该错误拒绝一次运行：同步错误拒绝正在投递输入的那次运行，之后的错误拒绝最早一次仍在等待的运行。之后的运行不受影响。

## 工作流

工作流就是组件会调用模型的管道。每一步根据输入构建提示词，再把模型的回答传给下一步。[工作流示例](/examples/workflow)依次串联了提纲、起草和润色三个步骤。
