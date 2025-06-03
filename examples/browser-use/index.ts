import { Pipeline, Component } from '@astack-tech/core';
import { ModelProvider } from '@astack-tech/integrations';
import { PlanningAgent } from './components/PlanningAgent';
import { BrowserAgent } from './components/BrowserAgent';
import { ResultFormatter } from './components/ResultFormatter';
import { BrowserStateComponent } from './components/BrowserStateComponent';

/**
 * 简单的输出收集组件 - 用于收集并返回 pipeline 的最终结果
 */
class OutputCollector extends Component {
  constructor() {
    super({});
    Component.Port.I('result').attach(this);
    Component.Port.O('output').attach(this);
    Component.Port.O('result').attach(this); // 添加 result 输出端口，用于转发结果到浏览器停止端口
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _transform($i: any, $o: any) {
    $i('result').receive((data: unknown) => {
      console.log('[OutputCollector] 收集到最终结果', data);
      $o('output').send(data); // 返回结果给 pipeline
      $o('result').send(data); // 将结果转发到停止端口
    });
  }
}

import type { ModelProvider as ModelProviderType } from '@astack-tech/components';

/**
 * 基于 AStack 框架的浏览器自动化示例
 * 展示如何使用组件模式构建支持从自然语言到浏览器操作的端到端流程
 */
async function main() {
  // 检查 API 密钥
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.error('错误: 需要设置 DEEPSEEK_API_KEY 环境变量');
    process.exit(1);
  }

  console.log('初始化 Browser Use 示例...');

  // 创建 LLM 提供者
  const modelProvider = new ModelProvider.Deepseek({
    apiKey,
    model: 'deepseek-chat', // 使用 Deepseek 模型
    temperature: 0.5,
  }) as ModelProviderType;

  // 创建主 Pipeline
  const pipeline = new Pipeline();

  // 添加组件，遵循 "一切皆组件" 原则
  pipeline.addComponent('planner', new PlanningAgent({ modelProvider }));
  pipeline.addComponent('browserState', new BrowserStateComponent());
  pipeline.addComponent('browser', new BrowserAgent({ modelProvider }));
  pipeline.addComponent('formatter', new ResultFormatter());
  pipeline.addComponent('collector', new OutputCollector()); // 添加输出收集组件

  // 建立组件之间的连接

  // 浏览器状态管理连接
  pipeline.connect('browser.stateUpdate', 'browserState.update'); // 浏览器代理向状态组件发送状态更新
  pipeline.connect('browserState.broadcast', 'browser.state'); // 状态组件向浏览器代理广播状态

  // 任务规划与执行
  pipeline.connect('planner.plan', 'browser.task'); // 规划器输出任务到浏览器

  pipeline.connect('browser.result', 'browser.stop');
  pipeline.connect('browser.result', 'formatter.data'); // 浏览器结果输出到格式化组件

  try {
    // 示例：执行自然语言任务
    console.log('执行查询任务...');
    const userIntent =
      process.argv[2] || '请给我查询 https://github.com/astack-tech/astack 开源项目最新的 star 数';

    // 运行 Pipeline，通过规划器输入意图
    console.log('运行 Pipeline，通过规划器输入意图...');
    console.log('等待 pipeline.run() 完成...');
    const result = await pipeline.run('planner.intent', userIntent);
    console.log('★★★ pipeline.run() 执行完成！★★★');

    // 显示结果
    console.log('\n任务执行完成！结果卡片：');
    console.log(JSON.stringify(result, null, 2));
    console.log('★★★ Pipeline execution completed. ★★★');
  } catch (error) {
    console.error('执行过程中出错:', error);
  }
}

// 执行主函数
main().catch(console.error);
