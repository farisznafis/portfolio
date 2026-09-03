/**
 * Project presentation/data-access helpers.
 *
 * Raw project data is provided by the caller. The source may be:
 *
 * - Supabase (normal production path)
 * - the static TypeScript fallback
 *
 * This layer only converts StoredProject[] into localized ProjectView objects.
 *
 *   getAllProjects(stored, lang)
 *   getFeaturedProjects(stored, lang)
 *   getProjectBySlug(stored, lang, slug)
 *   getProjectsByField(stored, lang, field)
 *   getCaseStudySlugs(stored)
 *   isCaseStudySlug(stored, slug)
 *   getNextCaseStudySlug(stored, slug)
 *   getProjectHref(view)
 *   getPrimaryLink(view)
 *
 * Components receive resolved/localized view objects and do not need to know
 * whether the underlying data came from Supabase or the static fallback.
 */

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

/**
 * Public link resolved for one locale.
 */
export type ViewLink = {
  type: ProjectLink["type"];
  label: string;
  url: string;
};

/**
 * Media resolved for one locale.
 *
 * src may be:
 * - a local /public path
 * - a Supabase Storage public URL
 * - another supported external URL
 */
export type ViewMedia = {
  type: ProjectMedia["type"];
  src: string;
  alt: string;
  caption?: string;
};

/**
 * Localized case-study content ready for rendering.
 */
export type CaseStudyView = {
  overview: string;

  atAGlance: string;

  challenge: {
    heading: string;
    lead: string;
    body: string;
  };

  approach: {
    kicker: string;
    heading: string;

    steps: {
      tag: string;
      title: string;
      description: string;
    }[];
  };

  features: {
    heading: string;

    items: {
      title: string;
      description: string;
    }[];
  };

  galleryLabel: string;

  outcomes: {
    kicker: string;
    heading: string;
    items: string[];
  };

  nextLabel: string;
};

/**
 * Project fully resolved for one locale and ready for UI rendering.
 */
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

  /**
   * Hero / social-preview media.
   *
   * The current UI only supports image covers.
   */
  cover: ViewMedia | null;

  /**
   * Current gallery UI only renders images.
   */
  gallery: ViewMedia[];

  hasCaseStudy: boolean;

  /**
   * Typographic fallback shown when no cover image exists.
   */
  initials: string;

  tone: ProjectTone;

  caseStudy: CaseStudyView | null;
};

/**
 * Convert one localized media object to the UI view.
 */
function mediaToView(
  media: ProjectMedia,
  lang: Lang,
): ViewMedia {
  return {
    type: media.type,

    src: media.src,

    alt:
      localized(media.alt, lang) ??
      media.src,

    caption:
      localized(media.caption, lang),
  };
}

/**
 * Convert bilingual case-study content into one active locale.
 */
function caseStudyToView(
  study: CaseStudyContent,
  lang: Lang,
): CaseStudyView {
  return {
    overview:
      localized(
        study.overview,
        lang,
      ) ?? "",

    atAGlance:
      localized(
        study.atAGlance,
        lang,
      ) ?? "",

    challenge: {
      heading:
        localized(
          study.challenge.heading,
          lang,
        ) ?? "",

      lead:
        localized(
          study.challenge.lead,
          lang,
        ) ?? "",

      body:
        localized(
          study.challenge.body,
          lang,
        ) ?? "",
    },

    approach: {
      kicker:
        localized(
          study.approach.kicker,
          lang,
        ) ?? "",

      heading:
        localized(
          study.approach.heading,
          lang,
        ) ?? "",

      steps:
        study.approach.steps.map(
          (step) => ({
            tag:
              localized(
                step.tag,
                lang,
              ) ?? "",

            title:
              localized(
                step.title,
                lang,
              ) ?? "",

            description:
              localized(
                step.description,
                lang,
              ) ?? "",
          }),
        ),
    },

    features: {
      heading:
        localized(
          study.features.heading,
          lang,
        ) ?? "",

      items:
        study.features.items.map(
          (item) => ({
            title:
              localized(
                item.title,
                lang,
              ) ?? "",

            description:
              localized(
                item.description,
                lang,
              ) ?? "",
          }),
        ),
    },

    galleryLabel:
      localized(
        study.galleryLabel,
        lang,
      ) ?? "",

    outcomes: {
      kicker:
        localized(
          study.outcomes.kicker,
          lang,
        ) ?? "",

      heading:
        localized(
          study.outcomes.heading,
          lang,
        ) ?? "",

      items:
        study.outcomes.items.map(
          (item) =>
            localized(
              item,
              lang,
            ) ?? "",
        ),
    },

    nextLabel:
      localized(
        study.nextLabel,
        lang,
      ) ?? "",
  };
}

/**
 * Convert one StoredProject into the localized shape consumed by the UI.
 */
function toView(
  project: StoredProject,
  lang: Lang,
): ProjectView {
  return {
    slug:
      project.slug,

    title:
      project.title,

    year:
      project.year,

    role:
      localized(
        project.role,
        lang,
      ),

    description:
      localized(
        project.summary,
        lang,
      ) ?? project.title,

    fields:
      project.fields,

    stack:
      project.stack,

    confidentiality:
      project.confidentiality,

    links:
      (project.links ?? []).map(
        (link) => ({
          type:
            link.type,

          label:
            localized(
              link.label,
              lang,
            ) ?? "",

          url:
            link.url,
        }),
      ),

    /**
     * Existing components use next/image / image-oriented rendering,
     * so video covers are not exposed as cover yet.
     */
    cover:
      project.cover &&
      project.cover.type === "image"
        ? mediaToView(
            project.cover,
            lang,
          )
        : null,

    /**
     * Existing gallery UI is image-only.
     * Video support can be added separately later.
     */
    gallery:
      (project.gallery ?? [])
        .filter(
          (media) =>
            media.type === "image",
        )
        .map(
          (media) =>
            mediaToView(
              media,
              lang,
            ),
        ),

    hasCaseStudy:
      project.hasCaseStudy,

    initials:
      project.initials,

    tone:
      project.tone,

    caseStudy:
      project.caseStudy
        ? caseStudyToView(
            project.caseStudy,
            lang,
          )
        : null,
  };
}

/**
 * Every project in /projects display order.
 */
export function getAllProjects(
  stored: StoredProject[],
  lang: Lang,
): ProjectView[] {
  return stored
    .slice()
    .sort(
      (a, b) =>
        a.projectOrder -
        b.projectOrder,
    )
    .map(
      (project) =>
        toView(
          project,
          lang,
        ),
    );
}

/**
 * Featured Home projects ordered by featuredOrder.
 */
export function getFeaturedProjects(
  stored: StoredProject[],
  lang: Lang,
): ProjectView[] {
  return stored
    .filter(
      (project) =>
        project.featured,
    )
    .slice()
    .sort(
      (a, b) =>
        (a.featuredOrder ?? 0) -
        (b.featuredOrder ?? 0),
    )
    .map(
      (project) =>
        toView(
          project,
          lang,
        ),
    );
}

/**
 * Projects belonging to one field.
 *
 * A project may belong to several fields.
 */
export function getProjectsByField(
  stored: StoredProject[],
  lang: Lang,
  field: ProjectField,
): ProjectView[] {
  return getAllProjects(
    stored,
    lang,
  ).filter(
    (project) =>
      project.fields.includes(
        field,
      ),
  );
}

/**
 * Find one project by URL slug.
 */
export function getProjectBySlug(
  stored: StoredProject[],
  lang: Lang,
  slug: string,
): ProjectView | undefined {
  const project =
    stored.find(
      (item) =>
        item.slug === slug,
    );

  return project
    ? toView(
        project,
        lang,
      )
    : undefined;
}

/**
 * Internal canonical case-study slug list.
 *
 * It is intentionally calculated from the supplied dataset instead of being
 * stored globally because projects now come from Supabase at runtime.
 */
function getCaseStudySlugList(
  stored: StoredProject[],
): string[] {
  return stored
    .filter(
      (project) =>
        project.hasCaseStudy &&
        Boolean(
          project.caseStudy,
        ),
    )
    .slice()
    .sort(
      (a, b) =>
        a.projectOrder -
        b.projectOrder,
    )
    .map(
      (project) =>
        project.slug,
    );
}

/**
 * Known case-study slugs.
 *
 * generateStaticParams may use this to prerender existing projects, while
 * dynamicParams can still allow newly-created projects later.
 */
export function getCaseStudySlugs(
  stored: StoredProject[],
): string[] {
  return getCaseStudySlugList(
    stored,
  );
}

/**
 * Check whether a slug currently represents a valid case study.
 */
export function isCaseStudySlug(
  stored: StoredProject[],
  slug: string,
): boolean {
  return getCaseStudySlugList(
    stored,
  ).includes(
    slug,
  );
}

/**
 * Get the next case study in display order.
 *
 * Wraps back to the first case study after the final project.
 */
export function getNextCaseStudySlug(
  stored: StoredProject[],
  slug: string,
): string {
  const slugs =
    getCaseStudySlugList(
      stored,
    );

  if (
    slugs.length === 0
  ) {
    return slug;
  }

  const index =
    slugs.indexOf(
      slug,
    );

  /**
   * Defensive fallback:
   * if the current slug is unexpectedly missing, use the first
   * valid case study rather than performing modulo math on -1.
   */
  if (
    index === -1
  ) {
    return (
      slugs[0] ??
      slug
    );
  }

  return (
    slugs[
      (index + 1) %
        slugs.length
    ] ?? slug
  );
}

/**
 * Priority used when deciding the primary external CTA.
 */
const LINK_PRIORITY: ProjectLink["type"][] = [
  "demo",
  "github",
  "figma",
  "article",
  "other",
];

/**
 * First public external link.
 *
 * Projects with a case study intentionally return null here because the
 * project's primary destination becomes /work/[slug].
 */
export function getPrimaryLink(
  view: ProjectView,
): ViewLink | null {
  if (
    view.hasCaseStudy
  ) {
    return null;
  }

  for (
    const type of
    LINK_PRIORITY
  ) {
    const link =
      view.links.find(
        (item) =>
          item.type === type,
      );

    if (link) {
      return link;
    }
  }

  return (
    view.links[0] ??
    null
  );
}

/**
 * Primary navigation destination for a project card.
 */
export function getProjectHref(
  view: ProjectView,
): string {
  if (
    view.hasCaseStudy
  ) {
    return `/work/${view.slug}`;
  }

  return (
    getPrimaryLink(
      view,
    )?.url ??
    "/projects"
  );
}