// 工具基础接口
export * from './tool';

// 工具集合
export * from './tool-set';

// 组件工具
export * from './component-tool';

// MCP 工具
export * from './mcp-tool';

import { createTool, Tool, ToolParameters } from './tool';
import { createToolSet } from './tool-set';
import { createComponentTool, ComponentToolConfig } from './component-tool';
import { createMCPTool, MCPToolConfig } from './mcp-tool';

// 默认导出
export default {
  // 工具创建
  createTool: (
    name: string,
    description: string,
    func: (args: Record<string, unknown>) => Promise<unknown> | unknown,
    parameters?: ToolParameters
  ) => {
    return createTool(name, description, func, parameters);
  },

  // 工具集合创建
  createToolSet: (tools: Tool[] = []) => {
    return createToolSet(tools);
  },

  // 组件工具创建
  createComponentTool: (config: ComponentToolConfig) => {
    return createComponentTool(config);
  },

  // MCP 工具创建
  createMCPTool: (config: MCPToolConfig) => {
    return createMCPTool(config);
  },
};
