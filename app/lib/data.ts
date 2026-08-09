/**
 * Centralized site constants.
 * Language-dependent copy lives in app/lib/content.ts (en/ja dictionaries).
 */

export const site = {
  name: "Faris Znafis",
  shortName: "FZ",
  role: "Creative Frontend Engineer",
  email: "hello@farisznafis.dev",
  location: "Jakarta, Indonesia · GMT+7",
  availability: "Available for work",
  github: "https://github.com/farisznafis",
  linkedin: "https://www.linkedin.com/in/farisznafis",
  twitter: "https://x.com/farisznafis",
};

/**
 * Hero spotlight images.
 * `base` is always visible; `reveal` shows only inside the cursor spotlight.
 * Swap these with your own photos later — drop files into /public/images
 * and change the values to e.g. "/images/hero-base.png" & "/images/hero-reveal.png".
 */
export const heroImages = {
//   base: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85",
//   reveal:
//     "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85",
    base: "/images/zaid-portrait-base.png",
    reveal: "/images/zaid-portrait-reveal.png",
} as const;

/**
 * Tech names shown in the hero marquee — identical across languages,
 * so they live here rather than in the content dictionaries.
 */
export const marqueeStack = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
  "GSAP",
  "Three.js",
  "Node.js",
] as const;

export const socials = [
  { label: "GitHub", href: site.github },
  { label: "LinkedIn", href: site.linkedin },
  { label: "Twitter / X", href: site.twitter },
] as const;

// ─── Projects ────────────────────────────────────────────────────────────────
// Project copy (titles, roles, descriptions) is localized in content.ts.
// `projectMeta` holds the language-neutral plumbing (initials, stack, links).

export type ProjectCategory = "All" | "Product UI" | "Web App" | "Interactive";

export type ProjectKey = "lumen" | "orbit" | "pulse" | "kinetic" | "atlas";

export type ProjectMeta = {
  initials: string;
  stack: string[];
  /** TODO: replace with the real live-demo URLs for each project. */
  demo: string;
  repo: string;
  tone: "accent" | "amber";
  featured?: boolean;
};

export type Project = ProjectMeta & {
  key: ProjectKey;
  title: string;
  category: Exclude<ProjectCategory, "All">;
  year: string;
  role: string;
  description: string;
};

export const projectMeta: Record<ProjectKey, ProjectMeta> = {
  lumen: {
    initials: "LA",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Recharts", "Zustand"],
    demo: "#",
    repo: "https://github.com/farisznafis",
    tone: "accent",
    featured: true,
  },
  orbit: {
    initials: "OC",
    stack: ["Three.js", "React Three Fiber", "GSAP", "WebGL"],
    demo: "#",
    repo: "https://github.com/farisznafis",
    tone: "amber",
  },
  pulse: {
    initials: "PS",
    stack: ["Next.js", "Storefront API", "Stripe", "Tailwind CSS"],
    demo: "#",
    repo: "https://github.com/farisznafis",
    tone: "accent",
  },
  kinetic: {
    initials: "KT",
    stack: ["GSAP", "Canvas API", "Variable Fonts"],
    demo: "#",
    repo: "https://github.com/farisznafis",
    tone: "amber",
  },
  atlas: {
    initials: "AD",
    stack: ["React", "TypeScript", "Storybook", "Radix UI"],
    demo: "#",
    repo: "https://github.com/farisznafis",
    tone: "accent",
  },
};

/** Display order for the case-study pages and the next-project loop. */
export const projectOrder: readonly ProjectKey[] = [
  "lumen",
  "orbit",
  "pulse",
  "kinetic",
  "atlas",
];

/** Returns the next project in the loop, for the case-study footer. */
export function nextProject(key: ProjectKey): ProjectKey {
  const index = projectOrder.indexOf(key);
  return projectOrder[(index + 1) % projectOrder.length];
}