import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Hide the Next.js dev badge so it doesn't appear in the QA screenshots
  devIndicators: false,
};

export default nextConfig;
