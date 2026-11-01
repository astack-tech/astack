/**
 * Ready-made AStack components: {@link Agent}, {@link StreamingAgent}, {@link RLMAgent},
 * {@link TextSplitter} and {@link ToolInvoker}.
 *
 * Every component works standalone through `run()` and inside a `Pipeline`.
 *
 * @packageDocumentation
 */

export { default as TextSplitter } from './text';
export type { TextSplitterConfig } from './text';

export {
  Agent,
  DefaultMemory,
  FileSystemContext,
  RLMAgent,
  RLMCore,
  StreamingAgent,
} from './agents';
export type {
  AgentConfig,
  AgentInput,
  AgentOutput,
  Message as AgentMessage,
  Tool as AgentTool,
  ToolCall as AgentToolCall,
  ContextStats,
  CustomPromptBuilder,
  FileInfo,
  FileSystemContextOptions,
  LLMProvider,
  Memory,
  MemoryLimits,
  MemoryUsage,
  MessageWithToolCalls,
  ModelProvider,
  ModelProviderOptions,
  RLMAgentConfig,
  RLMChunk,
  RLMCoreOptions,
  RLMExecutionMetadata,
  RLMInput,
  RLMResult,
  StreamingChunk,
  SubLLMCall,
  SystemPromptBuilder,
  TokenUsage,
  ToolCallRecord,
} from './agents';

export { default as ToolInvoker } from './tool-invoker';
export type {
  Message as ToolInvokerMessage,
  MessageRole as ToolInvokerMessageRole,
  ToolInvokerConfig,
  ToolInvokerInput,
  ToolInvokerOutput,
} from './tool-invoker';
