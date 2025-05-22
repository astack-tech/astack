import { Component } from '@astack/core';
import { ResearchReport } from './content-analyzer';

/**
 * 网关组件配置
 */
export interface GatewayConfig {
  /**
   * 延迟发送搜索请求的时间（毫秒）
   * 确保主题先被设置
   */
  searchDelay?: number;
}

/**
 * 网关输入参数
 */
export interface GatewayInput {
  /**
   * 研究主题
   */
  topic: string;
  
  /**
   * API 密钥
   */
  apiKey?: string;
}

/**
 * 网关组件
 * 
 * 作为流水线的单一入口和出口点，控制组件间数据流动顺序
 * 
 * 输入:
 *   - input: 包含主题和 API 密钥的输入对象
 *   - reportIn: 从 enhancer 接收最终报告
 *   - analyzerReady: 接收分析器就绪信号
 * 
 * 输出:
 *   - topicOut: 发送主题到 analyzer
 *   - searchQueryOut: 发送搜索请求到 webDriver
 *   - apiKeyOut: 发送 API 密钥到 llm 组件
 *   - result: 发送最终结果
 */
class GatewayComponent extends Component {
  private searchDelay: number;
  
  constructor(config: GatewayConfig = {}) {
    super({});
    
    // 设置延迟时间，默认为 200 毫秒
    this.searchDelay = config.searchDelay ?? 200;
    
    // 定义输入端口
    Component.Port.I('input').attach(this);
    Component.Port.I('reportIn').attach(this);
    Component.Port.I('analyzerReady').attach(this);
    
    // 定义输出端口
    Component.Port.O('topicOut').attach(this);
    Component.Port.O('searchQueryOut').attach(this);
    Component.Port.O('apiKeyOut').attach(this);
    Component.Port.O('result').attach(this);
  }
  
  /**
   * 组件在流水线中运行的方法
   * @param $i 输入端口
   * @param $o 输出端口
   */
  _transform($i: any, $o: any) {
    let pendingTopic: string | null = null;
    
    // 处理输入请求
    $i('input').receive((input: GatewayInput) => {
      console.log(`网关收到输入: 主题=${input.topic}`);
      pendingTopic = input.topic;
      
      // 发送主题到分析器
      $o('topicOut').send(input.topic);
      console.log('已发送主题到 ContentAnalyzer');
      
      // 如果提供了 API 密钥，则发送给 LLM 组件
      if (input.apiKey) {
        $o('apiKeyOut').send(input.apiKey);
        console.log('已发送 API 密钥到 LLM 组件');
      }
    });
    
    // 监听分析器就绪信号
    $i('analyzerReady').receive(() => {
      console.log('[Gateway] 收到 ContentAnalyzer 就绪信号');
      
      if (pendingTopic) {
        // 保存主题的副本，防止在异步调用中丢失
        const topicToSearch = pendingTopic;
        
        // 发送搜索请求，使用延迟确保分析器已经设置了主题
        setTimeout(() => {
          console.log(`[Gateway] 发送搜索请求到WebDriver: ${topicToSearch}`);
          $o('searchQueryOut').send(topicToSearch);
        }, this.searchDelay);
        
        pendingTopic = null; // 清空待处理主题
      } else {
        console.log('[Gateway] 收到就绪信号，但没有待处理的主题');
      }
    });

    // 处理最终报告
    // 使用简单的去重机制
    let reportProcessed = false;
    $i('reportIn').receive((report: ResearchReport) => {
      // 如果已经处理过报告，则不重复处理
      if (reportProcessed) {
        console.log('[Gateway] 报告已处理过，忽略重复数据');
        return;
      }
      
      console.log('网关收到最终报告，准备发送结果 ...');
      
      // 同时发送到 result 端口和 out 端口
      // 发送到 result 端口供用户逻辑使用
      $o('result').send(report);
      console.log('[Gateway] 报告已发送到 result 端口');
      
      // 发送到 out 端口供流水线结束使用
      // Pipeline 会自动检测最后一个组件的 out 端口作为终点
      $o('out').send(report);
      console.log('[Gateway] 报告同时发送到 out 端口，供流水线结束使用');
      
      // 标记报告已处理
      reportProcessed = true;
    });
  }

  /**
   * 组件独立运行方法
   * @param input 输入数据
   * @returns 研究报告 Promise
   */
  run(input: GatewayInput): Promise<ResearchReport> {
    console.log(`网关组件独立运行: 主题=${input.topic}`);
    
    // 创建一个承诺，等待最终报告
    return new Promise<ResearchReport>((resolve) => {
      // 设置内部转换，类似于流水线模式下的操作
      this._transform(
        // 输入端口处理函数
        (name: string) => ({
          receive: (callback: (data: any) => void) => {
            // 对于 input 端口，立即使用提供的输入调用
            if (name === 'input') {
              setTimeout(() => callback(input), 0);
            }
            // 对于 analyzerReady，在短暂延迟后模拟就绪信号
            if (name === 'analyzerReady') {
              setTimeout(() => callback(true), 50);
            }
          }
        }),
        // 输出端口处理函数
        (name: string) => ({
          send: (data: any) => {
            // 当数据发送到 result 端口时，解析承诺
            if (name === 'result') {
              console.log('网关在 run 方法中收到最终报告，完成流程');
              resolve(data as ResearchReport);
            }
          }
        })
      );
    });
  }
}

export default GatewayComponent;
