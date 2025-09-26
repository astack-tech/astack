import { createStreamingMathAgent } from './StreamingMathAgent.js';
import { createStreamingTextAgent } from './StreamingTextAgent.js';
import type { IntentType } from '../types/index.js';

// Streaming Agent 实例缓存
let streamingMathAgent: ReturnType<typeof createStreamingMathAgent> | null = null;
let streamingTextAgent: ReturnType<typeof createStreamingTextAgent> | null = null;

// 获取 Streaming Math Agent
export function getStreamingMathAgent() {
  if (!streamingMathAgent) {
    streamingMathAgent = createStreamingMathAgent();
  }
  return streamingMathAgent;
}

// 获取 Streaming Text Agent
export function getStreamingTextAgent() {
  if (!streamingTextAgent) {
    streamingTextAgent = createStreamingTextAgent();
  }
  return streamingTextAgent;
}

// 根据意图类型获取对应的 Streaming Agent
export function getStreamingAgentByIntent(intent: IntentType) {
  switch (intent) {
    case 'math':
      return getStreamingMathAgent();
    case 'text':
      return getStreamingTextAgent();
    default:
      return null;
  }
}

// 简单的意图分类器
export function classifyIntent(message: string): IntentType {
  const lowerMessage = message.toLowerCase();

  // 数学关键词
  const mathKeywords = [
    '计算',
    '算',
    '数学',
    '加',
    '减',
    '乘',
    '除',
    '+',
    '-',
    '*',
    '/',
    '=',
    '等于',
    '求解',
    '平方',
    '开方',
    '幂',
    '次方',
  ];

  // 文本分析关键词
  const textKeywords = [
    '分析文本',
    '统计字数',
    '分析内容',
    '文本分析',
    '字符数',
    '词数',
    '文本统计',
    '内容分析',
  ];

  // 检查数学关键词
  if (mathKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'math';
  }

  // 检查文本分析关键词
  if (textKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'text';
  }

  // 检查是否包含明显的数学表达式
  if (/\d+\s*[+\-*/]\s*\d+/.test(message)) {
    return 'math';
  }

  // 默认是普通聊天
  return 'chat';
}
