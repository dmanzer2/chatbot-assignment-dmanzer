import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ! This is a workaround for demo purposes only. Do not ignore TypeScript errors in production!
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;