# Interface: FileInfo

Defined in: [packages/components/src/agents/rlm/FileSystemContext.ts:10](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L10)

File information without content

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-lines"></a> `lines` | `number` | Line count. In filesystem mode it stays 0 until the file is first read. | [packages/components/src/agents/rlm/FileSystemContext.ts:16](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L16) |
| <a id="property-path"></a> `path` | `string` | Path relative to the context's base path. Memory mode uses `__memory__.txt`. | [packages/components/src/agents/rlm/FileSystemContext.ts:12](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L12) |
| <a id="property-size"></a> `size` | `number` | File size in bytes (in memory mode, the text length). | [packages/components/src/agents/rlm/FileSystemContext.ts:14](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L14) |
