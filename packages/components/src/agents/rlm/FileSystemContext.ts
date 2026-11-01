import * as fs from 'node:fs';
import * as path from 'node:path';

import { createLogger } from '../../utils/logger';
import type { Logger } from '../../utils/logger';

/**
 * File information without content
 */
export interface FileInfo {
  /** Path relative to the context's base path. Memory mode uses `__memory__.txt`. */
  path: string;
  /** File size in bytes (in memory mode, the text length). */
  size: number;
  /** Line count. In filesystem mode it stays 0 until the file is first read. */
  lines: number;
}

/**
 * Context statistics
 */
export interface ContextStats {
  /** Number of files in the context. */
  totalFiles: number;
  /** Sum of all file sizes in bytes. */
  totalSize: number;
  /** Sum of the line counts known so far. Files not yet read count as 0. */
  totalLines: number;
  /** Number of files per extension. */
  fileTypes: Record<string, number>;
}

/**
 * Memory usage information
 */
export interface MemoryUsage {
  /** Bytes currently held in the content cache. Not a cumulative total. */
  bytesRead: number;
  /** Cache capacity in bytes (`maxCacheSize`). */
  maxBytes: number;
  /** Cache use as a percentage of `maxBytes`. */
  percentUsed: number;
  /** Bytes currently held in the content cache. */
  cacheSize: number;
  /** Number of files currently in the content cache. */
  cacheEntries: number;
}

/**
 * File system context configuration
 */
export interface FileSystemContextOptions {
  /**
   * Not enforced. Memory use is bounded by `maxCacheSize`, and
   * `getMemoryLimits().maxTotalRead` reports that cache size.
   *
   * @deprecated Use `maxCacheSize`.
   */
  maxTotalRead?: number | undefined;

  /**
   * Maximum size of a single file that can be read.
   * Default: 5 MB.
   */
  maxFileSize?: number | undefined;

  /**
   * Maximum cache size in bytes.
   * Default: 10 MB.
   */
  maxCacheSize?: number | undefined;

  /**
   * Log skipped files and other diagnostics. Default: false.
   */
  verbose?: boolean | undefined;
}

/**
 * Limits reported by `FileSystemContext.getMemoryLimits()`.
 */
export interface MemoryLimits {
  /** Content cache capacity in bytes. Kept under this name for compatibility. */
  maxTotalRead: number;
  /** Largest file that can be read, in bytes. */
  maxFileSize: number;
}

/**
 * Default memory limits
 */
const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const DEFAULT_MAX_CACHE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Simple LRU Cache implementation
 */
class LRUCache<K, V> {
  // A Map iterates in insertion order, so re-inserting a key marks it as most recently used.
  private readonly cache = new Map<K, { value: V; size: number }>();
  private currentSize = 0;
  private readonly maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (entry === undefined) {
      return undefined;
    }
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.value;
  }

  set(key: K, value: V, size: number): void {
    const existing = this.cache.get(key);
    if (existing !== undefined) {
      this.currentSize -= existing.size;
      this.cache.delete(key);
    }

    for (const [evictKey, evictEntry] of this.cache) {
      if (this.currentSize + size <= this.maxSize) {
        break;
      }
      this.currentSize -= evictEntry.size;
      this.cache.delete(evictKey);
    }

    this.cache.set(key, { value, size });
    this.currentSize += size;
  }

  getSize(): number {
    return this.currentSize;
  }

  getEntryCount(): number {
    return this.cache.size;
  }

  clear(): void {
    this.cache.clear();
    this.currentSize = 0;
  }
}

/**
 * File system context provider for RLM
 * Provides unified access to context data with memory safety guarantees
 *
 * Supports two modes:
 * - **Filesystem mode**: On-demand loading from disk with LRU cache
 * - **Memory mode**: Direct string content (virtual single-file context)
 *
 * Both modes enable handling massive contexts (100MB+) without OOM issues.
 */
export class FileSystemContext {
  private readonly mode: 'filesystem' | 'memory';
  private readonly basePath: string;
  private readonly filePaths: Set<string>;
  private readonly fileMetadata: Map<string, FileInfo>;
  private readonly contentCache: LRUCache<string, string>;
  private readonly memoryContent: string;
  private readonly maxCacheSize: number;
  private readonly maxFileSize: number;
  private readonly logger: Logger;

  /**
   * Create FileSystemContext from filesystem or memory
   *
   * @param basePathOrContent - Filesystem: absolute path; Memory: string content
   * @param filePaths - Filesystem: relative file paths; Memory: omit/undefined
   * @param options - Memory safety configuration
   *
   * @example
   * Filesystem mode:
   * ```typescript
   * const ctx = new FileSystemContext('/project', ['src/index.ts']);
   * ```
   *
   * @example
   * Memory mode:
   * ```typescript
   * const ctx = new FileSystemContext('long text content...');
   * ```
   */
  constructor(basePathOrContent: string, filePaths?: string[], options?: FileSystemContextOptions) {
    this.maxCacheSize = options?.maxCacheSize ?? DEFAULT_MAX_CACHE_SIZE;
    this.maxFileSize = options?.maxFileSize ?? DEFAULT_MAX_FILE_SIZE;
    this.contentCache = new LRUCache(this.maxCacheSize);
    this.logger = createLogger('FileSystemContext', options?.verbose ?? false);

    if (filePaths === undefined || filePaths.length === 0) {
      // Memory mode: treat input as string content
      this.mode = 'memory';
      this.basePath = '';
      this.memoryContent = basePathOrContent;
      this.filePaths = new Set(['__memory__.txt']);
      this.fileMetadata = new Map([
        [
          '__memory__.txt',
          {
            path: '__memory__.txt',
            size: basePathOrContent.length,
            lines: basePathOrContent.split('\n').length,
          },
        ],
      ]);
    } else {
      // Filesystem mode: on-demand loading from disk
      this.mode = 'filesystem';
      this.basePath = basePathOrContent;
      this.filePaths = new Set(filePaths);
      this.memoryContent = '';
      this.fileMetadata = this.computeMetadata();
    }
  }

  /**
   * Compute file metadata (size, lines) by reading only file stats
   */
  private computeMetadata(): Map<string, FileInfo> {
    const metadata = new Map<string, FileInfo>();

    for (const relativePath of this.filePaths) {
      const fullPath = path.join(this.basePath, relativePath);
      try {
        const stats = fs.statSync(fullPath);
        // Line counts are computed when the file is first read.
        metadata.set(relativePath, {
          path: relativePath,
          size: stats.size,
          lines: 0, // Will be computed when file is read
        });
      } catch (error) {
        this.logger.warn(`Failed to read metadata for ${relativePath}:`, error);
      }
    }

    return metadata;
  }

  /**
   * List all available file paths
   */
  listFiles(): string[] {
    return [...this.filePaths];
  }

  /**
   * Read a specific file with memory safety checks
   * Filesystem: loaded from disk on-demand with LRU cache
   * Memory: returns the stored string content
   */
  readFile(filePath: string): string {
    // Memory mode: return stored content directly
    if (this.mode === 'memory') {
      if (filePath !== '__memory__.txt') {
        throw new Error(`File not found: ${filePath}`);
      }
      return this.memoryContent;
    }

    // Filesystem mode: check cache first
    const cached = this.contentCache.get(filePath);
    if (cached !== undefined) {
      return cached;
    }

    // Check if file exists
    const metadata = this.fileMetadata.get(filePath);
    if (!metadata) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Check single file size limit
    if (metadata.size > this.maxFileSize) {
      throw new Error(
        `File too large: ${filePath} (${metadata.size.toLocaleString()} bytes, max: ${this.maxFileSize.toLocaleString()} bytes)`
      );
    }

    // ONLY check if single file is larger than entire cache capacity
    if (metadata.size > this.maxCacheSize) {
      throw new Error(
        `File size exceeds cache capacity: ${filePath} (${metadata.size.toLocaleString()} bytes > ${this.maxCacheSize.toLocaleString()} bytes cache)`
      );
    }

    // Read from filesystem NOW
    const fullPath = path.join(this.basePath, filePath);
    const content = fs.readFileSync(fullPath, 'utf-8');

    // Update metadata with actual line count
    const lineCount = content.split('\n').length;
    metadata.lines = lineCount;

    // Store in cache (LRU will evict old entries automatically if needed)
    this.contentCache.set(filePath, content, content.length);

    return content;
  }

  /**
   * Get file metadata without reading content
   */
  getFileInfo(filePath: string): FileInfo {
    const metadata = this.fileMetadata.get(filePath);
    if (!metadata) {
      throw new Error(`File not found: ${filePath}`);
    }

    // If lines not computed yet, compute it
    if (metadata.lines === 0) {
      const fullPath = path.join(this.basePath, filePath);
      const content = fs.readFileSync(fullPath, 'utf-8');
      metadata.lines = content.split('\n').length;
    }

    return { ...metadata };
  }

  /**
   * Search files by pattern (returns paths only)
   */
  searchFiles(pattern: string | RegExp): string[] {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    return this.listFiles().filter(filePath => regex.test(filePath));
  }

  /**
   * Get overall context statistics
   */
  getStats(): ContextStats {
    // Computed on every call so that line counts of files read later are included.
    let totalSize = 0;
    let totalLines = 0;
    const fileTypes: Record<string, number> = {};

    for (const [filePath, metadata] of this.fileMetadata.entries()) {
      totalSize += metadata.size;

      // Only count lines if already computed (from cache or previous reads)
      if (metadata.lines > 0) {
        totalLines += metadata.lines;
      }

      const ext = filePath.split('.').pop() ?? 'unknown';
      fileTypes[ext] = (fileTypes[ext] ?? 0) + 1;
    }

    return {
      totalFiles: this.filePaths.size,
      totalSize,
      totalLines,
      fileTypes,
    };
  }

  /**
   * Get a subset of files by pattern (useful for sampling)
   */
  sampleFiles(pattern: string | RegExp, limit: number): string[] {
    const matched = this.searchFiles(pattern);
    return matched.slice(0, limit);
  }

  /**
   * Get files by directory
   */
  getFilesInDirectory(dir: string): string[] {
    return this.listFiles().filter(filePath => filePath.startsWith(dir));
  }

  /**
   * Reset memory tracking by clearing cache
   * Call this between queries to allow reusing the same context
   */
  resetMemoryTracking(): void {
    this.contentCache.clear();
  }

  /**
   * Get current memory usage information
   */
  getMemoryUsage(): MemoryUsage {
    const cacheSize = this.contentCache.getSize();
    return {
      bytesRead: cacheSize, // Current cache size, NOT cumulative
      maxBytes: this.maxCacheSize,
      percentUsed: (cacheSize / this.maxCacheSize) * 100,
      cacheSize,
      cacheEntries: this.contentCache.getEntryCount(),
    };
  }

  /**
   * Get memory limits configuration
   */
  getMemoryLimits(): MemoryLimits {
    return {
      maxTotalRead: this.maxCacheSize,
      maxFileSize: this.maxFileSize,
    };
  }
}
