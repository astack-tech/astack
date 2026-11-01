/**
 * JSON Schema object that describes the arguments of a tool.
 */
export interface ToolParameters {
  type: string;
  properties: Record<string, unknown>;
  required?: string[] | undefined;
  additionalProperties?: boolean | undefined;
  [key: string]: unknown;
}

/**
 * A tool call requested by a model.
 */
export interface ToolCall {
  /** Identifier assigned by the model provider. */
  id?: string | undefined;
  /** Name of the tool to call. */
  tool_name: string;
  /** Arguments for the tool. */
  arguments: Record<string, unknown>;
}

/**
 * The result of a tool call.
 */
export interface ToolCallResult {
  /** Value returned by the tool. */
  result: unknown;
  /** The call that produced this result. */
  origin?: ToolCall | undefined;
}

/**
 * A capability that an agent can call by name.
 */
export interface Tool {
  /** Unique tool name. */
  name: string;
  /** Description that tells the model when to use the tool. */
  description: string;
  /** JSON Schema of the arguments. */
  parameters?: ToolParameters | undefined;
  /**
   * Runs the tool.
   * @param args Arguments that match `parameters`.
   */
  invoke(args: Record<string, unknown>): Promise<unknown>;
}

/**
 * Function that implements a tool. It may return a value or a promise.
 */
export type ToolFunction = (args: Record<string, unknown>) => unknown;

/**
 * Creates a tool from a plain function.
 *
 * @param name Unique tool name.
 * @param description Description that tells the model when to use the tool.
 * @param func Implementation. Synchronous and asynchronous functions are both accepted.
 * @param parameters JSON Schema of the arguments.
 */
export function createTool(
  name: string,
  description: string,
  func: ToolFunction,
  parameters?: ToolParameters
): Tool {
  return {
    name,
    description,
    parameters,
    invoke: async (args: Record<string, unknown>): Promise<unknown> => {
      return await Promise.resolve(func(args));
    },
  };
}
