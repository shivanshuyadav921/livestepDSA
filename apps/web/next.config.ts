import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  transpilePackages: ['@algochef/recipe-engine-core'],
  outputFileTracingRoot: path.join(__dirname, '../..'),
};

export default nextConfig;
