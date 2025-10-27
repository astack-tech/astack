import { Component } from '@astack-tech/core';
import {
  Agent,
  AgentConfig,
  AgentInput,
  AgentOutput,
  Message,
  MessageWithToolCalls,
} from './index';

/**
 * 流式输出块的类型定义
 */
export interface StreamingChunk {
  /**
   * 流式输出的类型
   */
  type:
    | 'iteration_start'
    | 'model_thinking'
    | 'assistant_message'
    | 'tool_start'
    | 'tool_result'
    | 'completed'
    | 'error';

  /**
   * 迭代轮次（当 type 为 iteration_start 时）
   */
  iteration?: number;

  /**
   * 助手消息内容（当 type 为 assistant_message 时）
   */
  content?: string;

  /**
   * 工具调用信息（当 type 为 assistant_message 时）
   */
  toolCalls?: Array<{
    id: string;
    type: string;
    function: {
      name: string;
      arguments: string;
    };
  }>;

  /**
   * 工具名称（当 type 为 tool_start 或 tool_result 时）
   */
  toolName?: string;

  /**
   * 工具执行结果（当 type 为 tool_result 时）
   */
  result?: unknown;

  /**
   * 最终消息（当 type 为 completed 时）
   */
  finalMessage?: string;

  /**
   * 完整历史（当 type 为 completed 时）
   */
  history?: Message[];

  /**
   * 所有工具调用记录（当 type 为 completed 时）
   */
  allToolCalls?: Array<{
    tool: string;
    args: Record<string, unknown>;
    result: unknown;
  }>;

  /**
   * 错误信息（当 type 为 error 时）
   */
  error?: string;

  /**
   * Token 使用统计信息（当 type 为 completed 时）
   */
  usage?: {
    completion_tokens: number;
    prompt_tokens: number;
    prompt_cache_hit_tokens?: number;
    prompt_cache_miss_tokens?: number;
    total_tokens: number;
  };
}

/**
 * StreamingAgent - 基于原 Agent 的流式版本
 * 保持与原 Agent 完全一致的功能，只增加流式输出特性
 */
export class StreamingAgent extends Component {
  /**
   * 内部 Agent 实例，复用所有原有功能
   */
  private agent: Agent;

  constructor(config: AgentConfig) {
    super(config);

    // 创建内部 Agent 实例，完全复用原有逻辑
    this.agent = new Agent(config);
  }

  /**
   * 流式执行 Agent，保持与原 Agent.run() 相同的输入输出接口
   */
  async *runStream(input: string | AgentInput): AsyncGenerator<StreamingChunk, AgentOutput> {
    try {
      // 标准化输入，与原 Agent 保持一致
      const standardizedInput: AgentInput =
        typeof input === 'string'
          ? { messages: [{ role: 'user', content: input }] }
          : {
              messages: input.messages,
              context: input.context,
            };

      // 重置内部 Agent，确保记忆与迭代计数一致
      this.agent.reset();

      const agentInternals = this.agent as unknown as {
        buildSystemPrompt: () => string;
        tools: unknown[];
        verbose?: boolean;
      };

      const systemPrompt = agentInternals.buildSystemPrompt();
      const context = standardizedInput.context;

      const initialMessages: Message[] = [
        {
          role: 'system',
          content: systemPrompt,
        },
      ];

      for (const message of standardizedInput.messages) {
        initialMessages.push({
          ...message,
          metadata: message.metadata ?? context,
        });
      }

      if (agentInternals.verbose) {
        console.log('[StreamingAgent Debug] 工具列表:');
        agentInternals.tools.forEach((tool, index) => {
          console.log(`  ${index + 1}. ${(tool as { name?: string }).name ?? 'unknown'}`);
        });
      }

      // 执行流式处理
      let finalOutput: AgentOutput | null = null;

      for await (const chunk of this.executeWithToolsStream(initialMessages)) {
        if (chunk.type === 'completed') {
          // 构造与原 Agent 完全一致的输出格式
          finalOutput = {
            message: chunk.finalMessage || '',
            history: chunk.history || [],
            toolCalls: chunk.allToolCalls || [],
          };
        }
        yield chunk;
      }

      // 返回最终结果，与原 Agent.run() 保持一致
      return (
        finalOutput || {
          message: '',
          history: [],
          toolCalls: [],
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      // 发送错误流式输出
      yield {
        type: 'error',
        error: errorMessage,
      };

      // 抛出错误，与原 Agent 保持一致
      throw error;
    }
  }

  /**
   * 保持原 Agent 的 run 方法兼容性
   */
  async run(input: string | AgentInput): Promise<AgentOutput> {
    // 通过流式处理获取最终结果
    let finalResult: AgentOutput | null = null;

    for await (const chunk of this.runStream(input)) {
      if (chunk.type === 'completed') {
        finalResult = {
          message: chunk.finalMessage || '',
          history: chunk.history || [],
          toolCalls: chunk.allToolCalls || [],
        };
      }
    }

    return finalResult || { message: '', history: [], toolCalls: [] };
  }

  /**
   * 流式版本的 executeWithTools，完全基于原 Agent 逻辑
   */
  private async *executeWithToolsStream(messages: Message[]): AsyncGenerator<StreamingChunk> {
    try {
      // 使用 Agent 的内部属性，保持完全一致的行为
      const toolCalls: Array<{
        tool: string;
        args: Record<string, unknown>;
        result: unknown;
      }> = [];
      const currentMessages = [...messages];
      let iteration = 0;
      let lastAssistantMessage: MessageWithToolCalls | null = null;
      let hasMoreToolsToCall = true;
      let capturedUsage: StreamingChunk['usage'] | undefined;

      // 获取 Agent 的配置（通过反射访问私有属性）
      const maxIterations =
        (this.agent as unknown as { maxIterations?: number }).maxIterations || 3;
      const tools = (this.agent as unknown as { tools?: unknown[] }).tools || [];
      const model = (
        this.agent as unknown as {
          model: {
            chatCompletion: (...args: unknown[]) => Promise<unknown>;
            streamChatCompletion: (
              messages: Message[],
              options?: { temporaryTools?: unknown[] }
            ) => AsyncGenerator<Partial<MessageWithToolCalls>>;
          };
        }
      ).model;
      const verbose = (this.agent as unknown as { verbose?: boolean }).verbose || false;

      // 开始迭代循环，与原 Agent 逻辑完全一致
      while (hasMoreToolsToCall && iteration < maxIterations) {
        iteration++;

        // 流式输出：迭代开始
        yield {
          type: 'iteration_start',
          iteration,
        };

        if (verbose) {
          console.log(`\\n[StreamingAgent Debug] === 迭代 ${iteration}/${maxIterations} ===`);
          console.log(
            '[StreamingAgent Debug] 发送消息给模型:',
            JSON.stringify(currentMessages, null, 2)
          );
        }

        // 流式输出：模型思考中
        yield {
          type: 'model_thinking',
        };

        // 调用模型获取流式回复（真正的SSE流式）
        const streamGenerator = model.streamChatCompletion(currentMessages, {
          temporaryTools: tools,
        });

        let accumulatedContent = '';
        const toolCallBuffer = new Map<
          string,
          {
            id: string;
            type: string;
            function: {
              name: string;
              arguments: string;
            };
          }
        >();
        let lastToolCallKey: string | null = null;
        let finalToolCalls: MessageWithToolCalls['tool_calls'] = [];
        const modelResponse: MessageWithToolCalls = {
          role: 'assistant',
          content: '',
          tool_calls: [],
        };

        // 处理真正的流式响应
        for await (const chunk of streamGenerator) {
          if (chunk.content) {
            accumulatedContent += chunk.content;
            modelResponse.content = accumulatedContent;

            if (verbose) {
              console.log('[StreamingAgent Debug] 收到流式chunk:', chunk.content);
            }

            // 实时流式输出每个 content chunk
            yield {
              type: 'assistant_message',
              content: accumulatedContent,
              toolCalls: finalToolCalls,
            };
          }

          // 处理工具调用（通常在流式结束时到达）
          if (chunk.tool_calls) {
            chunk.tool_calls.forEach((partialCall, index) => {
              if (verbose) {
                console.log('[StreamingAgent Debug] tool_call delta:', partialCall);
              }

              const rawId = partialCall.id && partialCall.id.length > 0 ? partialCall.id : null;
              let key: string;

              if (rawId) {
                key = rawId;
                if (
                  lastToolCallKey &&
                  lastToolCallKey !== key &&
                  toolCallBuffer.has(lastToolCallKey)
                ) {
                  const previous = toolCallBuffer.get(lastToolCallKey)!;
                  toolCallBuffer.delete(lastToolCallKey);
                  previous.id = key;
                  toolCallBuffer.set(key, previous);
                }
                lastToolCallKey = key;
              } else {
                key = lastToolCallKey ?? `index-${index}`;
                if (!lastToolCallKey) {
                  lastToolCallKey = key;
                }
              }

              const existing = toolCallBuffer.get(key) || {
                id: rawId || key,
                type: partialCall.type || 'function',
                function: {
                  name: '',
                  arguments: '',
                },
              };

              if (partialCall.function?.name) {
                existing.function.name = partialCall.function.name;
              }
              if (partialCall.function?.arguments) {
                existing.function.arguments += partialCall.function.arguments;
              }

              if (partialCall.type) {
                existing.type = partialCall.type;
              }

              if (!existing.id) {
                existing.id = rawId || key;
              }

              toolCallBuffer.set(key, existing);
            });

            finalToolCalls = Array.from(toolCallBuffer.values()).map(call => ({
              id: call.id || call.function.name || '',
              type: call.type,
              function: {
                name: call.function.name,
                arguments: call.function.arguments,
              },
              tool_name: call.function.name,
              arguments: call.function.arguments,
            }));
            if (verbose) {
              console.log('[StreamingAgent Debug] 累计工具调用:', finalToolCalls);
            }
            modelResponse.tool_calls = finalToolCalls;
          }

          // 捕获 token 使用统计信息
          const chunkWithUsage = chunk as Partial<MessageWithToolCalls> & {
            usage?: StreamingChunk['usage'];
          };
          if (chunkWithUsage.usage) {
            capturedUsage = {
              completion_tokens: chunkWithUsage.usage.completion_tokens || 0,
              prompt_tokens: chunkWithUsage.usage.prompt_tokens || 0,
              prompt_cache_hit_tokens: chunkWithUsage.usage.prompt_cache_hit_tokens,
              prompt_cache_miss_tokens: chunkWithUsage.usage.prompt_cache_miss_tokens,
              total_tokens: chunkWithUsage.usage.total_tokens || 0,
            };
            if (verbose) {
              console.log('[StreamingAgent Debug] 捕获到 usage 信息:', capturedUsage);
            }
          }
        }

        if (verbose) {
          console.log(
            '[StreamingAgent Debug] 流式完成，最终回复:',
            JSON.stringify(modelResponse, null, 2)
          );
        }

        // 保存模型回复作为最后的助手消息
        lastAssistantMessage = modelResponse;

        // 检查是否有工具调用（与原 Agent 逻辑一致）
        if (!modelResponse.tool_calls || modelResponse.tool_calls.length === 0) {
          if (verbose) {
            console.log('[StreamingAgent Debug] 模型没有请求更多工具调用，完成迭代');
          }
          hasMoreToolsToCall = false;
          break;
        }

        // 处理工具调用（与原 Agent 完全一致的逻辑）
        if (verbose) {
          console.log(`[StreamingAgent Debug] 工具调用数量: ${modelResponse.tool_calls.length}`);
        }
        let toolResultsText = '';

        // 遍历所有工具调用
        for (const call of modelResponse.tool_calls) {
          const toolName = call.function?.name || 'unknown';

          // 流式输出：工具开始执行
          yield {
            type: 'tool_start',
            toolName,
          };

          // 查找工具（与原 Agent 逻辑一致）
          const tool = tools.find((t: unknown) => (t as { name?: string }).name === toolName);
          if (!tool) {
            const errorMsg = `找不到工具: ${toolName}`;
            toolResultsText += `\\n\\n[${toolName}] Error: ${errorMsg}`;

            yield {
              type: 'tool_result',
              toolName,
              result: { error: errorMsg },
            };
            continue;
          }

          // 解析参数（与原 Agent 逻辑一致）
          let args: Record<string, unknown> = {};
          try {
            if (call.function && call.function.arguments) {
              args =
                typeof call.function.arguments === 'string'
                  ? JSON.parse(call.function.arguments)
                  : {};
            }

            if (verbose) {
              console.log(`[StreamingAgent Debug] 工具 ${toolName} 的参数:`, args);
            }
          } catch (error) {
            const errorMsg = `参数解析失败 - ${error}`;
            toolResultsText += `\\n\\n[${toolName}] Error: ${errorMsg}`;

            yield {
              type: 'tool_result',
              toolName,
              result: { error: errorMsg },
            };
            continue;
          }

          // 执行工具（与原 Agent 逻辑完全一致）
          try {
            let result;
            if (
              typeof tool === 'object' &&
              tool !== null &&
              'execute' in tool &&
              typeof tool.execute === 'function'
            ) {
              if (verbose) {
                console.log(`[StreamingAgent Debug] 使用 execute 方法执行工具 ${toolName}`);
              }
              result = await tool.execute(args);
            } else if (
              typeof tool === 'object' &&
              tool !== null &&
              'invoke' in tool &&
              typeof tool.invoke === 'function'
            ) {
              if (verbose) {
                console.log(`[StreamingAgent Debug] 使用 invoke 方法执行工具 ${toolName}`);
              }
              result = await tool.invoke(args);
            } else {
              const errorMsg = '工具没有可执行的方法';
              toolResultsText += `\\n\\n[${toolName}] Error: ${errorMsg}`;

              yield {
                type: 'tool_result',
                toolName,
                result: { error: errorMsg },
              };
              continue;
            }

            // 格式化工具结果
            const resultStr = typeof result === 'string' ? result : JSON.stringify(result || {});
            toolResultsText += `\\n\\n[${toolName}] 结果: ${resultStr}`;

            // 记录工具调用
            toolCalls.push({
              tool: toolName,
              args,
              result,
            });

            // 流式输出：工具执行结果
            yield {
              type: 'tool_result',
              toolName,
              result,
            };

            if (verbose) {
              console.log(`[StreamingAgent Debug] 工具 ${toolName} 执行结果:`, result);
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            toolResultsText += `\\n\\n[${toolName}] Error: 工具执行失败 - ${errorMessage}`;

            // 记录失败的工具调用
            toolCalls.push({
              tool: toolName,
              args,
              result: { error: errorMessage },
            });

            // 流式输出：工具执行错误
            yield {
              type: 'tool_result',
              toolName,
              result: { error: errorMessage },
            };
          }
        }

        // 更新消息历史（与原 Agent 逻辑完全一致）
        currentMessages.push({
          role: 'assistant',
          content: modelResponse.content || '',
          tool_calls: modelResponse.tool_calls,
        });

        currentMessages.push({
          role: 'user',
          content: `以下是工具调用的结果，请基于这些结果继续:${toolResultsText}`,
        });
      }

      // 如果达到最大迭代次数但仍有工具调用，记录警告（与原 Agent 一致）
      if (iteration >= maxIterations && hasMoreToolsToCall) {
        if (verbose) {
          console.log(`[StreamingAgent Warning] 达到最大迭代次数 ${maxIterations}，强制终止迭代`);
        }
      }

      // 流式输出：完成
      yield {
        type: 'completed',
        finalMessage: lastAssistantMessage?.content || '',
        history: currentMessages,
        allToolCalls: toolCalls,
        usage: capturedUsage,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[StreamingAgent Debug] 处理过程中出错:', errorMessage);

      yield {
        type: 'error',
        error: errorMessage,
      };

      throw error;
    }
  }

  /**
   * 流式版本的 _transform，充分利用 HLang 的响应式架构
   */
  _transform($i: unknown, $o: unknown): void {
    // 监听输入端口
    (
      $i as {
        (port: string): { receive: (fn: (input: string | AgentInput) => Promise<void>) => void };
      }
    )('in').receive(async (input: string | AgentInput) => {
      try {
        if ((this.agent as unknown as { verbose?: boolean }).verbose) {
          if (typeof input === 'string') {
            console.log(`[StreamingAgent] 收到输入:`, input);
          } else {
            const firstMsg =
              input.messages && input.messages.length > 0 ? input.messages[0].content : '[空消息]';
            console.log(`[StreamingAgent] 收到输入:`, firstMsg);
          }
        }

        // 流式处理并实时发送每个 chunk
        for await (const chunk of this.runStream(input)) {
          // 利用 HLang 的响应式架构，实时发送流式数据
          ($o as { (port: string): { send: (data: unknown) => void } })('out').send(chunk);
        }

        if ((this.agent as unknown as { verbose?: boolean }).verbose) {
          console.log(`[StreamingAgent] 流式处理完成`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('[StreamingAgent] 执行过程中出错:', errorMessage);

        // 发送错误输出
        ($o as { (port: string): { send: (data: unknown) => void } })('out').send({
          type: 'error',
          error: errorMessage,
        });
      }
    });
  }

  /**
   * 重置方法，与原 Agent 保持一致
   */
  reset(): void {
    this.agent.reset();
  }
}

export default StreamingAgent;
