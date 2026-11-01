import { describe, expect, it } from 'vitest';

import { BLOCKS, DEFAULT_STACK, findBlock, reverseText, stackCode, stackNames } from '../blocks';

describe('blocks', () => {
  it('transforms text the way the generated code says', () => {
    const run = (id: string, text: string) => findBlock(id)?.transform(text);
    expect(run('trim', '  hi  ')).toBe('hi');
    expect(run('upper', 'hi')).toBe('HI');
    expect(run('reverse', 'abc')).toBe('cba');
    expect(run('slug', 'Hello, AStack!')).toBe('hello-astack-');
    expect(run('exclaim', 'hi')).toBe('hi!');
    expect(findBlock('missing')).toBeUndefined();
  });

  it('reverses by grapheme, and by code point where Intl.Segmenter is missing', () => {
    expect(reverseText('a👍🏽b')).toBe('b👍🏽a');
    expect(reverseText('abc', false)).toBe('cba');
  });

  it('gives repeated blocks unique pipeline names', () => {
    expect(stackNames(['upper', 'trim', 'upper', 'upper'])).toEqual([
      'upper',
      'trim',
      'upper2',
      'upper3',
    ]);
  });

  it('generates the pipeline a developer would write', () => {
    const code = stackCode(DEFAULT_STACK, ' hi ');
    expect(code).toContain("import { Component, Pipeline } from '@astack-tech/core';");
    expect(code).toContain("pipeline.addComponent('trim', new Trim());");
    expect(code).toContain("pipeline.connect('trim.out', 'upper.in');");
    expect(code).toContain("pipeline.connect('upper.out', 'exclaim.in');");
    expect(code).toContain(`await pipeline.run('trim.in', " hi ");`);
    // Each class is declared once even when the block repeats.
    expect(stackCode(['upper', 'upper'], 'x').match(/class Uppercase/g)).toHaveLength(1);
  });

  it('explains an empty stack instead of emitting a broken pipeline', () => {
    expect(stackCode([], 'x')).toContain('Add a block');
  });

  it('declares one class per block kind', () => {
    expect(new Set(BLOCKS.map(block => block.className)).size).toBe(BLOCKS.length);
  });
});
