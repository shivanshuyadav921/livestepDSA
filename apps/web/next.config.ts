import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  transpilePackages: ['@algochef/recipe-engine-core', '@algochef/database', '@algochef/prompts'],
  outputFileTracingRoot: path.join(__dirname, '../..'),
};

export default nextConfig;
