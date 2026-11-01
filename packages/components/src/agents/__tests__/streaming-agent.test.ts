import { Component, Pipeline } from '@astack-tech/core';
import type { Port } from '@astack-tech/core';
import { createTool } from '@astack-tech/tools';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { StreamingAgent } from '../StreamingAgent';
import type { StreamingChunk } from '../StreamingAgent';
import { ScriptedModel, ScriptedStreamingModel, toolCallReply } from './fakes';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Records every value that reaches its `in` port. */
class Collector extends Component {
  constructor(private readonly sink: unknown[]) {
    super({});
  }

  override _transform($i: Port): void {
    $i('in').receive(value => {
      this.sink.push(value);
    });
  }
}

const add = createTool('add', 'Adds two numbers', args => Number(args['a']) + Number(args['b']));

async function collect(
  agent: StreamingAgent,
  input: string
): Promise<{ chunks: StreamingChunk[]; error: unknown }> {
  const chunks: StreamingChunk[] = [];
  try {
    for await (const chunk of agent.runStream(input)) {
      chunks.push(chunk);
    }
    return { chunks, error: undefined };
  } catch (error) {
    return { chunks, error };
  }
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('StreamingAgent.runStream', () => {
  it('streams text deltas and completes', async () => {
    const model = new ScriptedStreamingModel([
      [
        { content: 'Hel' },
        { content: 'lo' },
        { usage: { completion_tokens: 1, prompt_tokens: 2, total_tokens: 3 } },
      ],
    ]);
    const agent = new StreamingAgent({ model });

    const { chunks } = await collect(agent, 'hi');

    expect(chunks.map(chunk => chunk.type)).toEqual([
      'iteration_start',
      'model_thinking',
      'assistant_message',
      'assistant_message',
      'completed',
    ]);
    expect(chunks[3]?.content).toBe('Hello');
    expect(chunks.at(-1)).toMatchObject({
      finalMessage: 'Hello',
      allToolCalls: [],
      usage: { completion_tokens: 1, prompt_tokens: 2, total_tokens: 3 },
    });
  });

  it('merges streamed tool-call deltas, runs the tool and sums usage over iterations', async () => {
    const model = new ScriptedStreamingModel([
      [
        {
          tool_calls: [
            { id: 'c1', type: 'function', function: { name: 'add', arguments: '{"a":2,' } },
          ],
        },
        { tool_calls: [{ id: '', type: '', function: { name: '', arguments: '"b":3}' } }] },
        { usage: { completion_tokens: 1, prompt_tokens: 1, total_tokens: 2 } },
      ],
      [{ content: '5' }, { usage: { completion_tokens: 2, prompt_tokens: 2, total_tokens: 4 } }],
    ]);
    const agent = new StreamingAgent({ model, tools: [add] });

    const { chunks } = await collect(agent, '2 + 3?');

    expect(chunks.filter(chunk => chunk.type === 'tool_start')).toEqual([
      { type: 'tool_start', toolName: 'add' },
    ]);
    expect(chunks.filter(chunk => chunk.type === 'tool_result')).toEqual([
      { type: 'tool_result', toolName: 'add', result: 5 },
    ]);
    const completed = chunks.at(-1);
    expect(completed?.allToolCalls).toEqual([{ tool: 'add', args: { a: 2, b: 3 }, result: 5 }]);
    expect(completed?.usage).toEqual({ completion_tokens: 3, prompt_tokens: 3, total_tokens: 6 });
    expect(model.streamCalls[1]?.messages.at(-1)?.content).toBe(
      'Tool results are below. Continue based on them:\n\n[add] Result: 5'
    );
  });

  it('re-keys a call whose id arrives after its first delta', async () => {
    const model = new ScriptedStreamingModel([
      [
        {
          tool_calls: [
            { id: '', type: 'function', function: { name: 'add', arguments: '{"a":1,' } },
          ],
        },
        {
          tool_calls: [
            { id: 'late', type: 'function', function: { name: '', arguments: '"b":1}' } },
          ],
        },
      ],
      [{ content: 'ok' }],
    ]);
    const agent = new StreamingAgent({ model, tools: [add] });

    const { chunks } = await collect(agent, 'x');

    expect(chunks.at(-1)?.allToolCalls).toEqual([{ tool: 'add', args: { a: 1, b: 1 }, result: 2 }]);
    expect(model.streamCalls[1]?.messages.at(-2)?.tool_calls?.[0]?.id).toBe('late');
  });

  it('reports tool errors as tool_result events', async () => {
    const model = new ScriptedStreamingModel([
      [
        {
          tool_calls: [
            { id: '1', type: 'function', function: { name: 'missing', arguments: '{}' } },
          ],
        },
      ],
      [{ content: 'sorry' }],
    ]);
    const agent = new StreamingAgent({ model, tools: [add] });

    const { chunks } = await collect(agent, 'x');

    expect(chunks.find(chunk => chunk.type === 'tool_result')).toEqual({
      type: 'tool_result',
      toolName: 'missing',
      result: { error: 'tool not found' },
    });
  });

  it('falls back to chatCompletion when the model cannot stream', async () => {
    const model = new ScriptedModel([
      toolCallReply([{ id: '1', name: 'add', args: '{"a":1,"b":2}' }]),
      {
        role: 'assistant',
        content: 'three',
        usage: { completion_tokens: 1, prompt_tokens: 1, total_tokens: 2 },
      },
    ]);
    const agent = new StreamingAgent({ model, tools: [add] });

    const output = await agent.run('1 + 2?');

    expect(output.message).toBe('three');
    expect(output.toolCalls).toEqual([{ tool: 'add', args: { a: 1, b: 2 }, result: 3 }]);
    expect(output.usage).toEqual({ completion_tokens: 1, prompt_tokens: 1, total_tokens: 2 });
  });

  it('yields exactly one error event and rethrows', async () => {
    const agent = new StreamingAgent({ model: new ScriptedStreamingModel([]) });

    const { chunks, error } = await collect(agent, 'x');

    expect(chunks.filter(chunk => chunk.type === 'error')).toEqual([
      { type: 'error', error: 'No scripted stream left' },
    ]);
    expect(error).toBeInstanceOf(Error);
  });

  it('stops after maxIterations', async () => {
    const loop = [
      { tool_calls: [{ id: '1', type: 'function', function: { name: 'add', arguments: '{}' } }] },
    ];
    const model = new ScriptedStreamingModel([loop, loop, loop]);
    const agent = new StreamingAgent({ model, tools: [add], maxIterations: 2 });

    const output = await agent.run('loop');

    expect(model.streamCalls).toHaveLength(2);
    expect(output.toolCalls).toHaveLength(2);
  });

  it('resets memory on reset()', () => {
    const agent = new StreamingAgent({ model: new ScriptedModel([]) });
    expect(() => {
      agent.reset();
    }).not.toThrow();
  });
});

describe('StreamingAgent in a pipeline', () => {
  it('sends every chunk to out', async () => {
    const pipeline = new Pipeline();
    pipeline.addComponent(
      'agent',
      new StreamingAgent({ model: new ScriptedStreamingModel([[{ content: 'hi' }]]) })
    );

    const first = await pipeline.run<StreamingChunk>('agent.in', 'hello');

    expect(first).toEqual({ type: 'iteration_start', iteration: 1 });
  });

  it('sends one error chunk when the run fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const sent: unknown[] = [];
    const pipeline = new Pipeline();
    pipeline.addComponent(
      'agent',
      new StreamingAgent({ model: new ScriptedStreamingModel([]), verbose: true })
    );
    pipeline.addComponent('collect', new Collector(sent));
    pipeline.connect('agent.out', 'collect.in');

    void pipeline.run('agent.in', 'x', 'collect.out');
    await vi.waitFor(() => {
      expect(consoleError).toHaveBeenCalled();
    });

    expect(sent.filter(value => isRecord(value) && value['type'] === 'error')).toHaveLength(1);
  });
});
