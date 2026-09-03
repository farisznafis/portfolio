import type { NextConfig } from "next";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseHostname = supabaseUrl
  ? new URL(supabaseUrl).hostname
  : undefined;

const nextConfig: NextConfig = {
  reactStrictMode: true,

  ...(supabaseHostname
    ? {
        images: {
          remotePatterns: [
            {
              protocol: "https" as const,
              hostname: supabaseHostname,
              pathname:
                "/storage/v1/object/public/portfolio-media/**",
            },
          ],
        },
      }
    : {}),

  async redirects() {
    return [
      {
        source: "/work",
        destination: "/projects",
        permanent: false,
      },
      {
        source: "/about",
        destination: "/#about",
        permanent: false,
      },
      {
        source: "/skills",
        destination: "/#capabilities",
        permanent: false,
      },
      {
        source: "/experience",
        destination: "/#experience",
        permanent: false,
      },
      {
        source: "/contact",
        destination: "/#contact",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;