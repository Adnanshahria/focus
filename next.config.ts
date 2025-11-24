import type { NextConfig } from "next";

// We're checking if the code is running in GitHub Actions
const isGithub = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  
  // Logic: '/focus' on GitHub, empty (root) otherwise
  basePath: isGithub ? "/focus" : "",
  assetPrefix: isGithub ? "/focus/" : "",
  
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
