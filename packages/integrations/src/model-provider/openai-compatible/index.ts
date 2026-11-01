import { Component } from '@astack-tech/core';
import type { Port } from '@astack-tech/core';
import OpenAI from 'openai';

/**
 * Options for a provider that speaks the OpenAI chat completions API.
 */
export interface OpenAICompatibleConfig {
  /** API key of the provider. */
  apiKey: string;
  /** Model name, for example `gpt-4o-mini`, `qwen-plus` or `llama3.1`. */
  model: string;
  /** API base URL. Defaults to `https://api.openai.com/v1`. */
  baseURL?: string | undefined;
  /** Provider name used in errors and logs. Defaults to `The model API`. */
  name?: string | undefined;
  /** Sampling temperature. Defaults to `0.7`. */
  temperature?: number | undefined;
  /** Maximum number of generated tokens. */
  maxTokens?: number | undefined;
  /** Nucleus sampling probability. */
  topP?: number | undefined;
  /** System prompt added before every request. */
  systemPrompt?: string | undefined;
  /**
   * Tools given as `{ name, description, parameters }` objects.
   * When this list is not empty, it takes precedence over `tools`.
   */
  rawTools?: RawTool[] | undefined;
  /** Tools in the OpenAI-compatible `{ type: 'function', function }` format. */
  tools?: unknown[] | undefined;
  /** Allows the OpenAI client to run in a browser. Defaults to `false`. */
  dangerouslyAllowBrowser?: boolean | undefined;
  /** Logs API errors to the console. Defaults to `false`. */
  verbose?: boolean | undefined;
}

/**
 * Tool description accepted by `rawTools` and `temporaryTools`.
 */
export interface RawTool {
  /** Unique tool name. */
  name: string;
  /** Description that tells the model when to use the tool. */
  description: string;
  /** JSON Schema of the arguments. Defaults to `{}`. */
  parameters?: Record<string, unknown> | undefined;
}

/**
 * Role of a chat message.
 */
export type MessageRole = 'system' | 'user' | 'assistant' | 'tool';

/**
 * Tool call in the internal format.
 */
export interface ToolCall {
  /** Identifier assigned by the API. */
  id?: string | undefined;
  /** Name of the tool. */
  tool_name: string;
  /** Parsed arguments. */
  arguments: Record<string, unknown>;
}

/**
 * Tool call returned by `chatCompletion`. It carries both the OpenAI shape
 * (`type`, `function`) and the internal shape (`tool_name`, `arguments`).
 */
export interface ResponseToolCall {
  /** Identifier assigned by the API. A `tool` message answers the call with it. */
  id: string;
  /** Always `function`. */
  type: 'function';
  /** The call in the OpenAI shape: function name and raw JSON arguments. An empty argument string is sent as `{}`. */
  function: {
    /** Name of the tool to call. */
    name: string;
    /** Arguments as JSON text. */
    arguments: string;
  };
  /** Name of the tool, same as `function.name`. */
  tool_name: string;
  /** Parsed arguments. JSON that is not an object becomes `{}`. */
  arguments: Record<string, unknown>;
}

/**
 * Partial tool call emitted while streaming. `arguments` holds the raw JSON fragment.
 */
export interface StreamToolCall {
  /** Identifier assigned by the API. Only the first delta of a call carries it; later deltas have `''`. */
  id: string;
  /** Always `function`. */
  type: 'function';
  /** The delta in the OpenAI shape. `arguments` holds only this delta's JSON fragment. */
  function: {
    /** Name of the tool to call. */
    name: string;
    /** Arguments as JSON text. */
    arguments: string;
  };
  /** Name of the tool when this delta carries it, otherwise `''`. */
  tool_name: string;
  /** Raw JSON fragment of this delta. Concatenate the fragments of a call to get its arguments. */
  arguments: string;
}

/**
 * Token usage reported by the API.
 */
export interface TokenUsage {
  /** Tokens in the generated reply. */
  completion_tokens: number;
  /** Tokens in the request. */
  prompt_tokens: number;
  /** Prompt tokens served from the provider's context cache (reported by DeepSeek). */
  prompt_cache_hit_tokens?: number | undefined;
  /** Prompt tokens not served from the cache. */
  prompt_cache_miss_tokens?: number | undefined;
  /** Sum of prompt and completion tokens. */
  total_tokens: number;
}

/**
 * Chat message accepted as input. It matches the agent message contract in
 * `@astack-tech/components`, so agent histories can be passed directly.
 */
export interface Message {
  /** One of `system`, `user`, `assistant` or `tool` (see `MessageRole`). */
  role: string;
  /** Text content. Omitted content is sent as no content. */
  content?: string | undefined;
  /** Accepted for compatibility. Assistant tool calls are not forwarded to the API. */
  tool_calls?: readonly unknown[] | undefined;
  /** Identifier of the call that a `tool` message answers. */
  tool_call_id?: string | undefined;
  /** Ignored on input. Present so agent histories can be passed unchanged. */
  usage?: TokenUsage | undefined;
}

/**
 * Assistant message returned by `chatCompletion`.
 */
export interface AssistantMessage {
  /** Always `assistant`. */
  role: 'assistant';
  /** Reply text. Empty when the model only calls tools. */
  content: string;
  /** Tool calls requested by the model, if any. */
  tool_calls?: ResponseToolCall[] | undefined;
  /** Token usage of this request, when the API reports it. */
  usage?: TokenUsage | undefined;
}

/**
 * Chunk yielded by `streamChatCompletion`.
 */
export interface StreamChunk {
  /** Always `assistant`. */
  role: 'assistant';
  /** Text delta. Empty in chunks that carry tool calls or usage. */
  content: string;
  /** Tool-call deltas in this chunk. */
  tool_calls?: StreamToolCall[] | undefined;
  /** Token usage. Sent once, in the final chunk, when the API reports it. */
  usage?: TokenUsage | undefined;
}

/**
 * Per-call options.
 */
export interface ChatCompletionOptions {
  /** Tools for this call only. They replace the configured tools. */
  temporaryTools?: unknown[] | undefined;
}

type ChatMessageParam = OpenAI.Chat.ChatCompletionMessageParam;
type ChatTool = OpenAI.Chat.ChatCompletionTool;

interface ApiUsage {
  completion_tokens?: number;
  prompt_tokens?: number;
  total_tokens?: number;
  prompt_cache_hit_tokens?: number;
  prompt_cache_miss_tokens?: number;
}

const DEFAULT_BASE_URL = 'https://api.openai.com/v1';
const DEFAULT_NAME = 'The model API';
const DEFAULT_TEMPERATURE = 0.7;
const FALLBACK_TEXT = 'API call failed';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Converts a `{ name, description, parameters }` object to the OpenAI tool format.
 * Objects already in the OpenAI format are returned unchanged.
 */
function toApiTool(tool: unknown): ChatTool {
  const raw = isRecord(tool) ? tool : {};
  const definition = raw['function'];
  if (raw['type'] === 'function' && isRecord(definition)) {
    const { name, description, parameters, strict } = definition;
    return {
      type: 'function',
      function: {
        name: typeof name === 'string' ? name : '',
        ...(typeof description === 'string' ? { description } : {}),
        ...(isRecord(parameters) ? { parameters } : {}),
        ...(typeof strict === 'boolean' ? { strict } : {}),
      },
    };
  }
  const { name, description, parameters } = raw;
  return {
    type: 'function',
    function: {
      name: typeof name === 'string' ? name : '',
      description: typeof description === 'string' ? description : '',
      parameters: isRecord(parameters) ? parameters : {},
    },
  };
}

/**
 * Parses tool-call arguments. Anything that is not a JSON object becomes `{}`.
 */
function parseArguments(raw: string): Record<string, unknown> {
  if (raw.trim().length === 0) {
    return {};
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    return isRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function mapUsage(usage: ApiUsage): TokenUsage {
  return {
    completion_tokens: usage.completion_tokens ?? 0,
    prompt_tokens: usage.prompt_tokens ?? 0,
    total_tokens: usage.total_tokens ?? 0,
    ...(usage.prompt_cache_hit_tokens === undefined
      ? {}
      : { prompt_cache_hit_tokens: usage.prompt_cache_hit_tokens }),
    ...(usage.prompt_cache_miss_tokens === undefined
      ? {}
      : { prompt_cache_miss_tokens: usage.prompt_cache_miss_tokens }),
  };
}

/**
 * Model provider for any API that speaks the OpenAI chat completions protocol:
 * OpenAI itself, and the compatible endpoints of DeepSeek, Qwen, Moonshot, Ollama,
 * vLLM and others. Set `baseURL` and `model` for the provider you use.
 *
 * Ports:
 * - `prompt` (in): a text prompt. The answer is sent on `completion`.
 * - `messages` (in): a list of chat messages. The reply is sent on `message`.
 */
class OpenAICompatible extends Component {
  private readonly client: OpenAI;
  private readonly model: string;
  private readonly temperature: number;
  private readonly maxTokens: number | undefined;
  private readonly topP: number | undefined;
  private readonly systemPrompt: string | undefined;
  private readonly tools: unknown[] | undefined;
  private readonly verbose: boolean;
  private readonly name: string;

  constructor(config: OpenAICompatibleConfig) {
    super({});

    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL ?? DEFAULT_BASE_URL,
      dangerouslyAllowBrowser: config.dangerouslyAllowBrowser ?? false,
    });

    this.model = config.model;
    this.name = config.name ?? DEFAULT_NAME;
    this.temperature = config.temperature ?? DEFAULT_TEMPERATURE;
    this.maxTokens = config.maxTokens;
    this.topP = config.topP;
    this.systemPrompt = config.systemPrompt;
    this.verbose = config.verbose ?? false;
    this.tools =
      config.rawTools !== undefined && config.rawTools.length > 0
        ? config.rawTools.map(toApiTool)
        : config.tools;

    Component.Port.I('prompt').attach(this);
    Component.Port.I('messages').attach(this);
    Component.Port.O('completion').attach(this);
    Component.Port.O('message').attach(this);
  }

  /**
   * Generates a completion for a single prompt.
   *
   * @returns The text answer, or the JSON-encoded assistant message when it contains tool calls.
   */
  async generateCompletion(prompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      ...this.baseRequest(),
      messages: [...this.systemMessages(), { role: 'user', content: prompt }],
      ...this.toolsParam(this.tools),
    });

    const message = this.firstMessage(response);
    if (message.tool_calls !== undefined && message.tool_calls.length > 0) {
      return JSON.stringify(message);
    }
    return message.content ?? '';
  }

  /**
   * Sends a conversation and returns the assistant reply.
   */
  async chatCompletion(
    messages: Message[],
    options?: ChatCompletionOptions
  ): Promise<AssistantMessage> {
    const response = await this.client.chat.completions.create({
      ...this.baseRequest(),
      messages: this.formatMessages(messages),
      ...this.toolsParam(options?.temporaryTools ?? this.tools),
    });

    const message = this.firstMessage(response);
    const result: AssistantMessage = { role: 'assistant', content: message.content ?? '' };

    if (response.usage !== undefined) {
      result.usage = mapUsage(response.usage);
    }

    if (message.tool_calls !== undefined && message.tool_calls.length > 0) {
      result.tool_calls = message.tool_calls.map(toolCall => {
        if (toolCall.type !== 'function') {
          throw new Error(`Unsupported tool call type: ${toolCall.type}`);
        }
        const rawArguments = toolCall.function.arguments;
        return {
          id: toolCall.id,
          type: 'function',
          function: {
            name: toolCall.function.name,
            arguments: rawArguments.length > 0 ? rawArguments : '{}',
          },
          tool_name: toolCall.function.name,
          arguments: parseArguments(rawArguments),
        };
      });
    }

    return result;
  }

  /**
   * Streams the assistant reply. Each chunk holds a text delta, tool-call deltas, or usage.
   */
  async *streamChatCompletion(
    messages: Message[],
    options?: ChatCompletionOptions
  ): AsyncGenerator<StreamChunk> {
    const stream = await this.client.chat.completions.create({
      ...this.baseRequest(),
      messages: this.formatMessages(messages),
      ...this.toolsParam(options?.temporaryTools ?? this.tools),
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;

      const text = delta?.content ?? '';
      if (text !== '') {
        yield { role: 'assistant', content: text };
      }

      if (delta?.tool_calls) {
        yield {
          role: 'assistant',
          content: '',
          tool_calls: delta.tool_calls.map(toolCall => {
            const name = toolCall.function?.name ?? '';
            const args = toolCall.function?.arguments ?? '';
            return {
              id: toolCall.id ?? '',
              type: 'function',
              function: { name, arguments: args },
              tool_name: name,
              arguments: args,
            };
          }),
        };
      }

      if (chunk.usage) {
        yield { role: 'assistant', content: '', usage: mapUsage(chunk.usage) };
      }
    }
  }

  /**
   * Runs the model outside a pipeline.
   *
   * @param input - A prompt string or a list of messages.
   */
  override run(input: string | Message[]): Promise<string | AssistantMessage> {
    return typeof input === 'string' ? this.generateCompletion(input) : this.chatCompletion(input);
  }

  /**
   * Connects the `prompt` and `messages` input ports to the model.
   * API errors produce a fallback value so the pipeline keeps flowing.
   */
  override _transform($i: Port, $o: Port): void {
    $i('prompt').receive((prompt: string) => {
      this.generateCompletion(prompt).then(
        completion => {
          $o('completion').send(completion);
        },
        (error: unknown) => {
          this.logError(error);
          $o('completion').send(FALLBACK_TEXT);
        }
      );
    });

    $i('messages').receive((messages: Message[]) => {
      this.chatCompletion(messages).then(
        message => {
          $o('message').send(message);
        },
        (error: unknown) => {
          this.logError(error);
          $o('message').send({ role: 'assistant', content: FALLBACK_TEXT });
        }
      );
    });
  }

  private baseRequest(): {
    model: string;
    temperature: number;
    max_tokens?: number;
    top_p?: number;
  } {
    return {
      model: this.model,
      temperature: this.temperature,
      ...(this.maxTokens === undefined ? {} : { max_tokens: this.maxTokens }),
      ...(this.topP === undefined ? {} : { top_p: this.topP }),
    };
  }

  private toolsParam(tools: unknown[] | undefined): { tools?: ChatTool[] } {
    return tools !== undefined && tools.length > 0 ? { tools: tools.map(toApiTool) } : {};
  }

  private systemMessages(): ChatMessageParam[] {
    return this.systemPrompt === undefined || this.systemPrompt === ''
      ? []
      : [{ role: 'system', content: this.systemPrompt }];
  }

  /**
   * Converts input messages to API messages. Assistant `tool_calls` are not forwarded:
   * agents send tool results back as user messages, and the API rejects assistant tool
   * calls that are not followed by tool messages.
   */
  private formatMessages(messages: Message[]): ChatMessageParam[] {
    return [...this.systemMessages(), ...messages.map(message => this.toApiMessage(message))];
  }

  /**
   * Converts one input message to its API shape.
   *
   * @throws Error when the role is not one of `MessageRole`, or a `tool` message has no
   * `tool_call_id`. The API would reject both.
   */
  private toApiMessage(message: Message): ChatMessageParam {
    const content = message.content ?? '';
    switch (message.role) {
      case 'system':
        return { role: 'system', content };
      case 'user':
        return { role: 'user', content };
      case 'assistant':
        return message.content === undefined
          ? { role: 'assistant' }
          : { role: 'assistant', content: message.content };
      case 'tool':
        if (message.tool_call_id === undefined || message.tool_call_id === '') {
          throw new Error(
            `${this.name}: a tool message needs the tool_call_id of the call it answers.`
          );
        }
        return { role: 'tool', content, tool_call_id: message.tool_call_id };
      default:
        throw new Error(
          `${this.name}: unsupported message role '${message.role}'. Use system, user, assistant or tool.`
        );
    }
  }

  private firstMessage(response: OpenAI.Chat.ChatCompletion): OpenAI.Chat.ChatCompletionMessage {
    const choice = response.choices[0];
    if (choice === undefined) {
      throw new Error(`${this.name} returned no choices.`);
    }
    return choice.message;
  }

  private logError(error: unknown): void {
    if (this.verbose) {
      // eslint-disable-next-line no-console -- opt-in diagnostics controlled by `verbose`.
      console.error(`[${this.name}] API call failed:`, error);
    }
  }
}

export default OpenAICompatible;
