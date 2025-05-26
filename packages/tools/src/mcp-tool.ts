import { Tool, ToolParameters } from './tool';

/**
 * MCP 工具配置
 */
export interface MCPToolConfig {
  /**
   * 工具名称
   */
  name: string;
  
  /**
   * 工具描述
   */
  description: string;
  
  /**
   * MCP 服务名称
   */
  serviceName: string;
  
  /**
   * MCP 方法名称
   */
  methodName: string;
  
  /**
   * 工具参数定义
   */
  parameters?: ToolParameters;
  
  /**
   * MCP 客户端
   */
  mcpClient: any;
  
  /**
   * 参数转换函数，将工具参数转换为 MCP 调用参数
   * @param args 工具参数
   * @returns MCP 调用参数
   */
  transformArgs?: (args: Record<string, any>) => any;
  
  /**
   * 结果转换函数，将 MCP 调用结果转换为工具结果
   * @param result MCP 调用结果
   * @returns 工具结果
   */
  transformResult?: (result: any) => any;
}

/**
 * MCP 工具
 * 
 * 包装 MCP 服务调用为工具
 */
export class MCPTool implements Tool {
  name: string;
  description: string;
  parameters?: ToolParameters;
  
  private serviceName: string;
  private methodName: string;
  private mcpClient: any;
  private transformArgs: (args: Record<string, any>) => any;
  private transformResult: (result: any) => any;
  
  /**
   * 创建 MCP 工具
   * @param config 配置参数
   */
  constructor(config: MCPToolConfig) {
    this.name = config.name;
    this.description = config.description;
    this.parameters = config.parameters;
    
    this.serviceName = config.serviceName;
    this.methodName = config.methodName;
    this.mcpClient = config.mcpClient;
    
    this.transformArgs = config.transformArgs || ((args) => args);
    this.transformResult = config.transformResult || ((result) => result);
  }
  
  /**
   * 执行工具
   * @param args 工具参数
   * @returns 执行结果
   */
  async invoke(args: Record<string, any>): Promise<any> {
    if (!this.mcpClient) {
      throw new Error('MCP 客户端未配置');
    }
    
    // 转换参数
    const mcpArgs = this.transformArgs(args);
    
    try {
      // 调用 MCP 服务
      const result = await this.mcpClient.call(
        this.serviceName,
        this.methodName,
        mcpArgs
      );
      
      // 转换结果
      return this.transformResult(result);
    } catch (error: any) {
      throw new Error(`MCP 服务调用失败: ${error.message || '未知错误'}`);
    }
  }
}

/**
 * 创建 MCP 工具
 * @param config 配置参数
 * @returns MCP 工具实例
 */
export function createMCPTool(config: MCPToolConfig): Tool {
  return new MCPTool(config);
}
