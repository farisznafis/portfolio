/**
 * Profile content — identity, portraits, socials, interest seeds and the
 * lab ticker. Language-neutral constants; localized labels live in the
 * copy layer (`app/lib/content.ts`) or the data-access layer.
 *
 * Accuracy rules: never invent employers, metrics, links, or dates.
 */
import type { InterestKey } from "../types/common";

export const site = {
  name: "Faris Zaidan Nafis",
  shortName: "FZ",
  role: "Software Engineer — Frontend, UI/UX & AI",
  // TODO_REAL_CONTENT: confirm this address is the one to publish before launch.
  email: "hello@farisznafis.dev",
  location: "Kumamoto, Japan",
  availability: "Open to opportunities in Japan",
  github: "https://github.com/farisznafis",
  linkedin: "https://www.linkedin.com/in/farisznafis",
} as const;

/** Hero wordmark — split across two oversized lines. Language-neutral. */
export const heroName = {
  line1: "FARIS",
  line2: "ZNAFIS",
} as const;

/**
 * Hero spotlight images (real portraits, already in the repo).
 * `base` is always visible; `reveal` shows only inside the cursor spotlight.
 */
export const heroImages = {
  base: "/images/zaid-portrait-base.png",
  reveal: "/images/zaid-portrait-reveal.png",
} as const;

/** Public professional profiles only — no dead social links. */
export const socials = [
  { label: "GitHub", href: site.github },
  { label: "LinkedIn", href: site.linkedin },
] as const;

// Interest tiles are typographic (no stock photography). Keys are shared
// across languages; labels live in the copy layer.
export const interestOrder: readonly InterestKey[] = [
  "engineering",
  "ai",
  "design",
  "photography",
  "videography",
  "experimentation",
];

/** Real current interests — replaces the fictional experiment names. */
export const labItems = [
  "AI-assisted UI Prototyping",
  "Web Motion & Interaction",
  "Design Systems",
  "LLM-powered Web Apps",
  "Computer Vision Interfaces",
  "Generative Visual Experiments",
  "Three.js / WebGL Experiments",
] as const;