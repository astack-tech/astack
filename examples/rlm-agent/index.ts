import { RLMAgent, type LLMProvider } from '@astack-tech/components/agents';
import { Deepseek } from '@astack-tech/integrations/model-provider';

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

  const longContext = `
This is a long document about AI architectures.

Section 1: Transformer Architecture
Transformers use self-attention mechanisms to process sequences. The key innovation
is the attention mechanism that allows the model to focus on different parts of the
input when producing each part of the output.

Section 2: GPT Models
GPT (Generative Pre-trained Transformer) models are autoregressive language models
that use transformer architecture. They are trained on large text corpora and can
generate coherent text.

Section 3: BERT and Bidirectional Models
BERT uses bidirectional transformers to understand context from both directions.
This makes it particularly effective for tasks like question answering.

Section 4: Modern Developments
Recent developments include models like GPT-4, Claude, and other large language
models that can handle complex reasoning tasks.
  `.trim();

  console.log('Long context prepared (length:', longContext.length, 'characters)\n');
  console.log('Query: "What are the main AI architectures mentioned?"\n');
  console.log('=== Streaming RLM Execution ===\n');

  for await (const chunk of rlmAgent.runStream({
    context: longContext,
    query: 'What are the main AI architectures mentioned in the document?',
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
