import { Component } from '@astack-tech/core';

/**
 * 结果格式化组件 - 将浏览器操作结果转换为卡片格式
 * 遵循 AStack 的 "一切皆组件" 原则，支持零适配层设计
 */
export class ResultFormatter extends Component {
  constructor() {
    super({});
    // 组件端口定义 - 只定义自定义的 data 入口
    // 默认已有 this.outPort 对应端口名 'out'
    Component.Port.I('data').attach(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _transform($i: any) {
    $i('data').receive(async (data: unknown) => {
      try {
        // 将收集到的数据转换为美观的卡片格式
        const card = this.formatAsCard(data);
        this.outPort.send(card);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.outPort.send({ error: errorMessage });
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private formatAsCard(data: any) {
    if (!data || typeof data !== 'object') {
      return { content: 'No valid data received', type: 'error' };
    }

    // 检测数据类型并应用适当的格式
    if (Array.isArray(data)) {
      // 处理数据列表
      return {
        type: 'listCard',
        title: '结果列表',
        items: data.map((item, index) => ({
          id: `item-${index}`,
          title: this.extractTitle(item),
          content: this.extractContent(item),
          metadata: this.extractMetadata(item),
        })),
      };
    } else if (data.title || data.name) {
      // 处理单个实体数据
      return {
        type: 'entityCard',
        title: data.title || data.name,
        description: data.description || data.summary || '',
        attributes: Object.entries(data)
          .filter(([key]) => !['title', 'name', 'description', 'summary'].includes(key))
          .reduce((acc: Record<string, unknown>, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {}),
      };
    } else {
      // 处理通用数据
      return {
        type: 'dataCard',
        content: JSON.stringify(data, null, 2),
      };
    }
  }

  // 从项目中提取标题
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private extractTitle(item: any): string {
    if (typeof item !== 'object') return String(item);

    // 尝试找出最适合作为标题的字段
    const titleFields = ['title', 'name', 'heading', 'subject', 'label'];

    for (const field of titleFields) {
      if (item[field] && typeof item[field] === 'string') {
        return item[field];
      }
    }

    // 如果没有明确的标题字段，使用第一个字符串字段
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [key, value] of Object.entries(item)) {
      if (typeof value === 'string' && value.length < 100) {
        return value;
      }
    }

    return '项目';
  }

  // 从项目中提取内容
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private extractContent(item: any): string {
    if (typeof item !== 'object') return '';

    // 尝试找出最适合作为内容的字段
    const contentFields = ['description', 'content', 'text', 'body', 'summary'];

    for (const field of contentFields) {
      if (item[field] && typeof item[field] === 'string') {
        return item[field];
      }
    }

    return '';
  }

  // 提取其他元数据
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private extractMetadata(item: any): Record<string, unknown> {
    if (typeof item !== 'object') return {};

    const ignoredFields = [
      'title',
      'name',
      'heading',
      'subject',
      'label',
      'description',
      'content',
      'text',
      'body',
      'summary',
    ];

    return Object.entries(item)
      .filter(([key]) => !ignoredFields.includes(key))
      .reduce((acc: Record<string, unknown>, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  }
}
