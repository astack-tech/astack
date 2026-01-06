import { Component } from '@astack-tech/core';
import { RLMCore, RLMInput, RLMResult, RLMChunk, LLMProvider } from './RLMCore';

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
   * @remarks Current implementation only supports depth=1
   */
  maxDepth?: number;
}

/**
 * RLMAgent - Recursive Language Model Agent
 *
 * Processes long contexts by allowing the LLM to generate code that orchestrates
 * multiple sub-LLM calls for chunking and analysis tasks.
 *
 * @example
 * ```typescript
 * const agent = new RLMAgent({ rootLLM, subLLM });
 * const result = await agent.runStream({
 *   context: fileSystemContext,
 *   query: "Analyze this codebase"
 * });
 * ```
 */
export class RLMAgent extends Component {
  private rlm: RLMCore;

  constructor(config: RLMAgentConfig) {
    super(config);
    this.rlm = new RLMCore(config.rootLLM, config.subLLM, config.maxDepth ?? 1);
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
