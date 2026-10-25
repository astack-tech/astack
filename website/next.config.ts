import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  devIndicators: false,
  // Dev and production builds must not write to the same cache.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  turbopack: {
    root: path.join(__dirname, '.'),
  },
};

export default nextConfig;
