import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  images: {
    remotePatterns: [new URL("https://trello-backgrounds.s3.amazonaws.com/**")],
  },
};

export default nextConfig;
