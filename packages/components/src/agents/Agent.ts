import { Component } from '@astack-tech/core';
import type { Port } from '@astack-tech/core';

import { createLogger } from '../utils/logger';
import type { Logger } from '../utils/logger';
import { DefaultMemory } from './memory';
import {
  DEFAULT_MAX_ITERATIONS,
  DEFAULT_SYSTEM_PROMPT,
  addUsage,
  buildInitialMessages,
  buildSystemPrompt,
  runToolCall,
  toolRoundMessages,
} from './runtime';
import type {
  AgentConfig,
  AgentInput,
  AgentOutput,
  Memory,
  Message,
  ModelProvider,
  TokenUsage,
  Tool,
  ToolCallRecord,
} from './types';

/**
 * Resolved agent settings shared by `Agent` and `StreamingAgent`.
 */
export interface AgentSettings {
  model: ModelProvider;
  tools: Tool[];
  systemPrompt: string;
  memory: Memory;
  maxIterations: number;
  logger: Logger;
}

/**
 * Applies the defaults to an `AgentConfig`.
 */
export function resolveAgentSettings(config: AgentConfig, scope: string): AgentSettings {
  return {
    model: config.model,
    tools: config.tools ?? [],
    systemPrompt: config.systemPrompt ?? DEFAULT_SYSTEM_PROMPT,
    memory: config.memory ?? new DefaultMemory(),
    maxIterations: config.maxIterations ?? DEFAULT_MAX_ITERATIONS,
    logger: createLogger(scope, config.verbose ?? false),
  };
}

/**
 * Clears `memory` and stores the full system prompt.
 */
export function resetMemory(settings: AgentSettings): void {
  const { memory, systemPrompt, tools } = settings;
  memory.clear();
  if (systemPrompt) {
    memory.addMessage({ role: 'system', content: buildSystemPrompt(systemPrompt, tools) });
  }
}

/**
 * Agent that lets a model call tools in a loop until it answers without tool calls
 * or reaches `maxIterations`.
 *
 * Ports: `in` receives a string or an `AgentInput`; `out` sends an `AgentOutput`.
 */
export class Agent extends Component {
  private readonly settings: AgentSettings;

  constructor(config: AgentConfig) {
    super({});
    this.settings = resolveAgentSettings(config, 'Agent');
    resetMemory(this.settings);
  }

  /**
   * Runs the agent outside a pipeline.
   */
  override async run(input: string | AgentInput): Promise<AgentOutput> {
    resetMemory(this.settings);
    const { tools, logger, systemPrompt } = this.settings;
    logger.debug(
      'Tools:',
      tools.map(tool => tool.name)
    );
    return this.executeWithTools(buildInitialMessages(input, buildSystemPrompt(systemPrompt, tools)));
  }

  /**
   * Runs the agent for every value on `in`. Errors produce an `AgentOutput` with `error` set.
   */
  override _transform($i: Port, $o: Port): void {
    $i('in').receive((input: string | AgentInput) => {
      this.run(input).then(
        output => {
          $o('out').send(output);
        },
        (error: unknown) => {
          const message = error instanceof Error ? error.message : String(error);
          this.settings.logger.error('Run failed:', message);
          const output: AgentOutput = {
            message: `Request failed: ${message}`,
            history: [],
            error: message,
          };
          $o('out').send(output);
        }
      );
    });
  }

  /**
   * Clears the memory and stores the system prompt again.
   */
  reset(): void {
    resetMemory(this.settings);
  }

  private async executeWithTools(messages: Message[]): Promise<AgentOutput> {
    const { model, tools, maxIterations, logger } = this.settings;
    const toolCalls: ToolCallRecord[] = [];
    const history = [...messages];
    let lastReply: Message | undefined;
    let usage: TokenUsage | undefined;

    for (let iteration = 1; iteration <= maxIterations; iteration += 1) {
      logger.debug(`Iteration ${String(iteration)}/${String(maxIterations)}`);
      const reply = await model.chatCompletion(history, { temporaryTools: tools });
      lastReply = reply;
      if (reply.usage) {
        usage = addUsage(usage, reply.usage);
      }

      const calls = reply.tool_calls ?? [];
      if (calls.length === 0) {
        break;
      }

      let resultsText = '';
      for (const call of calls) {
        const outcome = await runToolCall(call, tools, logger);
        resultsText += outcome.text;
        if (outcome.record) {
          toolCalls.push(outcome.record);
        }
      }
      history.push(...toolRoundMessages(reply, resultsText));

      if (iteration === maxIterations) {
        logger.warn(`Reached maxIterations (${String(maxIterations)}). Stopping.`);
      }
    }

    return { message: lastReply?.content ?? '', history, toolCalls, usage };
  }
}

export default Agent;
