# Interface: ToolInvokerConfig

Defined in: [packages/components/src/tool-invoker/index.ts:33](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L33)

Options for `ToolInvoker`.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-parallel"></a> `parallel?` | `boolean` | Run tool calls concurrently. Defaults to false (one at a time, in order). | [packages/components/src/tool-invoker/index.ts:39](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L39) |
| <a id="property-timeout"></a> `timeout?` | `number` | Timeout for each tool call in milliseconds. Defaults to 30000. | [packages/components/src/tool-invoker/index.ts:41](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L41) |
| <a id="property-tools"></a> `tools` | `ToolSet` \| `Tool`[] | Tools that can be called, as an array or a `ToolSet`. | [packages/components/src/tool-invoker/index.ts:35](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L35) |
| <a id="property-verbose"></a> `verbose?` | `boolean` | Log progress through the console. Defaults to false. | [packages/components/src/tool-invoker/index.ts:37](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L37) |
