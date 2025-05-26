import { Component } from '@astack/core';
import { Tool, ToolParameters } from './tool';

/**
 * ComponentTool 配置
 */
export interface ComponentToolConfig {
  /**
   * 工具名称
   */
  name: string;
  
  /**
   * 工具描述
   */
  description: string;
  
  /**
   * 组件实例
   */
  component: Component;
  
  /**
   * 输入端口名称，默认为 'in'
   */
  inputPort?: string;
  
  /**
   * 输出端口名称，默认为 'out'
   */
  outputPort?: string;
  
  /**
   * 工具参数定义
   */
  parameters?: ToolParameters;
  
  /**
   * 参数转换函数，将工具参数转换为组件输入
   * @param args 工具参数
   * @returns 组件输入
   */
  transformArgs?: (args: Record<string, any>) => any;
  
  /**
   * 结果转换函数，将组件输出转换为工具结果
   * @param result 组件输出
   * @returns 工具结果
   */
  transformResult?: (result: any) => any;
}

/**
 * 组件工具
 * 
 * 将 astack 组件包装为工具
 */
export class ComponentTool implements Tool {
  name: string;
  description: string;
  parameters?: ToolParameters;
  
  private component: Component;
  private inputPort: string;
  private outputPort: string;
  private transformArgs: (args: Record<string, any>) => any;
  private transformResult: (result: any) => any;
  
  /**
   * 创建组件工具
   * @param config 配置参数
   */
  constructor(config: ComponentToolConfig) {
    this.name = config.name;
    this.description = config.description;
    this.parameters = config.parameters;
    
    this.component = config.component;
    this.inputPort = config.inputPort || 'in';
    this.outputPort = config.outputPort || 'out';
    
    this.transformArgs = config.transformArgs || ((args) => args);
    this.transformResult = config.transformResult || ((result) => result);
  }
  
  /**
   * 执行工具
   * @param args 工具参数
   * @returns 执行结果
   */
  async invoke(args: Record<string, any>): Promise<any> {
    // 转换参数
    const input = this.transformArgs(args);
    
    // 以独立模式运行组件
    if (typeof this.component.run === 'function') {
      const result = await this.component.run(input);
      return this.transformResult(result);
    }
    
    // 如果组件不支持独立运行，则抛出错误
    throw new Error(`组件 ${this.name} 不支持独立运行模式`);
  }
}

/**
 * 创建组件工具
 * @param config 配置参数
 * @returns 组件工具实例
 */
export function createComponentTool(config: ComponentToolConfig): Tool {
  return new ComponentTool(config);
}
