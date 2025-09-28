import type { FastifyInstance } from 'fastify';
import { classifyIntent, getStreamingAgentByIntent } from '../agents/index.js';
import { createLLMClient, chatWithLLMStreaming } from '../services/llm.js';

// 流式配置
const STREAMING_CONFIG = {
  // 每个token/字符的延迟（毫秒），可以通过环境变量配置
  delayPerToken: parseInt(process.env.STREAMING_DELAY_MS || '0'),
  // 是否按字符流式传输，否则按词语
  streamByCharacter: process.env.STREAM_BY_CHARACTER === 'true',
};

// AI SDK 5.0 compatible types
interface UIMessagePart {
  type: 'text';
  text: string;
}

interface UIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  parts: UIMessagePart[];
}

export default async function chatRoutes(fastify: FastifyInstance) {
  // Chat endpoint compatible with AI SDK Data Stream Protocol
  fastify.post('/chat', async (request, reply) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { messages }: { messages: UIMessage[] } = request.body as any;

      if (!messages || !Array.isArray(messages)) {
        return reply.code(400).send({
          error: 'Invalid request: messages array required',
        });
      }

      // Get the latest user message
      const latestMessage = messages[messages.length - 1];
      if (!latestMessage || latestMessage.role !== 'user') {
        return reply.code(400).send({
          error: 'Invalid message format: expected user message',
        });
      }

      // Extract text from message parts
      const messageText = latestMessage.parts
        .filter(part => part.type === 'text')
        .map(part => part.text)
        .join(' ');

      // Classify intent
      const intent = classifyIntent(messageText);
      fastify.log.info({ intent, message: messageText }, 'Classified user intent');

      if (intent === 'chat') {
        // Handle normal chat with LLM using AI SDK Data Stream Protocol
        const llmClient = createLLMClient();

        // Convert UIMessage format to LLM format
        const llmMessages = messages.map(msg => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.parts
            .filter(part => part.type === 'text')
            .map(part => part.text)
            .join(' '),
        }));

        // Set proper headers for AI SDK Data Stream Protocol
        reply.type('text/plain; charset=utf-8');
        reply.header('X-Vercel-AI-Data-Stream', 'v1');

        let completionTokens = 0;

        try {
          // Real streaming from LLM with optimized chunking
          for await (const chunk of chatWithLLMStreaming(llmClient, llmMessages)) {
            // Send each chunk as it arrives from LLM - no artificial delays
            const textPart = `0:${JSON.stringify(chunk)}\n`;
            reply.raw.write(textPart);
            completionTokens += chunk.length;
          }

          // Send completion using Finish Message Part
          const finishPart = `d:${JSON.stringify({
            finishReason: 'stop',
            usage: { promptTokens: 0, completionTokens },
          })}\n`;
          reply.raw.write(finishPart);
          reply.raw.end();
        } catch (error) {
          fastify.log.error(error, 'Error in LLM streaming');
          const errorPart = `3:${JSON.stringify(error instanceof Error ? error.message : 'LLM streaming error')}\n`;
          reply.raw.write(errorPart);
          reply.raw.end();
        }
      } else {
        // Handle agent-based processing with AI SDK Data Stream Protocol
        const streamingAgent = getStreamingAgentByIntent(intent);
        if (!streamingAgent) {
          // Error Part: 3:string\n
          reply.type('text/plain; charset=utf-8');
          reply.header('X-Vercel-AI-Data-Stream', 'v1');
          const errorPart = `3:${JSON.stringify(`No streaming agent available for intent: ${intent}`)}\n`;
          reply.raw.write(errorPart);
          reply.raw.end();
          return;
        }

        // Convert UIMessage format to agent format
        const agentMessages = messages.map(msg => ({
          role: msg.role,
          content: msg.parts
            .filter(part => part.type === 'text')
            .map(part => part.text)
            .join(' '),
        }));

        // Set proper headers for AI SDK Data Stream Protocol
        reply.type('text/plain; charset=utf-8');
        reply.header('X-Vercel-AI-Data-Stream', 'v1');

        let fullContent = '';

        try {
          // Stream the agent processing using AI SDK Data Stream Protocol
          for await (const chunk of streamingAgent.runStream({
            messages: agentMessages,
          })) {
            switch (chunk.type) {
              case 'iteration_start': {
                // Data Part: 2:Array<JSONValue>\n
                const iterationData = `2:${JSON.stringify([{ type: 'iteration_start', iteration: chunk.iteration }])}\n`;
                reply.raw.write(iterationData);
                break;
              }

              case 'model_thinking': {
                // Data Part: 2:Array<JSONValue>\n
                const thinkingData = `2:${JSON.stringify([{ type: 'thinking' }])}\n`;
                reply.raw.write(thinkingData);
                break;
              }

              case 'assistant_message': {
                if (chunk.content) {
                  fullContent = chunk.content;

                  // 智能流式传输：针对代码内容优化
                  let chunks: string[];
                  if (STREAMING_CONFIG.streamByCharacter) {
                    // 字符级流式
                    chunks = chunk.content.split('');
                  } else {
                    // 智能分块：对于包含代码的内容，使用更细粒度的分割
                    if (
                      chunk.content.includes('```') ||
                      chunk.content.includes('def ') ||
                      chunk.content.includes('function ') ||
                      chunk.content.includes('class ')
                    ) {
                      // 代码内容：按行分割，保持良好的流式效果
                      chunks = chunk.content.split(/(\n)/);
                    } else {
                      // 普通文本：按词语分割
                      chunks = chunk.content.split(/(\s+)/);
                    }
                  }

                  for (const textChunk of chunks) {
                    if (textChunk) {
                      // 跳过空字符串
                      // Text Part: 0:string\n
                      const textPart = `0:${JSON.stringify(textChunk)}\n`;
                      reply.raw.write(textPart);

                      // 可配置的延迟
                      if (STREAMING_CONFIG.delayPerToken > 0) {
                        await new Promise(resolve =>
                          setTimeout(resolve, STREAMING_CONFIG.delayPerToken)
                        );
                      }
                    }
                  }
                }
                break;
              }

              case 'tool_start': {
                // Tool Call Streaming Start Part: b:{toolCallId:string; toolName:string}\n
                const toolStartPart = `b:${JSON.stringify({
                  toolCallId: `tool-${Date.now()}`,
                  toolName: chunk.toolName || 'unknown',
                })}\n`;
                reply.raw.write(toolStartPart);
                break;
              }

              case 'tool_result': {
                // Data Part: 2:Array<JSONValue>\n
                const toolResultData = `2:${JSON.stringify([
                  {
                    type: 'tool_result',
                    toolName: chunk.toolName,
                    result: chunk.result,
                  },
                ])}\n`;
                reply.raw.write(toolResultData);
                break;
              }

              case 'completed': {
                // Finish Message Part: d:{finishReason:string;usage:object}\n
                const finishPart = `d:${JSON.stringify({
                  finishReason: 'stop',
                  usage: {
                    promptTokens: 0,
                    completionTokens: (chunk.finalMessage || fullContent).length,
                  },
                })}\n`;
                reply.raw.write(finishPart);
                break;
              }

              case 'error': {
                // Error Part: 3:string\n
                const errorPart = `3:${JSON.stringify(chunk.error || 'Unknown error')}\n`;
                reply.raw.write(errorPart);
                break;
              }
            }
          }
        } catch (error) {
          fastify.log.error(error, 'Error in streaming agent processing');
          // Error Part: 3:string\n
          const errorPart = `3:${JSON.stringify(error instanceof Error ? error.message : 'Streaming error')}\n`;
          reply.raw.write(errorPart);
        }

        reply.raw.end();
      }
    } catch (error) {
      fastify.log.error(error, 'Error processing chat request');
      return reply.code(500).send({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  });

  // Health check endpoint
  fastify.get('/health', async (_, reply) => {
    return reply.send({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'astack-chat-server',
    });
  });
}
