import { Component } from '@astack/core';

export interface TextSplitterConfig {
  // 文本块的最大长度
  chunkSize?: number;
  // 块之间的重叠部分长度
  overlap?: number;
  // 分隔符，默认是段落(换行符)
  separator?: string | RegExp;
}

/**
 * TextSplitter 组件
 * 
 * 将长文本分割成小块，用于进一步处理
 * 
 * 输入:
 *   - text: 需要分割的文本
 * 
 * 输出:
 *   - chunks: 分割后的文本块数组
 */
class TextSplitter extends Component {
  // 组件配置
  private chunkSize: number;
  private overlap: number;
  private separator: string | RegExp | undefined;

  constructor(config: TextSplitterConfig = {}) {
    super({});
    
    // 设置配置参数，提供默认值
    const { chunkSize = 1000, overlap = 200, separator = /\n\s*\n/ } = config;
    this.chunkSize = chunkSize;
    this.overlap = overlap;
    this.separator = separator; // 默认按段落分割

    // rename in
    this.Port.I("text").attach(this);
  }
  
  /**
   * 将文本分割成小块
   */
  splitText(text: string): string[] {
    if (!text || text.length === 0) {
      return [];
    }
    
    const { chunkSize, overlap, separator } = { 
      chunkSize: this.chunkSize,
      overlap: this.overlap,
      separator: this.separator
    };
    
    // 如果长度小于块大小，直接返回
    if (text.length <= chunkSize) {
      return [text];
    }
    
    let chunks: string[] = [];
    
    // 按分隔符分割
    if (separator) {
      const segments = text.split(separator);
      let currentChunk = '';
      
      for (const segment of segments) {
        // 如果添加这个段落会超过块大小，则先保存当前块
        if (currentChunk && (currentChunk.length + segment.length > chunkSize)) {
          chunks.push(currentChunk);
          // 保留重叠部分
          const lastSegments = currentChunk.split(separator).slice(-2);
          currentChunk = lastSegments.length > 0 ? lastSegments.join('\n\n') : '';
        }
        
        // 添加当前段落
        if (currentChunk) {
          currentChunk += '\n\n' + segment;
        } else {
          currentChunk = segment;
        }
      }
      
      // 添加最后一个块
      if (currentChunk) {
        chunks.push(currentChunk);
      }
    } 
    // 如果没有分隔符，按字符分割
    else {
      for (let i = 0; i < text.length; i += chunkSize - overlap) {
        const chunk = text.substring(i, Math.min(i + chunkSize, text.length));
        chunks.push(chunk);
      }
    }
    
    return chunks;
  }
  
  /**
   * 覆盖实现 Component 基类的 process 方法
   * 处理输入文本，并返回分割后的块
   */
  process(input: unknown): string[] {
    // 确保输入是字符串
    const text = typeof input === 'string' ? input : String(input);
    
    // 分割文本并返回结果
    return this.splitText(text);
  }

  _transform($i: any, $o: any) {
    $i('text').receive((input: unknown) => {
      const output = this.process(input);
      $o('out').send(output);
    });
  }
}

export default TextSplitter;
