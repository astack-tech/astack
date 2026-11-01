import type { Logger } from '../utils/logger';
import type {
  AgentInput,
  Message,
  TokenUsage,
  Tool,
  ToolCall,
  ToolCallRecord,
} from './types';

/** Default system prompt. */
export const DEFAULT_SYSTEM_PROMPT = 'You are a helpful assistant.';

/** Default maximum number of model calls per run. */
export const DEFAULT_MAX_ITERATIONS = 10;

/** Prefix of the user message that returns tool results to the model. */
export const TOOL_RESULTS_PREFIX = 'Tool results are below. Continue based on them:';

type ToolFunction = (args: Record<string, unknown>) => unknown;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Builds the system prompt and appends a description of every tool.
 */
export function buildSystemPrompt(systemPrompt: string, tools: readonly Tool[]): string {
  if (tools.length === 0) {
    return systemPrompt;
  }

  let prompt = `${systemPrompt}\n\nAvailable tools:\n`;
  tools.forEach((tool, index) => {
    prompt += `${String(index + 1)}. ${tool.name} - ${tool.description}\n`;
    const properties = tool.parameters?.['properties'];
    if (isRecord(properties)) {
      prompt += '   Parameters:\n';
      for (const [name, schema] of Object.entries(properties)) {
        const description =
          isRecord(schema) && typeof schema['description'] === 'string'
            ? schema['description']
            : '';
        prompt += `   - ${name}: ${description}\n`;
      }
    }
  });
  return prompt;
}

/**
 * Builds the first model request: the system prompt followed by the user messages.
 * `context` becomes the `metadata` of every message that has none.
 */
export function buildInitialMessages(input: string | AgentInput, systemPrompt: string): Message[] {
  const agentInput: AgentInput =
    typeof input === 'string' ? { messages: [{ role: 'user', content: input }] } : input;

  return [
    { role: 'system', content: systemPrompt },
    ...agentInput.messages.map(message => {
      const metadata = message.metadata ?? agentInput.context;
      return metadata === undefined ? { ...message } : { ...message, metadata };
    }),
  ];
}

/**
 * Adds `usage` to `total`. Returns a new object.
 */
export function addUsage(total: TokenUsage | undefined, usage: TokenUsage): TokenUsage {
  const base = total ?? { completion_tokens: 0, prompt_tokens: 0, total_tokens: 0 };
  const sum: TokenUsage = {
    ...base,
    completion_tokens: base.completion_tokens + usage.completion_tokens,
    prompt_tokens: base.prompt_tokens + usage.prompt_tokens,
    total_tokens: base.total_tokens + usage.total_tokens,
  };
  if (usage.prompt_cache_hit_tokens) {
    sum.prompt_cache_hit_tokens = (base.prompt_cache_hit_tokens ?? 0) + usage.prompt_cache_hit_tokens;
  }
  if (usage.prompt_cache_miss_tokens) {
    sum.prompt_cache_miss_tokens =
      (base.prompt_cache_miss_tokens ?? 0) + usage.prompt_cache_miss_tokens;
  }
  return sum;
}

/**
 * Outcome of one tool call.
 */
export interface ToolCallOutcome {
  /** Tool name from the call. */
  toolName: string;
  /** Text appended to the tool-results message. */
  text: string;
  /** Value reported to streaming clients: the tool result or `{ error }`. */
  result: unknown;
  /** Present when the tool ran, whether it succeeded or threw. */
  record?: ToolCallRecord | undefined;
}

function resolveToolFunction(tool: Tool): ToolFunction | undefined {
  const candidate = tool as Tool & { execute?: unknown; invoke?: unknown };
  if (typeof candidate.execute === 'function') {
    return candidate.execute.bind(tool) as ToolFunction;
  }
  if (typeof candidate.invoke === 'function') {
    return candidate.invoke.bind(tool) as ToolFunction;
  }
  return undefined;
}

function parseToolArguments(raw: string): Record<string, unknown> {
  if (raw.length === 0) {
    return {};
  }
  const parsed: unknown = JSON.parse(raw);
  if (!isRecord(parsed)) {
    throw new Error('expected a JSON object');
  }
  return parsed;
}

function stringifyResult(result: unknown): string {
  if (typeof result === 'string') {
    return result;
  }
  return result === undefined ? '{}' : JSON.stringify(result);
}

/**
 * Finds the tool, parses the arguments and runs the tool. Errors never escape:
 * they are reported in the returned text so the model can react.
 */
export async function runToolCall(
  call: ToolCall,
  tools: readonly Tool[],
  logger: Logger
): Promise<ToolCallOutcome> {
  const toolName = call.function.name || 'unknown';
  const fail = (message: string): ToolCallOutcome => ({
    toolName,
    text: `\n\n[${toolName}] Error: ${message}`,
    result: { error: message },
  });

  const tool = tools.find(candidate => candidate.name === toolName);
  if (tool === undefined) {
    return fail('tool not found');
  }

  let args: Record<string, unknown>;
  try {
    args = parseToolArguments(call.function.arguments);
  } catch (error) {
    return fail(`invalid arguments - ${errorMessage(error)}`);
  }
  logger.debug(`Tool ${toolName} arguments:`, args);

  const run = resolveToolFunction(tool);
  if (run === undefined) {
    return fail('tool has no execute() or invoke() method');
  }

  try {
    const result: unknown = await Promise.resolve(run(args));
    logger.debug(`Tool ${toolName} result:`, result);
    return {
      toolName,
      text: `\n\n[${toolName}] Result: ${stringifyResult(result)}`,
      result,
      record: { tool: toolName, args, result },
    };
  } catch (error) {
    const message = errorMessage(error);
    return {
      ...fail(`tool execution failed - ${message}`),
      result: { error: message },
      record: { tool: toolName, args, result: { error: message } },
    };
  }
}

/**
 * Builds the two messages that close a tool round: the assistant request and
 * the user message with the tool results.
 */
export function toolRoundMessages(assistant: Message, resultsText: string): Message[] {
  return [
    { role: 'assistant', content: assistant.content, tool_calls: assistant.tool_calls },
    { role: 'user', content: `${TOOL_RESULTS_PREFIX}${resultsText}` },
  ];
}
