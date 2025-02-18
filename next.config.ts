import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    
    // Ensure this is used only with Next.js 13 or later
    turbo: {},    // Correct way to enable Turbopack (if needed)
  },
  webpack: (config) => {
    return config; // If you're not modifying the webpack config, return as is
  },
};

export default nextConfig;
