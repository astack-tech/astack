import { StreamingAgent } from '@astack-tech/components';
import { createTool } from '@astack-tech/tools';
import { Deepseek } from '@astack-tech/integrations/model-provider';
import type { ModelProvider } from '@astack-tech/components';

// 文本分析工具（与原text-agent完全一致）
const textAnalysisTool = createTool(
  'textAnalysis',
  '分析文本内容，统计字数、词数等信息',
  async (args: Record<string, unknown>) => {
    const { text } = args as { text: string };

    const charCount = text.length;
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    const lineCount = text.split('\n').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

    return {
      原文: text,
      字符数: charCount,
      词数: wordCount,
      行数: lineCount,
      句数: sentences,
      分析摘要: `这段文本包含 ${charCount} 个字符、${wordCount} 个词、${lineCount} 行、${sentences} 个句子。`,
    };
  },
  {
    type: 'object',
    properties: {
      text: {
        type: 'string',
        description: '需要分析的文本内容',
      },
    },
    required: ['text'],
  }
);

// 创建流式文本分析助手 Agent
export function createStreamingTextAgent(): StreamingAgent {
  const apiKey = process.env.DEEPSEEK_API_KEY || '';
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY environment variable is required');
  }

  const model = new Deepseek({
    apiKey,
    model: 'deepseek-chat',
    temperature: 0.7,
  });

  return new StreamingAgent({
    model: model as ModelProvider,
    tools: [textAnalysisTool],
    systemPrompt: `你是一个专业的文本分析助手，专门帮助用户分析和理解文本内容。

你的能力：
- 分析文本的基本统计信息（字数、词数、行数等）
- 提供文本内容的深度分析
- 给出文本改进建议

当用户需要分析文本时，请使用 textAnalysis 工具获取详细的统计信息。
分析完成后，请提供有见地的分析报告和实用的建议。`,
    verbose: true,
    maxIterations: 3,
  });
}
