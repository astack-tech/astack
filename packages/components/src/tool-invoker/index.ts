import { Component } from '@astack/core';
import { Tool, ToolCall, ToolCallResult, ToolSet } from '@astack/tools';

/**
 * 消息角色类型
 */
export type MessageRole = 'system' | 'user' | 'assistant' | 'tool';

/**
 * 消息接口
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
   * 工具调用 ID
   */
  tool_call_id?: string;

  /**
   * 消息元数据
   */
  meta?: Record<string, unknown>;
}

/**
 * 工具调用器配置
 */
export interface ToolInvokerConfig {
  /**
   * 可用工具集合或数组
   */
  tools: Tool[] | ToolSet;

  /**
   * 是否启用详细日志
   */
  verbose?: boolean;

  /**
   * 是否并行执行工具调用
   */
  parallel?: boolean;

  /**
   * 工具调用超时时间(毫秒)
   */
  timeout?: number;
}

/**
 * 工具调用器输入
 */
export interface ToolInvokerInput {
  /**
   * 消息数组
   */
  messages: Message[];
}

/**
 * 工具调用器输出
 */
export interface ToolInvokerOutput {
  /**
   * 工具消息结果
   */
  tool_messages: Message[];
}

/**
 * 工具调用器组件
 *
 * 根据消息中的工具调用，执行相应的工具并返回结果
 */
export class ToolInvoker extends Component {
  private tools: Map<string, Tool>;
  private verbose: boolean;
  private parallel: boolean;
  private timeout: number;

  /**
   * 创建工具调用器组件
   * @param config 配置参数
   */
  constructor(config: ToolInvokerConfig) {
    super({});

    // 初始化工具映射
    this.tools = new Map();

    // 处理工具集合或数组
    if (Array.isArray(config.tools)) {
      config.tools.forEach(tool => {
        this.tools.set(tool.name, tool);
      });
    } else {
      config.tools.getTools().forEach(tool => {
        this.tools.set(tool.name, tool);
      });
    }

    this.verbose = config.verbose || false;
    this.parallel = config.parallel || false;
    this.timeout = config.timeout || 30000; // 默认 30 秒超时

    // 配置端口
    Component.Port.I('in').attach(this);
    Component.Port.O('out').attach(this);

    if (this.verbose) {
      console.log(`[ToolInvoker] 已初始化，工具数量: ${this.tools.size}`);
    }
  }

  /**
   * 查找可用工具
   * @param name 工具名称
   * @returns 工具实例
   */
  private findTool(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  /**
   * 执行单个工具调用
   * @param toolCall 工具调用信息
   * @returns 工具调用结果
   */
  private async executeToolCall(toolCall: ToolCall): Promise<ToolCallResult> {
    const { tool_name, arguments: args } = toolCall;

    if (this.verbose) {
      console.log(`[ToolInvoker] 执行工具调用: ${tool_name}`);
    }

    // 查找工具
    const tool = this.findTool(tool_name);
    if (!tool) {
      throw new Error(`找不到工具: ${tool_name}`);
    }

    try {
      // 执行工具，并设置超时
      const result = await Promise.race([
        tool.invoke(args),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`工具执行超时: ${tool_name}`)), this.timeout)
        ),
      ]);

      if (this.verbose) {
        console.log(`[ToolInvoker] 工具 ${tool_name} 执行成功`);
      }

      return {
        result,
        origin: toolCall,
      };
    } catch (error) {
      const errorMessage = `工具 ${tool_name} 执行失败: ${error instanceof Error ? error.message : '未知错误'}`;
      console.error(`[ToolInvoker] ${errorMessage}`);

      return {
        result: errorMessage,
        origin: toolCall,
      };
    }
  }

  /**
   * 处理消息中的工具调用
   * @param messages 消息数组
   * @returns 工具结果消息数组
   */
  private async processToolCalls(messages: Message[]): Promise<Message[]> {
    const toolMessages: Message[] = [];

    // 从所有消息中提取工具调用
    const toolCalls: ToolCall[] = [];

    for (const message of messages) {
      if (message.tool_calls && message.tool_calls.length > 0) {
        toolCalls.push(...message.tool_calls);
      }
    }

    if (toolCalls.length === 0) {
      if (this.verbose) {
        console.log(`[ToolInvoker] 没有找到工具调用`);
      }
      return toolMessages;
    }

    if (this.verbose) {
      console.log(`[ToolInvoker] 找到 ${toolCalls.length} 个工具调用`);
    }

    // 执行工具调用
    let results: ToolCallResult[];

    if (this.parallel) {
      // 并行执行
      const promises = toolCalls.map(call => this.executeToolCall(call));
      results = await Promise.all(promises);
    } else {
      // 串行执行
      results = [];
      for (const call of toolCalls) {
        const result = await this.executeToolCall(call);
        results.push(result);
      }
    }

    // 转换结果为工具消息
    for (const result of results) {
      const toolMessage: Message = {
        role: 'tool',
        content: JSON.stringify(result.result),
        tool_call_id: result.origin?.id,
      };

      toolMessages.push(toolMessage);
    }

    return toolMessages;
  }

  /**
   * 独立运行组件
   * @param input 输入参数
   * @returns 输出结果
   */
  async run(input: ToolInvokerInput): Promise<ToolInvokerOutput> {
    if (this.verbose) {
      console.log(`[ToolInvoker] 开始处理消息，消息数量: ${input.messages.length}`);
    }

    const tool_messages = await this.processToolCalls(input.messages);

    return { tool_messages };
  }

  /**
   * 在流水线中运行组件
   * @param $i 输入端口
   * @param $o 输出端口
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _transform($i: any, $o: any): void {
    $i('in').receive(async (input: ToolInvokerInput) => {
      try {
        const output = await this.run(input);
        $o('out').send(output);
      } catch (error) {
        console.error(
          `[ToolInvoker] 处理消息失败: ${error instanceof Error ? error.message : String(error)}`
        );
        $o('out').send({ tool_messages: [] });
      }
    });
  }
}

export default ToolInvoker;
