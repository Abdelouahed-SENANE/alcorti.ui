import type { NextConfig } from "next";

// next.config.ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
    ],
  },
  webpack: (config: any) => {
    config.watchOptions = {
      ignored: ["**/node_modules", "**/.git", "**/.next", "**/public/uploads"],
    };
    return config;
  },
};

export default nextConfig;
