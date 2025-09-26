/** @type {import('next').NextConfig} */
const nextConfig = {
  // 开发环境代理配置
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*', // 代理到后端服务器
      },
    ];
  },
};

module.exports = nextConfig;