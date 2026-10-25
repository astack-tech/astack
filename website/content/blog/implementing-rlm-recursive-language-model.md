---
title: "Implementing RLM: Context Offloading and Dynamic Discovery for Long-Context Reasoning"
date: "2026-01-09"
excerpt: "How AStack implements recursive language models with filesystem context, recursive calls, and a bounded file cache. Includes the recorded tests and their limits."
author: "AStack Team"
tags: ["Release", "Tutorial", "RLM", "Long Context"]
---

# Implementing RLM: Context Offloading and Dynamic Discovery for Long-Context Reasoning

AStack implements the **Recursive Language Model (RLM)** architecture described in the paper ["Recursive Language Model: A Recursive Approach to Long Context Reasoning"](https://arxiv.org/abs/2512.24601). The implementation is available in `@astack-tech/components` as RLMAgent.

## The Problem: Context Window Limitations

Models with extended context windows (128K, 200K, or 1M tokens) can still face these limits:

1. **Lost-in-the-middle problem**: Information buried in long contexts gets overlooked
2. **Quadratic complexity**: Attention mechanisms scale poorly with context length
3. **Memory constraints**: Processing massive contexts causes OOM errors
4. **Reasoning degradation**: Performance drops significantly on long-context tasks

## The RLM Solution: Context Outside the REPL

RLM stores context in an external environment. The model generates code that reads and searches the context.

### The Core Concept

The model uses these steps:

1. **Context lives outside the REPL**: The long prompt P becomes an environmental variable, not direct model input
2. **LLM cannot "see" the context**: The model has no direct access to P through its attention mechanism
3. **Code is the interface**: The LLM must generate code to programmatically query and decompose P
4. **Recursive capability**: The LLM can invoke itself recursively on sub-tasks through `llm_query()`

The model runs code to select the context it needs. Each request contains the selected information and execution results.

### How It Works

```typescript
// 1. Context is placed in the environment (NOT fed to the model)
const context = new FileSystemContext('./data', filePaths);

// 2. Root LLM generates code to explore the context
const code = await rootLLM.generate(`
  Task: ${query}

  You CANNOT see the context directly.
  You must use these APIs to access it:
  - listFiles(): Get available files
  - readFile(path): Read a specific file
  - llm_query(prompt): Recursively call sub-LLM
  - FINAL(result): Return your answer
`);

// 3. Execute code in REPL with context as environment
const result = await executeInREPL(code, context);
```

The model accesses external context through code and receives the results as input.

## RLM implementation in AStack

The RLM components are in `packages/components/src/agents/rlm`. They provide recursive calls, context access, streaming, and execution metadata.

### 1. RLMAgent - The High-Level Interface

```typescript
import { RLMAgent, FileSystemContext } from '@astack-tech/components';

const agent = new RLMAgent({
  rootLLM: new DeepseekLLMProvider(apiKey, 'deepseek-chat'),
  subLLM: new DeepseekLLMProvider(apiKey, 'deepseek-chat'),
  maxDepth: 2, // Support nested recursion
});

const context = new FileSystemContext('./my-project', filePaths);
const result = await agent.run({
  context,
  query: 'Find all authentication vulnerabilities',
});
```

### 2. RLMCore - The Execution Engine

RLMCore provides these functions:

**True Recursion Support:**
```typescript
// Sub-LLM can itself be an RLM instance
if (maxDepth > 1) {
  const nestedRLM = new RLMCore(
    rootLLM,
    subLLM,
    maxDepth - 1,
    sharedContext,
    customPrompt
  );
  this.subLLM = nestedRLM; // Implements LLMProvider interface
}
```

**VM-Based Sandboxing:**
- Fresh VM context per execution prevents variable accumulation
- Controlled API surface; the Node.js VM is not a security boundary for untrusted code
- Automatic garbage collection

**Streaming Support:**
```typescript
for await (const chunk of agent.runStream({ context, query })) {
  process.stdout.write(chunk.content); // Real-time output
}
```

### 3. FileSystemContext: context access

AStack exposes context through a filesystem interface. The interface supports the following behavior:

1. **Unified interface**: Whether it's actual files, in-memory data, or future extensions (databases, APIs), the LLM interacts through the same file-like API
2. **True recursion**: Nested RLM calls can share the same context without redundant reads
3. **Memory safety**: LRU cache with configurable limits bounds cached file contents

**AStack's Solution: Filesystem Abstraction with LRU Cache**

```typescript
class FileSystemContext {
  private cache = new LRUCache<string, string>({
    maxSize: 10 * 1024 * 1024, // 10MB cache
  });

  async readFile(path: string): Promise<string> {
    // Load on-demand, cache with automatic eviction
    if (!this.cache.has(path)) {
      const content = await fs.readFile(path, 'utf-8');
      this.cache.set(path, content); // Auto-evicts LRU entries
    }
    return this.cache.get(path);
  }
}
```

The interface separates stored context from model input. The current implementation uses code to read that data. Other programmatic interfaces are possible.

## Recorded performance results

The original article reported OOLONG-Pairs-style tests. The table and measurements below preserve those records. This redesign did not rerun the tests. Different models, synthetic datasets, and hardware limit the comparison.

### Benchmark Results

| Dataset Size | Paper's RLM (GPT-4o) | Direct LLM F1 |
|--------------|----------------------|---------------|
| 100 entries  | 78.5%                | 45.2%         |
| 200 entries  | 71.3%                | 32.1%         |
| 500 entries  | 65.8%                | 18.7%         |

**AStack Implementation Results:**

The original tests used **DeepSeek-V3 (deepseek-chat, non-reasoning mode)** on synthetic OOLONG-Pairs datasets. The reported accuracy was 100% for 100, 200, and 500 entries. These conditions apply:

- **Model specification**: DeepSeek-V3 (deepseek-chat) in non-reasoning mode generated the code used in these tests
- **Synthetic data**: Our test datasets were synthetically generated, which may not fully represent the complexity of real-world scenarios
- **Implementation quality**: Our engineering improvements (filesystem abstraction, memory management, true recursion) contribute to reliability

The original article attributed the 78% → 65% results to GPT-4o tests in the paper. Different models and datasets prevent a direct comparison.

**Key Findings:**
- The recorded direct-LLM results decreased from 45% to 18% as the dataset grew.
- RLM lets the model select external context through code.
- The recorded run kept cached file contents within its configured limit.
- Model choice significantly impacts RLM effectiveness (code generation capability is critical)
- The recorded tests used non-reasoning mode

### Memory Usage

Real execution on AStack project **including node_modules** (8,466 TypeScript files):

```
Context Statistics:
   Files: 8,466
   Total Characters: 46,800,812
   Size: 44.63 MB
   File Types: ts

RLM Configuration:
   Context Mode: FileSystem (on-demand lazy loading)

Memory Safety:
   LRU Cache Size: 10 MB (auto-eviction enabled)
   Max Single File: 10 MB
   File Access: Unlimited (on-demand loading with LRU eviction)
   File cache limit: 10 MB. Total process memory is not bounded.

Note: Can process all 44.63MB - files loaded on-demand, old entries auto-evicted.

Execution Time:
   Total Time: 53.81s
   Code Generation: 53.80s
   REPL Execution: 0.01s
   Sub-LLM Calls: 0
```

The test included `node_modules` to cover these analysis tasks:
- Understand how dependencies are used and integrated
- Trace function calls into third-party libraries
- Identify version-specific behaviors or bugs
- Analyze the full dependency tree for security audits
- Debug issues that span your code and dependencies

The recorded context contained **44.63MB across 8,466 files, including dependencies**. The LRU file cache had a 10MB limit. The run used these operations:
- Loading files on-demand through `readFile()` calls
- Using `searchFiles()` and `getFileInfo()` to explore without loading content
- Automatically evicting old entries when cache is full
- Completing the analysis in under 1 minute

The run selected files from a context larger than its file cache. The cache limit applies to cached file contents. It does not bound total process memory or guarantee that all workloads avoid OOM errors.

## Code Example: Project Analysis

The following example analyzes project files for security issues:

```typescript
import { RLMAgent, FileSystemContext } from '@astack-tech/components';
import { DeepseekLLMProvider } from '@astack-tech/llm-deepseek';

async function analyzeProject() {
  // 1. Setup RLM Agent
  const agent = new RLMAgent({
    rootLLM: new DeepseekLLMProvider(process.env.DEEPSEEK_API_KEY, 'deepseek-chat'),
    subLLM: new DeepseekLLMProvider(process.env.DEEPSEEK_API_KEY, 'deepseek-chat'),
    maxDepth: 2,
  });

  // 2. Create filesystem context with memory limits
  const context = new FileSystemContext(
    './my-project',
    ['src/**/*.ts', 'lib/**/*.ts'],
    {
      maxTotalRead: 100 * 1024 * 1024, // 100MB limit
      maxFileSize: 10 * 1024 * 1024,   // 10MB per file
      maxCacheSize: 10 * 1024 * 1024,  // 10MB LRU cache
    }
  );

  // 3. Run analysis with streaming
  console.log('Analyzing project for security issues...\n');

  for await (const chunk of agent.runStream({
    context,
    query: `
      Analyze this project for security vulnerabilities.
      Focus on:
      1. SQL injection risks
      2. XSS vulnerabilities
      3. Authentication bypasses
      4. Insecure data handling

      For each issue found, provide:
      - File path and line number
      - Severity (Critical/High/Medium/Low)
      - Description of the vulnerability
      - Recommended fix
    `,
  })) {
    process.stdout.write(chunk.content);
  }

  // 4. Access execution metadata
  const metadata = chunk.metadata;
  console.log(`\n\nExecution Stats:`);
  console.log(`- Sub-LLM Calls: ${metadata.subLLMCalls}`);
  console.log(`- Execution Time: ${metadata.totalExecutionTime}ms`);
  console.log(`- Context Size: ${metadata.contextLength} chars`);
  console.log(`- Max Depth Used: ${metadata.actualDepth}/${metadata.maxDepth}`);
}

analyzeProject();
```

## Generated Code Example

Here's what the Root LLM (DeepSeek-V3, deepseek-chat) actually generated for analyzing the **44.63MB AStack project with 8,466 files**:

```javascript
try {
    // First, get overall statistics to understand the project scope
    const stats = getStats();

    // Look for key architectural files
    const packageFiles = searchFiles(/package\.json$/);
    const configFiles = searchFiles(/(tsconfig|webpack|rollup|vite|\.config)\.(js|json|ts)$/i);
    const entryFiles = searchFiles(/(index|main|app)\.(js|ts|jsx|tsx)$/i);
    const readmeFiles = searchFiles(/README\.(md|txt)$/i);

    // Look for common architectural patterns
    const componentFiles = searchFiles(/\.(jsx|tsx|vue|svelte)$/i);
    const storeFiles = searchFiles(/(store|redux|context)\.(js|ts)$/i);
    const routerFiles = searchFiles(/router\.(js|ts)$/i);
    const apiFiles = searchFiles(/api\.(js|ts)$/i);
    const serviceFiles = searchFiles(/service\.(js|ts)$/i);
    const utilFiles = searchFiles(/util(s|ity)?\.(js|ts)$/i);

    // Look for test files to understand testing approach
    const testFiles = searchFiles(/\.(test|spec)\.(js|ts|jsx|tsx)$/i);

    // Get directory structure to understand organization
    const srcFiles = getFilesInDirectory('src');
    const libFiles = getFilesInDirectory('lib');
    const appFiles = getFilesInDirectory('app');
    const componentsFiles = getFilesInDirectory('components');

    // Read key files to understand architecture
    let architectureSummary = {
        stats: stats,
        packageJson: null,
        hasComponents: componentFiles.length > 0,
        hasStateManagement: storeFiles.length > 0,
        hasRouting: routerFiles.length > 0,
        hasApiLayer: apiFiles.length > 0,
        testingApproach: testFiles.length > 0 ? "Test files detected" : "No test files found",
        directoryStructure: {
            src: srcFiles.length,
            lib: libFiles.length,
            app: appFiles.length,
            components: componentsFiles.length
        }
    };

    // Read package.json if available
    if (packageFiles.length > 0) {
        try {
            const packageContent = readFile(packageFiles[0]);
            architectureSummary.packageJson = JSON.parse(packageContent);
        } catch (e) {
            architectureSummary.packageJson = "Error reading package.json";
        }
    }

    // Read a sample of config files
    const configSamples = [];
    for (let i = 0; i < Math.min(3, configFiles.length); i++) {
        try {
            const fileInfo = getFileInfo(configFiles[i]);
            if (fileInfo.size < 5000) {
                const content = readFile(configFiles[i]);
                configSamples.push({
                    file: configFiles[i],
                    preview: content.substring(0, 300) + "..."
                });
            }
        } catch (e) {
            // Skip if error
        }
    }

    // Analyze dependencies from package.json
    let dependencies = [];
    if (architectureSummary.packageJson && typeof architectureSummary.packageJson === 'object') {
        if (architectureSummary.packageJson.dependencies) {
            dependencies = Object.keys(architectureSummary.packageJson.dependencies);
        }
    }

    // Create final structured summary
    const finalSummary = {
        "Main Components": {
            "Frontend Components": architectureSummary.hasComponents ? "Present" : "Not detected",
            "State Management": architectureSummary.hasStateManagement ? "Present" : "Not detected",
            "API Layer": architectureSummary.hasApiLayer ? "Present" : "Not detected"
        },
        "Codebase Statistics": {
            "Total Files": architectureSummary.stats.totalFiles,
            "Total Size": architectureSummary.stats.totalSize + " bytes",
            "Dependencies": dependencies.slice(0, 10)
        }
    };

    FINAL(JSON.stringify(finalSummary, null, 2));

} catch (error) {
    FINAL("Error analyzing architecture: " + error.message);
}
```

**Key observations from this 44.63MB project analysis:**
- **7,317 characters of generated code** to analyze 8,466 files
- The model uses `searchFiles()` with regex patterns to discover files **without loading them**
- It uses `getFileInfo()` to check file sizes before reading (avoiding huge files)
- Only reads small, critical files (package.json, configs) - most files never loaded into memory
- Completed in **53.81 seconds** with **0 sub-LLM calls** (single-pass analysis)
- **Memory usage stayed within 10MB cache** despite 44.63MB total context

The generated code used search and metadata calls to select files before it read their contents.

## Implementation choices

### Comparison with Official Implementation

The paper's authors released an [official Python implementation](https://github.com/alexzhang13/rlm). While their implementation validates the core concept, AStack's implementation addresses several challenges that the paper explicitly identifies as limitations or future work.

#### 1. True Recursive RLM Support

**Paper's Limitation (Section: Future Work):**
> "We chose to use a max recursion depth of one (i.e. sub-calls are LMs); while we found strong performance on existing long-context benchmarks, we believe that future work should investigate deeper layers of recursion."

**Official Implementation:**
The official Python implementation currently limits recursion depth to 1, as noted in the paper's future work section.

**AStack Implementation:**
```typescript
// Recursive construction: if maxDepth > 1, create nested RLM as subLLM
if (maxDepth > 1) {
  const nestedRLM = new RLMCore(
    rootLLM,
    subLLM,
    maxDepth - 1,
    this.sharedContext || undefined,
    customPrompt
  );
  this.subLLM = nestedRLM; // Nested RLM implements LLMProvider
}
```

We implement true recursive RLM where Sub-LLM can itself be an RLM instance with full REPL capabilities. This addresses the paper's identified future work direction.

#### 2. Asynchronous Sub-LLM Calls

**Paper's Limitation (Section: Limitations):**
> "We focused on synchronous sub-calls inside of a Python REPL environment, but we note that alternative strategies involving asynchronous sub-calls and sandboxed REPLs can potentially significantly reduce the runtime and inference cost of RLMs."

> "RLMs without asynchronous LM calls are slow. We implemented all sub-LM queries naively as blocking / sequential calls, which caused our RLM experiments to be slow."

**AStack Implementation:**
We implement background queue processing for `llm_query` calls:

```typescript
// Queue for handling llm_query requests OUTSIDE VM context
const llmQueryQueue: Array<{
  prompt: string;
  resolve: (result: string) => void;
  reject: (error: Error) => void;
}> = [];

// Process asynchronously with streaming support
const startQueryProcessing = () => {
  queryProcessingActive = (async () => {
    while (llmQueryQueue.length > 0) {
      const request = llmQueryQueue.shift()!;
      const result = await subLLM.generate(request.prompt);
      request.resolve(result);
    }
  })();
};
```

While still sequential, our architecture separates queue management from VM execution, enabling future parallel processing without breaking the API.

#### 3. Filesystem Abstraction for Context

**Filesystem context in AStack:**

AStack uses a filesystem interface for context:

```typescript
class FileSystemContext {
  private cache = new LRUCache<string, string>({
    maxSize: 10 * 1024 * 1024, // 10MB cache
  });

  async readFile(path: string): Promise<string> {
    // Lazy loading with automatic eviction
    if (!this.cache.has(path)) {
      const content = await fs.readFile(path, 'utf-8');
      this.cache.set(path, content);
    }
    return this.cache.get(path);
  }
}
```

This abstraction:
- Limits cached file memory through LRU caching
- Enables future extensions (databases, APIs, remote storage)
- Provides a unified interface regardless of context source

#### 4. Shared Context Across Recursion Levels

**AStack Implementation:**
```typescript
constructor(
  rootLLM: LLMProvider,
  subLLM: LLMProvider,
  maxDepth: number = 1,
  sharedContext?: FileSystemContext,  // Shared across all levels
  customPrompt?: string
)
```

When using nested RLM (depth > 1), all levels share the same `FileSystemContext`. This means:
- No redundant file reads across recursion levels
- Shared LRU cache benefits all nested calls
- Consistent view of context throughout the recursion tree

### Execution controls

The implementation includes these execution controls:

#### 1. File cache limits

**Cache and read controls:**
- LRU cache with automatic eviction
- Configurable size limits (per-file, total, cache)
- Lazy loading with on-demand file access

#### 2. Execution metadata

```typescript
interface RLMExecutionMetadata {
  maxDepth: number;
  actualDepth: number;
  subLLMCalls: number;
  subLLMCallDetails: SubLLMCall[];
  totalExecutionTime: number;
  codeGenTime: number;
  replExecutionTime: number;
  contextLength: number;
  generatedCodeLength: number;
}
```

#### 3. Streaming Support

- Real-time code generation streaming
- Live execution output streaming
- Background processing of sub-LLM calls

#### 4. Error Handling

- VM execution errors with stack traces
- Sub-LLM call failures with retry logic
- File access errors with graceful degradation

## Understanding the RLM Pattern

Use external context when the task has these requirements:

- **Long contexts**: When the context exceeds what fits comfortably in a single LLM call
- **Systematic exploration**: When the task benefits from programmatic decomposition
- **Memory constraints**: When loading everything into memory would cause OOM
- **Recursive reasoning**: When sub-problems can be solved independently and combined

Use this pattern when programmatic access helps the model retrieve the required context.

## Future Directions

The original roadmap identified two areas:

1. **Agent-Level RLM Abstraction**: Extending RLM from Root LLM → Sub-LLM to Root Agent → Sub-Agent architecture. This will enable exploration of RLM's performance on ultra-long contexts and long-running tasks, where agents can maintain state and execute complex multi-step workflows.

2. **Production Integration**: Integrating AStack's RLM implementation into real consumer-facing products. This will validate RLM's practical value in production environments and gather real-world usage data to guide further improvements.

## Implementation reference

RLM stores context outside model input and exposes it through programmatic access.

AStack includes the following implementation choices:

**Context and recursion:**
- **True recursion**: Implemented multi-level RLM nesting (paper lists this as "future work")
- **Filesystem abstraction**: Context as a unified interface, enabling extensions beyond in-memory data
- **Shared context**: Nested RLM instances share the same context cache, eliminating redundant reads
- **Memory safety**: LRU caching and lazy loading control reads for contexts configured above 100MB

**Execution features:**
- Streaming support for real-time feedback
- Execution metadata and monitoring
- Error handling and recovery
- TypeScript implementation with full type safety

The reported synthetic tests used **DeepSeek-V3 (deepseek-chat, non-reasoning mode)** and recorded 100% accuracy. These results apply to the described datasets and setup. They do not establish general accuracy or production reliability.

Use external context when the required information does not fit in a model request. Let the model select the information through code. Other programmatic access methods can use the same separation.

Install `@astack-tech/components` to use RLMAgent. Review the configuration and execution limits before deployment.

---

## Resources

- **Paper**: [arXiv:2512.24601](https://arxiv.org/abs/2512.24601)
- **Official Implementation**: [alexzhang13/rlm (Python)](https://github.com/alexzhang13/rlm)
- **AStack Implementation**: [RLMCore.ts (TypeScript)](https://github.com/astack-tech/astack/blob/master/packages/components/src/agents/rlm/RLMCore.ts)
- **Documentation**: [AStack GitHub Repository](https://github.com/astack-tech/astack)

## Join the Discussion

Report a bug or describe your use case:

- **GitHub Issues**: [Report bugs or request features](https://github.com/astack-tech/astack/issues)
- **Discussions**: [Share your use cases](https://github.com/astack-tech/astack/discussions)

*AStack Team*
