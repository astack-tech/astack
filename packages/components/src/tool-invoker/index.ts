import { Component } from '@astack-tech/core';
import type { Port } from '@astack-tech/core';
import type { Tool, ToolCall, ToolCallResult, ToolSet } from '@astack-tech/tools';

import { isArrayOf, isOptional, isRecord, isString } from '../utils/guards';
import { createLogger } from '../utils/logger';
import type { Logger } from '../utils/logger';

/**
 * Role of a conversation message.
 */
export type MessageRole = 'system' | 'user' | 'assistant' | 'tool';

/**
 * Conversation message read and produced by `ToolInvoker`.
 */
export interface Message {
  /** Message role. */
  role: MessageRole;
  /** Text content. */
  content?: string | undefined;
  /** Tool calls requested by an assistant message. */
  tool_calls?: ToolCall[] | undefined;
  /** Identifier of the call that a tool message answers. */
  tool_call_id?: string | undefined;
  /** Free-form metadata. */
  meta?: Record<string, unknown> | undefined;
}

/**
 * Options for `ToolInvoker`.
 */
export interface ToolInvokerConfig {
  /** Tools that can be called, as an array or a `ToolSet`. */
  tools: Tool[] | ToolSet;
  /** Log progress through the console. Defaults to false. */
  verbose?: boolean | undefined;
  /** Run tool calls concurrently. Defaults to false (one at a time, in order). */
  parallel?: boolean | undefined;
  /** Timeout for each tool call in milliseconds. Defaults to 30000. */
  timeout?: number | undefined;
}

/**
 * Input of `ToolInvoker`.
 */
export interface ToolInvokerInput {
  /** Messages to scan for tool calls. */
  messages: Message[];
}

/**
 * Output of `ToolInvoker`.
 */
export interface ToolInvokerOutput {
  /** One `tool` message per tool call, in call order. */
  tool_messages: Message[];
}

const DEFAULT_TIMEOUT_MS = 30_000;

const MESSAGE_ROLES: readonly MessageRole[] = ['system', 'user', 'assistant', 'tool'];

function isMessageRole(value: unknown): value is MessageRole {
  return MESSAGE_ROLES.some(role => role === value);
}

function isToolCall(value: unknown): value is ToolCall {
  return (
    isRecord(value) &&
    isOptional(value['id'], isString) &&
    isString(value['tool_name']) &&
    isRecord(value['arguments'])
  );
}

function isMessage(value: unknown): value is Message {
  return (
    isRecord(value) &&
    isMessageRole(value['role']) &&
    isOptional(value['content'], isString) &&
    isOptional(value['tool_calls'], (calls): calls is ToolCall[] => isArrayOf(calls, isToolCall)) &&
    isOptional(value['tool_call_id'], isString) &&
    isOptional(value['meta'], isRecord)
  );
}

function isToolInvokerInput(value: unknown): value is ToolInvokerInput {
  return isRecord(value) && isArrayOf(value['messages'], isMessage);
}

/**
 * Runs the tool calls found in a list of messages and returns one `tool` message per call.
 *
 * A failed, timed-out or unknown tool produces an error text in its tool message, so the
 * model can see the failure and other calls in the batch still complete.
 */
export class ToolInvoker extends Component {
  private readonly tools = new Map<string, Tool>();
  private readonly parallel: boolean;
  private readonly timeout: number;
  private readonly logger: Logger;

  constructor(config: ToolInvokerConfig) {
    super({});

    const tools = Array.isArray(config.tools) ? config.tools : config.tools.getTools();
    for (const tool of tools) {
      this.tools.set(tool.name, tool);
    }

    this.parallel = config.parallel ?? false;
    this.timeout = config.timeout ?? DEFAULT_TIMEOUT_MS;
    this.logger = createLogger('ToolInvoker', config.verbose ?? false);

    this.logger.debug(`Initialized with ${String(this.tools.size)} tools.`);
  }

  /**
   * Runs every tool call in `input.messages`.
   */
  override async run(input: ToolInvokerInput): Promise<ToolInvokerOutput> {
    this.logger.debug(`Processing ${String(input.messages.length)} messages.`);
    const toolCalls = input.messages.flatMap(message => message.tool_calls ?? []);

    if (toolCalls.length === 0) {
      this.logger.debug('No tool calls found.');
      return { tool_messages: [] };
    }

    this.logger.debug(`Found ${String(toolCalls.length)} tool calls.`);
    const results = this.parallel
      ? await Promise.all(toolCalls.map(call => this.executeToolCall(call)))
      : await this.executeSequentially(toolCalls);

    return { tool_messages: results.map(toToolMessage) };
  }

  /**
   * Reads `ToolInvokerInput` from the `in` port and sends `ToolInvokerOutput` to `out`.
   * Input that is not a `ToolInvokerInput` fails the pipeline run with a `TypeError`.
   */
  override _transform($i: Port, $o: Port): void {
    $i('in').receive(input => {
      if (!isToolInvokerInput(input)) {
        throw new TypeError(
          'ToolInvoker: expected a ToolInvokerInput ({ messages: Message[] }) on the in port.'
        );
      }
      return this.run(input).then(
        output => {
          $o('out').send(output);
        },
        (error: unknown) => {
          this.logger.error('Failed to process messages:', error);
          $o('out').send({ tool_messages: [] } satisfies ToolInvokerOutput);
        }
      );
    });
  }

  private async executeSequentially(toolCalls: ToolCall[]): Promise<ToolCallResult[]> {
    const results: ToolCallResult[] = [];
    for (const call of toolCalls) {
      results.push(await this.executeToolCall(call));
    }
    return results;
  }

  private async executeToolCall(toolCall: ToolCall): Promise<ToolCallResult> {
    const { tool_name: toolName } = toolCall;
    this.logger.debug(`Running tool: ${toolName}`);

    const tool = this.tools.get(toolName);
    if (!tool) {
      this.logger.warn(`Tool not found: ${toolName}`);
      return { result: `Tool not found: ${toolName}`, origin: toolCall };
    }

    try {
      const result = await this.withTimeout(tool.invoke(toolCall.arguments), toolName);
      this.logger.debug(`Tool succeeded: ${toolName}`);
      return { result, origin: toolCall };
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      const message = `Tool ${toolName} failed: ${reason}`;
      this.logger.error(message);
      return { result: message, origin: toolCall };
    }
  }

  private async withTimeout<T>(promise: Promise<T>, toolName: string): Promise<T> {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        reject(new Error(`Tool timed out after ${String(this.timeout)} ms: ${toolName}`));
      }, this.timeout);
    });

    try {
      return await Promise.race([promise, timeout]);
    } finally {
      clearTimeout(timer);
    }
  }
}

function toToolMessage(result: ToolCallResult): Message {
  const message: Message = { role: 'tool', content: JSON.stringify(result.result ?? null) };
  const id = result.origin?.id;
  if (id !== undefined) {
    message.tool_call_id = id;
  }
  return message;
}

export default ToolInvoker;
