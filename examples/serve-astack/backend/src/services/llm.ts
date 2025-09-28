import { Deepseek } from '@astack-tech/integrations/model-provider';
import type { ModelProvider } from '@astack-tech/components';

export function createLLMClient(): ModelProvider {
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || '';

  if (!apiKey) {
    throw new Error(
      'No API key found. Please set DEEPSEEK_API_KEY or OPENAI_API_KEY environment variable'
    );
  }

  // For now, we'll use Deepseek as the default LLM
  // In a production setup, this could be configurable
  const model = new Deepseek({
    apiKey,
    model: 'deepseek-chat',
    temperature: 0.7,
    // 优化流式性能的参数
    maxTokens: parseInt(process.env.LLM_MAX_TOKENS || '2048'),
  });

  return model as ModelProvider;
}

export interface LLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export async function chatWithLLM(
  client: ModelProvider,
  messages: LLMMessage[]
): Promise<LLMResponse> {
  const response = await client.chatCompletion(
    messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }))
  );

  return {
    content: response.content,
  };
}

export async function* chatWithLLMStreaming(
  client: ModelProvider,
  messages: LLMMessage[]
): AsyncGenerator<string> {
  // 检查是否支持流式调用
  if (!client.streamChatCompletion) {
    throw new Error('ModelProvider does not support streaming');
  }

  // 使用流式调用
  const response = await client.streamChatCompletion(
    messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }))
  );

  for await (const chunk of response) {
    if (chunk.content) {
      yield chunk.content;
    }
  }
}
