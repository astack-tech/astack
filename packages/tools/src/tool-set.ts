import type { Tool } from './tool';

/**
 * A collection of tools indexed by name.
 */
export interface ToolSet {
  /** Returns every tool in insertion order. */
  getTools(): Tool[];
  /** Returns the tool named `name`, or `undefined`. */
  getTool(name: string): Tool | undefined;
  /** Adds a tool. When the name is already registered, the first tool is kept. */
  addTool(tool: Tool): void;
  /** Removes the tool named `name`. Returns `true` when a tool was removed. */
  removeTool(name: string): boolean;
  /** Returns the number of tools. */
  size(): number;
}

/**
 * Map-backed `ToolSet` implementation.
 */
export class DefaultToolSet implements ToolSet {
  private readonly tools = new Map<string, Tool>();

  /**
   * @param tools - Initial tools. Later duplicates of a name are ignored.
   */
  constructor(tools: Tool[] = []) {
    for (const tool of tools) {
      this.addTool(tool);
    }
  }

  getTools(): Tool[] {
    return [...this.tools.values()];
  }

  getTool(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  addTool(tool: Tool): void {
    if (this.tools.has(tool.name)) {
      return;
    }
    this.tools.set(tool.name, tool);
  }

  removeTool(name: string): boolean {
    return this.tools.delete(name);
  }

  size(): number {
    return this.tools.size;
  }
}

/**
 * Creates a `ToolSet` from a list of tools.
 */
export function createToolSet(tools: Tool[] = []): ToolSet {
  return new DefaultToolSet(tools);
}
