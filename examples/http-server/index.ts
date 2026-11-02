import { createServer } from 'node:http';

import { StreamingAgent } from '@astack-tech/components';
import { ModelProvider } from '@astack-tech/integrations';

const apiKey = process.env['DEEPSEEK_API_KEY'];
if (apiKey === undefined || apiKey === '') {
  throw new Error('Set DEEPSEEK_API_KEY to run this example.');
}

// Any model works here: OpenAICompatible for OpenAI, Qwen or Ollama, or your own ModelProvider.
const agent = new StreamingAgent({ model: new ModelProvider.Deepseek({ apiKey }) });
const port = Number(process.env['PORT'] ?? 3000);

// POST /chat with a plain-text body. The reply is a stream of Server-Sent Events.
const server = createServer((request, response) => {
  if (request.method !== 'POST' || request.url !== '/chat') {
    response.writeHead(404).end();
    return;
  }

  let body = '';
  request.setEncoding('utf8');
  request.on('data', (chunk: string) => {
    body += chunk;
  });
  request.on('end', () => {
    response.writeHead(200, {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      connection: 'keep-alive',
    });

    void (async () => {
      try {
        for await (const event of agent.runStream(body)) {
          response.write(`data: ${JSON.stringify(event)}\n\n`);
        }
      } catch {
        // runStream already sent an `error` event before it threw.
      } finally {
        response.end();
      }
    })();
  });
});

server.listen(port, () => {
  console.log(`curl -N -X POST localhost:${String(port)}/chat -d "Explain ports in one line"`);
});
