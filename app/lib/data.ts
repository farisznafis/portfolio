/**
 * Centralized site constants and the real project data model.
 * Language-dependent copy lives in app/lib/content.ts (en/ja dictionaries).
 *
 * Accuracy rules for this file:
 * - Never invent employers, metrics, links, or dates.
 * - Missing information stays optional (undefined / null) - never "#".
 * - Anything awaiting real content is marked TODO_REAL_CONTENT / TODO_REAL_IMAGE.
 */

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
  // Twitter/X removed from prominent navigation (no meaningful professional content).
} as const;

/** Hero wordmark - split across two oversized lines. Language-neutral. */
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

/** Public professional profiles only - no dead social links. */
export const socials = [
  { label: "GitHub", href: site.github },
  { label: "LinkedIn", href: site.linkedin },
] as const;

// ─── About interests ─────────────────────────────────────────────────────────
// Interest tiles are typographic (no stock photography). Keys are shared
// across languages; labels live in content.ts.

export type InterestKey =
  | "engineering"
  | "ai"
  | "design"
  | "photography"
  | "videography"
  | "experimentation";

export const interestOrder = [
  "engineering",
  "ai",
  "design",
  "photography",
  "videography",
  "experimentation",
] as const satisfies readonly InterestKey[];

// ─── Lab / experiments ───────────────────────────────────────────────────────
/** Real current interests - replaces the fictional experiment names. */
export const labItems = [
  "AI-assisted UI Prototyping",
  "Web Motion & Interaction",
  "Design Systems",
  "LLM-powered Web Apps",
  "Computer Vision Interfaces",
  "Generative Visual Experiments",
  "Three.js / WebGL Experiments",
] as const;

// ─── Projects ────────────────────────────────────────────────────────────────
// Project copy (titles, roles, descriptions) is localized in content.ts.
// `projects` holds the language-neutral plumbing (fields, stack, links, media).

/** Fields a project can belong to. A project may have SEVERAL fields. */
export type ProjectField =
  | "Frontend"
  | "AI / ML"
  | "Data / Optimization"
  | "UI / UX"
  | "Visual Design";

export const fieldOrder = [
  "Frontend",
  "AI / ML",
  "Data / Optimization",
  "UI / UX",
  "Visual Design",
] as const satisfies readonly ProjectField[];

/** How much of a project may be shown publicly. */
export type Confidentiality =
  /** Personal / open-source work - links may be shown. */
  | "public"
  /** Professional work - describe at a high level, no internal material. */
  | "professional"
  /** Confidential work - high-level contribution only, no links at all. */
  | "confidential";

export type ProjectLink = { label: string; href: string };

/**
 * Real project keys. Fictional projects (lumen/orbit/pulse/kinetic/atlas)
 * have been removed entirely.
 */
export type ProjectKey =
  | "carbon-monitoring"
  | "kumamotalk"
  | "makomti-recruitment"
  | "speech-emotion"
  | "financify"
  | "blastout"
  | "co2-emission"
  | "suicide-risk"
  | "face-to-comic"
  | "building-damage"
  | "llm-pipeline"
  | "optimization-web"
  | "himakom-visual"
  | "portfolio-v3";

/** Keys that have a full case study under /work/[slug]. */
export type CaseStudyKey =
  | "carbon-monitoring"
  | "kumamotalk"
  | "makomti-recruitment"
  | "speech-emotion"
  | "financify";

export type ProjectMeta = {
  initials: string;
  fields: ProjectField[];
  stack: string[];
  tone: "accent" | "amber";
  /** Shown in the Home featured reel when true. */
  featured?: boolean;
  /** Full case study exists under /work/[slug]. */
  caseStudy?: boolean;
  confidentiality: Confidentiality;
  /** Live demo URL - only when it exists. Never "#". */
  demo?: string;
  /** Public repository URL - only when it exists. Never a private repo. */
  repo?: string;
  /** Public Figma file/community URL - only when it exists. */
  figma?: string;
  /** Any other public link (article, event page, ...). */
  externalLinks?: ProjectLink[];
  /** Real screenshot under /public/images - null until one exists. */
  image?: string | null;
  /** Case-study gallery images - null until real assets exist. */
  gallery?: string[] | null;
};

export const projects: Record<ProjectKey, ProjectMeta> = {
  // ── Featured (Home reel order) ───────────────────────────────────────────
  "carbon-monitoring": {
    initials: "CM",
    fields: ["Frontend", "UI / UX"],
    stack: ["React", "TypeScript", "Vite", "REST API", "React Router", "React Hook Form", "Zod", "Zustand"],
    tone: "accent",
    featured: true,
    caseStudy: true,
    // Professional/company work: no repo, no demo, no internal screenshots.
    confidentiality: "professional",
    image: null, // TODO_REAL_IMAGE: public-safe screenshot (if any is approved)
    gallery: null, // TODO_REAL_IMAGE
  },
  kumamotalk: {
    initials: "KM",
    fields: ["Frontend", "AI / ML", "UI / UX"],
    stack: ["Next.js", "React", "TypeScript", "face-api.js", "TensorFlow.js", "react-mic"],
    tone: "amber",
    featured: true,
    caseStudy: true,
    confidentiality: "public",
    repo: "https://github.com/farisznafis/kumamotalk",
    image: null, // TODO_REAL_IMAGE: expo photo / UI screenshot
    gallery: null, // TODO_REAL_IMAGE
  },
  "makomti-recruitment": {
    initials: "MK",
    fields: ["UI / UX", "Visual Design"],
    stack: ["Figma", "UI/UX Design", "Responsive Design", "Visual Assets"],
    tone: "accent",
    featured: true,
    caseStudy: true,
    // Professional work: no public links.
    confidentiality: "professional",
    image: null, // TODO_REAL_IMAGE: public-safe UI shots (if approved)
    gallery: null, // TODO_REAL_IMAGE
  },
  "speech-emotion": {
    initials: "SE",
    fields: ["AI / ML", "Data / Optimization"],
    stack: ["Python", "TensorFlow", "Keras", "Librosa", "NumPy", "Pandas", "Streamlit"],
    tone: "amber",
    featured: true,
    caseStudy: true,
    confidentiality: "public",
    repo: "https://github.com/farisznafis/emotion-sentiment",
    image: null, // TODO_REAL_IMAGE: Streamlit UI screenshot
    gallery: null, // TODO_REAL_IMAGE
  },
  financify: {
    initials: "FI",
    fields: ["AI / ML", "Data / Optimization"],
    stack: ["Python", "TensorFlow / Keras", "LSTM", "Pandas", "Flask", "Docker"],
    tone: "accent",
    featured: true,
    caseStudy: true,
    confidentiality: "public",
    repo: "https://github.com/farisznafis/bangkit-financify",
    image: null, // TODO_REAL_IMAGE: app/model screenshot
    gallery: null, // TODO_REAL_IMAGE
  },

  // ── All other real projects (/projects only) ─────────────────────────────
  blastout: {
    initials: "BO",
    fields: ["UI / UX"],
    // TODO_REAL_CONTENT: confirm year, team size, and any public link.
    stack: ["Figma", "Web Design"],
    tone: "amber",
    caseStudy: false,
    confidentiality: "professional",
    image: null, // TODO_REAL_IMAGE
  },
  "co2-emission": {
    initials: "C2",
    fields: ["AI / ML", "Data / Optimization"],
    // TODO_REAL_CONTENT: confirm year + whether a public repo exists.
    stack: ["Python", "Machine Learning"],
    tone: "accent",
    caseStudy: false,
    confidentiality: "public",
    image: null, // TODO_REAL_IMAGE
  },
  "suicide-risk": {
    initials: "SR",
    fields: ["AI / ML"],
    // TODO_REAL_CONTENT: confirm year + whether a public repo exists.
    stack: ["Python", "NLP"],
    tone: "amber",
    caseStudy: false,
    confidentiality: "public",
    image: null, // TODO_REAL_IMAGE
  },
  "face-to-comic": {
    initials: "FC",
    fields: ["AI / ML"],
    stack: ["Python", "Computer Vision"],
    tone: "accent",
    caseStudy: false,
    confidentiality: "public",
    repo: "https://github.com/farisznafis/real-to-comic-photo",
    // TODO_REAL_CONTENT: confirm year.
    image: null, // TODO_REAL_IMAGE
  },
  "building-damage": {
    initials: "BD",
    fields: ["AI / ML", "Data / Optimization"],
    // TODO_REAL_CONTENT: confirm year + whether a public repo exists.
    stack: ["Python", "Machine Learning"],
    tone: "amber",
    caseStudy: false,
    confidentiality: "public",
    image: null, // TODO_REAL_IMAGE
  },
  "llm-pipeline": {
    initials: "LP",
    fields: ["AI / ML", "Data / Optimization"],
    stack: ["Data Pipeline", "LLM", "Web Scraping"],
    tone: "accent",
    caseStudy: false,
    // GoTo internship work: no company code or internal names may be shown.
    confidentiality: "confidential",
    image: null,
  },
  "optimization-web": {
    initials: "OW",
    fields: ["Data / Optimization"],
    stack: ["Gurobi", "Docker", "Google Kubernetes Engine"],
    tone: "amber",
    caseStudy: false,
    // Telkom internship work: no company-private material.
    confidentiality: "professional",
    image: null, // TODO_REAL_IMAGE
  },
  "himakom-visual": {
    initials: "HV",
    fields: ["Visual Design"],
    // TODO_REAL_CONTENT: verified audience number (only if already published).
    stack: ["Visual Design", "Social Media"],
    tone: "accent",
    caseStudy: false,
    confidentiality: "public",
    image: null, // TODO_REAL_IMAGE
  },
  "portfolio-v3": {
    initials: "V3",
    fields: ["Frontend"],
    stack: ["Next.js", "TypeScript", "GSAP", "Framer Motion", "Three.js", "React Three Fiber"],
    tone: "amber",
    caseStudy: false,
    confidentiality: "public",
    repo: "https://github.com/farisznafis/portfolio",
    image: null, // TODO_REAL_IMAGE: a real screenshot of this site works here
  },
};

/**
 * Every real project, in display order for /projects.
 *
 * TODO_REAL_CONTENT - old Webflow portfolio (https://farisznafis.webflow.io/)
 * could not be verified from the repo. Manually check it for any additional
 * real projects missing from this list before launch.
 */
export const projectOrder: readonly ProjectKey[] = [
  "carbon-monitoring",
  "kumamotalk",
  "makomti-recruitment",
  "speech-emotion",
  "financify",
  "blastout",
  "co2-emission",
  "suicide-risk",
  "face-to-comic",
  "building-damage",
  "llm-pipeline",
  "optimization-web",
  "himakom-visual",
  "portfolio-v3",
];

/**
 * Only the projects featured on Home. The WorkReel reads THIS list,
 * never projectOrder. Swap entries here to change the featured set
 * (e.g. replace MAKOMTI with BLASTOUT once stronger assets exist).
 */
export const featuredProjectOrder: readonly ProjectKey[] = [
  "carbon-monitoring",
  "kumamotalk",
  "makomti-recruitment",
  "speech-emotion",
  "financify",
];

/** Case-study slugs for /work/[slug] - projects with `caseStudy: true`. */
export const caseStudyOrder: readonly CaseStudyKey[] = [
  "carbon-monitoring",
  "kumamotalk",
  "makomti-recruitment",
  "speech-emotion",
  "financify",
];

/** Where a project card should lead: case study first, then public links. */
export function projectHref(key: ProjectKey): string {
  const meta = projects[key];
  if (meta.caseStudy) return `/work/${key}`;
  if (meta.demo) return meta.demo;
  if (meta.repo) return meta.repo;
  return meta.externalLinks?.[0]?.href ?? "/projects";
}

/** True when the card should navigate internally (next/link) vs externally. */
export function projectIsInternal(key: ProjectKey): boolean {
  return Boolean(projects[key].caseStudy);
}

/** Returns the next case study in the loop, for the case-study footer. */
export function nextCaseStudy(key: CaseStudyKey): CaseStudyKey {
  const index = caseStudyOrder.indexOf(key);
  return caseStudyOrder[(index + 1) % caseStudyOrder.length];
}