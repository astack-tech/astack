import vm from 'node:vm';

/**
 * RLM input configuration
 */
export interface RLMInput {
  context: string;
  query: string;
  maxDepth?: number;
}

/**
 * RLM execution result
 */
export interface RLMResult {
  answer: string;
  code: string;
  depth: number;
}

/**
 * RLM streaming chunk
 */
export interface RLMChunk {
  type: 'code' | 'execution' | 'answer' | 'error';
  content: string;
}

/**
 * LLM provider interface for RLM
 */
export interface LLMProvider {
  generate(prompt: string): Promise<string>;
  generateStream?(prompt: string): AsyncGenerator<string>;
}

/**
 * RLM Core - Recursive Language Model with REPL environment
 * Based on the paper: handles long contexts by treating prompts as external environment
 */
export class RLMCore {
  private rootLLM: LLMProvider;
  private subLLM: LLMProvider;
  private maxDepth: number;

  constructor(rootLLM: LLMProvider, subLLM: LLMProvider, maxDepth: number = 1) {
    this.rootLLM = rootLLM;
    this.subLLM = subLLM;
    this.maxDepth = maxDepth;
  }

  /**
   * Execute RLM with given context and query
   */
  async execute(input: RLMInput): Promise<RLMResult> {
    const depth = 0;
    const rawCode = await this.rootLLM.generate(this.buildPrompt(input.context, input.query));
    const code = this.extractCode(rawCode);

    let answer = '';
    for await (const chunk of this.runREPLStream(code, input.context, depth)) {
      if (chunk.type === 'answer') {
        const match = chunk.content.match(/Answer:\s*(.+)/);
        if (match) {
          answer = match[1].trim();
        }
      }
    }

    return { answer, code, depth };
  }

  /**
   * Execute RLM with streaming output
   */
  async *executeStream(input: RLMInput): AsyncGenerator<RLMChunk> {
    const depth = 0;

    yield { type: 'code', content: 'Generating code...\n\n' };

    let rawCode = '';
    const prompt = this.buildPrompt(input.context, input.query);
    if (this.rootLLM.generateStream) {
      for await (const chunk of this.rootLLM.generateStream(prompt)) {
        rawCode += chunk;
        yield { type: 'code', content: chunk };
      }
    } else {
      rawCode = await this.rootLLM.generate(prompt);
      yield { type: 'code', content: rawCode };
    }

    const code = this.extractCode(rawCode);

    yield { type: 'code', content: '\n\n' };
    yield { type: 'execution', content: 'Executing code...\n' };

    try {
      for await (const chunk of this.runREPLStream(code, input.context, depth)) {
        yield chunk;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      yield { type: 'error', content: `\nError: ${errorMsg}\n` };
    }
  }

  /**
   * Extract JavaScript code from LLM response
   */
  private extractCode(rawCode: string): string {
    const codeBlockMatch = rawCode.match(/```(?:javascript|js)?\n([\s\S]*?)\n```/);
    if (codeBlockMatch) {
      return codeBlockMatch[1].trim();
    }
    return rawCode.trim();
  }

  /**
   * Build prompt for root LLM
   */
  private buildPrompt(context: string, query: string): string {
    return `You are a code generator for a Recursive Language Model (RLM) system.

TASK: ${query}

CONTEXT: The 'context' variable contains ${context.length} characters of information.

AVAILABLE TOOLS:
- context: string - the full context data
- llm_query(prompt): async function - send a prompt to sub-LLM, returns Promise<string>
- FINAL(answer): function - mark your final answer

YOUR JOB:
1. Analyze how to best solve the task given the long context
2. Decide how to break down the context (by parsing, splitting, extracting sections, etc.)
3. Use llm_query() to process parts of context or ask analytical questions
4. Synthesize results and call FINAL() with your answer

CRITICAL RULES:
- Write code at TOP LEVEL, do NOT define functions and call them
- You MUST output ONLY valid JavaScript code, no explanations
- Use 'await' directly at top level (supported in this environment)
- Be creative in how you split/process the context based on the task
- You can call llm_query() multiple times if needed
- Always end with FINAL(your_answer)

BAD example (DO NOT DO THIS):
async function main() { ... }
main();

GOOD example:
const chunks = context.split('\\n');
const result = await llm_query('analyze: ' + chunks[0]);
FINAL(result);

Generate the JavaScript code now:`;
  }

  /**
   * Run code in REPL environment with streaming
   */
  private async *runREPLStream(
    code: string,
    context: string,
    depth: number
  ): AsyncGenerator<RLMChunk> {
    let finalAnswer = '';

    const streamingLLMQuery = async function* (
      subLLM: LLMProvider,
      prompt: string
    ): AsyncGenerator<string> {
      if (subLLM.generateStream) {
        yield* subLLM.generateStream(prompt);
      } else {
        yield await subLLM.generate(prompt);
      }
    };

    const sandbox = {
      context,
      llm_query: async (prompt: string) => {
        if (depth >= maxDepth) {
          throw new Error('Maximum recursion depth reached');
        }

        let result = '';
        for await (const chunk of streamingLLMQuery(subLLM, prompt)) {
          result += chunk;
          pendingYield({ type: 'execution', content: chunk });
        }
        return result;
      },
      FINAL: (answer: string) => {
        finalAnswer = answer;
      },
    };

    const maxDepth = this.maxDepth;
    const subLLM = this.subLLM;
    const pendingChunks: RLMChunk[] = [];
    const pendingYield = (chunk: RLMChunk) => {
      pendingChunks.push(chunk);
    };

    const wrappedCode = `(async () => { ${code} })()`;
    const vmContext = vm.createContext(sandbox);
    const scriptResult = vm.runInContext(wrappedCode, vmContext);

    let isDone = false;
    const executionPromise =
      scriptResult && typeof scriptResult.then === 'function'
        ? scriptResult.finally(() => {
            isDone = true;
          })
        : Promise.resolve().then(() => {
            isDone = true;
          });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Execution timeout after 120s')), 120000)
    );

    const executionRace = Promise.race([executionPromise, timeoutPromise]);

    while (!isDone) {
      if (pendingChunks.length > 0) {
        const chunk = pendingChunks.shift();
        if (chunk) {
          yield chunk;
        }
      }
      await Promise.race([
        new Promise(resolve => setImmediate(resolve)),
        executionRace.catch(() => {}),
      ]);
    }

    while (pendingChunks.length > 0) {
      const chunk = pendingChunks.shift();
      if (chunk) {
        yield chunk;
      }
    }

    await executionRace;

    if (!finalAnswer) {
      throw new Error('Code executed but FINAL() was never called');
    }

    yield { type: 'answer', content: `\nAnswer: ${finalAnswer}\n` };
  }
}
