import { Pipeline } from '@astack-tech/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Deepseek from '../../deepseek';
import OpenAICompatible from '../index';

const mocks = vi.hoisted(() => {
  const constructorArgs: unknown[] = [];
  return { create: vi.fn<(request: Record<string, unknown>) => unknown>(), constructorArgs };
});

vi.mock('openai', () => {
  class OpenAI {
    chat = { completions: { create: mocks.create } };
    constructor(options: unknown) {
      mocks.constructorArgs.push(options);
    }
  }
  return { default: OpenAI };
});

function lastRequest(): Record<string, unknown> {
  const call = mocks.create.mock.calls.at(-1);
  if (!call) {
    throw new Error('create() was not called');
  }
  return call[0];
}

beforeEach(() => {
  mocks.create.mockReset();
  mocks.constructorArgs.length = 0;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('OpenAICompatible', () => {
  it('calls the OpenAI API by default with the configured model', async () => {
    const model = new OpenAICompatible({ apiKey: 'key', model: 'gpt-test' });
    mocks.create.mockResolvedValue({ choices: [{ message: { content: 'hi' } }] });

    await expect(model.generateCompletion('hello')).resolves.toBe('hi');

    expect(mocks.constructorArgs[0]).toEqual({
      apiKey: 'key',
      baseURL: 'https://api.openai.com/v1',
      dangerouslyAllowBrowser: false,
    });
    expect(lastRequest()).toMatchObject({ model: 'gpt-test', temperature: 0.7 });
  });

  it('calls any OpenAI-compatible endpoint', async () => {
    const model = new OpenAICompatible({
      apiKey: 'key',
      model: 'qwen-plus',
      baseURL: 'https://dashscope.example/compatible-mode/v1',
      name: 'Qwen',
    });
    mocks.create.mockResolvedValue({ choices: [{ message: { content: 'ok' } }] });

    await model.generateCompletion('hello');

    expect(mocks.constructorArgs[0]).toMatchObject({
      baseURL: 'https://dashscope.example/compatible-mode/v1',
    });
    expect(lastRequest()).toMatchObject({ model: 'qwen-plus' });
  });

  it('names the provider in errors and logs', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const model = new OpenAICompatible({ apiKey: 'key', model: 'm', name: 'Qwen', verbose: true });
    mocks.create.mockResolvedValue({ choices: [] });
    await expect(model.generateCompletion('x')).rejects.toThrow('Qwen returned no choices.');

    mocks.create.mockRejectedValue(new Error('down'));
    const pipeline = new Pipeline();
    pipeline.addComponent('llm', model);
    await expect(pipeline.run('llm.prompt', 'q', 'llm.completion')).resolves.toBe(
      'API call failed'
    );
    expect(error).toHaveBeenCalledWith('[Qwen] API call failed:', expect.any(Error));
  });

  it('rejects pipeline input of the wrong type before calling the API', async () => {
    const pipeline = new Pipeline();
    pipeline.addComponent('llm', new OpenAICompatible({ apiKey: 'key', model: 'm', name: 'Qwen' }));

    await expect(pipeline.run('llm.prompt', 42, 'llm.completion')).rejects.toThrow(
      'Qwen: the prompt port expects a string.'
    );
    await expect(pipeline.run('llm.messages', [{ content: 'q' }], 'llm.message')).rejects.toThrow(
      'Qwen: the messages port expects an array of messages.'
    );
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it('takes an agent history on the messages port', async () => {
    mocks.create.mockResolvedValue({ choices: [{ message: { content: 'ok' } }] });
    const pipeline = new Pipeline();
    pipeline.addComponent('llm', new OpenAICompatible({ apiKey: 'key', model: 'm' }));

    await expect(
      pipeline.run(
        'llm.messages',
        [
          { role: 'user', content: 'q' },
          {
            role: 'assistant',
            tool_calls: [],
            usage: {
              completion_tokens: 1,
              prompt_tokens: 1,
              total_tokens: 2,
              prompt_cache_hit_tokens: 0,
              prompt_cache_miss_tokens: 1,
            },
          },
          { role: 'tool', content: '7', tool_call_id: 'c1' },
        ],
        'llm.message'
      )
    ).resolves.toEqual({ role: 'assistant', content: 'ok' });
  });

  it.each([
    ['a message list that is not an array', { role: 'user', content: 'q' }],
    ['content that is not a string', [{ role: 'user', content: 1 }]],
    ['tool calls that are not an array', [{ role: 'assistant', tool_calls: {} }]],
    ['a tool_call_id that is not a string', [{ role: 'tool', content: '7', tool_call_id: 1 }]],
    ['usage without totals', [{ role: 'assistant', usage: { prompt_tokens: 1 } }]],
    [
      'a cache count that is not a number',
      [
        {
          role: 'assistant',
          usage: {
            completion_tokens: 1,
            prompt_tokens: 1,
            total_tokens: 2,
            prompt_cache_hit_tokens: '0',
          },
        },
      ],
    ],
    [
      'a cache miss count that is not a number',
      [
        {
          role: 'assistant',
          usage: {
            completion_tokens: 1,
            prompt_tokens: 1,
            total_tokens: 2,
            prompt_cache_miss_tokens: null,
          },
        },
      ],
    ],
  ])('rejects %s on the messages port', async (_, messages) => {
    const pipeline = new Pipeline();
    pipeline.addComponent('llm', new OpenAICompatible({ apiKey: 'key', model: 'm' }));

    await expect(pipeline.run('llm.messages', messages, 'llm.message')).rejects.toThrow(TypeError);
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it('uses a neutral name when none is given', async () => {
    const model = new OpenAICompatible({ apiKey: 'key', model: 'm' });
    mocks.create.mockResolvedValue({ choices: [] });
    await expect(model.generateCompletion('x')).rejects.toThrow(
      'The model API returned no choices.'
    );
  });

  it('rejects a message with an unsupported role before calling the API', async () => {
    const model = new OpenAICompatible({ apiKey: 'key', model: 'm', name: 'Qwen' });

    await expect(model.chatCompletion([{ role: 'function', content: 'x' }])).rejects.toThrow(
      "Qwen: unsupported message role 'function'. Use system, user, assistant or tool."
    );
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it('rejects a tool message without tool_call_id before calling the API', async () => {
    const model = new OpenAICompatible({ apiKey: 'key', model: 'm', name: 'Qwen' });

    await expect(model.chatCompletion([{ role: 'tool', content: 'result' }])).rejects.toThrow(
      'Qwen: a tool message needs the tool_call_id of the call it answers.'
    );
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it('sends omitted content as empty text, except on assistant messages', async () => {
    const model = new OpenAICompatible({ apiKey: 'key', model: 'm' });
    mocks.create.mockResolvedValue({ choices: [{ message: { content: 'ok' } }] });

    await model.chatCompletion([{ role: 'user' }, { role: 'assistant' }]);

    expect(lastRequest()['messages']).toEqual([
      { role: 'user', content: '' },
      { role: 'assistant' },
    ]);
  });

  it('keeps every field of a tool given in the OpenAI format', async () => {
    const model = new OpenAICompatible({ apiKey: 'key', model: 'm' });
    mocks.create.mockResolvedValue({ choices: [{ message: { content: 'ok' } }] });
    const tool = {
      type: 'function',
      function: {
        name: 'lookup',
        description: 'Looks a word up',
        parameters: { type: 'object' },
        strict: true,
      },
    };

    await model.chatCompletion([{ role: 'user', content: 'x' }], { temporaryTools: [tool] });

    expect(lastRequest()['tools']).toEqual([tool]);
  });

  it('is the base of the DeepSeek provider', () => {
    expect(new Deepseek({ apiKey: 'key' })).toBeInstanceOf(OpenAICompatible);
  });
});
