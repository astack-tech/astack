import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  devIndicators: false,
  // Lets devices on the local network load the dev server with live reload.
  allowedDevOrigins: ['127.0.0.1', '192.168.*.*', '10.*.*.*', '*.local'],
  // Dev and production builds must not write to the same cache.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  turbopack: {
    root: path.join(__dirname, '.'),
  },
};

export default nextConfig;
