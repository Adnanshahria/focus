import type { NextConfig } from "next";

const isGithub = process.env.GITHUB_REPOSITORY;
const repo = isGithub ? process.env.GITHUB_REPOSITORY?.split('/')[1] : '';

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGithub ? `/${repo}` : "",
  assetPrefix: isGithub ? `/${repo}/` : "",
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
