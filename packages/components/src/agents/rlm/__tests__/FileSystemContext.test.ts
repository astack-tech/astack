import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { FileSystemContext } from '../FileSystemContext';

describe('FileSystemContext (memory mode)', () => {
  it('exposes the content as one virtual file', () => {
    const context = new FileSystemContext('line one\nline two');

    expect(context.listFiles()).toEqual(['__memory__.txt']);
    expect(context.readFile('__memory__.txt')).toBe('line one\nline two');
    expect(context.getFileInfo('__memory__.txt')).toEqual({
      path: '__memory__.txt',
      size: 17,
      lines: 2,
    });
    expect(context.getStats()).toEqual({
      totalFiles: 1,
      totalSize: 17,
      totalLines: 2,
      fileTypes: { txt: 1 },
    });
  });

  it('uses memory mode when the file list is empty', () => {
    const context = new FileSystemContext('content', []);

    expect(context.listFiles()).toEqual(['__memory__.txt']);
  });

  it('rejects unknown virtual files', () => {
    const context = new FileSystemContext('content');

    expect(() => context.readFile('other.txt')).toThrow('File not found: other.txt');
    expect(() => context.getFileInfo('other.txt')).toThrow('File not found: other.txt');
  });
});

describe('FileSystemContext (filesystem mode)', () => {
  let baseDir: string;

  const write = (relativePath: string, content: string): void => {
    const fullPath = join(baseDir, relativePath);
    mkdirSync(join(fullPath, '..'), { recursive: true });
    writeFileSync(fullPath, content);
  };

  beforeEach(() => {
    baseDir = mkdtempSync(join(tmpdir(), 'astack-fsctx-'));
    write('src/a.ts', 'a\nb\nc');
    write('src/b.ts', 'bb');
    write('docs/readme.md', '# title');
    write('Makefile', 'all:');
  });

  afterEach(() => {
    rmSync(baseDir, { recursive: true, force: true });
  });

  const allFiles = ['src/a.ts', 'src/b.ts', 'docs/readme.md', 'Makefile'];

  it('lists, searches, samples and groups files', () => {
    const context = new FileSystemContext(baseDir, allFiles);

    expect(context.listFiles()).toEqual(allFiles);
    expect(context.searchFiles('\\.ts$')).toEqual(['src/a.ts', 'src/b.ts']);
    expect(context.searchFiles(/readme/)).toEqual(['docs/readme.md']);
    expect(context.sampleFiles('\\.ts$', 1)).toEqual(['src/a.ts']);
    expect(context.getFilesInDirectory('docs/')).toEqual(['docs/readme.md']);
  });

  it('reads files on demand and caches them', () => {
    const context = new FileSystemContext(baseDir, allFiles);

    expect(context.readFile('src/a.ts')).toBe('a\nb\nc');
    expect(context.getMemoryUsage()).toMatchObject({ cacheEntries: 1, cacheSize: 5 });

    // A cached read does not touch the disk again.
    rmSync(join(baseDir, 'src/a.ts'));
    expect(context.readFile('src/a.ts')).toBe('a\nb\nc');
  });

  it('computes line counts lazily in getFileInfo', () => {
    const context = new FileSystemContext(baseDir, allFiles);

    expect(context.getFileInfo('src/a.ts')).toEqual({ path: 'src/a.ts', size: 5, lines: 3 });
  });

  it('reports stats by extension', () => {
    const context = new FileSystemContext(baseDir, allFiles);

    expect(context.getStats()).toEqual({
      totalFiles: 4,
      totalSize: 5 + 2 + 7 + 4,
      totalLines: 0,
      fileTypes: { ts: 2, md: 1, Makefile: 1 },
    });
  });

  it('includes line counts of files read after the first getStats call', () => {
    const context = new FileSystemContext(baseDir, allFiles);

    expect(context.getStats().totalLines).toBe(0);
    context.readFile('src/a.ts');

    expect(context.getStats().totalLines).toBe(3);
  });

  it('skips files whose metadata cannot be read', () => {
    const context = new FileSystemContext(baseDir, ['src/a.ts', 'missing.ts']);

    expect(context.listFiles()).toEqual(['src/a.ts', 'missing.ts']);
    expect(() => context.readFile('missing.ts')).toThrow('File not found: missing.ts');
    expect(context.getStats().totalSize).toBe(5);
  });

  it('enforces the single-file size limit', () => {
    const context = new FileSystemContext(baseDir, allFiles, { maxFileSize: 3 });

    expect(() => context.readFile('src/a.ts')).toThrow(/File too large: src\/a\.ts/);
    expect(context.readFile('src/b.ts')).toBe('bb');
  });

  it('rejects files larger than the whole cache', () => {
    const context = new FileSystemContext(baseDir, allFiles, { maxCacheSize: 4 });

    expect(() => context.readFile('src/a.ts')).toThrow(/exceeds cache capacity/);
  });

  it('evicts the least recently used entry when the cache is full', () => {
    const context = new FileSystemContext(baseDir, allFiles, { maxCacheSize: 9 });

    context.readFile('src/a.ts'); // 5 bytes
    context.readFile('src/b.ts'); // 2 bytes
    context.readFile('src/a.ts'); // touch a: b is now least recently used
    context.readFile('Makefile'); // 4 bytes: 5 + 2 + 4 > 9, evicts b

    expect(context.getMemoryUsage()).toMatchObject({ cacheEntries: 2, cacheSize: 9 });
    rmSync(join(baseDir, 'src/b.ts'));
    expect(() => context.readFile('src/b.ts')).toThrow(/ENOENT/);
    expect(context.readFile('src/a.ts')).toBe('a\nb\nc');
  });

  it('resets the cache and reports limits', () => {
    const context = new FileSystemContext(baseDir, allFiles, {
      maxCacheSize: 100,
      maxFileSize: 50,
    });
    context.readFile('src/a.ts');
    context.resetMemoryTracking();

    expect(context.getMemoryUsage()).toEqual({
      bytesRead: 0,
      maxBytes: 100,
      percentUsed: 0,
      cacheSize: 0,
      cacheEntries: 0,
    });
    expect(context.getMemoryLimits()).toEqual({ maxTotalRead: 100, maxFileSize: 50 });
  });

  it('does not write to the console when metadata fails', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    new FileSystemContext(baseDir, ['missing.ts']);

    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});
