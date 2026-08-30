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
  async redirects() {
    return [
      // The one-page experience absorbed these routes; old URLs map to the
      // matching home section so existing links keep working.
      { source: "/work", destination: "/#work", permanent: false },
      { source: "/about", destination: "/#about", permanent: false },
      { source: "/skills", destination: "/#capabilities", permanent: false },
      { source: "/experience", destination: "/#experience", permanent: false },
      { source: "/contact", destination: "/#contact", permanent: false },
    ];
  },
};

export default nextConfig;
