import { Pipeline } from '@astack-tech/core';
import { createTool, createToolSet } from '@astack-tech/tools';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ToolInvoker from '../index';
import type { Message, ToolInvokerOutput } from '../index';

const add = createTool('add', 'Adds a and b', args => Number(args['a']) + Number(args['b']));
const echo = createTool('echo', 'Returns its arguments', args => args);

const callMessage = (
  ...calls: { id?: string; tool_name: string; arguments: Record<string, unknown> }[]
): Message => ({ role: 'assistant', content: '', tool_calls: calls });

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('ToolInvoker', () => {
  it('returns no tool messages when no message requests a tool', async () => {
    const invoker = new ToolInvoker({ tools: [add] });

    await expect(invoker.run({ messages: [{ role: 'user', content: 'hi' }] })).resolves.toEqual({
      tool_messages: [],
    });
  });

  it('runs every requested tool and links results to call ids', async () => {
    const invoker = new ToolInvoker({ tools: [add, echo] });

    const output = await invoker.run({
      messages: [
        callMessage({ id: 'c1', tool_name: 'add', arguments: { a: 1, b: 2 } }),
        callMessage({ id: 'c2', tool_name: 'echo', arguments: { x: 'y' } }),
      ],
    });

    expect(output.tool_messages).toEqual([
      { role: 'tool', content: '3', tool_call_id: 'c1' },
      { role: 'tool', content: '{"x":"y"}', tool_call_id: 'c2' },
    ]);
  });

  it('accepts a ToolSet', async () => {
    const invoker = new ToolInvoker({ tools: createToolSet([add]) });

    const output = await invoker.run({
      messages: [callMessage({ id: 'c1', tool_name: 'add', arguments: { a: 2, b: 2 } })],
    });

    expect(output.tool_messages[0]?.content).toBe('4');
  });

  it('omits tool_call_id when the call has no id', async () => {
    const invoker = new ToolInvoker({ tools: [add] });

    const output = await invoker.run({
      messages: [callMessage({ tool_name: 'add', arguments: { a: 1, b: 1 } })],
    });

    expect(output.tool_messages).toEqual([{ role: 'tool', content: '2' }]);
  });

  it('serializes an undefined result as null', async () => {
    const nothing = createTool('nothing', 'Returns nothing', () => undefined);
    const invoker = new ToolInvoker({ tools: [nothing] });

    const output = await invoker.run({
      messages: [callMessage({ id: 'c1', tool_name: 'nothing', arguments: {} })],
    });

    expect(output.tool_messages[0]?.content).toBe('null');
  });

  it('reports an unknown tool as a tool message instead of failing the batch', async () => {
    const invoker = new ToolInvoker({ tools: [add] });

    const output = await invoker.run({
      messages: [
        callMessage(
          { id: 'c1', tool_name: 'missing', arguments: {} },
          { id: 'c2', tool_name: 'add', arguments: { a: 1, b: 1 } }
        ),
      ],
    });

    expect(output.tool_messages).toEqual([
      { role: 'tool', content: JSON.stringify('Tool not found: missing'), tool_call_id: 'c1' },
      { role: 'tool', content: '2', tool_call_id: 'c2' },
    ]);
  });

  it('reports tool errors as tool messages', async () => {
    const failing = createTool('fail', 'Fails', () => {
      throw new Error('boom');
    });
    const invoker = new ToolInvoker({ tools: [failing] });

    const output = await invoker.run({
      messages: [callMessage({ id: 'c1', tool_name: 'fail', arguments: {} })],
    });

    expect(output.tool_messages[0]?.content).toBe(JSON.stringify('Tool fail failed: boom'));
  });

  it('reports non-Error failures with their string value', async () => {
    const failing = {
      name: 'fail',
      description: 'Rejects with a string',
      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- verifies handling of non-Error rejections.
      invoke: () => Promise.reject('plain'),
    };
    const invoker = new ToolInvoker({ tools: [failing] });

    const output = await invoker.run({
      messages: [callMessage({ id: 'c1', tool_name: 'fail', arguments: {} })],
    });

    expect(output.tool_messages[0]?.content).toBe(JSON.stringify('Tool fail failed: plain'));
  });

  it('times out slow tools', async () => {
    vi.useFakeTimers();
    const slow = createTool('slow', 'Never resolves', () => new Promise(() => undefined));
    const invoker = new ToolInvoker({ tools: [slow], timeout: 50 });

    const pending = invoker.run({
      messages: [callMessage({ id: 'c1', tool_name: 'slow', arguments: {} })],
    });
    await vi.advanceTimersByTimeAsync(50);

    const output = await pending;
    expect(output.tool_messages[0]?.content).toBe(
      JSON.stringify('Tool slow failed: Tool timed out after 50 ms: slow')
    );
  });

  it('clears the timeout timer after a tool finishes', async () => {
    vi.useFakeTimers();
    const invoker = new ToolInvoker({ tools: [add] });

    await invoker.run({
      messages: [callMessage({ id: 'c1', tool_name: 'add', arguments: { a: 1, b: 1 } })],
    });

    expect(vi.getTimerCount()).toBe(0);
  });

  it('runs tools one at a time by default', async () => {
    let active = 0;
    let maxActive = 0;
    const tracked = createTool('tracked', 'Tracks concurrency', async () => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await new Promise(resolve => setTimeout(resolve, 5));
      active -= 1;
      return active;
    });
    const invoker = new ToolInvoker({ tools: [tracked] });

    await invoker.run({
      messages: [
        callMessage(
          { id: 'a', tool_name: 'tracked', arguments: {} },
          { id: 'b', tool_name: 'tracked', arguments: {} }
        ),
      ],
    });

    expect(maxActive).toBe(1);
  });

  it('runs tools concurrently and keeps call order when parallel is true', async () => {
    let active = 0;
    let maxActive = 0;
    const delayed = createTool('delayed', 'Resolves after a delay', async args => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await new Promise(resolve => setTimeout(resolve, Number(args['ms'])));
      active -= 1;
      return args['ms'];
    });
    const invoker = new ToolInvoker({ tools: [delayed], parallel: true });

    const output = await invoker.run({
      messages: [
        callMessage(
          { id: 'slow', tool_name: 'delayed', arguments: { ms: 20 } },
          { id: 'fast', tool_name: 'delayed', arguments: { ms: 1 } }
        ),
      ],
    });

    expect(maxActive).toBe(2);
    expect(output.tool_messages.map(message => message.tool_call_id)).toEqual(['slow', 'fast']);
  });

  it('logs only in verbose mode', async () => {
    const debug = vi.spyOn(console, 'debug').mockImplementation(() => undefined);

    await new ToolInvoker({ tools: [add] }).run({ messages: [] });
    expect(debug).not.toHaveBeenCalled();

    await new ToolInvoker({ tools: [add], verbose: true }).run({ messages: [] });
    expect(debug).toHaveBeenCalled();
  });

  it('sends tool messages on the out port inside a pipeline', async () => {
    const pipeline = new Pipeline();
    pipeline.addComponent('invoker', new ToolInvoker({ tools: [add] }));

    const output = await pipeline.run<ToolInvokerOutput>(
      'invoker.in',
      { messages: [callMessage({ id: 'c1', tool_name: 'add', arguments: { a: 3, b: 4 } })] },
      'invoker.out'
    );

    expect(output.tool_messages).toEqual([{ role: 'tool', content: '7', tool_call_id: 'c1' }]);
  });

  it('sends an empty result for invalid pipeline input', async () => {
    const pipeline = new Pipeline();
    pipeline.addComponent('invoker', new ToolInvoker({ tools: [add] }));

    const output = await pipeline.run<ToolInvokerOutput>('invoker.in', {}, 'invoker.out');

    expect(output).toEqual({ tool_messages: [] });
  });
});
