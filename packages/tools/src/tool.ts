/**
 * 工具参数类型定义，遵循 JSON Schema 格式
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ToolParameters = {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: Record<string, any>;
  required?: string[];
  additionalProperties?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

/**
 * 工具调用结果
 */
export interface ToolCallResult {
  /**
   * 工具调用结果
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any;

  /**
   * 工具调用的原始信息
   */
  origin?: ToolCall;
}

/**
 * 工具调用信息
 */
export interface ToolCall {
  /**
   * 工具调用 ID
   */
  id?: string;

  /**
   * 工具名称
   */
  tool_name: string;

  /**
   * 工具调用参数
   */
  arguments: Record<string, unknown>;
}

/**
 * 工具接口
 *
 * 定义了一个工具的基本结构和行为
 */
export interface Tool {
  /**
   * 工具名称
   */
  name: string;

  /**
   * 工具描述
   */
  description: string;

  /**
   * 工具参数定义
   */
  parameters?: ToolParameters;

  /**
   * 执行工具
   * @param args 调用参数
   * @returns 执行结果
   */
  invoke(args: Record<string, unknown>): Promise<unknown>;
}

/**
 * 创建一个简单工具
 * @param name 工具名称
 * @param description 工具描述
 * @param func 工具函数
 * @param parameters 参数定义
 * @returns 工具实例
 */
export function createTool(
  name: string,
  description: string,
  func: (args: Record<string, unknown>) => Promise<unknown> | unknown,
  parameters?: ToolParameters
): Tool {
  return {
    name,
    description,
    parameters,
    invoke: async (args: Record<string, unknown>) => {
      return await Promise.resolve(func(args));
    },
  };
}
