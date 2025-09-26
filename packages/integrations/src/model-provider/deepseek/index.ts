import { Component } from '@astack-tech/core';
import OpenAI from 'openai';

/**
 * Deepseek 模型提供者配置
 */
export interface DeepseekConfig {
  /**
   * API 密钥
   */
  apiKey: string;

  /**
   * 使用的模型名称
   * 默认为 'deepseek-chat'
   */
  model?: string;

  /**
   * 自定义 API 基础 URL
   * 默认为 Deepseek 官方 API 地址
   */
  baseURL?: string;

  /**
   * 温度参数，控制输出的随机性
   */
  temperature?: number;

  /**
   * 最大生成的 token 数
   */
  maxTokens?: number;

  /**
   * 采样概率
   */
  topP?: number;

  /**
   * 系统提示消息
   */
  systemPrompt?: string;

  /**
   * 工具实例数组，直接传递工具实例
   * 每个工具应具有 name、description 和 parameters 属性
   */
  rawTools?: Array<{
    name: string;
    description: string;
    parameters?: Record<string, unknown>;
  }>;

  /**
   * API 格式的工具定义数组，与 rawTools 二选一
   * 使用 OpenAI 兼容的工具定义格式
   */
  tools?: unknown[];
}

/**
 * 消息角色类型
 */
export type MessageRole = 'system' | 'user' | 'assistant' | 'tool';

/**
 * 工具调用
 */
export interface ToolCall {
  /**
   * 工具调用 ID
   */
  id?: string;

  /**
   * 工具名称
   */
  tool_name: string;

  /**
   * 工具调用参数
   */
  arguments: Record<string, unknown>;
}

/**
 * 对话消息类型
 */
export interface Message {
  /**
   * 消息角色
   */
  role: MessageRole;

  /**
   * 消息内容
   */
  content?: string;

  /**
   * 工具调用
   */
  tool_calls?: ToolCall[];

  /**
   * 工具调用 ID，用于工具响应消息
   */
  tool_call_id?: string;
}

/**
 * Deepseek 组件
 *
 * 使用 OpenAI 兼容接口调用 Deepseek 模型
 *
 * 输入:
 *   - prompt: 文本提示
 *   - messages: 对话消息数组
 *
 * 输出:
 *   - completion: 生成的文本完成
 *   - message: 生成的响应消息
 */
class Deepseek extends Component {
  // OpenAI 客户端实例
  private client: OpenAI;

  // 配置选项
  private model: string;
  private temperature: number;
  private maxTokens?: number;
  private topP?: number;
  private systemPrompt?: string;
  private tools?: unknown[];

  constructor(config: DeepseekConfig) {
    super({});

    // 配置客户端
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL || 'https://api.deepseek.com/v1',
    });

    // 保存基本配置
    this.model = config.model || 'deepseek-chat';
    this.temperature = config.temperature ?? 0.7;
    this.maxTokens = config.maxTokens;
    this.topP = config.topP;
    this.systemPrompt = config.systemPrompt;

    // 处理工具配置，优先使用 rawTools
    if (config.rawTools && config.rawTools.length > 0) {
      // 将工具实例转换为 API 格式
      this.tools = config.rawTools.map(tool => ({
        type: 'function',
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters || {},
        },
      }));
    } else {
      // 使用直接提供的 API 格式工具
      this.tools = config.tools;
    }

    // 重命名端口
    Component.Port.I('prompt').attach(this);
    Component.Port.I('messages').attach(this);
    Component.Port.O('completion').attach(this);
    Component.Port.O('message').attach(this);
  }

  /**
   * 生成文本完成
   * @param prompt 提示文本
   * @returns 生成的文本
   */
  async generateCompletion(prompt: string): Promise<string> {
    const messages: Array<OpenAI.Chat.ChatCompletionMessageParam> = [];

    // 添加系统提示
    if (this.systemPrompt) {
      messages.push({
        role: 'system',
        content: this.systemPrompt,
      });
    }

    // 添加用户提示
    messages.push({
      role: 'user',
      content: prompt,
    });

    // 创建请求参数
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const requestParams: any = {
      model: this.model,
      messages,
      temperature: this.temperature,
      max_tokens: this.maxTokens,
      top_p: this.topP,
    };

    // 如果有工具定义，添加到请求中
    if (this.tools && this.tools.length > 0) {
      requestParams.tools = this.tools;
    }

    // 调用 API
    const response = await this.client.chat.completions.create(requestParams);

    // 处理工具调用结果
    if (
      response.choices[0].message.tool_calls &&
      response.choices[0].message.tool_calls.length > 0
    ) {
      return JSON.stringify(response.choices[0].message);
    }

    return response.choices[0].message.content || '';
  }

  /**
   * 流式处理对话消息
   * @param messages 对话消息数组
   * @param options 可选的调用选项，包含临时工具列表
   * @returns 生成的流式响应消息异步生成器
   */
  async *streamChatCompletion(
    messages: Message[],
    options?: { temporaryTools?: unknown[] }
  ): AsyncGenerator<Partial<Message>> {
    // 转换消息格式 (复用现有逻辑)
    const formattedMessages: Array<OpenAI.Chat.ChatCompletionMessageParam> = [];

    // 添加系统提示
    if (this.systemPrompt) {
      formattedMessages.push({
        role: 'system',
        content: this.systemPrompt,
      });
    }

    // 添加用户提供的消息
    formattedMessages.push(
      ...messages.map(msg => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedMsg: any = {
          role: msg.role,
          content: msg.content,
        };

        if (msg.role === 'tool' && msg.tool_call_id) {
          formattedMsg.tool_call_id = msg.tool_call_id;
        }

        return formattedMsg;
      })
    );

    // 创建请求参数
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const requestParams: any = {
      model: this.model,
      messages: formattedMessages,
      temperature: this.temperature,
      max_tokens: this.maxTokens,
      top_p: this.topP,
      stream: true, // 开启流式模式
    };

    // 决定使用哪些工具
    const toolsToUse = options?.temporaryTools || this.tools;

    // 如果有工具定义，添加到请求中
    if (toolsToUse && toolsToUse.length > 0) {
      const formattedTools = toolsToUse.map(tool => {
        type ToolType = {
          type?: string;
          name?: string;
          description?: string;
          parameters?: Record<string, unknown>;
        };

        const typedTool = tool as ToolType;

        if (typedTool.type === 'function') {
          return tool;
        }

        return {
          type: 'function',
          function: {
            name: typedTool.name,
            description: typedTool.description,
            parameters: typedTool.parameters || {},
          },
        };
      });

      requestParams.tools = formattedTools;
    }

    // 调用流式 API
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stream = (await this.client.chat.completions.create(requestParams)) as any;

    // 处理流式响应
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;

      if (delta?.content) {
        // 流式文本内容
        yield {
          role: 'assistant',
          content: delta.content,
        };
      }

      if (delta?.tool_calls) {
        // 流式工具调用（如果需要）
        yield {
          role: 'assistant',
          content: '',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tool_calls: delta.tool_calls.map((toolCall: any) => ({
            id: toolCall.id || '',
            function: {
              name: toolCall.function?.name || '',
              arguments: toolCall.function?.arguments || '',
            },
            type: 'function',
            tool_name: toolCall.function?.name || '',
            arguments: JSON.parse(toolCall.function?.arguments || '{}'),
          })),
        };
      }
    }
  }

  /**
   * 处理对话消息
   * @param messages 对话消息数组
   * @param options 可选的调用选项，包含临时工具列表
   * @returns 生成的响应消息
   */
  async chatCompletion(
    messages: Message[],
    options?: { temporaryTools?: unknown[] }
  ): Promise<Message> {
    // 转换消息格式
    const formattedMessages: Array<OpenAI.Chat.ChatCompletionMessageParam> = [];

    // 添加系统提示
    if (this.systemPrompt) {
      formattedMessages.push({
        role: 'system',
        content: this.systemPrompt,
      });
    }

    // 添加用户提供的消息
    formattedMessages.push(
      ...messages.map(msg => {
        // 基本消息结构
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedMsg: any = {
          role: msg.role,
          content: msg.content,
        };

        // 如果有工具调用 ID，添加到消息中
        if (msg.role === 'tool' && msg.tool_call_id) {
          formattedMsg.tool_call_id = msg.tool_call_id;
        }

        return formattedMsg;
      })
    );

    // 创建请求参数
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const requestParams: any = {
      model: this.model,
      messages: formattedMessages,
      temperature: this.temperature,
      max_tokens: this.maxTokens,
      top_p: this.topP,
    };

    // 决定使用哪些工具
    // 如果提供了临时工具，优先使用临时工具
    const toolsToUse = options?.temporaryTools || this.tools;

    // 如果有工具定义，添加到请求中
    if (toolsToUse && toolsToUse.length > 0) {
      // 检查工具格式并转换，确保符合 Deepseek API 要求
      const formattedTools = toolsToUse.map(tool => {
        // 使用类型断言来处理 unknown 类型
        type ToolType = {
          type?: string;
          name?: string;
          description?: string;
          parameters?: Record<string, unknown>;
        };

        const typedTool = tool as ToolType;

        // 如果工具已经是 API 格式，直接返回
        if (typedTool.type === 'function') {
          return tool;
        }

        // 如果是简单工具实例，转换为 API 格式
        return {
          type: 'function',
          function: {
            name: typedTool.name,
            description: typedTool.description,
            parameters: typedTool.parameters || {},
          },
        };
      });

      requestParams.tools = formattedTools;
    }

    // 调用 API
    const response = await this.client.chat.completions.create(requestParams);

    // 解析响应
    const responseMessage = response.choices[0].message;

    // 转换为内部消息格式
    const result: Message = {
      role: 'assistant',
      content: responseMessage.content || '',
    };

    // 如果有工具调用，添加到结果中
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      // 为了兼容 Agent 组件期望的格式，保留 function 和 type 字段
      // 同时为了满足内部 ToolCall 接口，也添加 tool_name 和 arguments 字段
      result.tool_calls = responseMessage.tool_calls.map(toolCall => {
        // 解析参数，确保是对象形式
        const args =
          typeof toolCall.function.arguments === 'string'
            ? JSON.parse(toolCall.function.arguments || '{}')
            : toolCall.function.arguments || {};

        return {
          id: toolCall.id,
          // 满足 Agent 组件期望的格式
          function: {
            name: toolCall.function.name,
            arguments: toolCall.function.arguments || '{}',
          },
          type: 'function',
          // 满足内部 ToolCall 接口
          tool_name: toolCall.function.name,
          arguments: args,
        };
      });
    }

    return result;
  }

  /**
   * 在独立模式下运行组件
   * @param input 输入参数，可以是提示文本或对话消息数组
   * @returns 生成的文本或响应消息
   */
  async run(input: string | Message[]): Promise<string | Message> {
    if (typeof input === 'string') {
      return this.generateCompletion(input);
    } else {
      return this.chatCompletion(input);
    }
  }

  /**
   * 在流水线中运行组件
   * @param $i 输入端口
   * @param $o 输出端口
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _transform($i: any, $o: any) {
    // 处理文本提示输入
    $i('prompt').receive(async (prompt: string) => {
      try {
        const completion = await this.generateCompletion(prompt);
        $o('completion').send(completion);
      } catch (error) {
        console.error('Deepseek API 调用错误:', error);
        $o('completion').send('API 调用错误');
      }
    });

    // 处理对话消息输入
    $i('messages').receive(async (messages: Message[]) => {
      try {
        const responseMessage = await this.chatCompletion(messages);
        $o('message').send(responseMessage);
      } catch (error) {
        console.error('Deepseek API 调用错误:', error);
        $o('message').send({
          role: 'assistant',
          content: 'API 调用错误',
        });
      }
    });
  }
}

// 默认导出组件
export default Deepseek;
