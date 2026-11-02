---
title: RLM
description: 在一个提示词放不下的上下文上回答问题。
order: 10
examples: [rlm-agent]
api: [components/classes/RLMAgent, components/classes/FileSystemContext, components/interfaces/LLMProvider, components/interfaces/RLMResult]
source: 1317708810fb29ad428093e8074b0c080608815bd64d5d2e8d63d302e762dc20
---

`RLMAgent` 实现了递归语言模型（Recursive Language Model）模式。它不把庞大的上下文放进提示词，而是让一个根模型编写 JavaScript 代码来探索上下文：代码按需读取文件，并向子模型提出有针对性的问题。

```typescript
import { FileSystemContext, RLMAgent } from '@astack-tech/components';

const context = new FileSystemContext('/path/to/project', ['src/index.ts', 'src/pipeline.ts']);
const agent = new RLMAgent({ rootLLM: llm, subLLM: llm });

const { answer, code } = await agent.run({ context, query: 'How is the pipeline built?' });
```

## LLM 提供方

RLM 使用的接口比智能体的更小：

```typescript
interface LLMProvider {
  generate(prompt: string): Promise<string>;
  generateStream?(prompt: string): AsyncGenerator<string>;
}
```

任何模型都可以用几行代码适配，例如 `{ generate: prompt => model.generateCompletion(prompt) }`，其中 `model` 可以是任意模型提供方。

## FileSystemContext

| 构造方式 | 模式 |
| --- | --- |
| `new FileSystemContext(basePath, filePaths)` | 文件系统模式。文件按需从磁盘读取。 |
| `new FileSystemContext(text)` | 内存模式。字符串就是一个虚拟文件的内容。 |

请显式传入文件列表。不传时，第一个参数会被当作文本，而不是路径。

| 选项 | 默认值 | 含义 |
| --- | --- | --- |
| `maxFileSize` | 5 MB | 可读取的最大文件 |
| `maxCacheSize` | 10 MB | 文件内容的 LRU 缓存大小 |
| `verbose` | `false` | 在控制台输出警告 |

生成的代码可以调用 `listFiles`、`readFile`、`getFileInfo`、`searchFiles`、`sampleFiles`、`getFilesInDirectory`、`getStats`、`llm_query` 和 `FINAL`。

## 结果与流式输出

`run()` 的结果为 `{ answer, code, depth }`。`runStream()` 会依次产出 `code`、`execution`、`answer`、`metadata`、`summary` 和 `error` 数据块。

## 安全

生成的代码在 Node.js 的 `vm` 上下文中运行，超时时间为 120 秒。`vm` 上下文**不是安全边界**。只在你信任的上下文和模型上运行 RLM；当输入不可信时，请在隔离的进程或容器中运行。

`maxDepth` 大于 1 时会嵌套多个 RLM 实例，推荐设置为 1。
