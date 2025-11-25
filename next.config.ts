import type { NextConfig } from "next";

// The GITHUB_REPOSITORY environment variable is injected by GitHub Actions.
// This is used to set the base path and asset prefix for GitHub Pages.
// If it's not set, we'll fall back to an empty string, which is correct for most other environments.
const repo = process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}` : '';

const nextConfig: NextConfig = {
  output: "export",
  basePath: repo,
  assetPrefix: repo,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
