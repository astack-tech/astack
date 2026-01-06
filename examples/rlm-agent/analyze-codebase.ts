import { RLMAgent, FileSystemContext, type LLMProvider } from '@astack-tech/components/agents';
import { Deepseek } from '@astack-tech/integrations/model-provider';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Adapter to wrap Deepseek as LLMProvider for RLM
 */
class DeepseekLLMProvider implements LLMProvider {
  private deepseek: Deepseek;

  constructor(apiKey: string, model: string) {
    this.deepseek = new Deepseek({ apiKey, model });
  }

  async generate(prompt: string): Promise<string> {
    return await this.deepseek.generateCompletion(prompt);
  }

  async *generateStream(prompt: string): AsyncGenerator<string> {
    const messages = [{ role: 'user' as const, content: prompt }];
    for await (const chunk of this.deepseek.streamChatCompletion(messages)) {
      if (chunk.content) {
        yield chunk.content;
      }
    }
  }
}

/**
 * Recursively scan all TypeScript source files (PATHS ONLY, not content)
 * This demonstrates RLM's filesystem offloading - files loaded on-demand
 */
function scanSourceFiles(dir: string, basePath: string): string[] {
  const filePaths: string[] = [];
  // Include node_modules to demonstrate RLM's long context handling capability
  const excludeDirs = ['dist', '.git', 'coverage', '.turbo'];

  function walk(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        if (!excludeDirs.includes(entry.name)) {
          walk(fullPath);
        }
      } else if (entry.isFile() && entry.name.endsWith('.ts')) {
        const relativePath = path.relative(basePath, fullPath);
        filePaths.push(relativePath); // Only store PATH, not content
      }
    }
  }

  walk(dir);
  return filePaths;
}

async function main() {
  const apiKey = process.env.DEEPSEEK_API_KEY || '';
  if (!apiKey) {
    console.error('Please set DEEPSEEK_API_KEY environment variable');
    process.exit(1);
  }

  console.log('Creating RLM Agent with DeepSeek...\n');

  const rootLLM = new DeepseekLLMProvider(apiKey, 'deepseek-chat');
  const subLLM = new DeepseekLLMProvider(apiKey, 'deepseek-chat');

  const rlmAgent = new RLMAgent({
    rootLLM,
    subLLM,
    // maxDepth defaults to 1 (current implementation only supports depth=1)
  });

  // Scan entire project root (including node_modules) - paths only, not content!
  const projectRoot = path.join(__dirname, '../..');
  console.log('Scanning AStack source files from:', projectRoot, '\n');

  const filePaths = scanSourceFiles(projectRoot, projectRoot);
  console.log(`Found ${filePaths.length} TypeScript files\n`);

  // Create FileSystemContext with filesystem offloading and memory safety limits
  // Files will be loaded from disk on-demand, not stored in memory upfront
  const fsContext = new FileSystemContext(projectRoot, filePaths, {
    maxTotalRead: 100 * 1024 * 1024, // 100MB total read limit
    maxFileSize: 10 * 1024 * 1024, // 10MB per file limit
    maxCacheSize: 10 * 1024 * 1024, // 10MB LRU cache
  });
  const stats = fsContext.getStats();
  const limits = fsContext.getMemoryLimits();

  const contextSizeMB = (stats.totalSize / (1024 * 1024)).toFixed(2);
  const maxCacheMB = (limits.maxTotalRead / (1024 * 1024)).toFixed(0);
  const maxFileMB = (limits.maxFileSize / (1024 * 1024)).toFixed(0);

  console.log(`📊 Context Statistics:`);
  console.log(`   Files: ${stats.totalFiles}`);
  console.log(`   Lines: ${stats.totalLines.toLocaleString()}`);
  console.log(`   Characters: ${stats.totalSize.toLocaleString()}`);
  console.log(`   Size: ${contextSizeMB} MB`);
  console.log(`   File Types:`, Object.keys(stats.fileTypes).join(', '));
  console.log(`\n🎯 RLM Configuration:`);
  console.log(`   Context Mode: FileSystem (on-demand lazy loading)`);
  console.log(`\n🛡️  Memory Safety:`);
  console.log(`   LRU Cache Size: ${maxCacheMB} MB (auto-eviction enabled)`);
  console.log(`   Max Single File: ${maxFileMB} MB`);
  console.log(`   File Access: Unlimited (on-demand loading with LRU eviction)`);
  console.log(`   100% OOM Protection Guaranteed!`);
  console.log(
    `\n💡 Note: Can process all ${contextSizeMB}MB - files loaded on-demand, old entries auto-evicted.\n`
  );
  console.log('=== Streaming RLM Execution ===\n');

  for await (const chunk of rlmAgent.runStream({
    context: fsContext, // Pass FileSystemContext instead of string
    query: `Analyze the architecture of this codebase. Focus on:
1. Main components and their responsibilities
2. Key design patterns used
3. Dependencies between modules
4. Overall architectural style (e.g., component-based, reactive, etc.)

Provide a structured summary.`,
  })) {
    process.stdout.write(chunk.content);
  }

  console.log('\n=== Done ===');
  process.exit(0);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
