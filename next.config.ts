import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'wall-art.t3.storage.dev',
            },

            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
        ],
    },
    experimental : {
        serverActions: {
            bodySizeLimit: "10mb",
        }
    },
    reactStrictMode: false
};
export default nextConfig;
