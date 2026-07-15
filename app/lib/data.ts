/**
 * Centralized site content.
 * Replace the placeholder values below with real data — every section reads from here.
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

export const heroStats = [
  { value: 6, suffix: "+", label: "Years crafting UI" },
  { value: 40, suffix: "+", label: "Projects shipped" },
  { value: 15, suffix: "+", label: "Clients & teams" },
] as const;

/**
 * Home page scroll-experience copy.
 * Short, punchy content shown over the scroll-driven particle wave.
 */
export const homeIntro = {
  kicker: "Creative Frontend Engineer",
  line1: "I design and build",
  line2: "interfaces that feel alive",
  blurb:
    "Motion, 3D, and product thinking woven into fast, memorable web experiences. Scroll to see what I mean.",
} as const;

export const homePillars = [
  {
    index: "01",
    title: "Motion Design",
    description:
      "Purposeful animation that explains state, guides attention, and rewards curiosity — never decoration for its own sake.",
  },
  {
    index: "02",
    title: "3D & WebGL",
    description:
      "Shader-driven scenes, particle systems, and real-time 3D that stay smooth at 60fps on real devices.",
  },
  {
    index: "03",
    title: "Product UI",
    description:
      "Design systems, accessible components, and the unglamorous glue that turns a prototype into a shipped product.",
  },
] as const;


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

export const projectCategories = ["All", "Product UI", "Web App", "Interactive"] as const;

export type ProjectCategory = (typeof projectCategories)[number];

export type Project = {
  title: string;
  initials: string;
  category: Exclude<ProjectCategory, "All">;
  year: string;
  role: string;
  description: string;
  stack: string[];
  demo: string;
  repo: string;
  tone: "accent" | "amber";
  featured?: boolean;
};

export const projects: Project[] = [
  {
    title: "Lumen Analytics",
    initials: "LA",
    category: "Product UI",
    year: "2025",
    role: "Frontend Lead",
    description:
      "Real-time analytics platform for marketing teams — 40+ dashboard views, a themeable design system, and virtualized data grids that stay smooth at 10k rows.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Recharts", "Zustand"],
    demo: "https://example.com",
    repo: "https://github.com/farisznafis",
    tone: "accent",
    featured: true,
  },
  {
    title: "Orbit Configurator",
    initials: "OC",
    category: "Interactive",
    year: "2024",
    role: "Creative Developer",
    description:
      "A WebGL product configurator with physically-based materials, camera choreography, and 60fps transitions between build steps.",
    stack: ["Three.js", "React Three Fiber", "GSAP", "WebGL"],
    demo: "https://example.com",
    repo: "https://github.com/farisznafis",
    tone: "amber",
  },
  {
    title: "Pulse Storefront",
    initials: "PS",
    category: "Web App",
    year: "2024",
    role: "Frontend Engineer",
    description:
      "Headless commerce storefront scoring 98+ on Lighthouse — optimistic cart, edge-rendered product pages, and A/B-tested checkout flows.",
    stack: ["Next.js", "Storefront API", "Stripe", "Tailwind CSS"],
    demo: "https://example.com",
    repo: "https://github.com/farisznafis",
    tone: "accent",
  },
  {
    title: "Kinetic Type Lab",
    initials: "KT",
    category: "Interactive",
    year: "2023",
    role: "Designer & Developer",
    description:
      "A playground of kinetic typography experiments — scroll-driven text, variable-font choreography, and shader-based distortion effects.",
    stack: ["GSAP", "Canvas API", "Variable Fonts"],
    demo: "https://example.com",
    repo: "https://github.com/farisznafis",
    tone: "amber",
  },
  {
    title: "Atlas Design System",
    initials: "AD",
    category: "Product UI",
    year: "2023",
    role: "Design Engineer",
    description:
      "Component library and token pipeline powering three products — 60+ accessible components, Storybook docs, and automated visual regression.",
    stack: ["React", "TypeScript", "Storybook", "Radix UI"],
    demo: "https://example.com",
    repo: "https://github.com/farisznafis",
    tone: "accent",
  },
];

export type SkillGroup = {
  title: string;
  blurb: string;
  skills: { name: string; level: number }[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend Core",
    blurb: "The foundation every project stands on.",
    skills: [
      { name: "React & Next.js", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "Tailwind CSS", level: 92 },
      { name: "HTML & Accessibility", level: 88 },
    ],
  },
  {
    title: "Motion & 3D",
    blurb: "Where interfaces come to life.",
    skills: [
      { name: "Framer Motion", level: 92 },
      { name: "GSAP", level: 88 },
      { name: "Three.js / R3F", level: 78 },
      { name: "CSS Animation", level: 90 },
    ],
  },
  {
    title: "Engineering Practice",
    blurb: "Shipping fast without breaking things.",
    skills: [
      { name: "Performance Optimization", level: 85 },
      { name: "Testing (Vitest, Playwright)", level: 80 },
      { name: "Git & CI/CD", level: 86 },
      { name: "Node.js & APIs", level: 75 },
    ],
  },
];

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  current?: boolean;
  summary: string;
  points: string[];
  stack: string[];
};

export const experience: ExperienceItem[] = [
  {
    role: "Senior Frontend Engineer",
    company: "Nimbus Labs",
    period: "2023 — Present",
    current: true,
    summary: "Leading the frontend guild on a B2B analytics suite used by 200+ teams.",
    points: [
      "Rebuilt the dashboard shell with streaming server components, cutting time-to-interactive by 38%.",
      "Introduced a shared motion system that unified transitions across four product areas.",
      "Mentored four engineers through their first design-system contributions.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    role: "Frontend Engineer",
    company: "Arunika Studio",
    period: "2021 — 2023",
    summary: "Built award-nominated marketing sites and interactive campaigns for regional brands.",
    points: [
      "Shipped 12 campaign sites with WebGL and scroll-driven storytelling, averaging 95+ Lighthouse scores.",
      "Created the studio's internal starter kit, halving project setup time.",
      "Collaborated daily with designers to prototype motion directly in the browser.",
    ],
    stack: ["React", "GSAP", "Three.js", "Sanity"],
  },
  {
    role: "Freelance UI Engineer",
    company: "Independent",
    period: "2019 — 2021",
    summary: "Partnered with early-stage startups to take products from Figma to production.",
    points: [
      "Delivered MVPs for five startups across fintech, education, and e-commerce.",
      "Owned everything from component architecture to deployment pipelines.",
    ],
    stack: ["React", "Styled Components", "Firebase"],
  },
];

export const aboutPrinciples = [
  {
    title: "Performance first",
    description: "Motion means nothing if it stutters. Every animation is budgeted against real devices.",
  },
  {
    title: "Motion with purpose",
    description: "Animation should explain, guide, or delight — never decorate for its own sake.",
  },
  {
    title: "Accessible by default",
    description: "Keyboard paths, reduced-motion fallbacks, and honest contrast are non-negotiable.",
  },
] as const;

export const socials = [
  { label: "GitHub", href: site.github },
  { label: "LinkedIn", href: site.linkedin },
  { label: "Twitter / X", href: site.twitter },
] as const;
