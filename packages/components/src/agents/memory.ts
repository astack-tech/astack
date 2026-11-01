import type { Memory, Message } from './types';

/**
 * In-memory message history.
 */
export class DefaultMemory implements Memory {
  private messages: Message[] = [];

  addMessage(message: Message): void {
    this.messages.push(message);
  }

  getMessages(): Message[] {
    return [...this.messages];
  }

  /**
   * Returns every stored message. `DefaultMemory` does not truncate by token count.
   */
  getFormattedMemory(): Message[] {
    return this.getMessages();
  }

  clear(): void {
    this.messages = [];
  }
}
