import { NextRequest } from 'next/server';

// 动态代理 API 路由 - 运行时判断后端地址
export async function POST(request: NextRequest) {
  try {
    // 运行时动态确定后端地址
    const backendUrl = process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') // 移除 /api 后缀
      : process.env.BACKEND_URL || 'http://localhost:8080';

    const targetUrl = `${backendUrl}/api/chat`;

    // 获取请求体
    const body = await request.text();

    // 转发请求到实际后端
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 转发其他相关头
        ...(request.headers.get('authorization') && {
          authorization: request.headers.get('authorization')!,
        }),
      },
      body,
    });

    // 检查响应是否成功
    if (!response.ok) {
      console.error(`Backend API error: ${response.status} ${response.statusText}`);
      return new Response(JSON.stringify({ error: 'Backend API error', status: response.status }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 转发响应，保持流式传输
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        // 保持流式传输的头
        ...(response.headers.get('transfer-encoding') && {
          'Transfer-Encoding': response.headers.get('transfer-encoding')!,
        }),
        // CORS 头（如果需要）
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('API proxy error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal proxy error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// 处理 OPTIONS 请求（CORS 预检）
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
