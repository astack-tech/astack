import { Component } from '@astack-tech/core';
import type { StreamingChunk } from '@astack-tech/components';

export interface StreamEvent {
  source: 'planner' | 'browser';
  chunk: StreamingChunk;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: Record<string, any>;
}

/**
 * StreamCollector 用于收集并转发来自各个组件的流式输出。
 * 组件会将事件打印到终端，并通过 events 端口转发给下游组件。
 * 为了提升可读性，这里对文本类 chunk 做了增量缓冲，模拟打字机效果。
 */
export class StreamCollector extends Component {
  private buffers: Record<string, string> = {};
  private prefixPrinted: Set<string> = new Set();

  constructor() {
    super({});
    Component.Port.I('planner').attach(this);
    Component.Port.I('browser').attach(this);
    Component.Port.O('events').attach(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _transform($i: any, $o: any): void {
    const forward =
      (fallbackSource: StreamEvent['source']) =>
      (event: StreamEvent | StreamingChunk | undefined) => {
        if (!event) return;

        const payload: StreamEvent =
          typeof event === 'object' && 'chunk' in event
            ? { source: event.source ?? fallbackSource, chunk: event.chunk, context: event.context }
            : { source: fallbackSource, chunk: event as StreamingChunk };

        this.logEvent(payload);
        $o('events').send(payload);
      };

    $i('planner').receive(forward('planner'));
    $i('browser').receive(forward('browser'));
  }

  private logEvent(event: StreamEvent) {
    const { source, chunk } = event;
    const baseLabel = `[StreamCollector][${source}]`;

    switch (chunk.type) {
      case 'model_thinking':
      case 'assistant_message': {
        this.printStreamingText(baseLabel, source, chunk.content ?? '');
        break;
      }
      case 'iteration_start':
        this.ensureLineBreak(source);
        console.log(`${baseLabel} iteration ${chunk.iteration ?? 0} started`);
        break;
      case 'tool_start':
        this.ensureLineBreak(source);
        console.log(`${baseLabel} tool ${chunk.toolName ?? 'unknown'} started`);
        break;
      case 'tool_result':
        this.ensureLineBreak(source);
        console.log(`${baseLabel} tool ${chunk.toolName ?? 'unknown'} result`, chunk.result);
        break;
      case 'completed':
        this.ensureLineBreak(source);
        console.log(`${baseLabel} completed`);
        if (chunk.finalMessage) {
          console.log(`${baseLabel} final message: ${chunk.finalMessage}`);
        }
        delete this.buffers[source];
        break;
      case 'error':
        this.ensureLineBreak(source);
        console.error(`${baseLabel} error: ${chunk.error ?? 'unknown error'}`);
        delete this.buffers[source];
        break;
      default:
        this.ensureLineBreak(source);
        console.log(`${baseLabel} chunk`, chunk);
    }
  }

  private printStreamingText(label: string, source: string, text: string) {
    if (!text) return;

    const previous = this.buffers[source] ?? '';
    let addition = text;

    if (text.startsWith(previous)) {
      addition = text.slice(previous.length);
    }

    if (!addition) return;

    this.buffers[source] = text;
    this.writeWithPrefix(label, source, addition);
  }

  private writeWithPrefix(label: string, source: string, text: string) {
    const prefix = `${label} `;

    if (!this.prefixPrinted.has(source)) {
      this.prefixPrinted.add(source);
      this.writeRaw(prefix);
    }

    this.writeRaw(text);
  }

  private ensureLineBreak(source: string) {
    if (this.prefixPrinted.has(source)) {
      this.prefixPrinted.delete(source);
      this.writeRaw('\n');
    }
  }

  private writeRaw(text: string) {
    if (typeof process !== 'undefined' && process.stdout) {
      process.stdout.write(text);
    } else {
      // Fallback: 浏览器或其他环境下直接打印
      // eslint-disable-next-line no-console
      console.log(text);
    }
  }
}

export default StreamCollector;
