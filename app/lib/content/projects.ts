/**
 * Project presentation / data-access helpers.
 *
 * Raw project content comes from:
 *
 * - Supabase in production
 * - app/content/projects.ts as a fallback
 *
 * This layer converts StoredProject into locale-resolved
 * ProjectView objects for components.
 */

import type {
  Lang,
} from "../../types/common";

import type {
  CaseStudyContent,
  Confidentiality,
  ProjectField,
  ProjectLink,
  ProjectMedia,
  ProjectTone,
  StoredProject,
} from "../../types/project";

import {
  localized,
} from "./common";

/**
 * External link ready for rendering.
 */
export type ViewLink = {
  type: ProjectLink["type"];

  label: string;

  url: string;
};

/**
 * Media ready for rendering.
 */
export type ViewMedia = {
  type: ProjectMedia["type"];

  src: string;

  alt: string;

  caption?: string;
};

/**
 * Generic long-form case-study section after locale resolution.
 */
export type CaseStudySectionView = {
  id: string;

  kicker?: string;

  heading: string;

  paragraphs: string[];

  facts: {
    label: string;
    value: string;
  }[];

  items: {
    title: string;
    description: string;
  }[];

  note?: string;
};

/**
 * Localized case study ready for rendering.
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

  sections: CaseStudySectionView[];

  galleryLabel: string;

  outcomes: {
    kicker: string;

    heading: string;

    items: string[];
  };

  nextLabel: string;
};

/**
 * Project fully resolved for one locale.
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
   * Current home / case-study hero expects an image.
   */
  cover: ViewMedia | null;

  /**
   * Gallery currently exposes image media only.
   */
  gallery: ViewMedia[];

  hasCaseStudy: boolean;

  initials: string;

  tone: ProjectTone;

  caseStudy: CaseStudyView | null;
};

/**
 * Resolve media text for one locale.
 */
function mediaToView(
  media: ProjectMedia,
  lang: Lang,
): ViewMedia {
  return {
    type:
      media.type,

    src:
      media.src,

    alt:
      localized(
        media.alt,
        lang,
      ) ?? media.src,

    caption:
      localized(
        media.caption,
        lang,
      ),
  };
}

/**
 * Resolve bilingual case-study content.
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

    sections:
      (
        study.sections ??
        []
      ).map(
        (section) => ({
          id:
            section.id,

          kicker:
            localized(
              section.kicker,
              lang,
            ),

          heading:
            localized(
              section.heading,
              lang,
            ) ?? "",

          paragraphs:
            (
              section.paragraphs ??
              []
            ).map(
              (paragraph) =>
                localized(
                  paragraph,
                  lang,
                ) ?? "",
            ),

          facts:
            (
              section.facts ??
              []
            ).map(
              (fact) => ({
                label:
                  localized(
                    fact.label,
                    lang,
                  ) ?? "",

                value:
                  localized(
                    fact.value,
                    lang,
                  ) ?? "",
              }),
            ),

          items:
            (
              section.items ??
              []
            ).map(
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

          note:
            localized(
              section.note,
              lang,
            ),
        }),
      ),

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
 * Convert one StoredProject into its UI view.
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
      ) ??
      project.title,

    fields:
      project.fields,

    stack:
      project.stack,

    confidentiality:
      project.confidentiality,

    links:
      (
        project.links ??
        []
      ).map(
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
     * Covers remain image-only because the current UI uses
     * image-oriented rendering.
     */
    cover:
      project.cover &&
      project.cover.type ===
        "image"
        ? mediaToView(
            project.cover,
            lang,
          )
        : null,

    /**
     * Case-study gallery currently renders images.
     */
    gallery:
      (
        project.gallery ??
        []
      )
        .filter(
          (media) =>
            media.type ===
            "image",
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
 * All projects in display order.
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
 * Featured home projects.
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
        (
          a.featuredOrder ??
          0
        ) -
        (
          b.featuredOrder ??
          0
        ),
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
 * Projects by field.
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
 * Get one project.
 */
export function getProjectBySlug(
  stored: StoredProject[],
  lang: Lang,
  slug: string,
): ProjectView | undefined {
  const project =
    stored.find(
      (item) =>
        item.slug ===
        slug,
    );

  return project
    ? toView(
        project,
        lang,
      )
    : undefined;
}

/**
 * Internal detail-page slug list.
 *
 * Every project has a /work/[slug] page. Projects without a long-form
 * case study render a shorter detail page from their summary and links.
 */
function getCaseStudySlugList(
  stored: StoredProject[],
): string[] {
  return stored
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

export function getCaseStudySlugs(
  stored: StoredProject[],
): string[] {
  return getCaseStudySlugList(
    stored,
  );
}

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
 * Get next case study.
 *
 * Wrap back to the first project after the last.
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
      (
        index +
        1
      ) %
        slugs.length
    ] ??
    slug
  );
}

export function getProjectHref(
  view: ProjectView,
): string {
  return `/work/${view.slug}`;
}
