import { Pipeline } from '@astack-tech/core';
import { describe, expect, it } from 'vitest';

import TextSplitter from '../index';

const paragraphs = (count: number, size: number): string =>
  Array.from({ length: count }, (_, index) => String.fromCharCode(97 + index).repeat(size)).join(
    '\n\n'
  );

describe('TextSplitter', () => {
  it('returns no chunks for empty text', () => {
    expect(new TextSplitter().splitText('')).toEqual([]);
  });

  it('returns the text unchanged when it fits in one chunk', () => {
    const text = 'short\n\ntext';
    expect(new TextSplitter({ chunkSize: 100 }).splitText(text)).toEqual([text]);
  });

  it('packs paragraphs greedily without exceeding chunkSize', () => {
    const splitter = new TextSplitter({ chunkSize: 22, overlap: 0 });
    const chunks = splitter.splitText(paragraphs(4, 10));

    expect(chunks).toEqual(['aaaaaaaaaa\n\nbbbbbbbbbb', 'cccccccccc\n\ndddddddddd']);
  });

  it('never produces a chunk longer than chunkSize', () => {
    const splitter = new TextSplitter({ chunkSize: 25, overlap: 12 });
    const chunks = splitter.splitText(paragraphs(6, 10));

    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(25);
    }
  });

  it('carries trailing paragraphs that fit in the overlap budget', () => {
    const splitter = new TextSplitter({ chunkSize: 22, overlap: 10 });
    const chunks = splitter.splitText(paragraphs(3, 10));

    expect(chunks).toEqual(['aaaaaaaaaa\n\nbbbbbbbbbb', 'bbbbbbbbbb\n\ncccccccccc']);
  });

  it('drops carried overlap that would push the next chunk over chunkSize', () => {
    const splitter = new TextSplitter({ chunkSize: 22, overlap: 10 });
    const text = ['a'.repeat(10), 'b'.repeat(10), 'c'.repeat(20)].join('\n\n');

    expect(splitter.splitText(text)).toEqual(['aaaaaaaaaa\n\nbbbbbbbbbb', 'c'.repeat(20)]);
  });

  it('carries no paragraph when overlap is zero', () => {
    const splitter = new TextSplitter({ chunkSize: 22, overlap: 0 });
    const chunks = splitter.splitText(paragraphs(3, 10));

    expect(chunks).toEqual(['aaaaaaaaaa\n\nbbbbbbbbbb', 'cccccccccc']);
  });

  it('splits a paragraph longer than chunkSize by characters', () => {
    const splitter = new TextSplitter({ chunkSize: 10, overlap: 0 });
    const chunks = splitter.splitText(`${'x'.repeat(25)}\n\nyy`);

    expect(chunks).toEqual(['xxxxxxxxxx', 'xxxxxxxxxx', 'xxxxx\n\nyy']);
  });

  it('joins segments with a string separator', () => {
    const splitter = new TextSplitter({ chunkSize: 7, overlap: 0, separator: '|' });

    expect(splitter.splitText('aaa|bbb|ccc')).toEqual(['aaa|bbb', 'ccc']);
  });

  it('splits by characters with overlap when separator is empty', () => {
    const splitter = new TextSplitter({ chunkSize: 4, overlap: 2, separator: '' });

    expect(splitter.splitText('abcdefghij')).toEqual(['abcd', 'cdef', 'efgh', 'ghij']);
  });

  it('splits by characters when separator is null', () => {
    const splitter = new TextSplitter({ chunkSize: 4, overlap: 0, separator: null });

    expect(splitter.splitText('abcdefghij')).toEqual(['abcd', 'efgh', 'ij']);
  });

  it('does not split surrogate pairs', () => {
    const splitter = new TextSplitter({ chunkSize: 2, overlap: 0, separator: '' });

    expect(splitter.splitText('😀😁😂')).toEqual(['😀😁', '😂']);
  });

  it('rejects an overlap that is not smaller than chunkSize', () => {
    expect(() => new TextSplitter({ chunkSize: 10, overlap: 10 })).toThrow(RangeError);
  });

  it('caps the default overlap for small chunk sizes', () => {
    const splitter = new TextSplitter({ chunkSize: 22 });

    expect(splitter.splitText(paragraphs(3, 10))).toEqual([
      'aaaaaaaaaa\n\nbbbbbbbbbb',
      'cccccccccc',
    ]);
  });

  it('rejects a non-positive chunkSize', () => {
    expect(() => new TextSplitter({ chunkSize: 0 })).toThrow(RangeError);
  });

  it('rejects a negative overlap', () => {
    expect(() => new TextSplitter({ chunkSize: 10, overlap: -1 })).toThrow(RangeError);
  });

  it('converts non-string input in run()', () => {
    expect(new TextSplitter().run(12345)).toEqual(['12345']);
  });

  it('emits chunks on the out port inside a pipeline', async () => {
    const pipeline = new Pipeline();
    pipeline.addComponent('splitter', new TextSplitter({ chunkSize: 22, overlap: 0 }));

    const chunks = await pipeline.run('splitter.text', paragraphs(3, 10), 'splitter.out');
    expect(chunks).toEqual(['aaaaaaaaaa\n\nbbbbbbbbbb', 'cccccccccc']);
  });
});
