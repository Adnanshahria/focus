import type { NextConfig } from "next";

const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];

const nextConfig: NextConfig = {
  output: "export",
  basePath: repo ? `/${repo}` : "",
  assetPrefix: repo ? `/${repo}/` : "",
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
