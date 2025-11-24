import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/focus",  // 👈 এই লাইনটিই সব ঠিক করে দেবে (আপনার রেপো নাম focus)
  output: "export",
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
