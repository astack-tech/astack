import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import vm from 'node:vm';

import { createLogger } from '../../utils/logger';
import type { Logger } from '../../utils/logger';

import { FileSystemContext } from './FileSystemContext';

/** Maximum run time of generated code. */
const EXECUTION_TIMEOUT_MS = 120_000;

/**
 * RLM input configuration
 */
export interface RLMInput {
  context: FileSystemContext;
  query: string;
  /** Reserved. The depth is fixed when the RLM is constructed. */
  maxDepth?: number | undefined;
}

/**
 * RLM execution result
 */
export interface RLMResult {
  answer: string;
  code: string;
  depth: number;
  /** Error message when the run failed inside a pipeline. */
  error?: string | undefined;
}

/**
 * RLM streaming chunk
 */
export interface RLMChunk {
  type: 'code' | 'execution' | 'answer' | 'error' | 'metadata' | 'summary';
  content: string;
  metadata?: RLMExecutionMetadata | undefined;
}

/**
 * Sub-LLM call details
 * Full prompt/result content is offloaded to temporary log files to prevent OOM
 */
export interface SubLLMCall {
  depth: number;
  logFile: string; // Path to temporary log file containing full prompt and result
  promptLength: number;
  resultLength: number;
  duration: number;
  timestamp: number;
}

/**
 * RLM execution metadata
 */
export interface RLMExecutionMetadata {
  maxDepth: number;
  actualDepth: number;
  subLLMCalls: number;
  subLLMCallDetails: SubLLMCall[];
  totalExecutionTime: number;
  codeGenTime: number;
  replExecutionTime: number;
  contextLength: number;
  generatedCodeLength: number;
}

/**
 * LLM provider interface for RLM
 */
export interface LLMProvider {
  generate(prompt: string): Promise<string>;
  generateStream?(prompt: string): AsyncGenerator<string>;
}

/**
 * Builds a task-specific prompt from the context and query.
 */
export type CustomPromptBuilder = (context: FileSystemContext, query: string) => string;

/**
 * Additional RLMCore options.
 */
export interface RLMCoreOptions {
  /** Mirror sandbox console output and diagnostics to the real console. Default: false. */
  verbose?: boolean | undefined;
}

const isPromiseLike = (value: unknown): value is PromiseLike<unknown> =>
  typeof value === 'object' &&
  value !== null &&
  'then' in value &&
  typeof value.then === 'function';

const formatArgs = (args: unknown[]): string => args.map(arg => String(arg)).join(' ');

/**
 * RLM Core - Recursive Language Model with REPL environment
 * Based on the paper arXiv:2512.24601
 *
 * Handles long contexts by allowing the LLM to generate code that orchestrates
 * multiple sub-LLM calls for chunking and analysis tasks.
 *
 * Supports true recursion: Sub-LLM can itself be an RLM instance with REPL capabilities.
 *
 * @example
 * ```typescript
 * const rlm = new RLMCore(rootLLM, subLLM, 2); // depth=2 enables recursive RLM
 * const result = await rlm.executeStream({
 *   context: fileSystemContext,
 *   query: "Analyze this codebase architecture"
 * });
 * ```
 */
export class RLMCore implements LLMProvider {
  private readonly rootLLM: LLMProvider;
  private readonly subLLM: LLMProvider;
  private readonly maxDepth: number;
  private readonly logDir: string;
  private readonly sharedContext: FileSystemContext | undefined;
  private readonly customPrompt: string | CustomPromptBuilder | undefined;
  private readonly logger: Logger;

  /**
   * Create an RLM instance with optional recursive nesting
   *
   * @param rootLLM - LLM for generating orchestration code at this level
   * @param subLLM - LLM for answering sub-queries (can be another RLM for recursion)
   * @param maxDepth - Maximum nesting depth (default: 1)
   * @param sharedContext - Shared FileSystemContext across all recursion levels (internal use)
   * @param customPrompt - Additional task-specific prompt (appended to default)
   * @param options - Additional options, such as `verbose`
   *
   * @remarks
   * When `maxDepth > 1`, the constructor automatically creates nested RLM instances:
   * - depth=2: Root RLM → Sub RLM → Base LLM
   * - depth=3: Root RLM → Sub RLM → Sub RLM → Base LLM
   *
   * All nested RLMs share the same FileSystemContext (if provided) to avoid redundant file reads.
   *
   * For most tasks, depth=1 is sufficient. Use depth>1 only for extremely complex multi-layer analysis.
   */
  constructor(
    rootLLM: LLMProvider,
    subLLM: LLMProvider,
    maxDepth = 1,
    sharedContext?: FileSystemContext,
    customPrompt?: string | CustomPromptBuilder,
    options: RLMCoreOptions = {}
  ) {
    this.rootLLM = rootLLM;
    this.maxDepth = maxDepth;
    this.sharedContext = sharedContext;
    this.customPrompt = customPrompt;
    this.logger = createLogger('RLM', options.verbose ?? false);

    // Each instance writes its sub-LLM call logs to its own temporary directory.
    this.logDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rlm-'));

    // Recursive construction: a nested RLM with depth - 1 acts as the sub-LLM.
    this.subLLM =
      maxDepth > 1
        ? new RLMCore(rootLLM, subLLM, maxDepth - 1, sharedContext, customPrompt, options)
        : subLLM;
  }

  /**
   * Execute RLM with given context and query
   */
  async execute(input: RLMInput): Promise<RLMResult> {
    const depth = 0;
    const subLLMCallDetails: SubLLMCall[] = [];
    const rawCode = await this.rootLLM.generate(this.buildPrompt(input.context, input.query));
    const code = this.extractCode(rawCode);

    let answer = '';
    for await (const chunk of this.runREPLStream(code, input.context, depth, subLLMCallDetails)) {
      if (chunk.type === 'answer') {
        // `[\s\S]` keeps multi-line answers intact.
        const match = /Answer:\s*([\s\S]*)/.exec(chunk.content);
        answer = match?.[1]?.trim() ?? '';
      }
    }

    return { answer, code, depth };
  }

  /**
   * Execute RLM with streaming output
   */
  async *executeStream(input: RLMInput): AsyncGenerator<RLMChunk> {
    const startTime = Date.now();
    const depth = 0;
    const subLLMCallDetails: SubLLMCall[] = [];

    // If we're at max depth, the RLM acts as a regular LLM (no REPL environment)
    // This matches the paper's implementation: rlm.py:171-173
    // Used for nested RLM calls where Sub-LLM itself is an RLM instance
    // Currently depth is always 0 (single-level RLM), but kept for future extensibility
    if (depth >= this.maxDepth) {
      // Fallback to direct LLM call without REPL
      const response = await this.rootLLM.generate(this.buildPrompt(input.context, input.query));
      yield { type: 'answer', content: response };
      return;
    }

    // Reset memory tracking for context
    input.context.resetMemoryTracking();

    yield { type: 'code', content: 'Generating code...\n\n' };

    const codeGenStart = Date.now();
    let rawCode = '';
    const prompt = this.buildPrompt(input.context, input.query);
    if (this.rootLLM.generateStream !== undefined) {
      for await (const chunk of this.rootLLM.generateStream(prompt)) {
        rawCode += chunk;
        yield { type: 'code', content: chunk };
      }
    } else {
      rawCode = await this.rootLLM.generate(prompt);
      yield { type: 'code', content: rawCode };
    }
    const codeGenTime = Date.now() - codeGenStart;

    const code = this.extractCode(rawCode);

    yield { type: 'code', content: '\n\n' };
    yield { type: 'execution', content: 'Executing code...\n' };

    const replStart = Date.now();
    let actualDepth = 0;

    try {
      for await (const chunk of this.runREPLStream(code, input.context, depth, subLLMCallDetails)) {
        if (chunk.metadata) {
          actualDepth = Math.max(actualDepth, chunk.metadata.actualDepth);
        }
        yield chunk;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      yield { type: 'error', content: `\nError: ${errorMsg}\n` };
    }

    const replExecutionTime = Date.now() - replStart;
    const totalExecutionTime = Date.now() - startTime;

    // Generate execution summary
    const contextLength = input.context.getStats().totalSize;

    const metadata: RLMExecutionMetadata = {
      maxDepth: this.maxDepth,
      actualDepth,
      subLLMCalls: subLLMCallDetails.length,
      subLLMCallDetails,
      totalExecutionTime,
      codeGenTime,
      replExecutionTime,
      contextLength,
      generatedCodeLength: code.length,
    };

    yield {
      type: 'summary',
      content: this.formatExecutionSummary(metadata),
      metadata,
    };
  }

  /**
   * Extract JavaScript code from LLM response
   */
  private extractCode(rawCode: string): string {
    const codeBlockMatch = /```(?:javascript|js)?\n([\s\S]*?)\n```/.exec(rawCode);
    return (codeBlockMatch?.[1] ?? rawCode).trim();
  }

  /**
   * Build prompt for root LLM
   */
  private buildPrompt(context: FileSystemContext, query: string): string {
    const stats = context.getStats();
    const fileList = context.listFiles();
    const isMemoryMode = fileList.length === 1 && fileList[0] === '__memory__.txt';

    // Default RLM system prompt (REPL environment basics)
    let prompt = `You are a code generator for a Recursive Language Model (RLM) system.

TASK: ${query}

CONTEXT: ${isMemoryMode ? 'In-memory data (single virtual file: __memory__.txt)' : `A file system with ${String(stats.totalFiles)} files`}, ${stats.totalSize.toLocaleString()} bytes total.
${isMemoryMode ? `\nIMPORTANT: All data is in a single file called "__memory__.txt". Use readFile("__memory__.txt") to access it directly.` : ''}

AVAILABLE TOOLS:
- listFiles(): string[] - list all available file paths
- readFile(path): string - read a specific file's content
- getFileInfo(path): {path, size, lines} - get file metadata without reading
- searchFiles(pattern): string[] - search files by regex pattern (returns paths)
- sampleFiles(pattern, limit): string[] - get limited sample of matching files
- getFilesInDirectory(dir): string[] - get all files in a directory
- getStats(): {totalFiles, totalSize, totalLines, fileTypes} - context statistics
- llm_query(prompt): async function - send a prompt to sub-LLM, returns Promise<string>
- FINAL(answer): function - mark your final answer

YOUR JOB:
${
  isMemoryMode
    ? `1. Read data from "__memory__.txt" using readFile("__memory__.txt")
2. Use llm_query() to process chunks of data if needed
3. Synthesize results and call FINAL() with your answer`
    : `1. Use searchFiles() or listFiles() to find relevant files
2. Use getFileInfo() to check file sizes before reading (avoid huge files)
3. Use readFile() ONLY for files you need - be selective to avoid memory issues
4. Use llm_query() to process individual files or groups of files
5. Synthesize results and call FINAL() with your answer`
}

CRITICAL RULES:
- Write code at TOP LEVEL, do NOT define functions and call them
- You MUST output ONLY valid JavaScript code, no explanations or markdown
- Use 'await' directly at top level (supported in this environment)
- MANDATORY: Your code MUST call FINAL(result) exactly once before ending
- MANDATORY: Even if errors occur, wrap ENTIRE code in try-catch and call FINAL() in both branches
- MANDATORY: FINAL() must receive a STRING argument, not an object or array directly
- MANDATORY: Convert arrays/objects to strings before passing to FINAL (use .join() or JSON.stringify())
- MANDATORY: DO NOT use return, break, continue, or any statement that exits early
- MANDATORY: Ensure ALL code paths lead to exactly ONE FINAL() call
- NEVER reuse function names as variable names (e.g., don't use: const sampleFiles = sampleFiles(...))
- Use descriptive variable names that don't conflict with provided functions

EXECUTION GUARANTEE:
Every code path must end with FINAL(). Examples:

CORRECT - simple string:
  const data = readFile('file.txt');
  FINAL(data);

CORRECT - array to string:
  const pairs = ['(1,2)', '(3,4)'];
  FINAL(pairs.join('\\n'));

CORRECT - object to string:
  const result = {count: 5};
  FINAL(JSON.stringify(result));

CORRECT - with error handling:
  try {
    const pairs = findPairs();
    FINAL(pairs.join('\\n'));
  } catch (error) {
    FINAL("Error: " + error.message);
  }

WRONG - no FINAL:
  const data = readFile('file.txt');
  console.log(data);

WRONG - passing object directly:
  const result = {count: 5};
  FINAL(result);  // BAD: FINAL needs string

WRONG - using return:
  const data = readFile('file.txt');
  return data;  // BAD: not in a function
`;

    // Append custom task-specific prompt if provided
    if (this.customPrompt !== undefined && this.customPrompt !== '') {
      const customPart =
        typeof this.customPrompt === 'function'
          ? this.customPrompt(context, query)
          : this.customPrompt;

      prompt += `\n\n${customPart}`;
    }

    prompt += '\n\nGenerate the JavaScript code now:';

    return prompt;
  }

  /**
   * Format execution summary for display
   */
  private formatExecutionSummary(metadata: RLMExecutionMetadata): string {
    const lines = [
      '\n',
      '═'.repeat(60),
      '📊 RLM EXECUTION SUMMARY',
      '═'.repeat(60),
      '',
      '🔢 Recursion Statistics:',
      `   Max Depth Configured: ${String(metadata.maxDepth)}`,
      `   Actual Depth Reached: ${String(metadata.actualDepth)}`,
      `   Sub-LLM Calls: ${String(metadata.subLLMCalls)}`,
      '',
      '📏 Context & Code:',
      `   Context Length: ${metadata.contextLength.toLocaleString()} characters`,
      `   Generated Code Length: ${String(metadata.generatedCodeLength)} characters`,
      '',
      '⏱️  Execution Time:',
      `   Total Time: ${(metadata.totalExecutionTime / 1000).toFixed(2)}s`,
      `   Code Generation: ${(metadata.codeGenTime / 1000).toFixed(2)}s`,
      `   REPL Execution: ${(metadata.replExecutionTime / 1000).toFixed(2)}s`,
    ];

    if (metadata.subLLMCallDetails.length > 0) {
      lines.push('', '🔍 Sub-LLM Call Details:');
      metadata.subLLMCallDetails.forEach((call, idx) => {
        lines.push(
          `   ${String(idx + 1)}. Depth ${String(call.depth)} | ${(call.duration / 1000).toFixed(2)}s | Prompt: ${String(call.promptLength)} chars → Result: ${String(call.resultLength)} chars`
        );
      });
    }

    lines.push('═'.repeat(60), '');

    return lines.join('\n');
  }

  /**
   * Run code in REPL environment with streaming
   */
  private async *runREPLStream(
    code: string,
    context: FileSystemContext,
    depth: number,
    subLLMCallDetails: SubLLMCall[]
  ): AsyncGenerator<RLMChunk> {
    let finalAnswer = '';

    const streamingLLMQuery = async function* (
      subLLM: LLMProvider,
      prompt: string
    ): AsyncGenerator<string> {
      if (subLLM.generateStream !== undefined) {
        yield* subLLM.generateStream(prompt);
      } else {
        yield await subLLM.generate(prompt);
      }
    };

    // Declare all variables first to avoid TDZ issues
    const maxDepth = this.maxDepth;
    const subLLM = this.subLLM;
    const pendingChunks: RLMChunk[] = [];
    const logger = this.logger;
    const pendingYield = (chunk: RLMChunk): void => {
      pendingChunks.push(chunk);
    };

    // Queue for handling llm_query requests OUTSIDE VM context
    const llmQueryQueue: {
      prompt: string;
      resolve: (result: string) => void;
      reject: (error: Error) => void;
    }[] = [];

    // Inject llm_query function - called FROM VM but processed OUTSIDE
    const llm_query = (prompt: string): Promise<string> =>
      new Promise<string>((resolve, reject) => {
        llmQueryQueue.push({ prompt, resolve, reject });
      });

    let queryProcessingActive: Promise<void> | null = null;

    // Process llm_query queue in background - CRITICAL: for await in EXTERNAL context!
    const startQueryProcessing = (): void => {
      if (queryProcessingActive !== null) {
        return;
      }

      queryProcessingActive = (async (): Promise<void> => {
        let request = llmQueryQueue.shift();
        while (request !== undefined) {
          const { prompt, resolve, reject } = request;

          try {
            const callStart = Date.now();
            let result = '';

            // CRITICAL: for await in EXTERNAL context prevents VM memory leak
            for await (const chunk of streamingLLMQuery(subLLM, prompt)) {
              result += chunk;
              pendingYield({ type: 'execution', content: chunk });
            }

            const callDuration = Date.now() - callStart;
            const callIndex = subLLMCallDetails.length;
            const logFile = path.join(this.logDir, `call-${String(callIndex)}.json`);

            fs.writeFileSync(
              logFile,
              JSON.stringify(
                { prompt, result, duration: callDuration, timestamp: Date.now() },
                null,
                2
              )
            );

            subLLMCallDetails.push({
              depth: depth + 1,
              logFile,
              promptLength: prompt.length,
              resultLength: result.length,
              duration: callDuration,
              timestamp: Date.now(),
            });

            const contextLength = context.getStats().totalSize;

            pendingYield({
              type: 'metadata',
              content: '',
              metadata: {
                maxDepth,
                actualDepth: depth + 1,
                subLLMCalls: subLLMCallDetails.length,
                subLLMCallDetails,
                totalExecutionTime: 0,
                codeGenTime: 0,
                replExecutionTime: 0,
                contextLength,
                generatedCodeLength: code.length,
              },
            });

            resolve(result);
          } catch (error) {
            reject(error instanceof Error ? error : new Error(String(error)));
          }
          request = llmQueryQueue.shift();
        }
        queryProcessingActive = null;
      })();
    };

    // Inject FINAL function
    const FINAL = (answer: unknown): void => {
      finalAnswer = String(answer); // Generated code may pass a non-string value.
      pendingYield({
        type: 'execution',
        content: `FINAL() called with ${String(finalAnswer.length)} characters\n`,
      });
    };

    // Sandbox console: streams output as chunks and mirrors it only in verbose mode.
    const customConsole = {
      log: (...args: unknown[]): void => {
        pendingYield({ type: 'execution', content: `${formatArgs(args)}\n` });
        logger.debug(...args);
      },
      error: (...args: unknown[]): void => {
        pendingYield({ type: 'execution', content: `Error: ${formatArgs(args)}\n` });
        logger.error(...args);
      },
      warn: (...args: unknown[]): void => {
        pendingYield({ type: 'execution', content: `Warning: ${formatArgs(args)}\n` });
        logger.warn(...args);
      },
      info: (...args: unknown[]): void => {
        pendingYield({ type: 'execution', content: `${formatArgs(args)}\n` });
        logger.info(...args);
      },
    };

    // Create fresh VM context for this execution to prevent variable accumulation
    // All user-defined variables from generated code will be GC'd after execution
    const sandbox: Record<string, unknown> = {
      // Built-in JavaScript globals
      console: customConsole,
      JSON,
      Math,
      Date,
      Promise,
      Array,
      Object,
      String,
      Number,
      Boolean,
      RegExp,
      Error,
      setTimeout,
      setInterval,
      clearTimeout,
      clearInterval,
      // RLM APIs
      llm_query,
      FINAL,
      // FileSystem APIs
      listFiles: () => context.listFiles(),
      readFile: (filePath: string) => context.readFile(filePath),
      getFileInfo: (filePath: string) => context.getFileInfo(filePath),
      searchFiles: (pattern: string | RegExp) => context.searchFiles(pattern),
      sampleFiles: (pattern: string | RegExp, limit: number) => context.sampleFiles(pattern, limit),
      getFilesInDirectory: (dir: string) => context.getFilesInDirectory(dir),
      getStats: () => context.getStats(),
    };

    const vmContext = vm.createContext(sandbox);

    // Wrap and execute code in the fresh context
    const wrappedCode = `(async () => { ${code} })()`;
    const scriptResult: unknown = vm.runInContext(wrappedCode, vmContext);

    // An object, so the flag can change inside callbacks without breaking type narrowing.
    const execution = { done: false };
    const executionPromise = Promise.resolve(
      isPromiseLike(scriptResult) ? scriptResult : undefined
    ).finally(() => {
      execution.done = true;
    });

    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutHandle = setTimeout(() => {
        reject(new Error(`Execution timeout after ${String(EXECUTION_TIMEOUT_MS / 1000)}s`));
      }, EXECUTION_TIMEOUT_MS);
    });

    // The timer must not outlive the execution, or it keeps the process alive.
    const executionRace = Promise.race([executionPromise, timeoutPromise]).finally(() => {
      clearTimeout(timeoutHandle);
    });

    // Stream pending chunks AND process llm_query queue while execution is running
    while (!execution.done) {
      // Trigger background processing of llm_query queue (non-blocking!)
      if (llmQueryQueue.length > 0) {
        startQueryProcessing();
      }

      // Stream chunks to user in real-time
      if (pendingChunks.length > 0) {
        const chunk = pendingChunks.shift();
        if (chunk) {
          yield chunk;
        }
      }

      await Promise.race([
        new Promise(resolve => setImmediate(resolve)),
        executionRace.catch(() => undefined),
      ]);
    }

    // Wait for any ongoing query processing to complete
    // `queryProcessingActive` is reassigned inside the async processor.
    const activeProcessing = queryProcessingActive as Promise<void> | null;
    if (activeProcessing !== null) {
      await activeProcessing;
    }

    // Flush remaining chunks
    while (pendingChunks.length > 0) {
      const chunk = pendingChunks.shift();
      if (chunk) {
        yield chunk;
      }
    }

    await executionRace;

    // Context cleanup: vmContext and all user-defined variables will be GC'd
    // after this function returns (no manual cleanup needed)

    if (finalAnswer === '') {
      throw new Error('Code executed but FINAL() was never called');
    }

    yield { type: 'answer', content: `\nAnswer: ${finalAnswer}\n` };
  }

  /**
   * Implement LLMProvider.generate - allows RLM to be used as sub-LLM
   * This enables true recursive RLM where Sub-LLM is itself an RLM instance
   */
  async generate(prompt: string): Promise<string> {
    // Use sharedContext if available, otherwise create memory mode context
    const context = this.sharedContext ?? new FileSystemContext(prompt);
    const result = await this.execute({ context, query: prompt });
    return result.answer;
  }

  /**
   * Implement LLMProvider.generateStream - streaming variant for recursive RLM
   */
  async *generateStream(prompt: string): AsyncGenerator<string> {
    const context = this.sharedContext ?? new FileSystemContext(prompt);

    for await (const chunk of this.executeStream({ context, query: prompt })) {
      // Only yield actual content, skip metadata/summary
      if (chunk.type === 'execution' || chunk.type === 'answer') {
        yield chunk.content;
      }
    }
  }
}
