import { Component } from '@astack-tech/core';
import { describe, expect, it, vi } from 'vitest';

import defaultExport, {
  ComponentTool,
  DefaultToolSet,
  MCPTool,
  createComponentTool,
  createMCPTool,
  createTool,
  createToolSet,
} from '../index';
import type { MCPClient, Tool } from '../index';

const parameters = {
  type: 'object',
  properties: { a: { type: 'number' } },
  required: ['a'],
};

class Square extends Component {
  constructor() {
    super({});
  }

  override run(data: unknown): number {
    const value = data as number;
    return value * value;
  }
}

class AsyncEcho extends Component {
  constructor() {
    super({});
  }

  override run(data: unknown): Promise<unknown> {
    return Promise.resolve(data);
  }
}

describe('createTool', () => {
  it('exposes name, description and parameters', () => {
    const tool = createTool('sum', 'Adds numbers', () => 0, parameters);

    expect(tool.name).toBe('sum');
    expect(tool.description).toBe('Adds numbers');
    expect(tool.parameters).toBe(parameters);
  });

  it('wraps a synchronous function', async () => {
    const tool = createTool('sum', 'Adds numbers', args => Number(args['a']) + Number(args['b']));

    await expect(tool.invoke({ a: 1, b: 2 })).resolves.toBe(3);
  });

  it('wraps an asynchronous function', async () => {
    const tool = createTool('later', 'Resolves later', () => Promise.resolve('done'));

    await expect(tool.invoke({})).resolves.toBe('done');
  });

  it('propagates errors from the function', async () => {
    const tool = createTool('fail', 'Always fails', () => {
      throw new Error('boom');
    });

    await expect(tool.invoke({})).rejects.toThrow('boom');
  });
});

describe('DefaultToolSet', () => {
  const first: Tool = createTool('a', 'first', () => 1);
  const duplicate: Tool = createTool('a', 'duplicate', () => 2);
  const second: Tool = createTool('b', 'second', () => 3);

  it('keeps the first tool when a name is registered twice', () => {
    const set = new DefaultToolSet([first, duplicate, second]);

    expect(set.size()).toBe(2);
    expect(set.getTool('a')).toBe(first);
    expect(set.getTools()).toEqual([first, second]);
  });

  it('adds and removes tools', () => {
    const set = createToolSet();
    set.addTool(first);

    expect(set.getTool('a')).toBe(first);
    expect(set.removeTool('a')).toBe(true);
    expect(set.removeTool('a')).toBe(false);
    expect(set.getTool('a')).toBeUndefined();
    expect(set.size()).toBe(0);
  });
});

describe('ComponentTool', () => {
  it('runs the component with the raw arguments by default', async () => {
    const tool = new ComponentTool({
      name: 'echo',
      description: 'Echo',
      component: new AsyncEcho(),
    });

    await expect(tool.invoke({ x: 1 })).resolves.toEqual({ x: 1 });
    expect(tool.parameters).toBeUndefined();
  });

  it('applies argument and result transforms', async () => {
    const tool = createComponentTool({
      name: 'square',
      description: 'Squares a number',
      component: new Square(),
      parameters,
      transformArgs: args => args['a'],
      transformResult: result => ({ squared: result }),
    });

    await expect(tool.invoke({ a: 3 })).resolves.toEqual({ squared: 9 });
    expect(tool.parameters).toBe(parameters);
  });
});

describe('MCPTool', () => {
  it('calls the client with service, method and arguments', async () => {
    const call = vi.fn<MCPClient['call']>().mockResolvedValue({ ok: true });
    const tool = new MCPTool({
      name: 'search',
      description: 'Search',
      serviceName: 'docs',
      methodName: 'search',
      mcpClient: { call },
    });

    await expect(tool.invoke({ q: 'astack' })).resolves.toEqual({ ok: true });
    expect(call).toHaveBeenCalledWith('docs', 'search', { q: 'astack' });
  });

  it('applies argument and result transforms', async () => {
    const call = vi.fn<MCPClient['call']>().mockReturnValue(5);
    const tool = createMCPTool({
      name: 'double',
      description: 'Double',
      serviceName: 'math',
      methodName: 'double',
      parameters,
      mcpClient: { call },
      transformArgs: args => [args['a']],
      transformResult: result => Number(result) * 2,
    });

    await expect(tool.invoke({ a: 1 })).resolves.toBe(10);
    expect(call).toHaveBeenCalledWith('math', 'double', [1]);
  });

  it('wraps client errors and keeps the cause', async () => {
    const cause = new Error('unreachable');
    const tool = new MCPTool({
      name: 'x',
      description: 'x',
      serviceName: 's',
      methodName: 'm',
      mcpClient: { call: () => Promise.reject(cause) },
    });

    const error = await tool.invoke({}).catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe('MCP call failed: unreachable');
    expect((error as Error).cause).toBe(cause);
  });

  it('wraps non-Error rejections', async () => {
    const tool = new MCPTool({
      name: 'x',
      description: 'x',
      serviceName: 's',
      methodName: 'm',
      mcpClient: {
        call: () => {
          // eslint-disable-next-line @typescript-eslint/only-throw-error -- verifies handling of non-Error values.
          throw 'plain string';
        },
      },
    });

    await expect(tool.invoke({})).rejects.toThrow('MCP call failed: plain string');
  });
});

describe('default export', () => {
  it('exposes the factory functions', () => {
    expect(defaultExport.createTool).toBe(createTool);
    expect(defaultExport.createToolSet).toBe(createToolSet);
    expect(defaultExport.createComponentTool).toBe(createComponentTool);
    expect(defaultExport.createMCPTool).toBe(createMCPTool);
  });
});
