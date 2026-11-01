---
title: Routing
description: Send data down different branches with named output ports.
order: 5
examples: [routing]
api: [core/type-aliases/Port, core/classes/Pipeline]
---

A component routes data by choosing which output port to send on. There is no separate router type.

```typescript
class Classifier extends Component {
  constructor() {
    super({});
    Component.Port.O('question').attach(this);
    Component.Port.O('statement').attach(this);
  }

  override _transform($i: Port, $o: Port): void {
    $i('in').receive((text: string) => {
      $o(text.trim().endsWith('?') ? 'question' : 'statement').send(text);
    });
  }
}

pipeline.connect('classify.question', 'answer.in');
pipeline.connect('classify.statement', 'note.in');
```

## Reading a branch

A branching graph has more than one terminal component, so `run()` cannot infer the endpoint. Name the branch you expect:

```typescript
await pipeline.run('classify.in', 'What is AStack?', 'answer.out');
```

If the data goes down the other branch, no value reaches `answer.out` and the promise stays pending. When you do not know the branch in advance, join the branches into one component, or have both branches send to a shared output.

## Fan-out

A component can send on several ports for one input. Use `includeOutputsFrom` to collect all of them:

```typescript
await pipeline.run('fork.in', 2, { includeOutputsFrom: ['fork.left', 'fork.right'] });
```
