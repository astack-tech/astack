import { Component } from '@astack-tech/core';
import type { Port } from '@astack-tech/core';

import { createLogger } from '../../utils/logger';
import type { Logger } from '../../utils/logger';

import type { FileSystemContext } from './FileSystemContext';
import { RLMCore } from './RLMCore';
import type { LLMProvider, RLMChunk, RLMInput, RLMResult } from './RLMCore';

/**
 * System prompt builder function type
 */
export type SystemPromptBuilder = (context: FileSystemContext, query: string) => string;

/**
 * RLMAgent configuration
 */
export interface RLMAgentConfig {
  /** LLM for generating orchestration code */
  rootLLM: LLMProvider;
  /** LLM for answering sub-queries */
  subLLM: LLMProvider;
  /**
   * Maximum nesting depth for RLM instances (default: 1)
   *
   * @remarks
   * - depth=1: Root RLM → Base LLM (recommended for most tasks)
   * - depth=2: Root RLM → Sub RLM → Base LLM (complex multi-layer analysis)
   * - depth=3+: Multiple nested RLM layers (experimental)
   *
   * When `maxDepth` is greater than 1, nested RLM instances are created automatically.
   */
  maxDepth?: number | undefined;
  /**
   * Shared FileSystemContext for all recursion levels (optional)
   *
   * @remarks
   * When provided, all nested RLM instances share the same FileSystemContext,
   * avoiding redundant file reads through shared LRU cache.
   */
  sharedContext?: FileSystemContext | undefined;
  /**
   * Task-specific additional prompt (optional)
   *
   * @remarks
   * This prompt is APPENDED to the default RLM system prompt.
   * The default prompt describes REPL environment basics (tools, FINAL(), etc.).
   * Your custom prompt should add task-specific strategies and examples.
   *
   * - String: Additional task-specific instructions
   * - Function: Dynamic prompt generation based on context and query
   * - Undefined: Uses only the default REPL environment prompt
   *
   * @example
   * ```typescript
   * // Static task-specific prompt
   * systemPrompt: "OOLONG-Pairs Strategy: Find all user pairs where both have entity/location..."
   *
   * // Dynamic prompt builder
   * systemPrompt: (context, query) => `Task-specific guidance for: ${query}`
   * ```
   */
  systemPrompt?: string | SystemPromptBuilder | undefined;
  /**
   * Mirror sandbox console output and errors to the real console. Default: false.
   */
  verbose?: boolean | undefined;
}

/**
 * RLMAgent - Recursive Language Model Agent
 *
 * Processes long contexts by allowing the LLM to generate code that orchestrates
 * multiple sub-LLM calls for chunking and analysis tasks.
 *
 * Supports true recursive nesting where Sub-LLM can itself be an RLM instance.
 *
 * @example
 * Basic usage (depth=1):
 * ```typescript
 * const agent = new RLMAgent({ rootLLM, subLLM });
 * const result = await agent.runStream({
 *   context: fileSystemContext,
 *   query: "Analyze this codebase"
 * });
 * ```
 *
 * @example
 * Recursive RLM (depth=2) with shared context:
 * ```typescript
 * const fsContext = new FileSystemContext(basePath, files);
 * const agent = new RLMAgent({
 *   rootLLM,
 *   subLLM,
 *   maxDepth: 2,
 *   sharedContext: fsContext
 * });
 * ```
 */
export class RLMAgent extends Component {
  private readonly rlm: RLMCore;
  private readonly logger: Logger;

  constructor(config: RLMAgentConfig) {
    super({});
    const verbose = config.verbose ?? false;
    this.logger = createLogger('RLMAgent', verbose);
    this.rlm = new RLMCore(
      config.rootLLM,
      config.subLLM,
      config.maxDepth ?? 1,
      config.sharedContext,
      config.systemPrompt,
      { verbose }
    );
  }

  /**
   * Process input through RLM
   */
  override async run(data: RLMInput): Promise<RLMResult> {
    return await this.rlm.execute(data);
  }

  /**
   * Pipeline mode: receives `RLMInput` on `in` and sends the resolved `RLMResult` on `out`.
   * A failed run sends a result with an empty answer and an `error` message.
   */
  override _transform($i: Port, $o: Port): void {
    $i('in').receive((input: RLMInput) => {
      this.run(input).then(
        result => {
          $o('out').send(result);
        },
        (error: unknown) => {
          const message = error instanceof Error ? error.message : String(error);
          this.logger.error('Run failed:', message);
          const failed: RLMResult = { answer: '', code: '', depth: 0, error: message };
          $o('out').send(failed);
        }
      );
    });
  }

  /**
   * Process input through RLM with streaming output
   */
  async *runStream(data: RLMInput): AsyncGenerator<RLMChunk> {
    yield* this.rlm.executeStream(data);
  }
}
