import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: { root: import.meta.dirname },
  experimental: {
    staleTimes: { dynamic: 300 },
    dynamicOnHover: true,
  },
  images: { unoptimized: true },
};

export default nextConfig;
