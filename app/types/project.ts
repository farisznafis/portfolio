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
  | "video";

export type ProjectMedia = {
  type: ProjectMediaType;

  src: string;

  alt: LocalizedText;

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
 * Full project case study.
 */
export type CaseStudyContent = {
  overview: LocalizedText;

  /**
   * Accessibility label for project metadata.
   */
  atAGlance: LocalizedText;

  challenge: {
    heading: LocalizedText;

    lead: LocalizedText;

    body: LocalizedText;
  };

  approach: {
    kicker: LocalizedText;

    heading: LocalizedText;

    steps: CaseStudyStep[];
  };

  features: {
    heading: LocalizedText;

    items: CaseStudyFeature[];
  };

  /**
   * Optional long-form sections.
   *
   * Speech Emotion Recognition uses these for:
   *
   * - data
   * - preprocessing
   * - feature engineering
   * - model architecture
   * - evaluation
   * - production engineering
   * - limitations
   */
  sections?: CaseStudySection[];

  /**
   * Accessibility / visual label for project gallery.
   */
  galleryLabel: LocalizedText;

  outcomes: {
    kicker: LocalizedText;

    heading: LocalizedText;

    items: LocalizedText[];
  };

  /**
   * Accessibility label for next-project navigation.
   */
  nextLabel: LocalizedText;
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

  caseStudy?: CaseStudyContent;

  initials: string;

  tone: ProjectTone;
};