---
title: 路由
description: 通过具名输出端口，把数据发送到不同的分支。
order: 5
examples: [routing]
api: [core/type-aliases/Port, core/classes/Pipeline]
source: 97086bcf65448d04dddcd21c6965a75d6a9bd9dbe0338b13cee72df27a870802
---

组件通过选择向哪个输出端口发送来路由数据，不需要单独的路由器类型。

```typescript
class Classifier extends Component {
  constructor() {
    super({});
    Component.Port.O('question').attach(this);
    Component.Port.O('statement').attach(this);
  }

  override _transform($i: Port, $o: Port): void {
    $i('in').receive(text => {
      if (typeof text !== 'string') {
        throw new TypeError('Classifier expects a string.');
      }
      $o(text.trim().endsWith('?') ? 'question' : 'statement').send(text);
    });
  }
}

pipeline.connect('classify.question', 'answer.in');
pipeline.connect('classify.statement', 'note.in');
```

## 读取某个分支

有分支的图会有不止一个终端组件，所以 `run()` 无法推断终点。请写明你期望的分支：

```typescript
await pipeline.run('classify.in', 'What is AStack?', 'answer.out');
```

如果数据走了另一个分支，就不会有值到达 `answer.out`，Promise 会一直处于等待状态。如果事先不知道数据会走哪个分支，可以把各分支汇合到一个组件，或者让两个分支都发送到同一个输出。

## 扇出

对一个输入，组件可以向多个端口发送数据。用 `includeOutputsFrom` 收集所有结果：

```typescript
await pipeline.run('fork.in', 2, { includeOutputsFrom: ['fork.left', 'fork.right'] });
```
