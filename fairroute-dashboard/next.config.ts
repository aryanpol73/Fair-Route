import type { NextConfig } from "next";

// IMPORTANT: use require instead of import
// @ts-ignore
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV !== "production",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    unoptimized: true,
  },

  // Fix for Next.js 16 Turbopack issue
  turbopack: {},
};

export default withPWA(nextConfig);