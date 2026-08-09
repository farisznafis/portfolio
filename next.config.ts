import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Placeholder project screenshots. TODO: remove once real screenshots
      // are added to /public/images/projects/.
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
