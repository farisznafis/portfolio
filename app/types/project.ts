/**
 * Project domain model.
 *
 * This is the strongly-typed shape that drives every project surface
 * (Home reel, /projects index, /work/[slug] case studies). It is designed to
 * map 1:1 onto the future Supabase schema:
 *
 *   projects                 -> id, slug, title, year, featured,
 *                               featured_order, project_order,
 *                               has_case_study, confidentiality
 *   project_translations     -> role, summary + full case study copy, per locale
 *   project_fields           -> name; project_field_relations -> project_id
 *   project_technologies     -> project_id, technology, sort_order
 *   project_links            -> project_id, type, label, url, sort_order
 *   project_media            -> project_id, type, storage_path,
 *                               alt_en/alt_ja, caption_en/caption_ja, sort_order
 *
 * Rules honoured by this model:
 * - Optional information stays optional (never fake URLs, never invented data)
 * - A project may belong to multiple fields
 * - Confidential work keeps `links` empty and `confidentiality !== "public"`
 * - Media `src` is opaque to the UI: a local `/public` path today, a
 *   Supabase Storage URL later — components only ever see `{ src, alt, caption }`
 */
import type { LocalizedText } from "./common";

/** Fields a project can belong to. A project may have SEVERAL. */
export type ProjectField =
  | "Frontend"
  | "AI / ML"
  | "Data / Optimization"
  | "UI / UX"
  | "Visual Design";

/** Canonical filter order, shared by the Home reel and /projects filters. */
export const PROJECT_FIELDS = [
  "Frontend",
  "AI / ML",
  "Data / Optimization",
  "UI / UX",
  "Visual Design",
] as const satisfies readonly ProjectField[];

/** How much of a project may be shown publicly. */
export type Confidentiality =
  /** Personal / open-source work — links may be shown. */
  | "public"
  /** Professional work — describe at a high level, no internal material. */
  | "limited"
  /** Confidential work — high-level contribution only, no links at all. */
  | "private";

export type ProjectLinkType = "demo" | "github" | "figma" | "article" | "other";

export type ProjectLink = {
  type: ProjectLinkType;
  /** Localized link label ("Source", "Live demo", "Figma", ...). */
  label: LocalizedText;
  url: string;
};

export type ProjectMediaType = "image" | "video";

/**
 * Media as the UI consumes it: `src` is intentionally opaque so the same
 * component renders local files today and Supabase Storage URLs later.
 * `alt` / `caption` are localized.
 */
export type ProjectMedia = {
  type: ProjectMediaType;
  src: string;
  alt: LocalizedText;
  caption?: LocalizedText;
};

/** Accent used by the typographic fallback when no real media exists. */
export type ProjectTone = "accent" | "amber";

// ─── Case study copy ─────────────────────────────────────────────────────────

export type CaseStudyStep = {
  tag: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
};

export type CaseStudyFeature = {
  title: LocalizedText;
  description: LocalizedText;
};

/**
 * Rich, fully-localized case-study copy. Mirrors the per-locale columns of a
 * future `project_translations` table (overview/problem/…/outcome), extended
 * for the longform storytelling layout this site already ships.
 */
export type CaseStudyContent = {
  overview: LocalizedText;
  /** sr-only label for the meta panel under the hero. */
  atAGlance: LocalizedText;
  challenge: { heading: LocalizedText; lead: LocalizedText; body: LocalizedText };
  approach: { kicker: LocalizedText; heading: LocalizedText; steps: CaseStudyStep[] };
  features: { heading: LocalizedText; items: CaseStudyFeature[] };
  /** sr-only label for the gallery section. */
  galleryLabel: LocalizedText;
  outcomes: { kicker: LocalizedText; heading: LocalizedText; items: LocalizedText[] };
  /** sr-only label for the next-project section. */
  nextLabel: LocalizedText;
};

/**
 * The static project store. `title` and `year` are language-neutral (the
 * project titles are identical in both locales today); everything user-facing
 * is `LocalizedText`.
 */
export type StoredProject = {
  /** Stable identifier — doubles as the URL slug; becomes a UUID in Supabase. */
  id: string;
  /** Route segment for /work/[slug] and /projects cards. */
  slug: string;
  title: string;
  /** Omitted when the real year is not verified. */
  year?: string;
  /** Omitted when the real role title is not verified. */
  role?: LocalizedText;
  fields: ProjectField[];
  stack: string[];
  /** Localized card/page summary. */
  summary: LocalizedText;
  featured: boolean;
  /** 1-based ordering among the featured Home projects. */
  featuredOrder?: number;
  /** 1-based display order for /projects. */
  projectOrder: number;
  hasCaseStudy: boolean;
  confidentiality: Confidentiality;
  links: ProjectLink[];
  /** Used as the social preview + case-study hero image when present. */
  cover?: ProjectMedia;
  gallery?: ProjectMedia[];
  caseStudy?: CaseStudyContent;
  /** Typographic fallback mark shown when no `cover` exists. */
  initials: string;
  tone: ProjectTone;
};