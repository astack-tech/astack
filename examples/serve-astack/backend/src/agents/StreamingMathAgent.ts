import { StreamingAgent } from '@astack-tech/components';
import { createTool } from '@astack-tech/tools';
import { Deepseek } from '@astack-tech/integrations/model-provider';
import type { ModelProvider } from '@astack-tech/components';

// 计算器工具（与原math-agent完全一致）
const calculatorTool = createTool(
  'calculator',
  '执行基本的数学计算',
  async (args: Record<string, unknown>) => {
    const { expression } = args as { expression: string };
    try {
      // 安全的数学计算，只允许基本数学运算
      const sanitized = expression.replace(/[^0-9+\-*/(). ]/g, '');
      const result = Function(`"use strict"; return (${sanitized})`)();
      return `计算结果: ${expression} = ${result}`;
    } catch (error) {
      return `计算错误: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
  {
    type: 'object',
    properties: {
      expression: {
        type: 'string',
        description: '数学表达式，如 "2 + 3" 或 "10 * 5"',
      },
    },
    required: ['expression'],
  }
);

// 创建流式数学助手 Agent
export function createStreamingMathAgent(): StreamingAgent {
  const apiKey = process.env.DEEPSEEK_API_KEY || '';
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY environment variable is required');
  }

  const model = new Deepseek({
    apiKey,
    model: 'deepseek-chat',
    temperature: 0.3,
  });

  return new StreamingAgent({
    model: model as ModelProvider,
    tools: [calculatorTool],
    systemPrompt: `你是一个专业的数学助手，专门帮助用户进行数学计算和解答数学问题。

你的能力：
- 执行基本的数学运算（加减乘除）
- 计算复杂的数学表达式
- 解答数学问题和提供解题思路

当用户提到需要计算时，请使用 calculator 工具来准确计算结果。
计算完成后，请给出清晰的解答和必要的说明。

可用工具：
1. calculator - 执行基本的数学计算
   参数：
   - expression: 数学表达式，如 "2 + 3" 或 "10 * 5"`,
    verbose: true,
    maxIterations: 3,
  });
}
