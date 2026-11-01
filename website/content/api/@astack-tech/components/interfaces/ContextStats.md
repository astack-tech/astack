# Interface: ContextStats

Defined in: [packages/components/src/agents/rlm/FileSystemContext.ts:22](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L22)

Context statistics

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-filetypes"></a> `fileTypes` | `Record`\<`string`, `number`\> | Number of files per extension. | [packages/components/src/agents/rlm/FileSystemContext.ts:30](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L30) |
| <a id="property-totalfiles"></a> `totalFiles` | `number` | Number of files in the context. | [packages/components/src/agents/rlm/FileSystemContext.ts:24](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L24) |
| <a id="property-totallines"></a> `totalLines` | `number` | Sum of the line counts known so far. Files not yet read count as 0. | [packages/components/src/agents/rlm/FileSystemContext.ts:28](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L28) |
| <a id="property-totalsize"></a> `totalSize` | `number` | Sum of all file sizes in bytes. | [packages/components/src/agents/rlm/FileSystemContext.ts:26](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L26) |
