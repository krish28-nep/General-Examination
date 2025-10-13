import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost"], // allow images from your backend
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5282",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
