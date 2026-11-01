import { Component } from '@astack-tech/core';
import type { Port } from '@astack-tech/core';

import { resetMemory, resolveAgentSettings } from './Agent';
import type { AgentSettings } from './Agent';
import { isAgentRunInput } from './guards';
import {
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
  Message,
  TokenUsage,
  ToolCall,
  ToolCallRecord,
} from './types';

/**
 * Event emitted by `StreamingAgent.runStream()`.
 */
export interface StreamingChunk {
  /** Event kind. Each kind sets the fields documented below. */
  type:
    | 'iteration_start'
    | 'model_thinking'
    | 'assistant_message'
    | 'tool_start'
    | 'tool_result'
    | 'completed'
    | 'error';
  /** `iteration_start`: 1-based iteration number. */
  iteration?: number | undefined;
  /** `assistant_message`: text accumulated so far in this iteration. */
  content?: string | undefined;
  /** `assistant_message`: tool calls accumulated so far in this iteration. */
  toolCalls?: ToolCall[] | undefined;
  /** `tool_start` and `tool_result`: tool name. */
  toolName?: string | undefined;
  /** `tool_result`: tool result, or `{ error }`. */
  result?: unknown;
  /** `completed`: final assistant text. */
  finalMessage?: string | undefined;
  /** `completed`: full message history. */
  history?: Message[] | undefined;
  /** `completed`: every tool call that ran. */
  allToolCalls?: ToolCallRecord[] | undefined;
  /** `error`: error message. */
  error?: string | undefined;
  /** `completed`: token usage summed over every model call. */
  usage?: TokenUsage | undefined;
}

interface ToolCallBuffer {
  calls: Map<string, ToolCall>;
  lastKey: string | null;
}

function isNonEmpty(value: string | undefined): value is string {
  return value !== undefined && value !== '';
}

/**
 * Merges streamed tool-call deltas into complete calls.
 *
 * A delta with an id starts or continues the call with that id. A delta without an id
 * continues the most recent call. When the first delta of a call has no id, the call is
 * re-keyed once its id arrives.
 */
export function mergeToolCallDeltas(buffer: ToolCallBuffer, deltas: Partial<ToolCall>[]): void {
  deltas.forEach((delta, index) => {
    const rawId = isNonEmpty(delta.id) ? delta.id : null;
    let key: string;

    if (rawId !== null) {
      key = rawId;
      const previousKey = buffer.lastKey;
      const previous = previousKey === null ? undefined : buffer.calls.get(previousKey);
      if (previousKey !== null && previousKey !== key && previous !== undefined) {
        buffer.calls.delete(previousKey);
        previous.id = key;
        buffer.calls.set(key, previous);
      }
      buffer.lastKey = key;
    } else {
      key = buffer.lastKey ?? `index-${String(index)}`;
      buffer.lastKey ??= key;
    }

    const existing = buffer.calls.get(key) ?? {
      id: rawId ?? key,
      type: delta.type ?? 'function',
      function: { name: '', arguments: '' },
    };
    const name = delta.function?.name;
    if (isNonEmpty(name)) {
      existing.function.name = name;
    }
    const argumentsDelta = delta.function?.arguments;
    if (isNonEmpty(argumentsDelta)) {
      existing.function.arguments += argumentsDelta;
    }
    if (isNonEmpty(delta.type)) {
      existing.type = delta.type;
    }
    buffer.calls.set(key, existing);
  });
}

function snapshotToolCalls(buffer: ToolCallBuffer): ToolCall[] {
  return [...buffer.calls.values()].map(call => ({
    id: call.id || call.function.name,
    type: call.type,
    function: { name: call.function.name, arguments: call.function.arguments },
    tool_name: call.function.name,
    arguments: call.function.arguments,
  }));
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Agent that reports its progress as a stream of `StreamingChunk` events.
 *
 * It follows the same loop as `Agent`. When the model implements
 * `streamChatCompletion`, assistant text is streamed token by token; otherwise each
 * reply arrives as one `assistant_message`.
 *
 * Ports: `in` receives a string or an `AgentInput`; `out` sends every `StreamingChunk`.
 */
export class StreamingAgent extends Component {
  private readonly settings: AgentSettings;

  constructor(config: AgentConfig) {
    super({});
    this.settings = resolveAgentSettings(config, 'StreamingAgent');
    resetMemory(this.settings);
  }

  /**
   * Runs the agent and yields progress events. The generator returns the final output.
   * On failure it yields one `error` event and rethrows.
   */
  async *runStream(input: string | AgentInput): AsyncGenerator<StreamingChunk, AgentOutput> {
    resetMemory(this.settings);
    const { systemPrompt, tools } = this.settings;
    try {
      return yield* this.executeWithToolsStream(
        buildInitialMessages(input, buildSystemPrompt(systemPrompt, tools))
      );
    } catch (error) {
      yield { type: 'error', error: errorMessage(error) };
      throw error;
    }
  }

  /**
   * Runs the agent to completion and returns the final output.
   */
  override async run(input: string | AgentInput): Promise<AgentOutput> {
    const stream = this.runStream(input);
    for (;;) {
      const next = await stream.next();
      if (next.done === true) {
        return next.value;
      }
    }
  }

  /**
   * Streams every event of a run to `out`. A failed run ends with one `error` event.
   * Input that is neither a string nor an `AgentInput` fails the pipeline run with a
   * `TypeError`.
   */
  override _transform($i: Port, $o: Port): void {
    $i('in').receive(input => {
      if (!isAgentRunInput(input)) {
        throw new TypeError(
          'StreamingAgent: expected a string or an AgentInput ({ messages: Message[] }) on the in port.'
        );
      }
      return (async () => {
        try {
          for await (const chunk of this.runStream(input)) {
            $o('out').send(chunk);
          }
        } catch (error) {
          this.settings.logger.error('Run failed:', errorMessage(error));
        }
      })();
    });
  }

  /**
   * Clears the memory and stores the system prompt again.
   */
  reset(): void {
    resetMemory(this.settings);
  }

  private async *streamReply(history: Message[]): AsyncGenerator<StreamingChunk, Message> {
    const { model, tools, logger } = this.settings;
    const options = { temporaryTools: tools };

    if (model.streamChatCompletion === undefined) {
      const reply = await model.chatCompletion(history, options);
      if (reply.content) {
        yield {
          type: 'assistant_message',
          content: reply.content,
          toolCalls: reply.tool_calls ?? [],
        };
      }
      return reply;
    }

    const buffer: ToolCallBuffer = { calls: new Map(), lastKey: null };
    const reply: Message = { role: 'assistant', content: '', tool_calls: [] };
    let usage: TokenUsage | undefined;

    for await (const chunk of model.streamChatCompletion(history, options)) {
      if (isNonEmpty(chunk.content)) {
        reply.content += chunk.content;
        yield { type: 'assistant_message', content: reply.content, toolCalls: reply.tool_calls };
      }
      if (chunk.tool_calls) {
        logger.debug('Tool call deltas:', chunk.tool_calls);
        mergeToolCallDeltas(buffer, chunk.tool_calls);
        reply.tool_calls = snapshotToolCalls(buffer);
      }
      if (chunk.usage) {
        usage = addUsage(usage, chunk.usage);
      }
    }

    return usage === undefined ? reply : { ...reply, usage };
  }

  private async *executeWithToolsStream(
    messages: Message[]
  ): AsyncGenerator<StreamingChunk, AgentOutput> {
    const { tools, maxIterations, logger } = this.settings;
    const toolCalls: ToolCallRecord[] = [];
    const history = [...messages];
    let lastReply: Message | undefined;
    let usage: TokenUsage | undefined;

    for (let iteration = 1; iteration <= maxIterations; iteration += 1) {
      yield { type: 'iteration_start', iteration };
      yield { type: 'model_thinking' };

      const reply = yield* this.streamReply(history);
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
        yield { type: 'tool_start', toolName: call.function.name || 'unknown' };
        const outcome = await runToolCall(call, tools, logger);
        resultsText += outcome.text;
        if (outcome.record) {
          toolCalls.push(outcome.record);
        }
        yield { type: 'tool_result', toolName: outcome.toolName, result: outcome.result };
      }
      history.push(...toolRoundMessages(reply, resultsText));

      if (iteration === maxIterations) {
        logger.warn(`Reached maxIterations (${String(maxIterations)}). Stopping.`);
      }
    }

    const output: AgentOutput = { message: lastReply?.content ?? '', history, toolCalls, usage };
    yield {
      type: 'completed',
      finalMessage: output.message,
      history: output.history,
      allToolCalls: toolCalls,
      usage,
    };
    return output;
  }
}

export default StreamingAgent;
