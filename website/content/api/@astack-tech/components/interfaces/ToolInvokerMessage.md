# Interface: ToolInvokerMessage

Defined in: [packages/components/src/tool-invoker/index.ts:17](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L17)

Conversation message read and produced by `ToolInvoker`.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-content"></a> `content?` | `string` | Text content. | [packages/components/src/tool-invoker/index.ts:21](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L21) |
| <a id="property-meta"></a> `meta?` | `Record`\<`string`, `unknown`\> | Free-form metadata. | [packages/components/src/tool-invoker/index.ts:27](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L27) |
| <a id="property-role"></a> `role` | [`ToolInvokerMessageRole`](../type-aliases/ToolInvokerMessageRole.md) | Message role. | [packages/components/src/tool-invoker/index.ts:19](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L19) |
| <a id="property-tool_call_id"></a> `tool_call_id?` | `string` | Identifier of the call that a tool message answers. | [packages/components/src/tool-invoker/index.ts:25](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L25) |
| <a id="property-tool_calls"></a> `tool_calls?` | `ToolCall`[] | Tool calls requested by an assistant message. | [packages/components/src/tool-invoker/index.ts:23](https://github.com/astack-tech/astack/blob/master/packages/components/src/tool-invoker/index.ts#L23) |
