# Interface: ToolInvokerMessage

Defined in: [packages/components/src/tool-invoker/index.ts:16](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L16)

Conversation message read and produced by `ToolInvoker`.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-content"></a> `content?` | `string` | Text content. | [packages/components/src/tool-invoker/index.ts:20](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L20) |
| <a id="property-meta"></a> `meta?` | `Record`\<`string`, `unknown`\> | Free-form metadata. | [packages/components/src/tool-invoker/index.ts:26](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L26) |
| <a id="property-role"></a> `role` | [`ToolInvokerMessageRole`](../type-aliases/ToolInvokerMessageRole.md) | Message role. | [packages/components/src/tool-invoker/index.ts:18](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L18) |
| <a id="property-tool_call_id"></a> `tool_call_id?` | `string` | Identifier of the call that a tool message answers. | [packages/components/src/tool-invoker/index.ts:24](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L24) |
| <a id="property-tool_calls"></a> `tool_calls?` | `ToolCall`[] | Tool calls requested by an assistant message. | [packages/components/src/tool-invoker/index.ts:22](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L22) |
