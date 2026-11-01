# Interface: MemoryUsage

Defined in: [packages/components/src/agents/rlm/FileSystemContext.ts:36](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L36)

Memory usage information

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-bytesread"></a> `bytesRead` | `number` | Bytes currently held in the content cache. Not a cumulative total. | [packages/components/src/agents/rlm/FileSystemContext.ts:38](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L38) |
| <a id="property-cacheentries"></a> `cacheEntries` | `number` | Number of files currently in the content cache. | [packages/components/src/agents/rlm/FileSystemContext.ts:46](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L46) |
| <a id="property-cachesize"></a> `cacheSize` | `number` | Bytes currently held in the content cache. | [packages/components/src/agents/rlm/FileSystemContext.ts:44](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L44) |
| <a id="property-maxbytes"></a> `maxBytes` | `number` | Cache capacity in bytes (`maxCacheSize`). | [packages/components/src/agents/rlm/FileSystemContext.ts:40](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L40) |
| <a id="property-percentused"></a> `percentUsed` | `number` | Cache use as a percentage of `maxBytes`. | [packages/components/src/agents/rlm/FileSystemContext.ts:42](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L42) |
