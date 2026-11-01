import { createComponentTool } from './component-tool';
import { createMCPTool } from './mcp-tool';
import { createTool } from './tool';
import { createToolSet } from './tool-set';

export * from './component-tool';
export * from './mcp-tool';
export * from './tool';
export * from './tool-set';

/**
 * Default export kept for backward compatibility. Prefer the named exports.
 */
const tools = {
  createTool,
  createToolSet,
  createComponentTool,
  createMCPTool,
};

export default tools;
