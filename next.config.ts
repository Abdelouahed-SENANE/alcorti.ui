import type { NextConfig } from "next";

// next.config.ts
const nextConfig = {
  webpack: (config: any) => {
    config.watchOptions = {
      ignored: ["**/node_modules", "**/.git", "**/.next", "**/public/uploads"],
    };
    return config;
  },
};

export default nextConfig;
