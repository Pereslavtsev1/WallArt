import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 't3.storage.dev',
        pathname: '/wall-art/**',
      },
    ],
  },
};
export default nextConfig;
