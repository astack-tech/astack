import { Component } from '@astack-tech/core';

/**
 * 结果格式化组件 - 简化版本，直接传递输入数据
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
        // 简化处理：直接传递输入数据，但过滤掉 DOM 快照相关内容
        const result = this.processResult(data);
        this.outPort.send(result);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.outPort.send({ error: errorMessage });
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private processResult(data: any) {
    // 如果数据不是对象，则直接返回
    if (!data || typeof data !== 'object') {
      return data;
    }

    // 如果是错误对象，直接返回
    if (data.error) {
      return data;
    }

    // 如果是浏览器状态对象，过滤掉 DOM 快照以减少输出
    if (data.browserState && typeof data.browserState === 'object') {
      // 创建一个新对象，排除 domSnapshot
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { domSnapshot, ...filteredState } = data.browserState;
      return { ...data, browserState: filteredState };
    }

    // 如果是提取的数据结果，直接返回
    if (data.message && (data.elements || data.content)) {
      return data;
    }

    // 其他情况，直接返回输入数据
    return data;
  }
}
