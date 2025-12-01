import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono, type Context } from 'hono';
import { streamSSE, type SSEStreamingApi } from 'hono/streaming';
import { StreamingAgent } from '@astack-tech/components/agents';
import { Deepseek } from '@astack-tech/integrations/model-provider';
import type { ModelProvider } from '@astack-tech/components';

// Initialize Hono app
const app = new Hono();

// Create Deepseek model instance
const createModel = (): ModelProvider => {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY environment variable is required');
  }

  return new Deepseek({
    apiKey,
    model: 'deepseek-chat',
    temperature: 0.7,
  }) as ModelProvider;
};

// Create streaming agent instance (singleton)
let agentInstance: StreamingAgent | null = null;
const getAgent = (): StreamingAgent => {
  if (!agentInstance) {
    agentInstance = new StreamingAgent({
      model: createModel(),
      tools: [],
      systemPrompt:
        'You are a helpful AI assistant powered by AStack and deployed on AWS Bedrock AgentCore.',
      maxIterations: 3,
    });
  }
  return agentInstance;
};

// Bedrock request/response types
interface BedrockRequest {
  inputText?: string;
  messages?: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
}

// Health check endpoint
app.get('/health', (c: Context) => {
  return c.json({
    status: 'healthy',
    service: 'astack-bedrock-agent-runtime',
    timestamp: new Date().toISOString(),
  });
});

// AWS Bedrock AgentCore invocations endpoint (port 8080 required)
app.post('/invocations', async (c: Context) => {
  try {
    const request: BedrockRequest = await c.req.json();

    // Extract messages from request
    const messages = request.messages || [
      { role: 'user' as const, content: request.inputText || '' },
    ];

    const agent = getAgent();

    // Stream response using SSE format
    return streamSSE(c, async (stream: SSEStreamingApi) => {
      try {
        for await (const chunk of agent.runStream({ messages })) {
          // Transform AStack chunks to SSE events
          switch (chunk.type) {
            case 'assistant_message':
              if (chunk.content) {
                await stream.writeSSE({
                  event: 'message',
                  data: JSON.stringify({
                    type: 'content_delta',
                    content: chunk.content,
                  }),
                });
              }
              break;

            case 'completed':
              await stream.writeSSE({
                event: 'done',
                data: JSON.stringify({
                  stopReason: 'stop',
                  completion: chunk.finalMessage || '',
                }),
              });
              break;

            case 'error':
              await stream.writeSSE({
                event: 'error',
                data: JSON.stringify({
                  error: chunk.error || 'Unknown error',
                }),
              });
              break;
          }
        }
      } catch (error) {
        await stream.writeSSE({
          event: 'error',
          data: JSON.stringify({
            error: error instanceof Error ? error.message : 'Stream error',
          }),
        });
      }
    });
  } catch (error) {
    return c.json(
      {
        error: error instanceof Error ? error.message : 'Invalid request',
      },
      400
    );
  }
});

// Start server on port 8080 (AWS Bedrock requirement)
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;
const HOST = process.env.HOST || '0.0.0.0';

serve(
  {
    fetch: app.fetch,
    port: PORT,
    hostname: HOST,
  },
  () => {
    console.log(`🚀 AStack Bedrock Agent Runtime started`);
    console.log(`📡 Listening on ${HOST}:${PORT}`);
    console.log(`🔗 Health: http://localhost:${PORT}/health`);
    console.log(`🤖 Invocations: http://localhost:${PORT}/invocations`);
  }
);
