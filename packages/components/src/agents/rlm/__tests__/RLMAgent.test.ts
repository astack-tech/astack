import { Component, Pipeline } from '@astack-tech/core';
import type { Port } from '@astack-tech/core';
import { describe, expect, it } from 'vitest';

import { FileSystemContext } from '../FileSystemContext';
import { RLMAgent } from '../RLMAgent';
import type { LLMProvider, RLMChunk, RLMResult } from '../RLMCore';

const fixed = (text: string): LLMProvider => ({ generate: () => Promise.resolve(text) });

/** Records the raw value it receives, then forwards it. */
class Recorder extends Component {
  received: unknown[] = [];

  constructor() {
    super({});
  }

  override _transform($i: Port, $o: Port): void {
    $i('in').receive((value: unknown) => {
      this.received.push(value);
      $o('out').send(value);
    });
  }
}

describe('RLMAgent', () => {
  it('runs standalone', async () => {
    const agent = new RLMAgent({ rootLLM: fixed('FINAL("42");'), subLLM: fixed('unused') });

    const result = await agent.run({ context: new FileSystemContext('x'), query: 'q' });

    expect(result).toEqual({ answer: '42', code: 'FINAL("42");', depth: 0 });
  });

  it('streams chunks', async () => {
    const agent = new RLMAgent({
      rootLLM: fixed('FINAL(readFile("__memory__.txt"));'),
      subLLM: fixed('unused'),
      sharedContext: new FileSystemContext('ctx'),
      systemPrompt: 'extra',
    });

    const chunks: RLMChunk[] = [];
    for await (const chunk of agent.runStream({ context: new FileSystemContext('ctx'), query: 'q' })) {
      chunks.push(chunk);
    }

    expect(chunks.find(chunk => chunk.type === 'answer')?.content).toBe('\nAnswer: ctx\n');
  });

  it('sends resolved results, not promises, to downstream components', async () => {
    const pipeline = new Pipeline();
    const recorder = new Recorder();
    pipeline.addComponent('rlm', new RLMAgent({ rootLLM: fixed('FINAL("ok");'), subLLM: fixed('unused') }));
    pipeline.addComponent('recorder', recorder);
    pipeline.connect('rlm.out', 'recorder.in');

    const result = await pipeline.run<RLMResult>(
      'rlm.in',
      { context: new FileSystemContext('x'), query: 'q' },
      'recorder.out'
    );

    expect(recorder.received[0]).not.toBeInstanceOf(Promise);
    expect(result).toEqual({ answer: 'ok', code: 'FINAL("ok");', depth: 0 });
  });

  it('sends an error result when the run fails inside a pipeline', async () => {
    const pipeline = new Pipeline();
    pipeline.addComponent('rlm', new RLMAgent({ rootLLM: fixed('const x = 1;'), subLLM: fixed('unused') }));

    const result = await pipeline.run<RLMResult>(
      'rlm.in',
      { context: new FileSystemContext('x'), query: 'q' },
      'rlm.out'
    );

    expect(result).toEqual({
      answer: '',
      code: '',
      depth: 0,
      error: 'Code executed but FINAL() was never called',
    });
  });
});
