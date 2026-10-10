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
  line1: "FARIS",
  line2Filled: "ZAID",
  line2Outline: "AN NAFIS",
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
 * Personal photography / videography section.
 *
 * Everything except `photos` can be omitted.
 * `photos` may also be an empty array.
 *
 * Recommended:
 * - 1–3 photos
 * - any number of films, landscape or portrait, in display order
 */

type LocalizedMediaText = {
  en: string;
  ja: string;
};

export type VisualJournalPhoto = {
  src: string;
  alt: LocalizedMediaText;
  caption?: LocalizedMediaText;
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
  photos?: VisualJournalPhoto[];
  films?: JournalFilm[];
};

export const visualJournal: VisualJournalConfig = {
  /**
   * Put the files inside:
   *
   * public/images/journal/
   *
   * You can use only 1 or 2 images too.
   * The layout adapts automatically.
   */
  photos: [
    {
      src: "/images/journal/IMG_20250215_132543_289.jpg",
      alt: {
        en: "A moment photographed in Japan",
        ja: "日本で撮影した一瞬",
      },
      // caption: {
      //   en: "Kumamoto, Japan",
      //   ja: "日本・熊本",
      // },
    },

    {
      src: "/images/journal/IMG_20250222_162510_780.jpg",
      alt: {
        en: "Kumamoto Castle",
        ja: "熊本城",
      },
    },

    {
      src: "/images/journal/IMG_20250209_180504_696.jpg",
      alt: {
        en: "View from the top of Hanaokayama",
        ja: "花岡山の頂上からの眺め",
      },
    },
  ],

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
  ],
};

/**
 * Current experiments.
 */
export const labItems = [
  "AI-assisted UI Prototyping",
  "Web Motion & Interaction",
  "Design Systems",
  "LLM-powered Web Apps",
  "Computer Vision Interfaces",
  "Generative Visual Experiments",
  "Three.js / WebGL Experiments",
] as const;