# Interface: FileSystemContextOptions

Defined in: [packages/components/src/agents/rlm/FileSystemContext.ts:52](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L52)

File system context configuration

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-maxcachesize"></a> `maxCacheSize?` | `number` | Maximum cache size in bytes. Default: 10 MB. | [packages/components/src/agents/rlm/FileSystemContext.ts:71](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L71) |
| <a id="property-maxfilesize"></a> `maxFileSize?` | `number` | Maximum size of a single file that can be read. Default: 5 MB. | [packages/components/src/agents/rlm/FileSystemContext.ts:65](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L65) |
| <a id="property-maxtotalread"></a> ~~`maxTotalRead?`~~ | `number` | Not enforced. Memory use is bounded by `maxCacheSize`, and `getMemoryLimits().maxTotalRead` reports that cache size. **Deprecated** Use `maxCacheSize`. | [packages/components/src/agents/rlm/FileSystemContext.ts:59](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L59) |
| <a id="property-verbose"></a> `verbose?` | `boolean` | Log skipped files and other diagnostics. Default: false. | [packages/components/src/agents/rlm/FileSystemContext.ts:76](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L76) |
