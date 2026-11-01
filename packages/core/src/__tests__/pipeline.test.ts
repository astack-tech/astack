import { describe, expect, it } from 'vitest';

import Component from '../component';
import type { Port } from '../component';
import Pipeline from '../pipeline';

/** Narrows a port value to a number, failing the test on anything else. */
function requireNumber(value: unknown): number {
  if (typeof value !== 'number') {
    throw new TypeError(`Expected a number, received ${typeof value}`);
  }
  return value;
}

class Doubler extends Component {
  constructor() {
    super({});
  }

  override run(data: unknown): number {
    return requireNumber(data) * 2;
  }
}

class AddOne extends Component {
  constructor() {
    super({});
  }

  override run(data: unknown): number {
    return requireNumber(data) + 1;
  }
}

/** Routes even numbers to `even` and odd numbers to `odd`. */
class ParityRouter extends Component {
  constructor() {
    super({});
    Component.Port.O('even').attach(this);
    Component.Port.O('odd').attach(this);
  }

  override _transform($i: Port, $o: Port): void {
    $i('in').receive(data => {
      const value = requireNumber(data);
      $o(value % 2 === 0 ? 'even' : 'odd').send(value);
    });
  }
}

/** Waits for one value on `a` and one on `b`, then sends their sum. */
class Join extends Component {
  constructor() {
    super({});
    Component.Port.I('a').attach(this);
    Component.Port.I('b').attach(this);
  }

  override _transform($i: Port, $o: Port): void {
    let a: number | undefined;
    let b: number | undefined;
    const emit = () => {
      if (a !== undefined && b !== undefined) {
        $o('out').send(a + b);
      }
    };
    $i('a').receive(data => {
      a = requireNumber(data);
      emit();
    });
    $i('b').receive(data => {
      b = requireNumber(data);
      emit();
    });
  }
}

/** Fails a run that never resolves, instead of hanging the suite. */
function within<T>(promise: Promise<T>, ms = 1000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`no value within ${String(ms)} ms`));
      }, ms);
    }),
  ]);
}

/** Fails on every input. */
class Failing extends Component {
  constructor() {
    super({});
  }

  override run(): number {
    throw new Error('cannot process');
  }
}

/** Fails asynchronously on every input. */
class FailingLater extends Component {
  constructor() {
    super({});
  }

  override _transform($i: Port): void {
    $i('in').receive(async () => {
      await Promise.resolve();
      throw new Error('failed later');
    });
  }
}

/** Emits the same input on two ports. */
class Fork extends Component {
  constructor() {
    super({});
    Component.Port.O('left').attach(this);
    Component.Port.O('right').attach(this);
  }

  override _transform($i: Port, $o: Port): void {
    $i('in').receive(data => {
      const value = requireNumber(data);
      $o('left').send(value * 10);
      $o('right').send(value * 100);
    });
  }
}

describe('Component', () => {
  it('returns the input from the default run()', () => {
    expect(new Component({}).run('same')).toBe('same');
  });

  it('runs a subclass on its own', () => {
    expect(new Doubler().run(21)).toBe(42);
  });
});

describe('Pipeline', () => {
  it('infers the output port of a single component', async () => {
    const pipeline = new Pipeline();
    pipeline.addComponent('double', new Doubler());

    await expect(pipeline.run('double.in', 4)).resolves.toBe(8);
  });

  it('infers the leaf port of a linear chain', async () => {
    const pipeline = new Pipeline();
    pipeline.addComponent('double', new Doubler());
    pipeline.addComponent('addOne', new AddOne());
    pipeline.connect('double.out', 'addOne.in');

    await expect(pipeline.run('double.in', 5)).resolves.toBe(11);
  });

  it('resolves concurrent runs in submission order', async () => {
    const pipeline = new Pipeline();
    pipeline.addComponent('double', new Doubler());
    pipeline.addComponent('addOne', new AddOne());
    pipeline.connect('double.out', 'addOne.in');

    const results = await Promise.all([1, 2, 3].map(n => pipeline.run('double.in', n)));
    expect(results).toEqual([3, 5, 7]);
  });

  it('uses an explicit endpoint on a branching topology', async () => {
    const pipeline = new Pipeline();
    pipeline.addComponent('router', new ParityRouter());
    pipeline.addComponent('double', new Doubler());
    pipeline.addComponent('addOne', new AddOne());
    pipeline.connect('router.even', 'double.in');
    pipeline.connect('router.odd', 'addOne.in');

    await expect(pipeline.run('router.in', 4, 'double.out')).resolves.toBe(8);
    await expect(pipeline.run('router.in', 3, 'addOne.out')).resolves.toBe(4);
  });

  it('rejects inference when several leaf ports exist', async () => {
    const pipeline = new Pipeline();
    pipeline.addComponent('router', new ParityRouter());
    pipeline.addComponent('double', new Doubler());
    pipeline.addComponent('addOne', new AddOne());
    pipeline.connect('router.even', 'double.in');
    pipeline.connect('router.odd', 'addOne.in');

    await expect(pipeline.run('router.in', 1)).rejects.toThrow(/Multiple leaf outputs/);
  });

  it('collects several outputs without mutating the options', async () => {
    const pipeline = new Pipeline();
    pipeline.addComponent('fork', new Fork());
    const outputs = ['fork.right', 'fork.left'];

    const result = await pipeline.run('fork.in', 2, { includeOutputsFrom: outputs });

    expect(result).toEqual({ 'fork.left': 20, 'fork.right': 200 });
    expect(outputs).toEqual(['fork.right', 'fork.left']);
  });

  it('keeps separate multi-output routes independent', async () => {
    const pipeline = new Pipeline();
    pipeline.addComponent('fork', new Fork());
    pipeline.addComponent('double', new Doubler());
    pipeline.connect('fork.left', 'double.in');

    const first = await pipeline.run('fork.in', 1, {
      includeOutputsFrom: ['fork.left', 'fork.right'],
    });
    const second = await pipeline.run('fork.in', 1, {
      includeOutputsFrom: ['double.out', 'fork.right'],
    });

    expect(first).toEqual({ 'fork.left': 10, 'fork.right': 100 });
    expect(second).toEqual({ 'double.out': 20, 'fork.right': 100 });
  });

  it('rejects an invalid trigger identifier', async () => {
    const pipeline = new Pipeline();
    pipeline.addComponent('double', new Doubler());

    await expect(pipeline.run('double', 1)).rejects.toThrow(/Invalid port identifier/);
  });

  it('rejects an unknown component', async () => {
    const pipeline = new Pipeline();

    await expect(pipeline.run('missing.in', 1, 'missing.out')).rejects.toThrow(
      /component not found/
    );
  });

  it('rejects an empty output list', async () => {
    const pipeline = new Pipeline();
    pipeline.addComponent('fork', new Fork());

    await expect(pipeline.run('fork.in', 1, { includeOutputsFrom: [] })).rejects.toThrow(
      /at least one output/
    );
  });

  it('infers the terminal endpoint after an explicit-endpoint run', async () => {
    const pipeline = new Pipeline();
    pipeline.addComponent('double', new Doubler());
    pipeline.addComponent('addOne', new AddOne());
    pipeline.connect('double.out', 'addOne.in');

    await expect(pipeline.run('double.in', 1, 'double.out')).resolves.toBe(2);
    await expect(pipeline.run('double.in', 1)).resolves.toBe(3);
  });

  it('rejects inference on a circular topology', async () => {
    const pipeline = new Pipeline();
    pipeline.addComponent('a', new AddOne());
    pipeline.addComponent('b', new AddOne());
    pipeline.connect('a.out', 'b.in');
    pipeline.connect('b.out', 'a.in');

    await expect(pipeline.run('a.in', 1)).rejects.toThrow(/Circular topology/);
  });

  it('rejects inference when the terminal component has no default output port', async () => {
    const pipeline = new Pipeline();
    const portless = new Component({});
    Object.defineProperty(portless, 'outPort', { value: undefined });
    pipeline.addComponent('portless', portless);

    await expect(pipeline.run('portless.in', 1)).rejects.toThrow(/Cannot infer the output port/);
  });

  it('rejects inference when the trigger component is unknown', async () => {
    const pipeline = new Pipeline();

    await expect(pipeline.run('missing.in', 1)).rejects.toThrow(/Trigger component not found/);
  });

  it('ignores duplicate components and connections', () => {
    const pipeline = new Pipeline();
    const first = new Doubler();
    pipeline.addComponent('double', first);
    pipeline.addComponent('double', new Doubler());
    pipeline.addComponent('addOne', new AddOne());
    pipeline.connect('double.out', 'addOne.in');
    pipeline.connect('double.out', 'addOne.in');

    expect(pipeline.getComponent('double')).toBe(first);
  });

  it('delivers two outputs of one component into two inputs of another', async () => {
    const pipeline = new Pipeline();
    pipeline.addComponent('fork', new Fork());
    pipeline.addComponent('join', new Join());
    pipeline.connect('fork.left', 'join.a');
    pipeline.connect('fork.right', 'join.b');

    await expect(within(pipeline.run('fork.in', 1, 'join.out'))).resolves.toBe(110);
  });

  it('delivers one output into two inputs of the same component', async () => {
    const pipeline = new Pipeline();
    pipeline.addComponent('double', new Doubler());
    pipeline.addComponent('join', new Join());
    pipeline.connect('double.out', 'join.a');
    pipeline.connect('double.out', 'join.b');

    await expect(within(pipeline.run('double.in', 2, 'join.out'))).resolves.toBe(8);
  });

  it('rejects the run when a component throws', async () => {
    const pipeline = new Pipeline();
    pipeline.addComponent('failing', new Failing());

    await expect(within(pipeline.run('failing.in', 1))).rejects.toThrow('cannot process');
  });

  it('rejects the run when a component fails asynchronously', async () => {
    const pipeline = new Pipeline();
    pipeline.addComponent('failing', new FailingLater());

    await expect(within(pipeline.run('failing.in', 1, 'failing.out'))).rejects.toThrow(
      'failed later'
    );
  });

  it('rejects only the run whose input failed', async () => {
    const pipeline = new Pipeline();
    pipeline.addComponent('double', new Doubler());
    pipeline.addComponent('addOne', new AddOne());
    pipeline.connect('double.out', 'addOne.in');

    const results = await Promise.allSettled([
      within(pipeline.run('double.in', 1)),
      within(pipeline.run('double.in', 'not a number')),
      within(pipeline.run('double.in', 2)),
    ]);

    expect(results.map(result => result.status)).toEqual(['fulfilled', 'rejected', 'fulfilled']);
    expect(results[0]).toEqual({ status: 'fulfilled', value: 3 });
    expect(results[2]).toEqual({ status: 'fulfilled', value: 5 });
  });

  it('keeps running after a failed run', async () => {
    const pipeline = new Pipeline();
    pipeline.addComponent('double', new Doubler());

    await expect(within(pipeline.run('double.in', 'x'))).rejects.toThrow(TypeError);
    await expect(within(pipeline.run('double.in', 4))).resolves.toBe(8);
  });

  it('sends each run only to its own trigger', async () => {
    const seen: unknown[] = [];
    class Recorder extends Component {
      constructor() {
        super({});
      }

      override run(data: unknown): unknown {
        seen.push(data);
        return data;
      }
    }
    const pipeline = new Pipeline();
    pipeline.addComponent('first', new Recorder());
    pipeline.addComponent('second', new Recorder());

    await expect(pipeline.run('first.in', 1)).resolves.toBe(1);
    await expect(pipeline.run('second.in', 2)).resolves.toBe(2);
    await expect(pipeline.run('first.in', 3)).resolves.toBe(3);

    expect(seen).toEqual([1, 2, 3]);
  });
});
