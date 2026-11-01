import type { Message, ModelProvider, ModelProviderOptions } from '../types';

/**
 * Scripted model provider for tests. Each call consumes the next reply.
 */
export class ScriptedModel implements ModelProvider {
  readonly calls: { messages: Message[]; options: ModelProviderOptions | undefined }[] = [];
  private readonly replies: Message[];

  constructor(replies: Message[]) {
    this.replies = [...replies];
  }

  chatCompletion(messages: Message[], options?: ModelProviderOptions): Promise<Message> {
    this.calls.push({ messages: structuredClone(messages), options });
    const reply = this.replies.shift();
    if (reply === undefined) {
      return Promise.reject(new Error('No scripted reply left'));
    }
    return Promise.resolve(reply);
  }
}

/**
 * Scripted streaming model. Each call streams the next list of partial messages.
 */
export class ScriptedStreamingModel extends ScriptedModel {
  readonly streamCalls: { messages: Message[]; options: ModelProviderOptions | undefined }[] = [];
  private readonly streams: Partial<Message>[][];

  constructor(streams: Partial<Message>[][]) {
    super([]);
    this.streams = [...streams];
  }

  async *streamChatCompletion(
    messages: Message[],
    options?: ModelProviderOptions
  ): AsyncGenerator<Partial<Message>> {
    this.streamCalls.push({ messages: structuredClone(messages), options });
    const chunks = this.streams.shift();
    if (chunks === undefined) {
      throw new Error('No scripted stream left');
    }
    for (const chunk of chunks) {
      yield await Promise.resolve(chunk);
    }
  }
}

/**
 * Builds an assistant message that requests one or more tool calls.
 */
export function toolCallReply(
  calls: { id: string; name: string; args: string }[],
  content = ''
): Message {
  return {
    role: 'assistant',
    content,
    tool_calls: calls.map(call => ({
      id: call.id,
      type: 'function',
      function: { name: call.name, arguments: call.args },
    })),
  };
}
