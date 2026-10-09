import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Docker: build a minimal self-contained server (.next/standalone) with only the files it needs
  output: "standalone",
  // Hide the Next.js dev badge so it doesn't appear in the QA screenshots
  devIndicators: false,
};

export default nextConfig;
