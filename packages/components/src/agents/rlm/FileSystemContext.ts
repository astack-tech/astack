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
}

/**
 * Default memory limits
 */
const DEFAULT_MAX_TOTAL_READ = 50 * 1024 * 1024; // 50MB
const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * File system context provider for RLM
 * Provides on-demand access to files with memory safety guarantees
 */
export class FileSystemContext {
  private fileMap: Map<string, string>;
  private stats: ContextStats | null = null;

  // Memory safety tracking
  private totalBytesRead = 0;
  private readonly maxTotalRead: number;
  private readonly maxFileSize: number;

  constructor(fileMap: Map<string, string>, options?: FileSystemContextOptions) {
    this.fileMap = fileMap;
    this.maxTotalRead = options?.maxTotalRead ?? DEFAULT_MAX_TOTAL_READ;
    this.maxFileSize = options?.maxFileSize ?? DEFAULT_MAX_FILE_SIZE;
  }

  /**
   * List all available file paths
   */
  listFiles(): string[] {
    return Array.from(this.fileMap.keys());
  }

  /**
   * Read a specific file with memory safety checks
   */
  readFile(path: string): string {
    const content = this.fileMap.get(path);
    if (content === undefined) {
      throw new Error(`File not found: ${path}`);
    }

    // Check single file size limit
    if (content.length > this.maxFileSize) {
      throw new Error(
        `File too large: ${path} (${content.length.toLocaleString()} bytes, max: ${this.maxFileSize.toLocaleString()} bytes)`
      );
    }

    // Check total memory limit
    const newTotal = this.totalBytesRead + content.length;
    if (newTotal > this.maxTotalRead) {
      throw new Error(
        `Memory safety limit reached: reading ${path} would use ${newTotal.toLocaleString()} bytes (limit: ${this.maxTotalRead.toLocaleString()} bytes, currently used: ${this.totalBytesRead.toLocaleString()} bytes)`
      );
    }

    this.totalBytesRead = newTotal;
    return content;
  }

  /**
   * Get file metadata without reading content
   */
  getFileInfo(path: string): FileInfo {
    const content = this.fileMap.get(path);
    if (content === undefined) {
      throw new Error(`File not found: ${path}`);
    }

    return {
      path,
      size: content.length,
      lines: content.split('\n').length,
    };
  }

  /**
   * Search files by pattern (returns paths only)
   */
  searchFiles(pattern: string | RegExp): string[] {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    return this.listFiles().filter(path => regex.test(path));
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

    for (const [path, content] of this.fileMap.entries()) {
      totalSize += content.length;
      totalLines += content.split('\n').length;

      const ext = path.split('.').pop() || 'unknown';
      fileTypes[ext] = (fileTypes[ext] || 0) + 1;
    }

    this.stats = {
      totalFiles: this.fileMap.size,
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
    return this.listFiles().filter(path => path.startsWith(dir));
  }

  /**
   * Reset memory tracking counter
   * Call this between queries to allow reusing the same context
   */
  resetMemoryTracking(): void {
    this.totalBytesRead = 0;
  }

  /**
   * Get current memory usage information
   */
  getMemoryUsage(): MemoryUsage {
    return {
      bytesRead: this.totalBytesRead,
      maxBytes: this.maxTotalRead,
      percentUsed: (this.totalBytesRead / this.maxTotalRead) * 100,
    };
  }

  /**
   * Get memory limits configuration
   */
  getMemoryLimits(): { maxTotalRead: number; maxFileSize: number } {
    return {
      maxTotalRead: this.maxTotalRead,
      maxFileSize: this.maxFileSize,
    };
  }
}
