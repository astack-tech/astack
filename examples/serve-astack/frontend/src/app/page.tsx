'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useChat } from '@ai-sdk/react';
import { Streamdown } from 'streamdown';
import {
  Send,
  Bot,
  User,
  Loader2,
  Zap,
  Calculator,
  FileText,
  Sparkles,
  Brain,
  MessageSquare,
} from 'lucide-react';
import { useState, useEffect } from 'react';

// 分析消息类型的辅助函数
function analyzeMessageType(message: any, data?: any[], messageIndex?: number, messages?: any[]) {
  if (message.role === 'user') return 'user';

  // 对于assistant消息，优先基于实际数据流判断
  const hasAgentData = data?.some(
    item =>
      typeof item === 'object' &&
      item !== null &&
      'type' in item &&
      ((item as any).type === 'tool_result' ||
        (item as any).type === 'iteration_start' ||
        (item as any).type === 'thinking')
  );

  // 如果有agent数据，说明走的是agent路径
  if (hasAgentData) return 'agent';

  // 如果没有agent数据，基于对应的用户消息内容判断类型
  let userMessage = null;
  if (messages && messageIndex !== undefined) {
    // 向前查找最近的用户消息
    for (let i = messageIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        userMessage = messages[i];
        break;
      }
    }
  }

  if (userMessage) {
    const content =
      (userMessage.parts?.find((part: any) => part.type === 'text') as any)?.text || '';
    // 检查数学计算特征
    if (content.includes('计算') || /\d+\s*[+\-*/]\s*\d+/.test(content)) {
      return 'math';
    }
    // 检查文本分析特征
    if (content.includes('分析') || content.includes('统计') || content.includes('文本')) {
      return 'analysis';
    }
  }

  // 默认为普通聊天
  return 'chat';
}

// 获取消息类型对应的图标和颜色
function getMessageStyle(messageType: string) {
  const styles = {
    user: {
      icon: User,
      bgColor: 'bg-blue-600',
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-blue-600',
      textColor: 'text-white',
    },
    agent: {
      icon: Brain,
      bgColor: 'bg-purple-600',
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-purple-600',
      textColor: 'text-white',
    },
    math: {
      icon: Calculator,
      bgColor: 'bg-green-600',
      gradientFrom: 'from-green-500',
      gradientTo: 'to-green-600',
      textColor: 'text-white',
    },
    analysis: {
      icon: FileText,
      bgColor: 'bg-orange-600',
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-orange-600',
      textColor: 'text-white',
    },
    chat: {
      icon: Bot,
      bgColor: 'bg-gray-600',
      gradientFrom: 'from-gray-500',
      gradientTo: 'to-gray-600',
      textColor: 'text-white',
    },
  };
  return styles[messageType as keyof typeof styles] || styles.chat;
}

// 智能思考状态组件
function ThinkingStatus({ messageType }: { messageType: string }) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const getThinkingText = () => {
    switch (messageType) {
      case 'agent':
        return `AI Agent 正在处理${dots}`;
      case 'math':
        return `正在计算${dots}`;
      case 'analysis':
        return `正在分析${dots}`;
      default:
        return `AI 正在思考${dots}`;
    }
  };

  const style = getMessageStyle(messageType);
  const IconComponent = style.icon;

  return (
    <div className="flex items-center gap-3 px-4 py-2 border border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
      <div
        className={`w-6 h-6 rounded-full bg-gradient-to-br ${style.gradientFrom} ${style.gradientTo} flex items-center justify-center`}
      >
        <IconComponent className="w-3 h-3 text-white" />
      </div>
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
        <span className="text-sm font-medium text-gray-700">{getThinkingText()}</span>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, status, data } = useChat({
    api: '/api/chat',
  });

  const [currentMessageType, setCurrentMessageType] = useState<string>('chat');

  // 分析当前处理的消息类型
  useEffect(() => {
    if (status === 'streaming' && messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
      if (lastUserMessage) {
        const content =
          (lastUserMessage.parts?.find((part: any) => part.type === 'text') as any)?.text || '';

        // 检查是否有agent数据流
        const hasAgentData = data?.some(
          item =>
            typeof item === 'object' &&
            item !== null &&
            'type' in item &&
            ((item as any).type === 'tool_result' ||
              (item as any).type === 'iteration_start' ||
              (item as any).type === 'thinking')
        );

        if (hasAgentData) {
          setCurrentMessageType('agent');
        } else if (content.includes('计算') || /\d+\s*[+\-*/]\s*\d+/.test(content)) {
          setCurrentMessageType('math');
        } else if (content.includes('分析')) {
          setCurrentMessageType('analysis');
        } else {
          setCurrentMessageType('chat');
        }
      }
    }
  }, [status, messages, data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-10 px-6 py-4 border-b bg-white/80 backdrop-blur-lg border-slate-200/60">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text">
                AStack AI Assistant
              </h1>
              <p className="text-sm text-slate-600">智能对话 · 数学计算 · 文本分析 · 工具调用</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${status === 'ready' ? 'bg-green-400' : status === 'streaming' ? 'bg-blue-400 animate-pulse' : 'bg-yellow-400'}`}
            ></div>
            <span className="text-xs font-medium text-slate-500">
              {status === 'ready' ? '就绪' : status === 'streaming' ? '处理中' : '连接中'}
            </span>
          </div>
        </div>
      </header>

      {/* Enhanced Messages Area */}
      <main className="flex-1 w-full max-w-5xl px-6 py-8 mx-auto">
        <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="py-16 text-center">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h2 className="mb-3 text-2xl font-bold text-slate-800">AStack AI Assistant</h2>
              <p className="mb-2 text-lg text-slate-600">
                你好！我是智能助手，拥有强大的推理和工具调用能力
              </p>
              <p className="mb-8 text-sm text-slate-500">
                支持复杂对话、数学计算、文本分析等多种智能任务
              </p>

              <div className="grid max-w-2xl grid-cols-1 gap-4 mx-auto md:grid-cols-3">
                <button
                  onClick={() => {
                    handleInputChange({
                      target: { value: '计算 123 + 456' },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }}
                  className="p-4 transition-all duration-300 bg-white border group rounded-2xl border-slate-200 hover:border-green-300 hover:shadow-lg"
                >
                  <Calculator className="w-6 h-6 mx-auto mb-2 text-green-600 transition-transform group-hover:scale-110" />
                  <h3 className="mb-1 font-semibold text-slate-800">数学计算</h3>
                  <p className="text-xs text-slate-500">复杂数学运算</p>
                </button>

                <button
                  onClick={() => {
                    handleInputChange({
                      target: { value: '分析文本：人工智能正在改变世界' },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }}
                  className="p-4 transition-all duration-300 bg-white border group rounded-2xl border-slate-200 hover:border-orange-300 hover:shadow-lg"
                >
                  <FileText className="w-6 h-6 mx-auto mb-2 text-orange-600 transition-transform group-hover:scale-110" />
                  <h3 className="mb-1 font-semibold text-slate-800">文本分析</h3>
                  <p className="text-xs text-slate-500">内容深度解析</p>
                </button>

                <button
                  onClick={() => {
                    handleInputChange({
                      target: { value: '你好，介绍一下你的能力' },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }}
                  className="p-4 transition-all duration-300 bg-white border group rounded-2xl border-slate-200 hover:border-purple-300 hover:shadow-lg"
                >
                  <MessageSquare className="w-6 h-6 mx-auto mb-2 text-purple-600 transition-transform group-hover:scale-110" />
                  <h3 className="mb-1 font-semibold text-slate-800">智能对话</h3>
                  <p className="text-xs text-slate-500">自然语言交流</p>
                </button>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => {
                const messageType = analyzeMessageType(message, data, index, messages);
                const style = getMessageStyle(messageType);
                const IconComponent = style.icon;

                return (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`flex gap-4 max-w-[85%] ${
                        message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      {/* Enhanced Avatar */}
                      <div className="flex-shrink-0">
                        <div
                          className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${style.gradientFrom} ${style.gradientTo} flex items-center justify-center shadow-lg`}
                        >
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        {/* Message type indicator */}
                        {message.role === 'assistant' && (
                          <div className="mt-1 text-center">
                            <span className="text-xs font-medium capitalize text-slate-500">
                              {messageType === 'agent'
                                ? 'Agent'
                                : messageType === 'math'
                                  ? '数学'
                                  : messageType === 'analysis'
                                    ? '分析'
                                    : '聊天'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Enhanced Message Content */}
                      <div
                        className={`relative group ${message.role === 'user' ? 'ml-4' : 'mr-4'}`}
                      >
                        <div
                          className={`px-6 py-4 rounded-2xl shadow-sm ${
                            message.role === 'user'
                              ? `bg-gradient-to-br ${style.gradientFrom} ${style.gradientTo} text-white`
                              : 'bg-white border border-slate-200 text-slate-800 hover:shadow-md transition-shadow'
                          }`}
                        >
                          {message.parts.map((part, partIndex) => {
                            if (part.type === 'text') {
                              return (
                                <div key={partIndex} className="leading-relaxed">
                                  <Streamdown>{part.text}</Streamdown>
                                </div>
                              );
                            }
                            return null;
                          })}

                          {/* Thinking indicator for assistant messages while streaming */}
                          {message.role === 'assistant' &&
                            index === messages.length - 1 &&
                            status === 'streaming' && (
                              <div className="pt-3 mt-3 border-t border-slate-100">
                                <ThinkingStatus messageType={currentMessageType} />
                              </div>
                            )}
                        </div>

                        {/* Message timestamp */}
                        <div
                          className={`text-xs text-slate-400 mt-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                        >
                          刚刚
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </main>

      {/* Enhanced Input Area */}
      <footer className="sticky bottom-0 px-6 py-6 border-t bg-white/80 backdrop-blur-lg border-slate-200/60">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="输入你的消息，开始智能对话..."
                disabled={status !== 'ready'}
                className="w-full px-6 py-4 pr-16 transition-all duration-200 bg-white border-2 shadow-sm border-slate-200 rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100 disabled:cursor-not-allowed text-slate-800 placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || status !== 'ready'}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {status === 'streaming' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between px-2 mt-3">
              <div className="text-xs text-slate-500">
                {status === 'streaming' ? '正在处理中...' : '准备就绪，开始对话'}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Zap className="w-3 h-3" />
                <span>由 AStack 强力驱动</span>
              </div>
            </div>
          </form>
        </div>
      </footer>
    </div>
  );
}
