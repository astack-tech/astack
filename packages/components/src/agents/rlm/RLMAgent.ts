import { Component } from '@astack-tech/core';
import { RLMCore, RLMInput, RLMResult, RLMChunk, LLMProvider } from './RLMCore';
import type { FileSystemContext } from './FileSystemContext';

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
   * When maxDepth > 1, nested RLM instances are automatically created.
   */
  maxDepth?: number;
  /**
   * Shared FileSystemContext for all recursion levels (optional)
   *
   * @remarks
   * When provided, all nested RLM instances share the same FileSystemContext,
   * avoiding redundant file reads through shared LRU cache.
   */
  sharedContext?: FileSystemContext;
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
  private rlm: RLMCore;

  constructor(config: RLMAgentConfig) {
    super(config);
    this.rlm = new RLMCore(
      config.rootLLM,
      config.subLLM,
      config.maxDepth ?? 1,
      config.sharedContext
    );
  }

  /**
   * Process input through RLM
   */
  async run(data: RLMInput): Promise<RLMResult> {
    return await this.rlm.execute(data);
  }

  /**
   * Process input through RLM with streaming output
   */
  async *runStream(data: RLMInput): AsyncGenerator<RLMChunk> {
    yield* this.rlm.executeStream(data);
  }
}
