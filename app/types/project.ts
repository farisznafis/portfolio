/**
 * Project domain model.
 *
 * This is the strongly-typed shape that drives every project surface
 * (Home reel, /projects index, /work/[slug] case studies).
 *
 * Runtime project content normally comes from Supabase.
 * app/content/projects.ts remains only as a static fallback.
 */

import type {
  LocalizedText,
} from "./common";

/**
 * Fields a project can belong to.
 */
export type ProjectField =
  | "Frontend"
  | "AI / ML"
  | "Data / Optimization"
  | "UI / UX"
  | "Visual Design";

/**
 * Canonical filter order.
 */
export const PROJECT_FIELDS = [
  "Frontend",
  "AI / ML",
  "Data / Optimization",
  "UI / UX",
  "Visual Design",
] as const satisfies readonly ProjectField[];

/**
 * Public visibility / confidentiality.
 */
export type Confidentiality =
  | "public"
  | "limited"
  | "private";

/**
 * External project link types.
 */
export type ProjectLinkType =
  | "demo"
  | "github"
  | "figma"
  | "article"
  | "other";

export type ProjectLink = {
  type: ProjectLinkType;

  label: LocalizedText;

  url: string;
};

/**
 * Project media.
 */
export type ProjectMediaType =
  | "image"
  | "video"
  | "embed";

export type ProjectMedia = {
  type: ProjectMediaType;

  /**
   * For "embed": an iframe URL, e.g. a Google Drive /preview link.
   */
  src: string;

  /**
   * CSS aspect-ratio for "embed" iframes, e.g. "16 / 9". Defaults to 16 / 9.
   */
  aspect?: string;

  alt: LocalizedText;

  caption?: LocalizedText;
};

/**
 * Interactive Figma file embedded in the case study.
 *
 * `url` is the regular figma.com/design link (with an optional node-id);
 * the embed URL is derived from it. The file must be shared as
 * "Anyone with the link can view".
 */
export type ProjectFigmaEmbed = {
  url: string;

  title: LocalizedText;

  caption?: LocalizedText;
};

/**
 * Typographic fallback accent.
 */
export type ProjectTone =
  | "accent"
  | "amber";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CASE STUDY
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type CaseStudyFeature = {
  title: LocalizedText;

  description: LocalizedText;
};

/**
 * Small label/value pair for technical facts.
 *
 * Example:
 *
 * Input shape
 * (352, 15)
 */
export type CaseStudyFact = {
  label: LocalizedText;

  value: LocalizedText;
};

/**
 * Generic long-form section.
 *
 * This intentionally stays domain-neutral so the same structure
 * can be reused for:
 *
 * - ML methodology
 * - engineering architecture
 * - design process
 * - research
 * - evaluation
 * - limitations
 */
export type CaseStudySection = {
  /**
   * Stable DOM / data identifier.
   *
   * Example:
   * "evaluation-analysis"
   */
  id: string;

  kicker?: LocalizedText;

  heading: LocalizedText;

  paragraphs?: LocalizedText[];

  facts?: CaseStudyFact[];

  items?: CaseStudyFeature[];

  /**
   * Important caveat / interpretation.
   */
  note?: LocalizedText;
};

/**
 * Full project case study. Every page answers the same questions, in order:
 * what it is and my part (overview), why it exists (problem), what I used
 * and why (decisions), what came of it (results). Each fact is said once.
 */
export type CaseStudyContent = {
  /** What the project is and what I did, 1–2 sentences. */
  overview: LocalizedText;

  /** Why the project exists / the main constraint, 1–2 sentences. */
  problem: LocalizedText;

  /** General flow from input to output, one short step each. No metrics. */
  howItWorks?: LocalizedText[];

  /** title = technology or decision, description = why, one sentence. */
  decisions: CaseStudyFeature[];

  /** Technical depth (ML data, model, evaluation). Facts over prose. */
  sections?: CaseStudySection[];

  /** Verifiable results only; never a restated feature. */
  results: LocalizedText[];
};

/**
 * Raw project shape consumed by the application.
 *
 * Normally created from Supabase rows.
 */
export type StoredProject = {
  id: string;

  slug: string;

  title: string;

  year?: string;

  role?: LocalizedText;

  fields: ProjectField[];

  stack: string[];

  summary: LocalizedText;

  featured: boolean;

  featuredOrder?: number;

  projectOrder: number;

  hasCaseStudy: boolean;

  confidentiality: Confidentiality;

  links: ProjectLink[];

  cover?: ProjectMedia;

  gallery?: ProjectMedia[];

  figmaEmbed?: ProjectFigmaEmbed;

  caseStudy?: CaseStudyContent;

  initials: string;

  tone: ProjectTone;
};