import { ModelProvider as Providers } from '@astack-tech/integrations';
import { describe, expect, it } from 'vitest';

import { Agent, StreamingAgent } from '../index';
import type { ModelProvider } from '../index';

/** Compile-time check: the argument must satisfy `ModelProvider` without a cast. */
function asModelProvider(model: ModelProvider): ModelProvider {
  return model;
}

describe('ModelProvider contract', () => {
  it('is satisfied by the Deepseek integration without a cast', () => {
    const model = asModelProvider(new Providers.Deepseek({ apiKey: 'test-key' }));

    expect(new Agent({ model })).toBeInstanceOf(Agent);
    expect(new StreamingAgent({ model })).toBeInstanceOf(StreamingAgent);
  });
});
