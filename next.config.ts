import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'base-ec2.akamaized.net', // エラーに出ているドメイン
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.base.ec',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
