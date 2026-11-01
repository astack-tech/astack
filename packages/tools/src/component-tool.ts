import type { Component } from '@astack-tech/core';

import type { Tool, ToolParameters } from './tool';

/**
 * Options for `ComponentTool`.
 */
export interface ComponentToolConfig {
  /** Unique tool name. */
  name: string;
  /** Description that tells the model when to use the tool. */
  description: string;
  /** Component that runs when the tool is called. */
  component: Component;
  /** JSON Schema of the arguments. */
  parameters?: ToolParameters | undefined;
  /** Converts tool arguments to component input. Defaults to the identity function. */
  transformArgs?: ((args: Record<string, unknown>) => unknown) | undefined;
  /** Converts component output to the tool result. Defaults to the identity function. */
  transformResult?: ((result: unknown) => unknown) | undefined;
}

const identity = <T>(value: T): T => value;

/**
 * Exposes a component as a tool. The component runs in standalone mode through `run()`.
 */
export class ComponentTool implements Tool {
  readonly name: string;
  readonly description: string;
  readonly parameters: ToolParameters | undefined;

  private readonly component: Component;
  private readonly transformArgs: (args: Record<string, unknown>) => unknown;
  private readonly transformResult: (result: unknown) => unknown;

  constructor(config: ComponentToolConfig) {
    this.name = config.name;
    this.description = config.description;
    this.parameters = config.parameters;
    this.component = config.component;
    this.transformArgs = config.transformArgs ?? identity;
    this.transformResult = config.transformResult ?? identity;
  }

  async invoke(args: Record<string, unknown>): Promise<unknown> {
    const input = this.transformArgs(args);
    const result: unknown = await Promise.resolve(this.component.run(input));
    return this.transformResult(result);
  }
}

/**
 * Creates a tool that runs a component.
 */
export function createComponentTool(config: ComponentToolConfig): Tool {
  return new ComponentTool(config);
}
