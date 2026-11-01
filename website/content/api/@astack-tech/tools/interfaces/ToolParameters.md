# Interface: ToolParameters

Defined in: [tool.ts:4](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool.ts#L4)

JSON Schema object that describes the arguments of a tool.

## Indexable

```ts
[key: string]: unknown
```

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-additionalproperties"></a> `additionalProperties?` | `boolean` | Whether arguments not listed in `properties` are allowed. | [tool.ts:12](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool.ts#L12) |
| <a id="property-properties"></a> `properties` | `Record`\<`string`, `unknown`\> | JSON Schema of each argument, keyed by argument name. | [tool.ts:8](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool.ts#L8) |
| <a id="property-required"></a> `required?` | `string`[] | Names of the arguments the model must provide. | [tool.ts:10](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool.ts#L10) |
| <a id="property-type"></a> `type` | `string` | JSON Schema type of the arguments value. Tools take an object, so this is `object`. | [tool.ts:6](https://github.com/astack-tech/astack/blob/master/packages/tools/src/tool.ts#L6) |
