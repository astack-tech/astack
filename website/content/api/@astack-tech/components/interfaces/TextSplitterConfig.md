# Interface: TextSplitterConfig

Defined in: [packages/components/src/text/index.ts:7](https://github.com/astack-tech/astack/blob/master/packages/components/src/text/index.ts#L7)

Options for `TextSplitter`.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-chunksize"></a> `chunkSize?` | `number` | Maximum chunk length in characters (Unicode code points). Defaults to 1000. | [packages/components/src/text/index.ts:9](https://github.com/astack-tech/astack/blob/master/packages/components/src/text/index.ts#L9) |
| <a id="property-overlap"></a> `overlap?` | `number` | Characters shared by consecutive chunks. Must be smaller than `chunkSize`. Defaults to 200, capped at one fifth of `chunkSize`. | [packages/components/src/text/index.ts:14](https://github.com/astack-tech/astack/blob/master/packages/components/src/text/index.ts#L14) |
| <a id="property-separator"></a> `separator?` | `string` \| `RegExp` \| `null` | Segment separator. Defaults to blank lines (`/\n\s*\n/`). Pass `''` or `null` to split by characters only. | [packages/components/src/text/index.ts:19](https://github.com/astack-tech/astack/blob/master/packages/components/src/text/index.ts#L19) |
