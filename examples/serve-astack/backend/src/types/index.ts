export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  stream?: boolean;
}

export interface ChatResponse {
  message: string;
  type: 'chat' | 'agent';
  agent?: string;
  metadata?: {
    thinking?: string;
    toolCalls?: Array<{
      tool: string;
      args: Record<string, unknown>;
      result: unknown;
    }>;
  };
}

export type IntentType = 'chat' | 'math' | 'text';

export interface AgentResult {
  message: string;
  thinking?: string;
  toolCalls?: Array<{
    tool: string;
    args: Record<string, unknown>;
    result: unknown;
  }>;
  history: ChatMessage[];
}
