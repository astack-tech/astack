import OpenAICompatible from '../openai-compatible';
import type { OpenAICompatibleConfig } from '../openai-compatible';

export type {
  AssistantMessage,
  ChatCompletionOptions,
  Message,
  MessageRole,
  RawTool,
  ResponseToolCall,
  StreamChunk,
  StreamToolCall,
  TokenUsage,
  ToolCall,
} from '../openai-compatible';

const DEFAULT_BASE_URL = 'https://api.deepseek.com/v1';
const DEFAULT_MODEL = 'deepseek-chat';

/**
 * Options for the DeepSeek model provider. They are the options of
 * `OpenAICompatible`, with DeepSeek's endpoint and model as defaults.
 */
export interface DeepseekConfig extends Omit<OpenAICompatibleConfig, 'model' | 'name'> {
  /** Model name. Defaults to `deepseek-chat`. */
  model?: string | undefined;
  /** API base URL. Defaults to `https://api.deepseek.com/v1`. */
  baseURL?: string | undefined;
}

/**
 * DeepSeek model provider: `OpenAICompatible` set up for the DeepSeek API.
 *
 * Ports:
 * - `prompt` (in): a text prompt. The answer is sent on `completion`.
 * - `messages` (in): a list of chat messages. The reply is sent on `message`.
 */
class Deepseek extends OpenAICompatible {
  constructor(config: DeepseekConfig) {
    super({
      ...config,
      model: config.model ?? DEFAULT_MODEL,
      baseURL: config.baseURL ?? DEFAULT_BASE_URL,
      name: 'DeepSeek',
    });
  }
}

export default Deepseek;
