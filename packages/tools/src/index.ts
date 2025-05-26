// 工具基础接口
export * from './tool';

// 工具集合
export * from './tool-set';

// 组件工具
export * from './component-tool';

// MCP 工具
export * from './mcp-tool';

// 默认导出
export default {
  // 工具创建
  createTool: (
    name: string,
    description: string,
    func: (args: Record<string, any>) => Promise<any> | any,
    parameters?: any
  ) => {
    const { createTool } = require('./tool');
    return createTool(name, description, func, parameters);
  },
  
  // 工具集合创建
  createToolSet: (tools: any[] = []) => {
    const { createToolSet } = require('./tool-set');
    return createToolSet(tools);
  },
  
  // 组件工具创建
  createComponentTool: (config: any) => {
    const { createComponentTool } = require('./component-tool');
    return createComponentTool(config);
  },
  
  // MCP 工具创建
  createMCPTool: (config: any) => {
    const { createMCPTool } = require('./mcp-tool');
    return createMCPTool(config);
  }
};
