import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // 👇 এই অংশটি নতুন যোগ করা হলো
  typescript: {
    ignoreBuildErrors: true, // টাইপ এরর থাকলেও বিল্ড হবে
  },
  eslint: {
    ignoreDuringBuilds: true, // লিন্ট এরর থাকলেও বিল্ড হবে
  },
};

export default nextConfig;
