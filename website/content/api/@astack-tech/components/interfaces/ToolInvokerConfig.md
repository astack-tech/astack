# Interface: ToolInvokerConfig

Defined in: [packages/components/src/tool-invoker/index.ts:32](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L32)

Options for `ToolInvoker`.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-parallel"></a> `parallel?` | `boolean` | Run tool calls concurrently. Defaults to false (one at a time, in order). | [packages/components/src/tool-invoker/index.ts:38](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L38) |
| <a id="property-timeout"></a> `timeout?` | `number` | Timeout for each tool call in milliseconds. Defaults to 30000. | [packages/components/src/tool-invoker/index.ts:40](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L40) |
| <a id="property-tools"></a> `tools` | `ToolSet` \| `Tool`[] | Tools that can be called, as an array or a `ToolSet`. | [packages/components/src/tool-invoker/index.ts:34](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L34) |
| <a id="property-verbose"></a> `verbose?` | `boolean` | Log progress through the console. Defaults to false. | [packages/components/src/tool-invoker/index.ts:36](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L36) |
