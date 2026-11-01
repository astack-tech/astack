import { isArrayOf, isNumber, isOptional, isRecord, isString } from '../utils/guards';
import type { AgentInput, Message, TokenUsage, ToolCall } from './types';

function isTokenUsage(value: unknown): value is TokenUsage {
  return (
    isRecord(value) &&
    isNumber(value['completion_tokens']) &&
    isNumber(value['prompt_tokens']) &&
    isNumber(value['total_tokens']) &&
    isOptional(value['prompt_cache_hit_tokens'], isNumber) &&
    isOptional(value['prompt_cache_miss_tokens'], isNumber)
  );
}

function isArguments(value: unknown): value is Record<string, unknown> | string {
  return isRecord(value) || isString(value);
}

function isToolCall(value: unknown): value is ToolCall {
  if (!isRecord(value)) {
    return false;
  }
  const definition = value['function'];
  return (
    isString(value['id']) &&
    isString(value['type']) &&
    isRecord(definition) &&
    isString(definition['name']) &&
    isString(definition['arguments']) &&
    isOptional(value['tool_name'], isString) &&
    isOptional(value['arguments'], isArguments)
  );
}

/** Whether `value` is a `Message`, checked field by field. */
export function isMessage(value: unknown): value is Message {
  return (
    isRecord(value) &&
    isString(value['role']) &&
    isString(value['content']) &&
    isOptional(value['tool_calls'], (calls): calls is ToolCall[] => isArrayOf(calls, isToolCall)) &&
    isOptional(value['tool_call_id'], isString) &&
    isOptional(value['metadata'], isRecord) &&
    isOptional(value['usage'], isTokenUsage)
  );
}

/** Whether `value` is what an agent's `in` port accepts: a string or an `AgentInput`. */
export function isAgentRunInput(value: unknown): value is string | AgentInput {
  return (
    isString(value) ||
    (isRecord(value) &&
      isArrayOf(value['messages'], isMessage) &&
      isOptional(value['context'], isRecord))
  );
}
