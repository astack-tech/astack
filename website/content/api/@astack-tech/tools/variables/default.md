# Variable: default

```ts
const default: object;
```

Defined in: [index.ts:21](https://github.com/astack-tech/astack/blob/master/packages/tools/src/index.ts#L21)

Default export kept for backward compatibility. Prefer the named exports.

## Type Declaration

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-createcomponenttool"></a> `createComponentTool()` | (`config`) => [`Tool`](../interfaces/Tool.md) | Same as the named export [createComponentTool](../functions/createComponentTool.md). Creates a tool that runs a component. | [index.ts:27](https://github.com/astack-tech/astack/blob/master/packages/tools/src/index.ts#L27) |
| <a id="property-createmcptool"></a> `createMCPTool()` | (`config`) => [`Tool`](../interfaces/Tool.md) | Same as the named export [createMCPTool](../functions/createMCPTool.md). Creates a tool that calls an MCP service method. | [index.ts:29](https://github.com/astack-tech/astack/blob/master/packages/tools/src/index.ts#L29) |
| <a id="property-createtool"></a> `createTool()` | (`name`, `description`, `func`, `parameters?`) => [`Tool`](../interfaces/Tool.md) | Same as the named export [createTool](../functions/createTool.md). Creates a tool from a plain function. | [index.ts:23](https://github.com/astack-tech/astack/blob/master/packages/tools/src/index.ts#L23) |
| <a id="property-createtoolset"></a> `createToolSet()` | (`tools`) => [`ToolSet`](../interfaces/ToolSet.md) | Same as the named export [createToolSet](../functions/createToolSet.md). Creates a `ToolSet` from a list of tools. | [index.ts:25](https://github.com/astack-tech/astack/blob/master/packages/tools/src/index.ts#L25) |
