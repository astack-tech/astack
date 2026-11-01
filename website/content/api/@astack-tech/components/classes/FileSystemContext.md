# Class: FileSystemContext

Defined in: [packages/components/src/agents/rlm/FileSystemContext.ts:161](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L161)

File system context provider for RLM
Provides unified access to context data with memory safety guarantees

Supports two modes:
- **Filesystem mode**: On-demand loading from disk with LRU cache
- **Memory mode**: Direct string content (virtual single-file context)

Both modes enable handling massive contexts (100MB+) without OOM issues.

## Constructors

### Constructor

```ts
new FileSystemContext(
   basePathOrContent, 
   filePaths?, 
   options?
): FileSystemContext;
```

Defined in: [packages/components/src/agents/rlm/FileSystemContext.ts:191](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L191)

Create FileSystemContext from filesystem or memory

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `basePathOrContent` | `string` | Filesystem: absolute path; Memory: string content |
| `filePaths?` | `string`[] | Filesystem: relative file paths; Memory: omit/undefined |
| `options?` | [`FileSystemContextOptions`](../interfaces/FileSystemContextOptions.md) | Memory safety configuration |

#### Returns

`FileSystemContext`

#### Examples

Filesystem mode:
```typescript
const ctx = new FileSystemContext('/project', ['src/index.ts']);
```

Memory mode:
```typescript
const ctx = new FileSystemContext('long text content...');
```

## Methods

### getFileInfo()

```ts
getFileInfo(filePath): FileInfo;
```

Defined in: [packages/components/src/agents/rlm/FileSystemContext.ts:311](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L311)

Get file metadata without reading content

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `filePath` | `string` |

#### Returns

[`FileInfo`](../interfaces/FileInfo.md)

***

### getFilesInDirectory()

```ts
getFilesInDirectory(dir): string[];
```

Defined in: [packages/components/src/agents/rlm/FileSystemContext.ts:375](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L375)

Get files by directory

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `dir` | `string` |

#### Returns

`string`[]

***

### getMemoryLimits()

```ts
getMemoryLimits(): MemoryLimits;
```

Defined in: [packages/components/src/agents/rlm/FileSystemContext.ts:404](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L404)

Get memory limits configuration

#### Returns

[`MemoryLimits`](../interfaces/MemoryLimits.md)

***

### getMemoryUsage()

```ts
getMemoryUsage(): MemoryUsage;
```

Defined in: [packages/components/src/agents/rlm/FileSystemContext.ts:390](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L390)

Get current memory usage information

#### Returns

[`MemoryUsage`](../interfaces/MemoryUsage.md)

***

### getStats()

```ts
getStats(): ContextStats;
```

Defined in: [packages/components/src/agents/rlm/FileSystemContext.ts:338](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L338)

Get overall context statistics

#### Returns

[`ContextStats`](../interfaces/ContextStats.md)

***

### listFiles()

```ts
listFiles(): string[];
```

Defined in: [packages/components/src/agents/rlm/FileSystemContext.ts:250](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L250)

List all available file paths

#### Returns

`string`[]

***

### readFile()

```ts
readFile(filePath): string;
```

Defined in: [packages/components/src/agents/rlm/FileSystemContext.ts:259](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L259)

Read a specific file with memory safety checks
Filesystem: loaded from disk on-demand with LRU cache
Memory: returns the stored string content

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `filePath` | `string` |

#### Returns

`string`

***

### resetMemoryTracking()

```ts
resetMemoryTracking(): void;
```

Defined in: [packages/components/src/agents/rlm/FileSystemContext.ts:383](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L383)

Reset memory tracking by clearing cache
Call this between queries to allow reusing the same context

#### Returns

`void`

***

### sampleFiles()

```ts
sampleFiles(pattern, limit): string[];
```

Defined in: [packages/components/src/agents/rlm/FileSystemContext.ts:367](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L367)

Get a subset of files by pattern (useful for sampling)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pattern` | `string` \| `RegExp` |
| `limit` | `number` |

#### Returns

`string`[]

***

### searchFiles()

```ts
searchFiles(pattern): string[];
```

Defined in: [packages/components/src/agents/rlm/FileSystemContext.ts:330](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/FileSystemContext.ts#L330)

Search files by pattern (returns paths only)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pattern` | `string` \| `RegExp` |

#### Returns

`string`[]
