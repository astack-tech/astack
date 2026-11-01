/**
 * Tool definitions for AStack agents: {@link createTool}, tool sets, component tools and
 * MCP tools.
 *
 * @packageDocumentation
 */

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
  /** Same as the named export {@link createTool}. */
  createTool,
  /** Same as the named export {@link createToolSet}. */
  createToolSet,
  /** Same as the named export {@link createComponentTool}. */
  createComponentTool,
  /** Same as the named export {@link createMCPTool}. */
  createMCPTool,
};

export default tools;
