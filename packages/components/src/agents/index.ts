import { Component } from '@astack/core';

/**
 * Message 接口定义了 Agent 内部的消息格式
 */
export interface Message {
  /**
   * 消息的角色，如 system、user、assistant、tool 等
   */
  role: string;

  /**
   * 消息的内容
   */
  content: string;

  /**
   * 工具调用信息，当 role 为 assistant 且调用工具时使用
   */
  tool_calls?: Array<{
    id: string;
    type: string;
    function: {
      name: string;
      arguments: string;
    };
  }>;

  /**
   * 当消息是工具响应时，表示对应的工具调用 ID
   */
  tool_call_id?: string;

  /**
   * 消息的附加元数据
   */
  metadata?: Record<string, any>;
}

/**
 * 统一工具接口，兼容不同来源的工具
 */
export interface Tool {
  /**
   * 工具的唯一名称
   */
  name: string;

  /**
   * 工具的描述，用于生成系统提示
   */
  description: string;

  /**
   * 工具的参数定义，JSON Schema 格式
   */
  parameters?: Record<string, any>;
}

/**
 * Memory 接口定义了 Agent 的记忆系统
 */
export interface Memory {
  /**
   * 添加消息到记忆
   * @param message 要添加的消息
   */
  addMessage(message: Message): void;

  /**
   * 获取所有记忆中的消息
   * @returns 记忆中的所有消息
   */
  getMessages(): Message[];

  /**
   * 获取格式化后的记忆，用于提供给模型
   * @param maxTokens 最大令牌数限制
   * @returns 格式化后的记忆字符串或消息数组
   */
  getFormattedMemory(maxTokens?: number): Message[] | string;

  /**
   * 清空记忆
   */
  clear(): void;
}

/**
 * 默认内存实现，简单存储消息历史
 */
export class DefaultMemory implements Memory {
  private messages: Message[] = [];

  /**
   * 添加消息到记忆
   * @param message 要添加的消息
   */
  addMessage(message: Message): void {
    this.messages.push(message);
  }

  /**
   * 获取所有记忆中的消息
   * @returns 记忆中的所有消息
   */
  getMessages(): Message[] {
    return [...this.messages];
  }

  /**
   * 获取格式化后的记忆，用于提供给模型
   * @param maxTokens 最大令牌数限制
   * @returns 记忆中的所有消息
   */
  getFormattedMemory(maxTokens?: number): Message[] {
    return this.getMessages();
  }

  /**
   * 清空记忆
   */
  clear(): void {
    this.messages = [];
  }
}

/**
 * 通用模型提供者接口，兼容各种大模型组件
 */
export interface ModelProvider {
  /**
   * 调用模型生成回复
   * @param messages 输入消息列表
   * @returns 生成的回复消息
   */
  chatCompletion(messages: any[]): Promise<any>;
}

/**
 * Agent 输入接口
 */
export interface AgentInput {
  /**
   * 消息列表
   */
  messages: Message[];

  /**
   * 可选的上下文信息
   */
  context?: Record<string, any>;
}

/**
 * Agent 输出接口
 */
export interface AgentOutput {
  /**
   * 回复消息
   */
  message: string;

  /**
   * 思考过程
   */
  thinking?: string;

  /**
   * 工具调用记录
   */
  toolCalls?: Array<{
    tool: string;
    args: Record<string, any>;
    result: any;
  }>;

  /**
   * 完整的消息历史
   */
  history: Message[];
}

/**
 * Agent 配置接口
 */
export interface AgentConfig {
  /**
   * 模型提供者，可以直接传入 Deepseek 等模型组件
   */
  model: ModelProvider;

  /**
   * 可用工具列表，可以直接传入各种工具
   */
  tools?: Tool[];

  /**
   * 系统提示
   */
  systemPrompt?: string;

  /**
   * 记忆系统实例，不提供则使用默认记忆系统
   */
  memory?: Memory;

  /**
   * 最大思考轮次，防止无限循环
   */
  maxIterations?: number;

  /**
   * 是否在控制台输出详细日志
   */
  verbose?: boolean;

  /**
   * 是否支持工具调用
   */
  supportsToolCalls?: boolean;
}

/**
 * Agent 组件，利用大模型能力的智能代理
 */
export class Agent extends Component {
  /**
   * 模型提供者
   */
  private model: ModelProvider;

  /**
   * 可用工具列表
   */
  private tools: Tool[];

  /**
   * 系统提示
   */
  private systemPrompt: string;

  /**
   * 记忆系统
   */
  private memory: Memory;

  /**
   * 最大思考轮次
   */
  private maxIterations: number;

  /**
   * 是否输出详细日志
   */
  private verbose: boolean;

  /**
   * 当前思考轮次
   */
  private currentIteration: number = 0;

  /**
   * 是否支持工具调用
   */
  private supportsToolCalls: boolean;

  /**
   * 创建 Agent 实例
   * @param config Agent 配置
   */
  constructor(config: AgentConfig) {
    super({});

    // 初始化输入和输出端口
    Component.Port.I('in').attach(this);
    Component.Port.O('out').attach(this);

    // 初始化属性
    this.model = config.model;
    this.tools = config.tools || [];
    this.systemPrompt = config.systemPrompt || '你是一个智能助手';
    this.memory = config.memory || new DefaultMemory();
    this.maxIterations = config.maxIterations || 10;
    this.verbose = config.verbose || false;
    this.supportsToolCalls = config.supportsToolCalls !== false; // 默认为 true

    // 初始化记忆
    this.initializeMemory();
  }

  /**
   * 初始化记忆系统，添加系统提示
   */
  private initializeMemory(): void {
    this.memory.clear();

    // 添加系统提示消息
    if (this.systemPrompt) {
      this.memory.addMessage({
        role: 'system',
        content: this.buildSystemPrompt(),
      });
    }
  }

  /**
   * 构建系统提示，包括工具描述
   * @returns 完整的系统提示
   */
  private buildSystemPrompt(): string {
    let prompt = this.systemPrompt;

    // 如果有工具，添加工具描述
    if (this.tools.length > 0) {
      prompt += '\n\n可用工具：\n';

      this.tools.forEach((tool, index) => {
        prompt += `${index + 1}. ${tool.name} - ${tool.description}\n`;

        // 添加参数描述
        if (tool.parameters) {
          try {
            const params = tool.parameters;
            if (params.properties) {
              prompt += '   参数：\n';
              for (const [name, param] of Object.entries(params.properties)) {
                const paramDesc = (param as any).description || '';
                prompt += `   - ${name}: ${paramDesc}\n`;
              }
            }
          } catch (error) {
            // 忽略参数解析错误
          }
        }
      });
    }

    return prompt;
  }

  /**
   * 单轮对话
   * @param messages 消息历史
   * @returns 最终的 Agent 输出
   */
  private async singleRoundWithTools(messages: Message[]): Promise<AgentOutput> {
    try {
      // 1. 初始化变量并创建需要返回的记录
      const toolCalls: Array<{
        tool: string;
        args: Record<string, any>;
        result: any;
      }> = [];

      // 2. 第一次调用模型获取前端解析和工具调用
      console.log("[Agent Debug] 发送消息给模型:", JSON.stringify(messages, null, 2));
      const initialResponse = await this.model.chatCompletion(messages);
      let assistantMessage = initialResponse;
      console.log("[Agent Debug] 收到模型回复:", JSON.stringify(initialResponse, null, 2));

      // 3. 如果存在工具调用，我们需要处理它们
      if (initialResponse.tool_calls && initialResponse.tool_calls.length > 0) {
        // 执行所有工具调用并收集工具反馈内容，但不生成工具响应消息
        console.log(`[Agent Debug] 工具调用数量: ${initialResponse.tool_calls.length}`);

        // 构建工具调用结果字符串
        let toolResultsText = "";

        for (const call of initialResponse.tool_calls) {
          // 解析工具信息
          const toolName = call.tool_name ||
            (call.function && call.function.name) ||
            "unknown";

          // 查找工具
          const tool = this.tools.find(t => t.name === toolName);
          if (!tool) {
            toolResultsText += `\n\n[${toolName}] Error: 找不到工具`;
            continue;
          }

          // 解析参数
          let args: Record<string, any> = {};
          try {
            if (call.function && call.function.arguments) {
              args = typeof call.function.arguments === 'string'
                ? JSON.parse(call.function.arguments)
                : call.function.arguments;
            } else if (call.arguments) {
              args = typeof call.arguments === 'string'
                ? JSON.parse(call.arguments)
                : call.arguments;
            }

            console.log(`[Agent Debug] 工具 ${toolName} 的参数:`, args);
          } catch (error) {
            toolResultsText += `\n\n[${toolName}] Error: 参数解析失败 - ${error}`;
            continue;
          }

          // 执行工具
          try {
            let result;
            if (typeof (tool as any).execute === 'function') {
              console.log(`[Agent Debug] 使用 execute 方法执行工具 ${toolName}`);
              result = await (tool as any).execute(args);
            } else if (typeof (tool as any).invoke === 'function') {
              console.log(`[Agent Debug] 使用 invoke 方法执行工具 ${toolName}`);
              result = await (tool as any).invoke(args);
            } else {
              toolResultsText += `\n\n[${toolName}] Error: 工具没有可执行的方法`;
              continue;
            }

            // 格式化工具结果
            const resultStr = typeof result === 'string' ? result : JSON.stringify(result || {});
            toolResultsText += `\n\n[${toolName}] 结果: ${resultStr}`;

            // 记录工具调用
            toolCalls.push({
              tool: toolName,
              args,
              result
            });

            console.log(`[Agent Debug] 工具 ${toolName} 执行结果:`, result);
          } catch (error: any) {
            toolResultsText += `\n\n[${toolName}] Error: 工具执行失败 - ${error.message || error}`;

            // 记录失败的工具调用
            toolCalls.push({
              tool: toolName,
              args,
              result: { error: error.message || '工具执行失败' }
            });
          }
        }

        // 4. 使用一体化方法生成第二轮提示，包含工具执行结果
        const secondRoundMessages = [...messages]; // 复制原始消息

        // 添加助手消息，包含工具调用内容
        secondRoundMessages.push({
          role: "assistant",
          content: initialResponse.content || ""
        });

        // 添加用户消息，包含工具结果
        secondRoundMessages.push({
          role: "user",
          content: `以下是工具调用的结果，请基于这些结果继续回答我的问题:${toolResultsText}`
        });

        // 5. 再次调用模型获取最终回复
        console.log("[Agent Debug] 发送第二轮消息，包含工具结果:", JSON.stringify(secondRoundMessages, null, 2));
        const finalResponse = await this.model.chatCompletion(secondRoundMessages);
        console.log("[Agent Debug] 收到最终回复:", JSON.stringify(finalResponse, null, 2));

        // 更新助手消息
        assistantMessage = finalResponse;
      }

      // 使用当前的助手消息作为最终回复
      const lastUserMessage = messages.filter(m => m.role === 'user').pop();

      return {
        message: assistantMessage.content || '',
        thinking: toolCalls.length > 0 ? `执行了${toolCalls.length}个工具调用` : '',
        toolCalls,
        history: [...messages, assistantMessage]
      };
    } catch (error: any) {
      console.error('[Agent Debug] 处理过程中出错:', error);
      throw error;
    }
  }

  /**
   * 组件独立运行方法
   * @param input 用户输入或 AgentInput 对象
   * @returns Agent 输出
   */
  async run(input: string | AgentInput): Promise<AgentOutput> {
    // 重置记忆
    this.initializeMemory();

    // 将字符串输入转换为 AgentInput 格式
    const agentInput: AgentInput = typeof input === 'string'
      ? { messages: [{ role: 'user', content: input }] }
      : input;

    // 构建初始消息列表
    const initialMessages: Message[] = [
      // 系统消息
      { role: 'system', content: this.buildSystemPrompt() }
    ];

    // 添加用户消息
    for (const message of agentInput.messages) {
      initialMessages.push({
        ...message,
        metadata: message.metadata || agentInput.context
      });
    }

    console.log("[Agent Debug] 工具列表:");
    this.tools.forEach((tool, index) => {
      console.log(`  ${index + 1}. ${tool.name} - ${tool.description}`);
    });

    // 执行单轮对话处理
    return this.singleRoundWithTools(initialMessages);
  }

  /**
   * 在流水线中运行组件
   * @param $i 输入端口
   * @param $o 输出端口
   */
  _transform($i: any, $o: any): void {
    // 监听输入端口
    $i('in').receive(async (input: string | AgentInput) => {
      try {
        if (this.verbose) {
          if (typeof input === 'string') {
            console.log(`[Agent] 收到输入:`, input);
          } else {
            const firstMsg = input.messages && input.messages.length > 0 ? input.messages[0].content : '[空消息]';
            console.log(`[Agent] 收到输入:`, firstMsg);
          }
        }

        // 运行 Agent
        const output = await this.run(input);

        // 发送输出
        $o('out').send(output);

        if (this.verbose) {
          console.log(`[Agent] 生成的输出:`, output.message);
        }
      } catch (error: any) {
        console.error('[Agent] 执行过程中出错:', error);

        // 发送错误输出
        $o('out').send({
          message: `处理您的请求时出错: ${error.message || '未知错误'}`,
          history: [],
          error: error.message || '未知错误'
        });
      }
    });
  }

  /**
   * 重置 Agent 状态
   * 清空记忆，重新初始化系统提示
   */
  reset(): void {
    this.currentIteration = 0;
    this.initializeMemory();
  }
}

export default Agent;
