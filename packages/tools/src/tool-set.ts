import { Tool } from './tool';

/**
 * 工具集合接口
 *
 * 用于组织和管理多个工具
 */
export interface ToolSet {
  /**
   * 获取所有工具
   * @returns 工具数组
   */
  getTools(): Tool[];

  /**
   * 获取指定名称的工具
   * @param name 工具名称
   * @returns 工具实例，如果不存在则返回 undefined
   */
  getTool(name: string): Tool | undefined;

  /**
   * 添加工具到集合
   * @param tool 工具实例
   */
  addTool(tool: Tool): void;

  /**
   * 移除工具
   * @param name 工具名称
   * @returns 是否成功移除
   */
  removeTool(name: string): boolean;

  /**
   * 获取工具数量
   * @returns 工具数量
   */
  size(): number;
}

/**
 * 默认工具集合实现
 */
export class DefaultToolSet implements ToolSet {
  private tools: Map<string, Tool>;

  /**
   * 创建工具集合
   * @param tools 初始工具数组
   */
  constructor(tools: Tool[] = []) {
    this.tools = new Map();
    tools.forEach(tool => this.addTool(tool));
  }

  /**
   * 获取所有工具
   * @returns 工具数组
   */
  getTools(): Tool[] {
    return Array.from(this.tools.values());
  }

  /**
   * 获取指定名称的工具
   * @param name 工具名称
   * @returns 工具实例，如果不存在则返回 undefined
   */
  getTool(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  /**
   * 添加工具到集合
   * @param tool 工具实例
   */
  addTool(tool: Tool): void {
    // TODO: duplicate check
    if (this.tools.has(tool.name)) return;
    this.tools.set(tool.name, tool);
  }

  /**
   * 移除工具
   * @param name 工具名称
   * @returns 是否成功移除
   */
  removeTool(name: string): boolean {
    return this.tools.delete(name);
  }

  /**
   * 获取工具数量
   * @returns 工具数量
   */
  size(): number {
    return this.tools.size;
  }
}

/**
 * 创建工具集合
 * @param tools 工具数组
 * @returns 工具集合实例
 */
export function createToolSet(tools: Tool[] = []): ToolSet {
  return new DefaultToolSet(tools);
}
