import { existsSync, readFileSync } from 'node:fs';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { FileSystemContext } from '../FileSystemContext';
import { RLMCore } from '../RLMCore';
import type { LLMProvider, RLMChunk } from '../RLMCore';

/** LLM that always returns the same text. */
const fixed = (text: string): LLMProvider => ({ generate: () => Promise.resolve(text) });

/** LLM that streams its answer in two parts. */
const streaming = (text: string): LLMProvider => ({
  generate: () => Promise.resolve(text),
  async *generateStream() {
    await Promise.resolve();
    yield text.slice(0, 1);
    yield text.slice(1);
  },
});

const collect = async (stream: AsyncGenerator<RLMChunk>): Promise<RLMChunk[]> => {
  const chunks: RLMChunk[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return chunks;
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('RLMCore.execute', () => {
  it('runs generated code and returns the FINAL answer', async () => {
    const root = fixed('```javascript\nFINAL(readFile("__memory__.txt").toUpperCase());\n```');
    const core = new RLMCore(root, fixed('unused'));

    const result = await core.execute({ context: new FileSystemContext('hello'), query: 'shout' });

    expect(result).toEqual({
      answer: 'HELLO',
      code: 'FINAL(readFile("__memory__.txt").toUpperCase());',
      depth: 0,
    });
  });

  it('keeps every line of a multi-line answer', async () => {
    const core = new RLMCore(fixed('FINAL("first\\nsecond");'), fixed('unused'));

    const result = await core.execute({ context: new FileSystemContext('x'), query: 'q' });

    expect(result.answer).toBe('first\nsecond');
  });

  it('routes llm_query calls to the sub-LLM', async () => {
    const generate = vi.fn((prompt: string) => Promise.resolve(`<${prompt}>`));
    const sub: LLMProvider = { generate };
    const root = fixed(
      'const a = await llm_query("one"); const b = await llm_query("two"); FINAL(a + b);'
    );
    const core = new RLMCore(root, sub);

    const result = await core.execute({ context: new FileSystemContext('x'), query: 'q' });

    expect(result.answer).toBe('<one><two>');
    expect(generate).toHaveBeenCalledTimes(2);
  });

  it('exposes the context file APIs inside the sandbox', async () => {
    const code = [
      'const info = getFileInfo("__memory__.txt");',
      'const parts = [listFiles().length, searchFiles("memory").length, sampleFiles(/txt/, 1).length,',
      '  getFilesInDirectory("__").length, getStats().totalFiles, info.lines];',
      'FINAL(parts.join(","));',
    ].join('\n');
    const core = new RLMCore(fixed(code), fixed('unused'));

    const result = await core.execute({ context: new FileSystemContext('a\nb'), query: 'q' });

    expect(result.answer).toBe('1,1,1,1,1,2');
  });

  it('fails when the code never calls FINAL', async () => {
    const core = new RLMCore(fixed('const x = 1;'), fixed('unused'));

    await expect(core.execute({ context: new FileSystemContext('x'), query: 'q' })).rejects.toThrow(
      'FINAL() was never called'
    );
  });

  it('appends a static custom prompt', async () => {
    const generate = vi.fn((_prompt: string) => Promise.resolve('FINAL("ok");'));
    const core = new RLMCore({ generate }, fixed('unused'), 1, undefined, 'EXTRA RULES');

    await core.execute({ context: new FileSystemContext('x'), query: 'find pairs' });

    const prompt = generate.mock.calls[0]?.[0] ?? '';
    expect(prompt).toContain('TASK: find pairs');
    expect(prompt).toContain('__memory__.txt');
    expect(prompt).toContain('EXTRA RULES');
  });

  it('builds a dynamic custom prompt for filesystem contexts', async () => {
    const generate = vi.fn((_prompt: string) => Promise.resolve('FINAL("ok");'));
    const builder = vi.fn((_context: FileSystemContext, query: string) => `GUIDE ${query}`);
    const core = new RLMCore({ generate }, fixed('unused'), 1, undefined, builder);
    const context = new FileSystemContext(process.cwd(), ['package.json']);

    await core.execute({ context, query: 'q' });

    const prompt = generate.mock.calls[0]?.[0] ?? '';
    expect(prompt).toContain('A file system with 1 files');
    expect(prompt).toContain('GUIDE q');
    expect(builder).toHaveBeenCalledWith(context, 'q');
  });

  it('clears its execution timeout when the code finishes', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const core = new RLMCore(fixed('FINAL("done");'), fixed('unused'));

    await core.execute({ context: new FileSystemContext('x'), query: 'q' });

    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('RLMCore.executeStream', () => {
  it('streams code, execution output, answer and summary', async () => {
    const root = streaming(
      'console.log("hi"); console.info("info"); console.warn("careful"); console.error("bad"); FINAL(await llm_query("q"));'
    );
    const core = new RLMCore(root, streaming('sub-answer'));

    const chunks = await collect(
      core.executeStream({ context: new FileSystemContext('data'), query: 'q' })
    );
    const contents = chunks.map(chunk => chunk.content).join('');

    expect(chunks[0]).toEqual({ type: 'code', content: 'Generating code...\n\n' });
    expect(contents).toContain('hi\n');
    expect(contents).toContain('info\n');
    expect(contents).toContain('Warning: careful\n');
    expect(contents).toContain('Error: bad\n');
    expect(contents).toContain('sub-answer');
    expect(chunks.some(chunk => chunk.type === 'metadata')).toBe(true);
    expect(chunks.find(chunk => chunk.type === 'answer')?.content).toBe('\nAnswer: sub-answer\n');

    const summary = chunks.at(-1);
    expect(summary?.type).toBe('summary');
    expect(summary?.metadata).toMatchObject({
      maxDepth: 1,
      actualDepth: 1,
      subLLMCalls: 1,
      contextLength: 4,
    });
    expect(summary?.content).toContain('RLM EXECUTION SUMMARY');
    expect(summary?.content).toContain('Sub-LLM Call Details');
  });

  it('writes each sub-LLM call to a log file', async () => {
    const core = new RLMCore(fixed('FINAL(await llm_query("ping"));'), fixed('pong'));

    const chunks = await collect(
      core.executeStream({ context: new FileSystemContext('x'), query: 'q' })
    );
    const call = chunks.at(-1)?.metadata?.subLLMCallDetails[0];

    expect(call).toMatchObject({ depth: 1, promptLength: 4, resultLength: 4 });
    expect(call && existsSync(call.logFile)).toBe(true);
    const log: unknown = JSON.parse(readFileSync(call?.logFile ?? '', 'utf-8'));
    expect(log).toMatchObject({ prompt: 'ping', result: 'pong' });
  });

  it('reports execution errors as an error chunk', async () => {
    const core = new RLMCore(fixed('throw new Error("broken");'), fixed('unused'));

    const chunks = await collect(
      core.executeStream({ context: new FileSystemContext('x'), query: 'q' })
    );

    expect(chunks).toContainEqual({ type: 'error', content: '\nError: broken\n' });
    expect(chunks.at(-1)?.type).toBe('summary');
  });

  it('reports sub-LLM failures as an error chunk', async () => {
    const failing: LLMProvider = { generate: () => Promise.reject(new Error('sub failed')) };
    const core = new RLMCore(fixed('FINAL(await llm_query("x"));'), failing);

    const chunks = await collect(
      core.executeStream({ context: new FileSystemContext('x'), query: 'q' })
    );

    expect(chunks).toContainEqual({ type: 'error', content: '\nError: sub failed\n' });
  });

  it('answers directly when maxDepth is zero', async () => {
    const core = new RLMCore(fixed('plain answer'), fixed('unused'), 0);

    const chunks = await collect(
      core.executeStream({ context: new FileSystemContext('x'), query: 'q' })
    );

    expect(chunks).toEqual([{ type: 'answer', content: 'plain answer' }]);
  });

  it('does not mirror sandbox console output to the real console by default', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const core = new RLMCore(fixed('console.log("quiet"); FINAL("ok");'), fixed('unused'));

    await core.execute({ context: new FileSystemContext('x'), query: 'q' });

    expect(log).not.toHaveBeenCalled();
  });
});

describe('RLMCore as an LLMProvider', () => {
  it('nests itself when maxDepth is greater than one', async () => {
    // The root LLM writes code that asks the sub-LLM; at depth 2 the sub-LLM is another RLMCore
    // whose own root LLM answers with code again.
    const root = fixed('FINAL(await llm_query("inner"));');
    const base = fixed('base');
    const core = new RLMCore(root, base, 2);

    const chunks = await collect(
      core.executeStream({ context: new FileSystemContext('x'), query: 'q' })
    );

    // The nested RLM runs the same code; its llm_query reaches the base LLM.
    expect(chunks.find(chunk => chunk.type === 'answer')?.content).toContain('base');
  });

  it('answers through generate() using a memory context', async () => {
    const core = new RLMCore(fixed('FINAL(readFile("__memory__.txt") + "!");'), fixed('unused'));

    await expect(core.generate('prompt')).resolves.toBe('prompt!');
  });

  it('streams through generateStream() using the shared context', async () => {
    const shared = new FileSystemContext('shared');
    const core = new RLMCore(
      fixed('FINAL(readFile("__memory__.txt"));'),
      fixed('unused'),
      1,
      shared
    );

    let text = '';
    for await (const part of core.generateStream('ignored')) {
      text += part;
    }

    expect(text).toContain('Answer: shared');
    expect(text).not.toContain('RLM EXECUTION SUMMARY');
  });
});
