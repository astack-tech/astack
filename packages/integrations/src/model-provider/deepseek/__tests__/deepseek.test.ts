import { Pipeline } from '@astack-tech/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Deepseek from '../index';
import type { Message } from '../index';

interface CreateCall {
  model: string;
  messages: { role: string; content?: string | null; tool_call_id?: string }[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
  tools?: unknown[];
}

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  constructorArgs: [] as unknown[],
}));

vi.mock('openai', () => {
  class OpenAI {
    chat = { completions: { create: mocks.create } };
    constructor(options: unknown) {
      mocks.constructorArgs.push(options);
    }
  }
  return { default: OpenAI };
});

function lastRequest(): CreateCall {
  const call = mocks.create.mock.calls.at(-1);
  if (!call) {
    throw new Error('create() was not called');
  }
  return call[0] as CreateCall;
}

function completion(message: Record<string, unknown>, usage?: Record<string, number>): unknown {
  return { choices: [{ message }], ...(usage ? { usage } : {}) };
}

async function* streamOf(chunks: unknown[]): AsyncGenerator {
  for (const chunk of chunks) {
    yield await Promise.resolve(chunk);
  }
}

beforeEach(() => {
  mocks.create.mockReset();
  mocks.constructorArgs.length = 0;
});

describe('Deepseek configuration', () => {
  it('uses the DeepSeek defaults', async () => {
    const model = new Deepseek({ apiKey: 'key' });
    mocks.create.mockResolvedValue(completion({ content: 'hi' }));

    await model.generateCompletion('hello');

    expect(mocks.constructorArgs[0]).toEqual({
      apiKey: 'key',
      baseURL: 'https://api.deepseek.com/v1',
      dangerouslyAllowBrowser: false,
    });
    const request = lastRequest();
    expect(request.model).toBe('deepseek-chat');
    expect(request.temperature).toBe(0.7);
    expect(request).not.toHaveProperty('max_tokens');
    expect(request).not.toHaveProperty('top_p');
    expect(request).not.toHaveProperty('tools');
  });

  it('applies custom options', async () => {
    const model = new Deepseek({
      apiKey: 'key',
      baseURL: 'https://example.test/v1',
      model: 'deepseek-reasoner',
      temperature: 0,
      maxTokens: 64,
      topP: 0.5,
      dangerouslyAllowBrowser: true,
    });
    mocks.create.mockResolvedValue(completion({ content: 'ok' }));

    await model.generateCompletion('hello');

    expect(mocks.constructorArgs[0]).toEqual({
      apiKey: 'key',
      baseURL: 'https://example.test/v1',
      dangerouslyAllowBrowser: true,
    });
    expect(lastRequest()).toMatchObject({
      model: 'deepseek-reasoner',
      temperature: 0,
      max_tokens: 64,
      top_p: 0.5,
    });
  });
});

describe('Deepseek.generateCompletion', () => {
  it('sends the system prompt and the user prompt', async () => {
    const model = new Deepseek({ apiKey: 'key', systemPrompt: 'Be brief.' });
    mocks.create.mockResolvedValue(completion({ content: 'answer' }));

    await expect(model.generateCompletion('question')).resolves.toBe('answer');
    expect(lastRequest().messages).toEqual([
      { role: 'system', content: 'Be brief.' },
      { role: 'user', content: 'question' },
    ]);
  });

  it('returns an empty string when the model returns no content', async () => {
    const model = new Deepseek({ apiKey: 'key' });
    mocks.create.mockResolvedValue(completion({ content: null }));

    await expect(model.generateCompletion('question')).resolves.toBe('');
  });

  it('converts raw tools and returns tool calls as JSON', async () => {
    const model = new Deepseek({
      apiKey: 'key',
      rawTools: [
        { name: 'search', description: 'Search the web' },
        { name: 'sum', description: 'Add', parameters: { type: 'object' } },
      ],
    });
    const message = {
      content: null,
      tool_calls: [{ id: 'c1', type: 'function', function: { name: 'search', arguments: '{}' } }],
    };
    mocks.create.mockResolvedValue(completion(message));

    await expect(model.generateCompletion('find')).resolves.toBe(JSON.stringify(message));
    expect(lastRequest().tools).toEqual([
      {
        type: 'function',
        function: { name: 'search', description: 'Search the web', parameters: {} },
      },
      {
        type: 'function',
        function: { name: 'sum', description: 'Add', parameters: { type: 'object' } },
      },
    ]);
  });

  it('passes API-format tools through unchanged', async () => {
    const tools = [{ type: 'function', function: { name: 'x', description: 'x', parameters: {} } }];
    const model = new Deepseek({ apiKey: 'key', tools });
    mocks.create.mockResolvedValue(completion({ content: 'ok' }));

    await model.generateCompletion('q');

    expect(lastRequest().tools).toEqual(tools);
  });

  it('rejects when the response has no choices', async () => {
    const model = new Deepseek({ apiKey: 'key' });
    mocks.create.mockResolvedValue({ choices: [] });

    await expect(model.generateCompletion('q')).rejects.toThrow(/no choices/);
  });
});

describe('Deepseek.chatCompletion', () => {
  const history: Message[] = [
    { role: 'user', content: 'hi' },
    {
      role: 'assistant',
      content: '',
      tool_calls: [{ id: 'c1', tool_name: 'x', arguments: {} }],
    },
    { role: 'tool', content: 'result', tool_call_id: 'c1' },
    { role: 'user', content: 'thanks', tool_call_id: 'ignored' },
  ];

  it('formats messages and keeps tool_call_id only on tool messages', async () => {
    const model = new Deepseek({ apiKey: 'key', systemPrompt: 'sys' });
    mocks.create.mockResolvedValue(completion({ content: 'done' }));

    const result = await model.chatCompletion(history);

    expect(result).toEqual({ role: 'assistant', content: 'done' });
    expect(lastRequest().messages).toEqual([
      { role: 'system', content: 'sys' },
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: '' },
      { role: 'tool', content: 'result', tool_call_id: 'c1' },
      { role: 'user', content: 'thanks' },
    ]);
  });

  it('prefers temporary tools and converts simple tool objects', async () => {
    const model = new Deepseek({
      apiKey: 'key',
      rawTools: [{ name: 'configured', description: 'configured' }],
    });
    mocks.create.mockResolvedValue(completion({ content: 'ok' }));

    await model.chatCompletion([{ role: 'user', content: 'q' }], {
      temporaryTools: [
        { name: 'temp', description: 'temporary', parameters: { type: 'object' } },
        { type: 'function', function: { name: 'native', description: 'n', parameters: {} } },
      ],
    });

    expect(lastRequest().tools).toEqual([
      {
        type: 'function',
        function: { name: 'temp', description: 'temporary', parameters: { type: 'object' } },
      },
      { type: 'function', function: { name: 'native', description: 'n', parameters: {} } },
    ]);
  });

  it('omits tools when the temporary list is empty and none are configured', async () => {
    const model = new Deepseek({ apiKey: 'key' });
    mocks.create.mockResolvedValue(completion({ content: 'ok' }));

    await model.chatCompletion([{ role: 'user', content: 'q' }], { temporaryTools: [] });

    expect(lastRequest()).not.toHaveProperty('tools');
  });

  it('maps token usage including cache fields', async () => {
    const model = new Deepseek({ apiKey: 'key' });
    mocks.create.mockResolvedValue(
      completion(
        { content: 'ok' },
        {
          completion_tokens: 2,
          prompt_tokens: 3,
          total_tokens: 5,
          prompt_cache_hit_tokens: 1,
          prompt_cache_miss_tokens: 2,
        }
      )
    );

    const result = await model.chatCompletion([{ role: 'user', content: 'q' }]);

    expect(result.usage).toEqual({
      completion_tokens: 2,
      prompt_tokens: 3,
      total_tokens: 5,
      prompt_cache_hit_tokens: 1,
      prompt_cache_miss_tokens: 2,
    });
  });

  it('maps usage without cache fields', async () => {
    const model = new Deepseek({ apiKey: 'key' });
    mocks.create.mockResolvedValue(
      completion({ content: 'ok' }, { completion_tokens: 1, prompt_tokens: 1, total_tokens: 2 })
    );

    const result = await model.chatCompletion([{ role: 'user', content: 'q' }]);

    expect(result.usage).toEqual({ completion_tokens: 1, prompt_tokens: 1, total_tokens: 2 });
  });

  it('maps tool calls in both the OpenAI and the internal shape', async () => {
    const model = new Deepseek({ apiKey: 'key' });
    mocks.create.mockResolvedValue(
      completion({
        content: null,
        tool_calls: [
          { id: 'a', type: 'function', function: { name: 'sum', arguments: '{"a":1}' } },
          { id: 'b', type: 'function', function: { name: 'noop', arguments: '' } },
          { id: 'c', type: 'function', function: { name: 'bad', arguments: '{oops' } },
          { id: 'd', type: 'function', function: { name: 'list', arguments: '[1]' } },
        ],
      })
    );

    const result = await model.chatCompletion([{ role: 'user', content: 'q' }]);

    expect(result.content).toBe('');
    expect(result.tool_calls).toEqual([
      {
        id: 'a',
        type: 'function',
        function: { name: 'sum', arguments: '{"a":1}' },
        tool_name: 'sum',
        arguments: { a: 1 },
      },
      {
        id: 'b',
        type: 'function',
        function: { name: 'noop', arguments: '{}' },
        tool_name: 'noop',
        arguments: {},
      },
      {
        id: 'c',
        type: 'function',
        function: { name: 'bad', arguments: '{oops' },
        tool_name: 'bad',
        arguments: {},
      },
      {
        id: 'd',
        type: 'function',
        function: { name: 'list', arguments: '[1]' },
        tool_name: 'list',
        arguments: {},
      },
    ]);
  });

  it('rejects unsupported tool call types', async () => {
    const model = new Deepseek({ apiKey: 'key' });
    mocks.create.mockResolvedValue(
      completion({ content: null, tool_calls: [{ id: 'x', type: 'custom', custom: {} }] })
    );

    await expect(model.chatCompletion([{ role: 'user', content: 'q' }])).rejects.toThrow(
      'Unsupported tool call type: custom'
    );
  });
});

describe('Deepseek.streamChatCompletion', () => {
  it('requests a stream and yields content, tool call and usage deltas', async () => {
    const model = new Deepseek({ apiKey: 'key', systemPrompt: 'sys' });
    mocks.create.mockResolvedValue(
      streamOf([
        { choices: [{ delta: { content: 'Hel' } }] },
        { choices: [{ delta: { content: 'lo' } }] },
        { choices: [{ delta: {} }] },
        { choices: [] },
        {
          choices: [
            {
              delta: {
                tool_calls: [
                  { index: 0, id: 'c1', function: { name: 'sum', arguments: '{"a"' } },
                  { index: 0, function: { arguments: ':1}' } },
                ],
              },
            },
          ],
        },
        {
          choices: [],
          usage: {
            completion_tokens: 4,
            prompt_tokens: 6,
            total_tokens: 10,
            prompt_cache_hit_tokens: 6,
          },
        },
      ])
    );

    const chunks: unknown[] = [];
    for await (const chunk of model.streamChatCompletion(
      [
        { role: 'user', content: 'hi' },
        { role: 'tool', content: 'r', tool_call_id: 'c0' },
      ],
      { temporaryTools: [{ name: 't', description: 'd' }] }
    )) {
      chunks.push(chunk);
    }

    const request = lastRequest();
    expect(request.stream).toBe(true);
    expect(request.messages).toEqual([
      { role: 'system', content: 'sys' },
      { role: 'user', content: 'hi' },
      { role: 'tool', content: 'r', tool_call_id: 'c0' },
    ]);
    expect(request.tools).toEqual([
      { type: 'function', function: { name: 't', description: 'd', parameters: {} } },
    ]);
    expect(chunks).toEqual([
      { role: 'assistant', content: 'Hel' },
      { role: 'assistant', content: 'lo' },
      {
        role: 'assistant',
        content: '',
        tool_calls: [
          {
            id: 'c1',
            type: 'function',
            function: { name: 'sum', arguments: '{"a"' },
            tool_name: 'sum',
            arguments: '{"a"',
          },
          {
            id: '',
            type: 'function',
            function: { name: '', arguments: ':1}' },
            tool_name: '',
            arguments: ':1}',
          },
        ],
      },
      {
        role: 'assistant',
        content: '',
        usage: {
          completion_tokens: 4,
          prompt_tokens: 6,
          total_tokens: 10,
          prompt_cache_hit_tokens: 6,
        },
      },
    ]);
  });
});

describe('Deepseek.run', () => {
  it('dispatches a string to generateCompletion', async () => {
    const model = new Deepseek({ apiKey: 'key' });
    mocks.create.mockResolvedValue(completion({ content: 'text' }));

    await expect(model.run('prompt')).resolves.toBe('text');
  });

  it('dispatches messages to chatCompletion', async () => {
    const model = new Deepseek({ apiKey: 'key' });
    mocks.create.mockResolvedValue(completion({ content: 'reply' }));

    await expect(model.run([{ role: 'user', content: 'q' }])).resolves.toEqual({
      role: 'assistant',
      content: 'reply',
    });
  });
});

describe('Deepseek in a pipeline', () => {
  function pipelineWith(model: Deepseek): Pipeline {
    const pipeline = new Pipeline();
    pipeline.addComponent('llm', model);
    return pipeline;
  }

  it('answers on the completion port', async () => {
    mocks.create.mockResolvedValue(completion({ content: 'piped' }));

    await expect(
      pipelineWith(new Deepseek({ apiKey: 'key' })).run('llm.prompt', 'q', 'llm.completion')
    ).resolves.toBe('piped');
  });

  it('answers on the message port', async () => {
    mocks.create.mockResolvedValue(completion({ content: 'piped' }));

    await expect(
      pipelineWith(new Deepseek({ apiKey: 'key' })).run(
        'llm.messages',
        [{ role: 'user', content: 'q' }],
        'llm.message'
      )
    ).resolves.toEqual({ role: 'assistant', content: 'piped' });
  });

  it('sends a fallback completion when the API fails', async () => {
    mocks.create.mockRejectedValue(new Error('down'));

    await expect(
      pipelineWith(new Deepseek({ apiKey: 'key' })).run('llm.prompt', 'q', 'llm.completion')
    ).resolves.toBe('API call failed');
  });

  it('sends a fallback message when the API fails', async () => {
    mocks.create.mockRejectedValue(new Error('down'));

    await expect(
      pipelineWith(new Deepseek({ apiKey: 'key', verbose: true })).run(
        'llm.messages',
        [{ role: 'user', content: 'q' }],
        'llm.message'
      )
    ).resolves.toEqual({ role: 'assistant', content: 'API call failed' });
  });
});
