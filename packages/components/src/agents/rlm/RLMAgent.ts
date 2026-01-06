import { Component } from '@astack-tech/core';
import { RLMCore, RLMInput, RLMResult, RLMChunk, LLMProvider } from './RLMCore';

/**
 * RLMAgent configuration
 */
export interface RLMAgentConfig {
  rootLLM: LLMProvider;
  subLLM: LLMProvider;
  maxDepth?: number;
}

/**
 * RLMAgent - Recursive Language Model Agent
 * Processes long contexts by treating prompts as external environment
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
