/**
 * Project data-access layer.
 *
 * The ONLY file components/pages import for project data. It hides whether
 * the data is static TypeScript (today) or Supabase (long term) behind small,
 * typed functions:
 *
 *   getAllProjects(lang)          → every project, /projects display order
 *   getFeaturedProjects(lang)     → exactly the Home featured set
 *   getProjectBySlug(lang, slug)  → one project + its case study (localized)
 *   getProjectsByField(lang, f)   → projects belonging to one field
 *   getCaseStudySlugs()           → SSG routes for /work/[slug]
 *   getNextCaseStudySlug(slug)    → next-project loop for case-study footers
 *   getProjectHref(view)          → internal /work route or first public link
 *   getPrimaryLink(view)          → the card's first public link, if any
 *
 * Components receive resolved, localized view objects — never the raw store.
 */
import { projects as stored } from "../../content/projects";
import type { Lang } from "../../types/common";
import type {
  CaseStudyContent,
  Confidentiality,
  ProjectField,
  ProjectLink,
  ProjectMedia,
  ProjectTone,
  StoredProject,
} from "../../types/project";
import { localized } from "./common";

/** A public link resolved for one locale (label is a plain string now). */
export type ViewLink = {
  type: ProjectLink["type"];
  label: string;
  url: string;
};

/** Media as the UI consumes it — `src` is opaque (local path or CDN URL). */
export type ViewMedia = {
  type: ProjectMedia["type"];
  src: string;
  alt: string;
  caption?: string;
};

/** Case-study copy resolved for one locale, matching the existing layout. */
export type CaseStudyView = {
  overview: string;
  atAGlance: string;
  challenge: { heading: string; lead: string; body: string };
  approach: {
    kicker: string;
    heading: string;
    steps: { tag: string; title: string; description: string }[];
  };
  features: {
    heading: string;
    items: { title: string; description: string }[];
  };
  galleryLabel: string;
  outcomes: { kicker: string; heading: string; items: string[] };
  nextLabel: string;
};

/** A project fully resolved for one locale, ready to render. */
export type ProjectView = {
  slug: string;
  title: string;
  year?: string;
  role?: string;
  description: string;
  fields: ProjectField[];
  stack: string[];
  confidentiality: Confidentiality;
  links: ViewLink[];
  /** Hero / social-preview media — null when no real asset exists. */
  cover: ViewMedia | null;
  gallery: ViewMedia[];
  hasCaseStudy: boolean;
  /** Typographic fallback mark used when `cover` is null. */
  initials: string;
  tone: ProjectTone;
  caseStudy: CaseStudyView | null;
};

function mediaToView(media: ProjectMedia, lang: Lang): ViewMedia {
  return {
    type: media.type,
    src: media.src,
    alt: localized(media.alt, lang) ?? media.src,
    caption: localized(media.caption, lang),
  };
}

function caseStudyToView(study: CaseStudyContent, lang: Lang): CaseStudyView {
  return {
    overview: localized(study.overview, lang) ?? "",
    atAGlance: localized(study.atAGlance, lang) ?? "",
    challenge: {
      heading: localized(study.challenge.heading, lang) ?? "",
      lead: localized(study.challenge.lead, lang) ?? "",
      body: localized(study.challenge.body, lang) ?? "",
    },
    approach: {
      kicker: localized(study.approach.kicker, lang) ?? "",
      heading: localized(study.approach.heading, lang) ?? "",
      steps: study.approach.steps.map((step) => ({
        tag: localized(step.tag, lang) ?? "",
        title: localized(step.title, lang) ?? "",
        description: localized(step.description, lang) ?? "",
      })),
    },
    features: {
      heading: localized(study.features.heading, lang) ?? "",
      items: study.features.items.map((item) => ({
        title: localized(item.title, lang) ?? "",
        description: localized(item.description, lang) ?? "",
      })),
    },
    galleryLabel: localized(study.galleryLabel, lang) ?? "",
    outcomes: {
      kicker: localized(study.outcomes.kicker, lang) ?? "",
      heading: localized(study.outcomes.heading, lang) ?? "",
      items: study.outcomes.items.map((item) => localized(item, lang) ?? ""),
    },
    nextLabel: localized(study.nextLabel, lang) ?? "",
  };
}
function toView(project: StoredProject, lang: Lang): ProjectView {
  return {
    slug: project.slug,
    title: project.title,
    year: project.year,
    role: localized(project.role, lang),
    description: localized(project.summary, lang) ?? project.title,
    fields: project.fields,
    stack: project.stack,
    confidentiality: project.confidentiality,
    links: (project.links ?? []).map((link) => ({
      type: link.type,
      label: localized(link.label, lang) ?? "",
      url: link.url,
    })),
    cover: project.cover && project.cover.type === "image"
      ? mediaToView(project.cover, lang)
      : null,
    gallery: (project.gallery ?? [])
      .filter((media) => media.type === "image")
      .map((media) => mediaToView(media, lang)),
    hasCaseStudy: project.hasCaseStudy,
    initials: project.initials,
    tone: project.tone,
    caseStudy: project.caseStudy ? caseStudyToView(project.caseStudy, lang) : null,
  };
}

/** Case-study slugs in /projects display order (drives /work/[slug] SSG). */
const CASE_STUDY_SLUGS = stored
  .filter((project) => project.hasCaseStudy && project.caseStudy)
  .sort((a, b) => a.projectOrder - b.projectOrder)
  .map((project) => project.slug);

/** Every project, in /projects display order. */
export function getAllProjects(lang: Lang): ProjectView[] {
  return stored
    .slice()
    .sort((a, b) => a.projectOrder - b.projectOrder)
    .map((project) => toView(project, lang));
}

/** Exactly the Home reel: featured projects ordered by featuredOrder. */
export function getFeaturedProjects(lang: Lang): ProjectView[] {
  return stored
    .filter((project) => project.featured)
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0))
    .map((project) => toView(project, lang));
}

/** Projects belonging to a single field (a project may match several). */
export function getProjectsByField(lang: Lang, field: ProjectField): ProjectView[] {
  return getAllProjects(lang).filter((project) => project.fields.includes(field));
}

/** One project (with its localized case study), for /work/[slug]. */
export function getProjectBySlug(lang: Lang, slug: string): ProjectView | undefined {
  const project = stored.find((p) => p.slug === slug);
  return project ? toView(project, lang) : undefined;
}

/** Slugs meant for /work/[slug] (SSG via generateStaticParams). */
export function getCaseStudySlugs(): string[] {
  return CASE_STUDY_SLUGS;
}

export function isCaseStudySlug(slug: string): boolean {
  return CASE_STUDY_SLUGS.includes(slug);
}

/** Next case study for the footer loop (wraps around). */
export function getNextCaseStudySlug(slug: string): string {
  const index = CASE_STUDY_SLUGS.indexOf(slug);
  return CASE_STUDY_SLUGS[(index + 1) % CASE_STUDY_SLUGS.length] ?? slug;
}

/** Link priority for primary CTAs on cards. */
const LINK_PRIORITY: ProjectLink["type"][] = ["demo", "github", "figma", "article", "other"];

/** The card's first public link (demo > github > figma > ...), null when none. */
export function getPrimaryLink(view: ProjectView): ViewLink | null {
  if (view.hasCaseStudy) return null;
  for (const type of LINK_PRIORITY) {
    const link = view.links.find((l) => l.type === type);
    if (link) return link;
  }
  return view.links[0] ?? null;
}

/** Where a card leads: case-study page first, then the primary link. */
export function getProjectHref(view: ProjectView): string {
  if (view.hasCaseStudy) return `/work/${view.slug}`;
  return getPrimaryLink(view)?.url ?? "/projects";
}