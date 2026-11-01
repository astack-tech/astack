import { Pipeline } from '@astack-tech/core';
import { createTool } from '@astack-tech/tools';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Agent, { DefaultMemory } from '../index';
import type { AgentOutput, Tool } from '../index';
import { ScriptedModel, toolCallReply } from './fakes';

const add = createTool('add', 'Adds two numbers', args => Number(args['a']) + Number(args['b']), {
  type: 'object',
  properties: { a: { type: 'number', description: 'First number' }, b: { type: 'number' } },
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Agent system prompt', () => {
  it('uses an English default system prompt without tools', async () => {
    const model = new ScriptedModel([{ role: 'assistant', content: 'hi' }]);
    const agent = new Agent({ model });

    await agent.run('hello');

    expect(model.calls[0]?.messages[0]).toEqual({
      role: 'system',
      content: 'You are a helpful assistant.',
    });
  });

  it('lists tools and parameter descriptions', async () => {
    const model = new ScriptedModel([{ role: 'assistant', content: 'ok' }]);
    const agent = new Agent({ model, tools: [add], systemPrompt: 'Be exact.' });

    await agent.run('hello');

    expect(model.calls[0]?.messages[0]?.content).toBe(
      'Be exact.\n\nAvailable tools:\n1. add - Adds two numbers\n   Parameters:\n' +
        '   - a: First number\n   - b: \n'
    );
  });
});

describe('Agent.run', () => {
  it('returns the reply when the model calls no tools', async () => {
    const model = new ScriptedModel([
      {
        role: 'assistant',
        content: 'Paris',
        usage: { completion_tokens: 1, prompt_tokens: 2, total_tokens: 3 },
      },
    ]);
    const agent = new Agent({ model, tools: [add] });

    const output = await agent.run('Capital of France?');

    expect(output.message).toBe('Paris');
    expect(output.toolCalls).toEqual([]);
    expect(output.usage).toEqual({ completion_tokens: 1, prompt_tokens: 2, total_tokens: 3 });
    expect(output.history.map(message => message.role)).toEqual(['system', 'user']);
    expect(model.calls[0]?.options).toEqual({ temporaryTools: [add] });
  });

  it('runs tools, feeds results back and accumulates usage', async () => {
    const model = new ScriptedModel([
      {
        ...toolCallReply([{ id: 'c1', name: 'add', args: '{"a":2,"b":3}' }], 'thinking'),
        usage: {
          completion_tokens: 1,
          prompt_tokens: 1,
          total_tokens: 2,
          prompt_cache_hit_tokens: 1,
        },
      },
      {
        role: 'assistant',
        content: 'The sum is 5.',
        usage: {
          completion_tokens: 2,
          prompt_tokens: 2,
          total_tokens: 4,
          prompt_cache_hit_tokens: 2,
          prompt_cache_miss_tokens: 1,
        },
      },
    ]);
    const agent = new Agent({ model, tools: [add] });

    const output = await agent.run('2 + 3?');

    expect(output.message).toBe('The sum is 5.');
    expect(output.toolCalls).toEqual([{ tool: 'add', args: { a: 2, b: 3 }, result: 5 }]);
    expect(output.usage).toEqual({
      completion_tokens: 3,
      prompt_tokens: 3,
      total_tokens: 6,
      prompt_cache_hit_tokens: 3,
      prompt_cache_miss_tokens: 1,
    });
    const followUp = model.calls[1]?.messages.at(-1);
    expect(followUp).toEqual({
      role: 'user',
      content: 'Tool results are below. Continue based on them:\n\n[add] Result: 5',
    });
    expect(model.calls[1]?.messages.at(-2)).toMatchObject({
      role: 'assistant',
      content: 'thinking',
    });
  });

  it('reports unknown tools, invalid arguments and tool failures to the model', async () => {
    const failing = createTool('fail', 'Always fails', () => {
      throw new Error('boom');
    });
    const notCallable: Tool = { name: 'inert', description: 'No method' };
    const model = new ScriptedModel([
      toolCallReply([
        { id: '1', name: 'missing', args: '{}' },
        { id: '2', name: 'add', args: '{not json' },
        { id: '3', name: 'add', args: '[1, 2]' },
        { id: '4', name: 'fail', args: '' },
        { id: '5', name: 'inert', args: '{}' },
      ]),
      { role: 'assistant', content: 'done' },
    ]);
    const agent = new Agent({ model, tools: [add, failing, notCallable] });

    const output = await agent.run('go');

    expect(output.toolCalls).toEqual([{ tool: 'fail', args: {}, result: { error: 'boom' } }]);
    const followUp = model.calls[1]?.messages.at(-1)?.content ?? '';
    expect(followUp).toContain('[missing] Error: tool not found');
    expect(followUp).toContain('[add] Error: invalid arguments - ');
    expect(followUp).toContain('[add] Error: invalid arguments - expected a JSON object');
    expect(followUp).toContain('[fail] Error: tool execution failed - boom');
    expect(followUp).toContain('[inert] Error: tool has no execute() or invoke() method');
  });

  it('supports tools that expose execute()', async () => {
    const execute = vi.fn((args: Record<string, unknown>) => ({ echoed: args }));
    const tool: Tool = { name: 'echo', description: 'Echo', execute };
    const model = new ScriptedModel([
      toolCallReply([{ id: '1', name: 'echo', args: '{"x":1}' }]),
      { role: 'assistant', content: 'ok' },
    ]);
    const agent = new Agent({ model, tools: [tool] });

    const output = await agent.run('go');

    expect(execute).toHaveBeenCalledWith({ x: 1 });
    expect(output.toolCalls).toEqual([
      { tool: 'echo', args: { x: 1 }, result: { echoed: { x: 1 } } },
    ]);
  });

  it('serializes falsy tool results instead of replacing them with {}', async () => {
    const zero = createTool('zero', 'Returns zero', () => 0);
    const model = new ScriptedModel([
      toolCallReply([{ id: '1', name: 'zero', args: '{}' }]),
      { role: 'assistant', content: 'ok' },
    ]);
    const agent = new Agent({ model, tools: [zero] });

    await agent.run('go');

    expect(model.calls[1]?.messages.at(-1)?.content).toContain('[zero] Result: 0');
  });

  it('stops after maxIterations', async () => {
    const loop = toolCallReply([{ id: '1', name: 'add', args: '{"a":1,"b":1}' }], 'again');
    const model = new ScriptedModel([loop, loop, loop]);
    const agent = new Agent({ model, tools: [add], maxIterations: 2 });

    const output = await agent.run('loop');

    expect(model.calls).toHaveLength(2);
    expect(output.message).toBe('again');
    expect(output.toolCalls).toHaveLength(2);
  });

  it('accepts AgentInput with context as metadata', async () => {
    const model = new ScriptedModel([{ role: 'assistant', content: 'ok' }]);
    const agent = new Agent({ model });

    await agent.run({
      messages: [
        { role: 'user', content: 'a' },
        { role: 'user', content: 'b', metadata: { own: true } },
      ],
      context: { session: 1 },
    });

    expect(model.calls[0]?.messages.slice(1)).toEqual([
      { role: 'user', content: 'a', metadata: { session: 1 } },
      { role: 'user', content: 'b', metadata: { own: true } },
    ]);
  });

  it('propagates model errors', async () => {
    const agent = new Agent({ model: new ScriptedModel([]) });

    await expect(agent.run('x')).rejects.toThrow('No scripted reply left');
  });

  it('does not write to the console unless verbose is set', async () => {
    const methods: readonly ('log' | 'debug' | 'info' | 'warn' | 'error')[] = [
      'log',
      'debug',
      'info',
      'warn',
      'error',
    ];
    const spies = methods.map(method =>
      vi.spyOn(console, method).mockImplementation(() => undefined)
    );
    const model = new ScriptedModel([
      toolCallReply([{ id: '1', name: 'add', args: '{"a":1,"b":1}' }]),
      { role: 'assistant', content: 'ok' },
    ]);

    await new Agent({ model, tools: [add] }).run('quiet');

    for (const spy of spies) {
      expect(spy).not.toHaveBeenCalled();
    }
  });

  it('writes diagnostics when verbose is set', async () => {
    const debug = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
    const model = new ScriptedModel([{ role: 'assistant', content: 'ok' }]);

    await new Agent({ model, verbose: true }).run('loud');

    expect(debug).toHaveBeenCalled();
  });
});

describe('Agent memory', () => {
  it('resets memory to the system prompt on each run and on reset()', async () => {
    const memory = new DefaultMemory();
    const model = new ScriptedModel([{ role: 'assistant', content: 'ok' }]);
    const agent = new Agent({ model, memory, systemPrompt: 'S' });

    memory.addMessage({ role: 'user', content: 'stale' });
    await agent.run('x');
    expect(memory.getMessages()).toEqual([{ role: 'system', content: 'S' }]);

    memory.addMessage({ role: 'user', content: 'stale' });
    agent.reset();
    expect(memory.getFormattedMemory()).toEqual([{ role: 'system', content: 'S' }]);
  });
});

describe('Agent in a pipeline', () => {
  it('sends the output on the out port', async () => {
    const pipeline = new Pipeline();
    pipeline.addComponent(
      'agent',
      new Agent({ model: new ScriptedModel([{ role: 'assistant', content: 'piped' }]) })
    );

    const output = await pipeline.run<AgentOutput>('agent.in', 'hello');

    expect(output.message).toBe('piped');
  });

  it('sends an error output when the run fails', async () => {
    const pipeline = new Pipeline();
    pipeline.addComponent('agent', new Agent({ model: new ScriptedModel([]) }));

    const output = await pipeline.run<AgentOutput>('agent.in', {
      messages: [{ role: 'user', content: 'x' }],
    });

    expect(output).toEqual({
      message: 'Request failed: No scripted reply left',
      history: [],
      error: 'No scripted reply left',
    });
  });
});
