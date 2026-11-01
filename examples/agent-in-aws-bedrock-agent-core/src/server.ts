import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono, type Context } from 'hono';
import { streamSSE, type SSEStreamingApi } from 'hono/streaming';
import { StreamingAgent } from '@astack-tech/components/agents';
import { Deepseek } from '@astack-tech/integrations/model-provider';
import type { ModelProvider } from '@astack-tech/components';

// Enhanced logging function with immediate flush
const log = (...args: unknown[]) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}]`, ...args);
  // Force flush to stdout for CloudWatch
  if (process.stdout.write) {
    process.stdout.write('');
  }
};

const logError = (...args: unknown[]) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR:`, ...args);
  if (process.stderr.write) {
    process.stderr.write('');
  }
};

// Initialize Hono app
const app = new Hono();

// Global request logger middleware
app.use('*', async (c, next) => {
  const method = c.req.method;
  const path = c.req.path;
  const startTime = Date.now();

  log(`➡️  ${method} ${path}`);
  log(`📋 Headers:`, JSON.stringify(c.req.header(), null, 2));

  await next();

  const duration = Date.now() - startTime;
  log(`⬅️  ${method} ${path} - Status: ${c.res.status} - Duration: ${duration}ms`);
});

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
  messages?: {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }[];
}

// Health check endpoint
app.get('/health', (c: Context) => {
  return c.json({
    status: 'healthy',
    service: 'astack-bedrock-agent-runtime',
    timestamp: new Date().toISOString(),
  });
});

// Ping endpoint for AgentCore health checks
app.get('/ping', (c: Context) => {
  return c.json({ status: 'healthy' });
});

// AWS Bedrock AgentCore invocations endpoint (port 8080 required)
app.post('/invocations', async (c: Context) => {
  try {
    log('🔍 Parsing request body...');
    const rawBody = await c.req.text();
    log('📦 Raw request body:', rawBody);

    let request: BedrockRequest;
    try {
      request = JSON.parse(rawBody);
      log('✅ Request parsed successfully:', JSON.stringify(request, null, 2));
    } catch (parseError) {
      logError('❌ JSON parse error:', parseError);
      return c.json(
        {
          error: 'Invalid JSON in request body',
          details: parseError instanceof Error ? parseError.message : 'Unknown parse error',
          receivedBody: rawBody.substring(0, 500), // First 500 chars for debugging
        },
        400
      );
    }

    // Extract messages from request
    const messages = request.messages || [
      { role: 'user' as const, content: request.inputText || '' },
    ];

    log('💬 Processing messages:', JSON.stringify(messages, null, 2));

    const agent = getAgent();
    log('🤖 Agent instance ready');

    // Stream response using SSE format
    log('🌊 Starting SSE stream...');
    return streamSSE(c, async (stream: SSEStreamingApi) => {
      try {
        log('📡 Beginning agent execution...');
        let chunkCount = 0;

        for await (const chunk of agent.runStream({ messages })) {
          chunkCount++;
          log(`📨 Chunk ${chunkCount}:`, chunk.type);

          // Transform AStack chunks to SSE events
          switch (chunk.type) {
            case 'assistant_message':
              if (chunk.content) {
                log(`💬 Assistant message: "${chunk.content.substring(0, 100)}..."`);
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
              log('✅ Stream completed:', chunk.finalMessage?.substring(0, 100));
              await stream.writeSSE({
                event: 'done',
                data: JSON.stringify({
                  stopReason: 'stop',
                  completion: chunk.finalMessage || '',
                }),
              });
              break;

            case 'error':
              logError('❌ Stream error:', chunk.error);
              await stream.writeSSE({
                event: 'error',
                data: JSON.stringify({
                  error: chunk.error || 'Unknown error',
                }),
              });
              break;
          }
        }

        log(`✨ Stream finished successfully with ${chunkCount} chunks`);
      } catch (error) {
        logError('❌ Stream processing error:', error);
        await stream.writeSSE({
          event: 'error',
          data: JSON.stringify({
            error: error instanceof Error ? error.message : 'Stream error',
            stack: error instanceof Error ? error.stack : undefined,
          }),
        });
      }
    });
  } catch (error) {
    logError('❌ Request handling error:', error);
    return c.json(
      {
        error: error instanceof Error ? error.message : 'Invalid request',
        stack: error instanceof Error ? error.stack : undefined,
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
    log('🚀 AStack Bedrock Agent Runtime started');
    log(`📡 Listening on ${HOST}:${PORT}`);
    log(`🔗 Health: http://localhost:${PORT}/health`);
    log(`🤖 Invocations: http://localhost:${PORT}/invocations`);
    log('🔧 Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      HAS_DEEPSEEK_KEY: !!process.env.DEEPSEEK_API_KEY,
    });
    log('✨ Ready to handle requests');
  }
);
