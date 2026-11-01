import type { Tool, ToolParameters } from './tool';

/**
 * Minimal client interface that `MCPTool` needs. Adapt your MCP SDK client to it.
 */
export interface MCPClient {
  /** Calls `methodName` on the MCP service `serviceName`. May return a value or a promise. */
  call(serviceName: string, methodName: string, args: unknown): unknown;
}

/**
 * Options for `MCPTool`.
 */
export interface MCPToolConfig {
  /** Unique tool name. */
  name: string;
  /** Description that tells the model when to use the tool. */
  description: string;
  /** MCP service name. */
  serviceName: string;
  /** MCP method name. */
  methodName: string;
  /** Client that performs the call. */
  mcpClient: MCPClient;
  /** JSON Schema of the arguments. */
  parameters?: ToolParameters | undefined;
  /** Converts tool arguments to MCP call arguments. Defaults to the identity function. */
  transformArgs?: ((args: Record<string, unknown>) => unknown) | undefined;
  /** Converts the MCP result to the tool result. Defaults to the identity function. */
  transformResult?: ((result: unknown) => unknown) | undefined;
}

const identity = <T>(value: T): T => value;

/**
 * Exposes one MCP service method as a tool.
 */
export class MCPTool implements Tool {
  readonly name: string;
  readonly description: string;
  readonly parameters: ToolParameters | undefined;

  private readonly serviceName: string;
  private readonly methodName: string;
  private readonly mcpClient: MCPClient;
  private readonly transformArgs: (args: Record<string, unknown>) => unknown;
  private readonly transformResult: (result: unknown) => unknown;

  constructor(config: MCPToolConfig) {
    this.name = config.name;
    this.description = config.description;
    this.parameters = config.parameters;
    this.serviceName = config.serviceName;
    this.methodName = config.methodName;
    this.mcpClient = config.mcpClient;
    this.transformArgs = config.transformArgs ?? identity;
    this.transformResult = config.transformResult ?? identity;
  }

  /**
   * Calls the MCP method.
   *
   * @throws Error that wraps the client error message.
   */
  async invoke(args: Record<string, unknown>): Promise<unknown> {
    const mcpArgs = this.transformArgs(args);

    let result: unknown;
    try {
      result = await Promise.resolve(
        this.mcpClient.call(this.serviceName, this.methodName, mcpArgs)
      );
    } catch (error) {
      throw new Error(
        `MCP call failed: ${error instanceof Error ? error.message : String(error)}`,
        { cause: error }
      );
    }
    return this.transformResult(result);
  }
}

/**
 * Creates a tool that calls an MCP service method.
 */
export function createMCPTool(config: MCPToolConfig): Tool {
  return new MCPTool(config);
}
