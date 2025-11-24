import type { NextConfig } from "next";

// আমরা চেক করছি কোডটি GitHub Actions-এ রান হচ্ছে কিনা
const isGithub = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  
  // 👇 স্মার্ট লজিক: গিটহাবে হলে '/focus', অন্যথায় খালি (root)
  basePath: isGithub ? "/focus" : "",
  
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
