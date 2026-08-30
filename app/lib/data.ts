/**
 * Centralized site constants.
 * Language-dependent copy lives in app/lib/content.ts (en/ja dictionaries).
 */

export const site = {
  name: "Faris Znafis",
  shortName: "FZ",
  role: "Creative Frontend Engineer",
  email: "hello@farisznafis.dev",
  location: "Jakarta, Indonesia",
  availability: "Available for work",
  github: "https://github.com/farisznafis",
  linkedin: "https://www.linkedin.com/in/farisznafis",
  twitter: "https://x.com/farisznafis",
};

/** Hero wordmark - split across two oversized lines. Language-neutral. */
export const heroName = {
  line1: "FARIS",
  line2: "ZNAFIS",
} as const;

/**
 * Hero spotlight images.
 * `base` is always visible; `reveal` shows only inside the cursor spotlight.
 * Swap these with your own photos later - drop files into /public/images
 * and change the values here.
 */
export const heroImages = {
  base: "/images/zaid-portrait-base.png",
  reveal: "/images/zaid-portrait-reveal.png",
} as const;

export const socials = [
  { label: "GitHub", href: site.github },
  { label: "LinkedIn", href: site.linkedin },
  { label: "Twitter / X", href: site.twitter },
] as const;

/** About section: interest categories with a picsum seed each for media. */
export type InterestKey =
  | "engineering"
  | "ai"
  | "design"
  | "photography"
  | "videography"
  | "experimentation";

export function interestImage(key: InterestKey, w = 900, h = 1100) {
  return `https://picsum.photos/seed/fz-interest-${key}/${w}/${h}`;
}

export const interestOrder = [
  "engineering",
  "ai",
  "design",
  "photography",
  "videography",
  "experimentation",
] as const satisfies readonly InterestKey[];

/** Lab strip: experiment names are proper nouns, shared across languages. */
export const labItems = [
  "Shader Particles",
  "Variable Font Choreography",
  "Scroll-Driven Masks",
  "Generative Type Systems",
  "WebGL Image Distortion",
  "Cursor Physics",
  "Kinetic Marquees",
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

/** Placeholder imagery per project - swap for real screenshots when ready. */
export function projectImage(key: ProjectKey, w: number, h: number, variant = "") {
  return `https://picsum.photos/seed/fz-${key}${variant ? `-${variant}` : ""}/${w}/${h}`;
}

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

/** Display order for the case-study pages and the work reel. */
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
