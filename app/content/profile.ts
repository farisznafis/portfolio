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
 * - direct video OR YouTube embed
 * - YouTube URL may still be supplied when direct video is used
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

export type VisualJournalConfig = {
  photos?: VisualJournalPhoto[];

  /**
   * Direct video.
   *
   * For large MP4 files, prefer Supabase Storage instead
   * of committing the video into Git.
   */
  video?: {
    src: string;
    poster?: string;
    title?: LocalizedMediaText;
  };

  /**
   * YouTube.
   *
   * `id` enables an embedded player.
   * `url` enables the "Watch on YouTube" link.
   *
   * You can provide only `url` if you do not want an embed.
   */
  youtube?: {
    id?: string;
    url?: string;
    title?: LocalizedMediaText;
  };
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
        en: "A street scene photographed in Japan",
        ja: "日本で撮影した街の風景",
      },
    },

    {
      src: "/images/journal/IMG_20250209_180504_696.jpg",
      alt: {
        en: "A landscape photographed in Japan",
        ja: "日本で撮影した風景",
      },
    },
  ],

  /**
   * OPTION A — direct MP4.
   *
   * Uncomment when ready.
   *
   * Example using Supabase Storage:
   */
  // video: {
  //   src: "https://YOUR_PROJECT.supabase.co/storage/v1/object/public/portfolio-media/journal/japan.mp4",
  //   poster: "/images/journal/video-poster.webp",
  //   title: {
  //     en: "Japan visual journal",
  //     ja: "日本のビジュアルジャーナル",
  //   },
  // },

  /**
   * OPTION B — YouTube.
   *
   * Replace the ID and URL, then uncomment.
   *
   * For:
   * https://www.youtube.com/watch?v=abcdefghijk
   *
   * ID = abcdefghijk
   */
  youtube: {
    id: "abcdefghijk",
    // url: "https://youtube.com/shorts/W7x1RqQywzY?si=aHkFz2qYPKrNPnwL",
    url: "https://www.youtube.com/embed/nhUbSx-ovoU?si=rZd66amkgkFXvGeq",
    title: {
      en: "Last Day Iftar in Japan",
      ja: "日本での最後のイフタール",
    },
  },
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