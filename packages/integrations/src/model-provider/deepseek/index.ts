import { Component } from '@astack/core';
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
}

/**
 * 消息角色类型
 */
export type MessageRole = 'system' | 'user' | 'assistant';

/**
 * 对话消息类型
 */
export interface Message {
  role: MessageRole;
  content: string;
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
  
  constructor(config: DeepseekConfig) {
    super({});
    
    // 配置客户端
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL || 'https://api.deepseek.com/v1',
    });
    
    // 保存配置
    this.model = config.model || 'deepseek-chat';
    this.temperature = config.temperature ?? 0.7;
    this.maxTokens = config.maxTokens;
    this.topP = config.topP;
    this.systemPrompt = config.systemPrompt;
    
    // 重命名端口
    Component.Port.I("prompt").attach(this);
    Component.Port.I("messages").attach(this);
    Component.Port.O("completion").attach(this);
    Component.Port.O("message").attach(this);
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
        content: this.systemPrompt
      });
    }
    
    // 添加用户提示
    messages.push({
      role: 'user',
      content: prompt
    });
    
    // 调用 API
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages,
      temperature: this.temperature,
      max_tokens: this.maxTokens,
      top_p: this.topP
    });
    
    return response.choices[0].message.content || '';
  }
  
  /**
   * 处理对话消息
   * @param messages 对话消息数组
   * @returns 生成的响应消息
   */
  async chatCompletion(messages: Message[]): Promise<Message> {
    // 转换消息格式
    const formattedMessages: Array<OpenAI.Chat.ChatCompletionMessageParam> = [];
    
    // 添加系统提示
    if (this.systemPrompt) {
      formattedMessages.push({
        role: 'system',
        content: this.systemPrompt
      });
    }
    
    // 添加用户提供的消息
    formattedMessages.push(...messages.map(msg => ({
      role: msg.role,
      content: msg.content
    })));
    
    // 调用 API
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: formattedMessages,
      temperature: this.temperature,
      max_tokens: this.maxTokens,
      top_p: this.topP
    });
    
    // 返回响应消息
    return {
      role: 'assistant',
      content: response.choices[0].message.content || ''
    };
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
          content: 'API 调用错误'
        });
      }
    });
  }
}

// 默认导出组件
export default Deepseek;
