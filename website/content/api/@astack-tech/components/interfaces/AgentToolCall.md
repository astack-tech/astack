# Interface: AgentToolCall

Defined in: [packages/components/src/agents/types.ts:21](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L21)

A tool call in the OpenAI-compatible format. Providers may add the internal
`tool_name` and parsed `arguments` fields.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-arguments"></a> `arguments?` | `string` \| `Record`\<`string`, `unknown`\> | Parsed arguments, or the raw JSON text while streaming, when the provider adds them. | [packages/components/src/agents/types.ts:36](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L36) |
| <a id="property-function"></a> `function` | `object` | Function name and raw JSON arguments, as sent by the model. | [packages/components/src/agents/types.ts:27](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L27) |
| `function.arguments` | `string` | Arguments as a JSON string. | [packages/components/src/agents/types.ts:31](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L31) |
| `function.name` | `string` | Name of the tool to call. | [packages/components/src/agents/types.ts:29](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L29) |
| <a id="property-id"></a> `id` | `string` | Identifier that a `tool` message uses to answer this call. | [packages/components/src/agents/types.ts:23](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L23) |
| <a id="property-tool_name"></a> `tool_name?` | `string` | Tool name in the internal format, when the provider adds it. | [packages/components/src/agents/types.ts:34](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L34) |
| <a id="property-type"></a> `type` | `string` | Call type. Model providers send `function`. | [packages/components/src/agents/types.ts:25](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/types.ts#L25) |
