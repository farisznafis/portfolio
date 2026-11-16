import type { NextConfig } from "next";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseHostname = supabaseUrl
  ? new URL(supabaseUrl).hostname
  : undefined;

// Gallery files are served from public/media unless this names the bucket (see app/lib/content/gallery.ts).
const galleryMedia = process.env.NEXT_PUBLIC_GALLERY_MEDIA_URL
  ? new URL(process.env.NEXT_PUBLIC_GALLERY_MEDIA_URL)
  : undefined;

const remotePatterns = [
  ...(supabaseHostname
    ? [
        {
          protocol: "https" as const,
          hostname: supabaseHostname,
          pathname:
            "/storage/v1/object/public/portfolio-media/**",
        },
      ]
    : []),
  ...(galleryMedia && galleryMedia.hostname !== supabaseHostname
    ? [
        {
          protocol: "https" as const,
          hostname: galleryMedia.hostname,
          pathname: `${galleryMedia.pathname}/**`,
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    // 90 is for the gallery lightbox, where the photograph is the point.
    qualities: [75, 90],
    remotePatterns,
  },

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