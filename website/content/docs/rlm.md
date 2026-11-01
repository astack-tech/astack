---
title: RLM
description: Answer questions over contexts that do not fit in one prompt.
order: 10
examples: [rlm-agent]
api: [components/classes/RLMAgent, components/classes/FileSystemContext, components/interfaces/LLMProvider, components/interfaces/RLMResult]
---

`RLMAgent` implements the Recursive Language Model pattern. Instead of putting a large context into the prompt, a root model writes JavaScript that explores the context. The code reads files on demand and asks a sub-model focused questions.

```typescript
import { FileSystemContext, RLMAgent } from '@astack-tech/components';

const context = new FileSystemContext('/path/to/project', ['src/index.ts', 'src/pipeline.ts']);
const agent = new RLMAgent({ rootLLM: llm, subLLM: llm });

const { answer, code } = await agent.run({ context, query: 'How is the pipeline built?' });
```

## LLM providers

RLM uses a smaller interface than agents:

```typescript
interface LLMProvider {
  generate(prompt: string): Promise<string>;
  generateStream?(prompt: string): AsyncGenerator<string>;
}
```

Adapt any model in a few lines, for example `{ generate: prompt => deepseek.generateCompletion(prompt) }`.

## FileSystemContext

| Constructor | Mode |
| --- | --- |
| `new FileSystemContext(basePath, filePaths)` | Filesystem. Files are read from disk on demand. |
| `new FileSystemContext(text)` | Memory. The string is the content of one virtual file. |

Pass the file list explicitly. Without it, the first argument is treated as text, not as a path.

| Option | Default | Meaning |
| --- | --- | --- |
| `maxFileSize` | 5 MB | Largest file that can be read |
| `maxCacheSize` | 10 MB | LRU cache size for file contents |
| `verbose` | `false` | Log warnings to the console |

The generated code can call `listFiles`, `readFile`, `getFileInfo`, `searchFiles`, `sampleFiles`, `getFilesInDirectory`, `getStats`, `llm_query` and `FINAL`.

## Results and streaming

`run()` resolves with `{ answer, code, depth }`. `runStream()` yields `code`, `execution`, `answer`, `metadata`, `summary` and `error` chunks.

## Safety

The generated code runs in a Node.js `vm` context with a 120-second timeout. A `vm` context is **not a security boundary**. Only run RLM on contexts and models you trust, and run it in an isolated process or container when the input is untrusted.

`maxDepth` above 1 nests RLM instances. Depth 1 is the recommended setting.
