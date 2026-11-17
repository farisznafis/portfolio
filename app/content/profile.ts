/**
 * Profile content — identity, portraits, socials, visual journal and
 * the lab ticker. Language-neutral constants; localized labels live in the
 * copy layer (`app/lib/content.ts`) or the data-access layer.
 *
 * Accuracy rules: never invent employers, metrics, links, or dates.
 */

export const site = {
  name: "Faris Zaidan Nafis",
  shortName: "F",
  role: "Software Engineer — Frontend, UI/UX & AI",
  email: "farisznafis14@gmail.com",
  location: "Kumamoto, Japan",
  // availability: "Open to opportunities in Japan",
  github: "https://github.com/farisznafis",
  linkedin: "https://www.linkedin.com/in/farisznafis",
} as const;

/**
 * Hero wordmark — split across two oversized lines.
 */
export const heroName = {
  en: {
    line1: "FARIS",
    line2Filled: "ZAID",
    line2Outline: "AN NAFIS",
  },
  ja: {
    line1: "ファリス・",
    line2Filled: "ザイダン・",
    line2Outline: "ナフィス",
  },
} as const;

/**
 * Hero spotlight images.
 *
 * `base` is always visible.
 * `reveal` appears inside the cursor spotlight.
 */
export const heroImages = {
  base: "/images/zaid-portrait-base.png",
  reveal: "/images/zaid-portrait-reveal.png",
} as const;

/**
 * Public professional profiles.
 */
export const socials = [
  {
    label: "GitHub",
    href: site.github,
  },
  {
    label: "LinkedIn",
    href: site.linkedin,
  },
] as const;

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Visual journal
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Films for the "Outside the code" section, in display order, landscape or
 * portrait. Photos live in the gallery: `npm run gallery:import`, then mark
 * up to three as `featured` in app/content/gallery.generated.json to put
 * them on the darkroom table.
 */

type LocalizedMediaText = {
  en: string;
  ja: string;
};

/**
 * One film. Give either `youtubeId` (embed + thumbnail + "Watch on YouTube")
 * or `src` (direct MP4; for large files prefer Supabase Storage over Git).
 *
 * `orientation` picks the frame: "landscape" = 16:9, "portrait" = 9:16
 * (YouTube Shorts, Reels-style edits).
 */
export type JournalFilm = {
  title: LocalizedMediaText;
  orientation: "landscape" | "portrait";
  youtubeId?: string;
  src?: string;
  /** Optional custom thumbnail; YouTube films fall back to YouTube's own. */
  poster?: string;
};

export type VisualJournalConfig = {
  films?: JournalFilm[];
};

export const visualJournal: VisualJournalConfig = {
  /**
   * YouTube ID = the part after `watch?v=` or `/shorts/`.
   *
   * Direct MP4 example:
   * { title: {...}, orientation: "landscape", src: "https://.../film.mp4", poster: "/images/journal/poster.webp" }
   */
  films: [
    {
      youtubeId: "nhUbSx-ovoU",
      orientation: "landscape",
      title: {
        en: "Perubahan Paradigma — Growth vs Fixed Mindset",
        ja: "Perubahan Paradigma — 成長マインドセットと固定マインドセット",
      },
    },
    {
      youtubeId: "W7x1RqQywzY",
      orientation: "portrait",
      title: {
        en: "Last Day Iftar in Japan",
        ja: "日本での最後のイフタール",
      },
    },
    {
      youtubeId: "9vs6u9fHUys",
      orientation: "landscape",
      title: {
        en: "Worth It — 2 Bangkit Things You Should Know",
        ja: "Worth It — Bangkitについて知っておきたい2つのこと",
      },
    },
  ],
};

/**
 * Current experiments.
 */
export const labItems = [
  { en: "Amazon Web Services (AWS)", ja: "Amazon Web Services（AWS）" },
  { en: "AI Agents", ja: "AIエージェント" },
  { en: "Three.js / WebGL Experiments", ja: "Three.js / WebGLの実験" },
  { en: "LLM-powered Web Apps", ja: "LLMを活用したWebアプリ" },
  { en: "Computer Vision Interfaces", ja: "コンピュータビジョンのUI" },
  { en: "Playing games", ja: "ゲーム" },
  { en: "and many more!", ja: "ほかにもいろいろ！" },
];