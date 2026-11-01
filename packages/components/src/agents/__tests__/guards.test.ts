import { describe, expect, it } from 'vitest';

import { isAgentRunInput, isMessage } from '../guards';

const call = {
  id: 'c1',
  type: 'function',
  function: { name: 'add', arguments: '{"a":1}' },
};

describe('isMessage', () => {
  it('accepts a message with every optional field', () => {
    expect(
      isMessage({
        role: 'assistant',
        content: '',
        tool_calls: [
          { ...call, tool_name: 'add', arguments: { a: 1 } },
          { ...call, arguments: '{' },
        ],
        tool_call_id: 'c0',
        metadata: { turn: 1 },
        usage: {
          completion_tokens: 1,
          prompt_tokens: 2,
          total_tokens: 3,
          prompt_cache_hit_tokens: 1,
          prompt_cache_miss_tokens: 1,
        },
      })
    ).toBe(true);
  });

  it.each([
    ['a missing content', { role: 'user' }],
    ['a role that is not a string', { role: 1, content: 'x' }],
    [
      'a tool call without a function',
      { role: 'assistant', content: '', tool_calls: [{ id: 'c', type: 'function' }] },
    ],
    [
      'a tool call whose arguments are a number',
      { role: 'assistant', content: '', tool_calls: [{ ...call, arguments: 1 }] },
    ],
    ['tool calls that are not an array', { role: 'assistant', content: '', tool_calls: call }],
    ['metadata that is an array', { role: 'user', content: 'x', metadata: [] }],
    [
      'usage without totals',
      { role: 'assistant', content: 'x', usage: { completion_tokens: 1, prompt_tokens: 1 } },
    ],
    [
      'a usage count that is not finite',
      {
        role: 'assistant',
        content: 'x',
        usage: { completion_tokens: Infinity, prompt_tokens: 1, total_tokens: 1 },
      },
    ],
    ['a tool call that is not an object', { role: 'assistant', content: '', tool_calls: ['c1'] }],
    ['null', null],
  ])('rejects %s', (_, value) => {
    expect(isMessage(value)).toBe(false);
  });
});

describe('isAgentRunInput', () => {
  it('accepts a string and an AgentInput with context', () => {
    expect(isAgentRunInput('hello')).toBe(true);
    expect(
      isAgentRunInput({ messages: [{ role: 'user', content: 'x' }], context: { user: 'a' } })
    ).toBe(true);
  });

  it('rejects messages that are not an array and a context that is not an object', () => {
    expect(isAgentRunInput({ messages: 'x' })).toBe(false);
    expect(isAgentRunInput({ messages: [], context: 'x' })).toBe(false);
    expect(isAgentRunInput(['x'])).toBe(false);
  });
});
