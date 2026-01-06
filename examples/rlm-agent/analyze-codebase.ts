import { RLMAgent, type LLMProvider } from '@astack-tech/components/agents';
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
  const excludeDirs = ['node_modules', 'dist', '.git', 'coverage', '.turbo'];

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
    maxDepth: 1,
  });

  const packagesPath = path.join(__dirname, '../../packages');
  console.log('Reading AStack source files from:', packagesPath, '\n');

  const sourceFiles = readSourceFiles(packagesPath, packagesPath);
  console.log(`Found ${sourceFiles.size} TypeScript files\n`);

  let context = '# AStack Codebase\n\n';
  let totalLines = 0;

  for (const [filePath, content] of sourceFiles) {
    const lines = content.split('\n').length;
    totalLines += lines;
    context += `## File: ${filePath} (${lines} lines)\n\n\`\`\`typescript\n${content}\n\`\`\`\n\n`;
  }

  console.log(`Total context: ${context.length} characters, ${totalLines} lines of code\n`);
  console.log('Query: "Analyze the architecture of this codebase"\n');
  console.log('=== Streaming RLM Execution ===\n');

  for await (const chunk of rlmAgent.runStream({
    context,
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
