import * as fs from 'fs';
import * as path from 'path';

/**
 * File information without content
 */
export interface FileInfo {
  path: string;
  size: number;
  lines: number;
}

/**
 * Context statistics
 */
export interface ContextStats {
  totalFiles: number;
  totalSize: number;
  totalLines: number;
  fileTypes: Record<string, number>;
}

/**
 * Memory usage information
 */
export interface MemoryUsage {
  bytesRead: number;
  maxBytes: number;
  percentUsed: number;
  cacheSize: number;
  cacheEntries: number;
}

/**
 * File system context configuration
 */
export interface FileSystemContextOptions {
  /**
   * Maximum total bytes that can be read across all files
   * Default: 50MB
   */
  maxTotalRead?: number;

  /**
   * Maximum size of a single file that can be read
   * Default: 5MB
   */
  maxFileSize?: number;

  /**
   * Maximum cache size in bytes
   * Default: 10MB
   */
  maxCacheSize?: number;
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
  private cache: Map<K, { value: V; size: number }> = new Map();
  private accessOrder: K[] = [];
  private currentSize = 0;
  private maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (entry) {
      // Move to end (most recently used)
      this.accessOrder = this.accessOrder.filter(k => k !== key);
      this.accessOrder.push(key);
      return entry.value;
    }
    return undefined;
  }

  set(key: K, value: V, size: number): void {
    // Remove old entry if exists
    if (this.cache.has(key)) {
      const oldEntry = this.cache.get(key)!;
      this.currentSize -= oldEntry.size;
      this.accessOrder = this.accessOrder.filter(k => k !== key);
    }

    // Evict entries if needed
    while (this.currentSize + size > this.maxSize && this.accessOrder.length > 0) {
      const evictKey = this.accessOrder.shift()!;
      const evictEntry = this.cache.get(evictKey)!;
      this.currentSize -= evictEntry.size;
      this.cache.delete(evictKey);
    }

    // Add new entry
    this.cache.set(key, { value, size });
    this.accessOrder.push(key);
    this.currentSize += size;
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  getSize(): number {
    return this.currentSize;
  }

  getEntryCount(): number {
    return this.cache.size;
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
    this.currentSize = 0;
  }
}

/**
 * File system context provider for RLM
 * Provides on-demand access to files with memory safety guarantees
 *
 * This implementation uses filesystem offloading - files are loaded from disk
 * on-demand rather than being stored in memory upfront. This enables handling
 * massive codebases (100MB+, 10k+ files) without OOM issues.
 */
export class FileSystemContext {
  private basePath: string;
  private filePaths: Set<string>;
  private fileMetadata: Map<string, FileInfo>;
  private contentCache: LRUCache<string, string>;
  private stats: ContextStats | null = null;

  // Memory safety tracking
  private readonly maxCacheSize: number;
  private readonly maxFileSize: number;

  /**
   * Create FileSystemContext from base path and file paths
   *
   * @param basePath - Absolute path to project root
   * @param filePaths - Array of relative file paths from basePath
   * @param options - Memory safety configuration
   */
  constructor(basePath: string, filePaths: string[], options?: FileSystemContextOptions) {
    this.basePath = basePath;
    this.filePaths = new Set(filePaths);
    this.maxCacheSize = options?.maxCacheSize ?? DEFAULT_MAX_CACHE_SIZE;
    this.maxFileSize = options?.maxFileSize ?? DEFAULT_MAX_FILE_SIZE;
    this.contentCache = new LRUCache(this.maxCacheSize);

    // Pre-compute file metadata without loading content
    this.fileMetadata = this.computeMetadata();
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
        // For now, lines is set to 0 (can be computed on-demand if needed)
        metadata.set(relativePath, {
          path: relativePath,
          size: stats.size,
          lines: 0, // Will be computed when file is read
        });
      } catch (error) {
        console.warn(`Failed to read metadata for ${relativePath}:`, error);
      }
    }

    return metadata;
  }

  /**
   * List all available file paths
   */
  listFiles(): string[] {
    return Array.from(this.filePaths);
  }

  /**
   * Read a specific file with memory safety checks
   * Files are loaded from disk on-demand and cached in LRU cache
   *
   * IMPORTANT: No cumulative read limit - you can read unlimited files as long as
   * the cache size stays within maxCacheSize. LRU automatically evicts old entries.
   */
  readFile(filePath: string): string {
    // Check cache first
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
    // This is the only real limit - LRU will handle everything else automatically
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
    if (this.stats) {
      return this.stats;
    }

    let totalSize = 0;
    let totalLines = 0;
    const fileTypes: Record<string, number> = {};

    for (const [filePath, metadata] of this.fileMetadata.entries()) {
      totalSize += metadata.size;

      // Only count lines if already computed (from cache or previous reads)
      if (metadata.lines > 0) {
        totalLines += metadata.lines;
      }

      const ext = filePath.split('.').pop() || 'unknown';
      fileTypes[ext] = (fileTypes[ext] || 0) + 1;
    }

    this.stats = {
      totalFiles: this.filePaths.size,
      totalSize,
      totalLines,
      fileTypes,
    };

    return this.stats;
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
  getMemoryLimits(): { maxTotalRead: number; maxFileSize: number } {
    return {
      maxTotalRead: this.maxCacheSize, // This is now maxCacheSize, not cumulative limit
      maxFileSize: this.maxFileSize,
    };
  }
}
