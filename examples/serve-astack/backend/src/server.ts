import dotenv from 'dotenv';
import { createApp } from './app.js';

// 加载环境变量
dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;
const HOST = process.env.HOST || '0.0.0.0';

async function start() {
  try {
    const app = await createApp();

    await app.listen({ port: PORT, host: HOST });

    console.log(`🚀 AStack Chat Server is running!`);
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`🔗 Chat API: http://localhost:${PORT}/api/chat`);
    console.log(`🤖 Built-in Agents: math, text`);
    console.log(`💬 Ready for AI conversations!`);
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});

start();
