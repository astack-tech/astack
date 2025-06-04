import { Component } from '@astack-tech/core';
import { InteractiveElement } from '../utils/dom-annotator';

/**
 * BrowserStateComponent
 *
 * 用于管理和共享浏览器状态的组件
 * 包括当前 URL、DOM 快照、最后操作等信息
 */
export class BrowserStateComponent extends Component {
  // 浏览器状态
  private state: {
    currentUrl: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    domSnapshot: { interactive: InteractiveElement[]; meta: any };
    lastAction?: string;
    lastError?: string;
    lastUpdateTime: number;
  } = {
    currentUrl: 'about:blank',
    domSnapshot: { interactive: [], meta: {} },
    lastUpdateTime: Date.now(),
  };

  constructor() {
    super({});
    // 定义输入输出端口
    Component.Port.I('update').attach(this); // 接收状态更新
    Component.Port.I('get').attach(this); // 获取当前状态
    Component.Port.O('broadcast').attach(this); // 输出状态

    console.log('[BrowserState] 组件已初始化');
  }

  /**
   * 处理组件消息转换
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _transform($i: any, $o: any) {
    // 更新状态
    $i('update').receive((update: Partial<typeof this.state>) => {
      const oldUrl = this.state.currentUrl;
      const oldDomSize = JSON.stringify(this.state.domSnapshot).length;

      // 更新状态
      this.state = {
        ...this.state,
        ...update,
        lastUpdateTime: Date.now(),
      };

      // 记录日志
      console.log(`[BrowserState] 状态已更新:`);

      // 记录 URL 变化
      if (oldUrl !== this.state.currentUrl) {
        console.log(`  URL: ${oldUrl} => ${this.state.currentUrl}`);
      }

      // 记录 DOM 变化
      if (oldDomSize !== JSON.stringify(this.state.domSnapshot).length) {
        console.log(
          `  DOM 快照: ${oldDomSize} => ${JSON.stringify(this.state.domSnapshot).length} 字符`
        );
      }

      // 记录最后动作
      if (update.lastAction) {
        console.log(`  最后动作: ${update.lastAction}`);
      }

      // 记录错误(如果有)
      if (update.lastError) {
        console.log(`  错误: ${update.lastError}`);
      }

      // 发送更新后的状态
      $o('broadcast').send(this.state);
    });

    // 获取当前状态
    $i('get').receive(() => {
      console.log('[BrowserState] 收到状态请求');
      $o('broadcast').send(this.state);
    });
  }
}

export default BrowserStateComponent;
