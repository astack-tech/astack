import { StreamingAgent } from '@astack-tech/components';
import { ModelProvider } from '@astack-tech/integrations';
import { createTool } from '@astack-tech/tools';

const apiKey = process.env['DEEPSEEK_API_KEY'];
if (!apiKey) {
  throw new Error('Set DEEPSEEK_API_KEY to run this example.');
}

const wordCount = createTool(
  'word_count',
  'Count the words in a text.',
  args => String(args['text']).split(/\s+/).filter(Boolean).length,
  { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] }
);

const agent = new StreamingAgent({
  model: new ModelProvider.Deepseek({ apiKey }),
  tools: [wordCount],
});

// runStream() yields events while the agent works.
let printed = 0;
for await (const event of agent.runStream('How many words are in "data flows through ports"?')) {
  switch (event.type) {
    case 'assistant_message': {
      // `content` holds the text so far; print only the new part.
      const text = event.content ?? '';
      process.stdout.write(text.slice(printed));
      printed = text.length;
      break;
    }
    case 'tool_start':
      console.log(`\n[tool] ${event.toolName ?? ''}`);
      break;
    case 'tool_result':
      console.log(`[result] ${JSON.stringify(event.result)}`);
      break;
    case 'iteration_start':
      printed = 0;
      break;
    case 'completed':
      console.log('\n[done]', event.usage);
      break;
    case 'model_thinking':
    case 'error':
      break;
  }
}
