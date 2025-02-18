import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    turbo: false, // Disable Turbopack
  },
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
