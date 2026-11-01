# Function: createTool()

```ts
function createTool(
   name, 
   description, 
   func, 
   parameters?
): Tool;
```

Defined in: [tool.ts:68](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool.ts#L68)

Creates a tool from a plain function.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Unique tool name. |
| `description` | `string` | Description that tells the model when to use the tool. |
| `func` | [`ToolFunction`](../type-aliases/ToolFunction.md) | Implementation. Synchronous and asynchronous functions are both accepted. |
| `parameters?` | [`ToolParameters`](../interfaces/ToolParameters.md) | JSON Schema of the arguments. |

## Returns

[`Tool`](../interfaces/Tool.md)
