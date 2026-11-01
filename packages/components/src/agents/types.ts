/**
 * Token usage reported by a model provider.
 */
export interface TokenUsage {
  completion_tokens: number;
  prompt_tokens: number;
  prompt_cache_hit_tokens?: number | undefined;
  prompt_cache_miss_tokens?: number | undefined;
  total_tokens: number;
}

/**
 * A tool call in the OpenAI-compatible format. Providers may add the internal
 * `tool_name` and parsed `arguments` fields.
 */
export interface ToolCall {
  id: string;
  type: string;
  function: {
    name: string;
    arguments: string;
  };
  tool_name?: string | undefined;
  arguments?: Record<string, unknown> | string | undefined;
}

/**
 * A chat message exchanged between an agent and its model.
 */
export interface Message {
  /** Message role, such as `system`, `user`, `assistant` or `tool`. */
  role: string;
  /** Text content. */
  content: string;
  /** Tool calls requested by an assistant message. */
  tool_calls?: ToolCall[] | undefined;
  /** For tool messages: the identifier of the call this message answers. */
  tool_call_id?: string | undefined;
  /** Application data attached to the message. Models do not read it. */
  metadata?: Record<string, unknown> | undefined;
  /** Token usage of the reply that produced this message. */
  usage?: TokenUsage | undefined;
}

/**
 * Message returned by a model provider.
 */
export type MessageWithToolCalls = Message;

/**
 * Tool shape accepted by agents. At run time, a tool must expose `invoke(args)`
 * (as in `@astack-tech/tools`) or `execute(args)`.
 */
export interface Tool {
  /** Unique tool name. */
  name: string;
  /** Description that tells the model when to use the tool. */
  description: string;
  /** JSON Schema of the arguments. */
  parameters?: Record<string, unknown> | undefined;
}

/**
 * Conversation memory used by an agent.
 */
export interface Memory {
  addMessage(message: Message): void;
  getMessages(): Message[];
  getFormattedMemory(maxTokens?: number): Message[] | string;
  clear(): void;
}

/**
 * Per-call model options.
 */
export interface ModelProviderOptions {
  /** Tools for this call only. They replace the tools configured on the model. */
  temporaryTools?: unknown[] | undefined;
}

/**
 * Contract that a model component must meet to drive an agent.
 * `Deepseek` from `@astack-tech/integrations` implements it.
 */
export interface ModelProvider {
  chatCompletion(messages: Message[], options?: ModelProviderOptions): Promise<MessageWithToolCalls>;
  streamChatCompletion?(
    messages: Message[],
    options?: ModelProviderOptions
  ): AsyncGenerator<Partial<MessageWithToolCalls>>;
}

/**
 * Structured agent input.
 */
export interface AgentInput {
  messages: Message[];
  /** Attached as `metadata` to every message that has none. */
  context?: Record<string, unknown> | undefined;
}

/**
 * One executed tool call.
 */
export interface ToolCallRecord {
  tool: string;
  args: Record<string, unknown>;
  result: unknown;
}

/**
 * Agent result.
 */
export interface AgentOutput {
  /** Final assistant text. */
  message: string;
  /** Reserved for providers that expose reasoning text. */
  thinking?: string | undefined;
  /** Tool calls that ran, including failed ones. */
  toolCalls?: ToolCallRecord[] | undefined;
  /** Full message history, including tool rounds. */
  history: Message[];
  /** Token usage summed over every model call. */
  usage?: TokenUsage | undefined;
  /** Set when the agent failed inside a pipeline. */
  error?: string | undefined;
}

/**
 * Agent options.
 */
export interface AgentConfig {
  /** Model provider, for example `new Deepseek({ apiKey })`. */
  model: ModelProvider;
  /** Tools the model may call. */
  tools?: Tool[] | undefined;
  /** System prompt. Defaults to `You are a helpful assistant.`. */
  systemPrompt?: string | undefined;
  /** Memory instance. Defaults to a new `DefaultMemory`. */
  memory?: Memory | undefined;
  /** Maximum number of model calls per run. Defaults to `10`. */
  maxIterations?: number | undefined;
  /** Writes diagnostics to the console. Defaults to `false`. */
  verbose?: boolean | undefined;
  /**
   * @deprecated Has no effect. Tools are always offered to the model when `tools` is not empty.
   */
  supportsToolCalls?: boolean | undefined;
}
