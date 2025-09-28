'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useChat } from '@ai-sdk/react';
import {
  Send,
  Bot,
  User,
  Loader2,
  Calculator,
  FileText,
  Brain,
  MessageSquare,
  Terminal,
  ChevronRight,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { CalculatorCard } from '@/components/CalculatorCard';
import { AnalysisCard } from '@/components/AnalysisCard';
import { AgentCard } from '@/components/AgentCard';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

// 分析消息类型的辅助函数
function analyzeMessageType(message: any, data?: any[]): string {
  if (message.role === 'user') return 'user';

  // 检查数据流中是否有 agent 相关信息
  const hasAgentData = data?.some(
    item =>
      typeof item === 'object' &&
      item !== null &&
      'type' in item &&
      ((item as any).type === 'tool_result' ||
        (item as any).type === 'iteration_start' ||
        (item as any).type === 'thinking')
  );

  if (hasAgentData) return 'agent';

  // 从消息内容推断类型
  const content = message.parts?.find((part: any) => part.type === 'text')?.text || '';

  if (content.includes('计算') || /\d+\s*[+\-*/]\s*\d+/.test(content)) {
    return 'math';
  }
  if (content.includes('分析') || content.includes('统计') || content.includes('文本')) {
    return 'analysis';
  }

  return 'chat';
}

// Vercel 风格的思考状态组件
function ThinkingIndicator() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-500">
      <div className="flex space-x-1">
        <div className="w-1 h-1 bg-neutral-400 rounded-full animate-pulse" />
        <div className="w-1 h-1 bg-neutral-400 rounded-full animate-pulse delay-100" />
        <div className="w-1 h-1 bg-neutral-400 rounded-full animate-pulse delay-200" />
      </div>
      <span>AI 正在思考{dots}</span>
    </div>
  );
}

// 智能内容解析器，从 AI 响应中提取结构化信息
function parseAIResponse(content: string, messageType: string) {
  const components = [];

  if (messageType === 'math') {
    // 尝试提取数学计算信息
    const mathMatch = content.match(/计算[：:]?\s*(.+?)\s*[=＝]\s*(.+?)(?:\n|$)/);
    if (mathMatch) {
      const expression = mathMatch[1].trim();
      const result = mathMatch[2].trim();

      // 提取计算步骤（如果有的话）
      const stepsMatch = content.match(/步骤[：:]?\s*([\s\S]*?)(?:\n\n|$)/);
      const steps = stepsMatch ? stepsMatch[1].split('\n').filter(s => s.trim()) : undefined;

      components.push(
        <CalculatorCard key="calc" expression={expression} result={result} steps={steps} />
      );
    }
  } else if (messageType === 'analysis') {
    // 尝试提取文本分析信息
    const textMatch = content.match(/(?:分析文本|原文)[：:]?\s*(.+?)(?:\n|$)/);
    if (textMatch) {
      const text = textMatch[1].trim();

      // 提取统计信息
      const wordCountMatch = content.match(/词数[：:]?\s*(\d+)/);
      const charCountMatch = content.match(/字符数[：:]?\s*(\d+)/);
      const sentencesMatch = content.match(/句子数[：:]?\s*(\d+)/);

      // 提取关键词
      const keywordsMatch = content.match(/关键词[：:]?\s*(.+?)(?:\n|$)/);
      const keywords = keywordsMatch
        ? keywordsMatch[1].split(/[，,、\s]+/).filter(k => k.trim())
        : undefined;

      // 提取情感分析
      let sentiment: 'positive' | 'negative' | 'neutral' | undefined;
      if (content.includes('积极') || content.includes('正面')) sentiment = 'positive';
      else if (content.includes('消极') || content.includes('负面')) sentiment = 'negative';
      else if (content.includes('中性')) sentiment = 'neutral';

      components.push(
        <AnalysisCard
          key="analysis"
          text={text}
          wordCount={wordCountMatch ? parseInt(wordCountMatch[1]) : undefined}
          charCount={charCountMatch ? parseInt(charCountMatch[1]) : undefined}
          sentences={sentencesMatch ? parseInt(sentencesMatch[1]) : undefined}
          keywords={keywords}
          sentiment={sentiment}
        />
      );
    }
  } else if (messageType === 'agent') {
    // 为 Agent 执行创建步骤
    const steps = [
      {
        type: 'thinking' as const,
        title: '分析用户请求',
        content: '理解任务需求...',
        status: 'completed' as const,
      },
      {
        type: 'tool_call' as const,
        title: '调用工具',
        content: '执行相关操作...',
        status: 'completed' as const,
      },
      {
        type: 'result' as const,
        title: '生成响应',
        content: '整合结果...',
        status: 'completed' as const,
      },
    ];

    components.push(
      <AgentCard
        key="agent"
        agentName="智能助手"
        status="completed"
        steps={steps}
        finalResult={content}
      />
    );
  }

  return components;
}

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, status, data } = useChat({
    api: '/api/chat',
  });

  // 在用户发送消息时立即创建一个占位的助手消息来显示加载状态
  const displayMessages = [...messages];
  if (
    status === 'streaming' &&
    messages.length > 0 &&
    messages[messages.length - 1]?.role === 'user'
  ) {
    // 分析用户消息类型来预测助手消息类型
    const userMessage = messages[messages.length - 1];
    const userText = userMessage.parts?.find(part => part.type === 'text')?.text || '';
    const predictedType = analyzeMessageType({
      role: 'user',
      parts: [{ type: 'text', text: userText }],
    });

    displayMessages.push({
      id: 'loading-message',
      role: 'assistant' as const,
      parts: [{ type: 'text', text: '' }],
      // 添加预测的消息类型用于显示对应头像
      predictedType,
    } as any);
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Vercel 风格的极简头部 */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black">
                <Terminal className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">AStack AI</h1>
                <p className="text-xs text-neutral-500">Intelligent Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  status === 'ready'
                    ? 'bg-green-500'
                    : status === 'streaming'
                      ? 'bg-orange-500 animate-pulse'
                      : 'bg-neutral-400'
                }`}
              />
              <span className="text-xs text-neutral-500">
                {status === 'ready'
                  ? 'Ready'
                  : status === 'streaming'
                    ? 'Processing'
                    : 'Connecting'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Vercel 风格的消息区域 */}
      <main className="mx-auto max-w-3xl px-4 py-8">
        {messages.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
              <Brain className="h-8 w-8 text-neutral-600" />
            </div>
            <h2 className="mb-4 text-2xl font-semibold">AStack AI Assistant</h2>
            <p className="mb-8 max-w-md text-neutral-600">
              智能助手支持复杂对话、数学计算、文本分析等多种任务
            </p>

            <div className="grid w-full max-w-md gap-3">
              <button
                onClick={() => {
                  handleInputChange({
                    target: { value: '计算 123 + 456' },
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                className="group flex items-center gap-3 rounded-lg border border-neutral-200 p-4 text-left transition-colors hover:bg-neutral-50"
              >
                <Calculator className="h-5 w-5 text-neutral-500" />
                <div>
                  <p className="font-medium">数学计算</p>
                  <p className="text-sm text-neutral-500">复杂数学运算</p>
                </div>
                <ChevronRight className="ml-auto h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => {
                  handleInputChange({
                    target: { value: '分析文本：人工智能正在改变世界' },
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                className="group flex items-center gap-3 rounded-lg border border-neutral-200 p-4 text-left transition-colors hover:bg-neutral-50"
              >
                <FileText className="h-5 w-5 text-neutral-500" />
                <div>
                  <p className="font-medium">文本分析</p>
                  <p className="text-sm text-neutral-500">内容深度解析</p>
                </div>
                <ChevronRight className="ml-auto h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => {
                  handleInputChange({
                    target: { value: '你好，介绍一下你的能力' },
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                className="group flex items-center gap-3 rounded-lg border border-neutral-200 p-4 text-left transition-colors hover:bg-neutral-50"
              >
                <MessageSquare className="h-5 w-5 text-neutral-500" />
                <div>
                  <p className="font-medium">智能对话</p>
                  <p className="text-sm text-neutral-500">自然语言交流</p>
                </div>
                <ChevronRight className="ml-auto h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {displayMessages.map((message, index) => {
              const messageType =
                (message as any).predictedType || analyzeMessageType(message, data);

              return (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Avatar */}
                  {message.role === 'assistant' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                      {messageType === 'agent' ? (
                        <Brain className="h-4 w-4 text-neutral-600" />
                      ) : messageType === 'math' ? (
                        <Calculator className="h-4 w-4 text-neutral-600" />
                      ) : messageType === 'analysis' ? (
                        <FileText className="h-4 w-4 text-neutral-600" />
                      ) : (
                        <Bot className="h-4 w-4 text-neutral-600" />
                      )}
                    </div>
                  )}

                  {/* Message Content */}
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                    {/* Message Type Label */}
                    {message.role === 'assistant' && (
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-xs font-medium text-neutral-500">
                          {messageType === 'agent'
                            ? 'AI Agent'
                            : messageType === 'math'
                              ? '数学计算'
                              : messageType === 'analysis'
                                ? '文本分析'
                                : 'AI 助手'}
                        </span>
                      </div>
                    )}

                    <div
                      className={`rounded-lg px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-black text-white'
                          : 'border border-neutral-200 bg-white'
                      }`}
                    >
                      {message.parts.map((part, partIndex) => {
                        if (part.type === 'text') {
                          // 对于助手消息，尝试解析并渲染自定义组件
                          if (message.role === 'assistant') {
                            const customComponents = parseAIResponse(part.text, messageType);

                            return (
                              <div key={partIndex}>
                                {/* 如果有自定义组件，先渲染组件 */}
                                {customComponents.length > 0 && (
                                  <div className="mb-4">{customComponents}</div>
                                )}

                                {/* 然后渲染文本内容 */}
                                <MarkdownRenderer
                                  content={part.text}
                                  className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                                />
                              </div>
                            );
                          } else {
                            // 用户消息正常渲染
                            return (
                              <MarkdownRenderer
                                key={partIndex}
                                content={part.text}
                                className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                              />
                            );
                          }
                        }
                        return null;
                      })}

                      {/* Thinking indicator */}
                      {message.role === 'assistant' &&
                        (index === displayMessages.length - 1 ||
                          message.id === 'loading-message') &&
                        status === 'streaming' && (
                          <div className="mt-3 border-t border-neutral-100 pt-3">
                            <ThinkingIndicator />
                          </div>
                        )}
                    </div>

                    <div
                      className={`mt-1 text-xs text-neutral-400 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                    >
                      刚刚
                    </div>
                  </div>

                  {/* User Avatar */}
                  {message.role === 'user' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Vercel 风格的输入区域 */}
      <footer className="sticky bottom-0 border-t border-neutral-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                disabled={status !== 'ready'}
                className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 pr-12 text-sm focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-200 disabled:bg-neutral-50 disabled:text-neutral-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || status !== 'ready'}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 disabled:pointer-events-none disabled:opacity-50"
              >
                {status === 'streaming' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* 状态栏 */}
            <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
              <span>{status === 'streaming' ? 'Processing...' : 'Ready to chat'}</span>
              <span>Powered by AStack</span>
            </div>
          </form>
        </div>
      </footer>
    </div>
  );
}
