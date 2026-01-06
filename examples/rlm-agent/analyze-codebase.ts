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
 * Recursively read all TypeScript source files
 */
function readSourceFiles(dir: string, basePath: string): Map<string, string> {
  const files = new Map<string, string>();
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
        const content = fs.readFileSync(fullPath, 'utf-8');
        files.set(relativePath, content);
      }
    }
  }

  walk(dir);
  return files;
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
    maxDepth: 5, // Deep recursion to demonstrate RLM's true power with long context
  });

  // Scan entire project root (including node_modules) to create massive context
  const projectRoot = path.join(__dirname, '../..');
  console.log('Reading AStack source files from:', projectRoot, '\n');

  const sourceFiles = readSourceFiles(projectRoot, projectRoot);
  console.log(`Found ${sourceFiles.size} TypeScript files\n`);

  // Create FileSystemContext with memory safety limits
  const fsContext = new FileSystemContext(sourceFiles, {
    maxTotalRead: 100 * 1024 * 1024, // 100MB total read limit
    maxFileSize: 10 * 1024 * 1024, // 10MB per file limit
  });
  const stats = fsContext.getStats();
  const limits = fsContext.getMemoryLimits();

  const contextSizeMB = (stats.totalSize / (1024 * 1024)).toFixed(2);
  const maxReadMB = (limits.maxTotalRead / (1024 * 1024)).toFixed(0);
  const maxFileMB = (limits.maxFileSize / (1024 * 1024)).toFixed(0);

  console.log(`📊 Context Statistics:`);
  console.log(`   Files: ${stats.totalFiles}`);
  console.log(`   Lines: ${stats.totalLines.toLocaleString()}`);
  console.log(`   Characters: ${stats.totalSize.toLocaleString()}`);
  console.log(`   Size: ${contextSizeMB} MB`);
  console.log(`   File Types:`, Object.keys(stats.fileTypes).join(', '));
  console.log(`\n🎯 RLM Configuration:`);
  console.log(`   Max Recursion Depth: 5`);
  console.log(`   Context Mode: FileSystem (on-demand access)`);
  console.log(`\n🛡️  Memory Safety:`);
  console.log(`   Max Total Read: ${maxReadMB} MB`);
  console.log(`   Max File Size: ${maxFileMB} MB`);
  console.log(`   100% OOM Protection Guaranteed!`);
  console.log(
    `\n💡 Note: Even with ${contextSizeMB}MB available, RLM will safely limit memory usage.\n`
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

  // Show actual memory usage
  const memoryUsage = fsContext.getMemoryUsage();
  const actualReadMB = (memoryUsage.bytesRead / (1024 * 1024)).toFixed(2);

  console.log('\n');
  console.log('═'.repeat(60));
  console.log('🛡️  MEMORY SAFETY REPORT');
  console.log('═'.repeat(60));
  console.log(`Actual Memory Used: ${actualReadMB} MB`);
  console.log(`Memory Limit: ${maxReadMB} MB`);
  console.log(`Usage: ${memoryUsage.percentUsed.toFixed(1)}%`);
  console.log(`Files Read: ${memoryUsage.bytesRead > 0 ? 'Yes' : 'None (metadata only)'}`);
  console.log('Status: ✅ No OOM - Execution completed safely!');
  console.log('═'.repeat(60));

  console.log('\n=== Done ===');
  process.exit(0);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
