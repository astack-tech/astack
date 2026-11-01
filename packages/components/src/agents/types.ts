/**
 * Token usage reported by a model provider.
 */
export interface TokenUsage {
  /** Tokens in the generated reply. */
  completion_tokens: number;
  /** Tokens in the request, including the conversation history. */
  prompt_tokens: number;
  /** Prompt tokens served from the provider's cache, when the provider reports it. */
  prompt_cache_hit_tokens?: number | undefined;
  /** Prompt tokens not served from the cache, when the provider reports it. */
  prompt_cache_miss_tokens?: number | undefined;
  /** Sum of prompt and completion tokens. */
  total_tokens: number;
}

/**
 * A tool call in the OpenAI-compatible format. Providers may add the internal
 * `tool_name` and parsed `arguments` fields.
 */
export interface ToolCall {
  /** Identifier that a `tool` message uses to answer this call. */
  id: string;
  /** Call type. Model providers send `function`. */
  type: string;
  /** Function name and raw JSON arguments, as sent by the model. */
  function: {
    /** Name of the tool to call. */
    name: string;
    /** Arguments as a JSON string. */
    arguments: string;
  };
  /** Tool name in the internal format, when the provider adds it. */
  tool_name?: string | undefined;
  /** Parsed arguments, or the raw JSON text while streaming, when the provider adds them. */
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
  /** Stores a message at the end of the history. */
  addMessage(message: Message): void;
  /** Returns a copy of every stored message, oldest first. */
  getMessages(): Message[];
  /** Returns the history prepared for a model request, optionally limited to `maxTokens`. */
  getFormattedMemory(maxTokens?: number): Message[] | string;
  /** Removes every stored message. */
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
  /** Sends the conversation and resolves with the assistant reply, including any tool calls and token usage. */
  chatCompletion(
    messages: Message[],
    options?: ModelProviderOptions
  ): Promise<MessageWithToolCalls>;
  /** Optional. Streams the reply as partial messages: text deltas, tool-call deltas and usage. Without it, `StreamingAgent` falls back to `chatCompletion`. */
  streamChatCompletion?(
    messages: Message[],
    options?: ModelProviderOptions
  ): AsyncGenerator<Partial<MessageWithToolCalls>>;
}

/**
 * Structured agent input.
 */
export interface AgentInput {
  /** Conversation to send. A string input to `run()` becomes one `user` message. */
  messages: Message[];
  /** Attached as `metadata` to every message that has none. */
  context?: Record<string, unknown> | undefined;
}

/**
 * One executed tool call.
 */
export interface ToolCallRecord {
  /** Name of the tool that ran. */
  tool: string;
  /** Parsed arguments passed to the tool. */
  args: Record<string, unknown>;
  /** Value returned by the tool, or `{ error }` when it threw. */
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
