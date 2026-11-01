import type { Memory, Message } from './types';

/**
 * In-memory message history.
 */
export class DefaultMemory implements Memory {
  private messages: Message[] = [];

  /** Stores a message at the end of the history. */
  addMessage(message: Message): void {
    this.messages.push(message);
  }

  /** Returns a copy of every stored message, oldest first. */
  getMessages(): Message[] {
    return [...this.messages];
  }

  /**
   * Returns every stored message. `DefaultMemory` does not truncate by token count.
   */
  getFormattedMemory(): Message[] {
    return this.getMessages();
  }

  /** Removes every stored message. */
  clear(): void {
    this.messages = [];
  }
}
