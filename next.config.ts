import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // /work now lives at /projects (all projects) - keep old links working.
      { source: "/work", destination: "/projects", permanent: false },
      // The one-page experience absorbed these routes; old URLs map to the
      // matching home section so existing links keep working.
      { source: "/about", destination: "/#about", permanent: false },
      { source: "/skills", destination: "/#capabilities", permanent: false },
      { source: "/experience", destination: "/#experience", permanent: false },
      { source: "/contact", destination: "/#contact", permanent: false },
    ];
  },
};

export default nextConfig;
