import { Pipeline } from '@astack-tech/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Deepseek from '../../deepseek';
import OpenAICompatible from '../index';

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

function lastRequest(): Record<string, unknown> {
  const call = mocks.create.mock.calls.at(-1);
  if (!call) {
    throw new Error('create() was not called');
  }
  return call[0] as Record<string, unknown>;
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

  it('uses a neutral name when none is given', async () => {
    const model = new OpenAICompatible({ apiKey: 'key', model: 'm' });
    mocks.create.mockResolvedValue({ choices: [] });
    await expect(model.generateCompletion('x')).rejects.toThrow(
      'The model API returned no choices.'
    );
  });

  it('is the base of the DeepSeek provider', () => {
    expect(new Deepseek({ apiKey: 'key' })).toBeInstanceOf(OpenAICompatible);
  });
});
