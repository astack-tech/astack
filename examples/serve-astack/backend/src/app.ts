import Fastify from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import chatRoutes from './routes/chat.js';

export async function createApp() {
  const app = Fastify({
    logger: true,
  }).withTypeProvider<TypeBoxTypeProvider>();

  // 移除 SSE 插件，使用原生 HTTP 流响应 AI SDK Data Stream Protocol

  // 健康检查路由
  app.get('/', async () => {
    return {
      message: 'AStack Chat Server is running!',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: {
        chat: '/api/chat',
        health: '/',
      },
      features: {
        agents: ['math', 'text'],
        streaming: true,
        intentRouting: true,
      },
    };
  });

  // 注册聊天路由
  await app.register(chatRoutes, { prefix: '/api' });

  return app;
}
