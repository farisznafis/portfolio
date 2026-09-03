import { unstable_cache } from "next/cache";

import { createPublicClient } from "@/app/lib/supabase/public";
import { projects as fallbackProjects } from "@/app/content/projects";

import type {
  CaseStudyContent,
  Confidentiality,
  ProjectField,
  ProjectLinkType,
  ProjectMediaType,
  ProjectTone,
  StoredProject,
} from "@/app/types/project";

/**
 * Database row shapes returned by the Supabase nested project query.
 *
 * We keep these types here because they describe the persistence layer,
 * while StoredProject describes the application's domain layer.
 */

type DbProjectTranslation = {
  locale: "en" | "ja";
  role: string | null;
  summary: string;
};

type DbProjectField = {
  name: ProjectField;
  sort_order: number;
};

type DbProjectFieldRelation = {
  project_fields: DbProjectField | null;
};

type DbProjectTechnology = {
  technology: string;
  sort_order: number;
};

type DbProjectLink = {
  type: ProjectLinkType;
  label_en: string;
  label_ja: string;
  url: string;
  sort_order: number;
};

type DbProjectMedia = {
  type: ProjectMediaType;

  storage_path: string | null;
  external_src: string | null;

  alt_en: string;
  alt_ja: string;

  caption_en: string | null;
  caption_ja: string | null;

  is_cover: boolean;
  sort_order: number;
};

type DbProjectRow = {
  id: string;

  slug: string;
  title: string;
  year: string | null;

  featured: boolean;
  featured_order: number | null;

  project_order: number;

  has_case_study: boolean;

  confidentiality: Confidentiality;

  initials: string;
  tone: ProjectTone;

  case_study: unknown | null;

  project_translations:
    | DbProjectTranslation[]
    | null;

  project_field_relations:
    | DbProjectFieldRelation[]
    | null;

  project_technologies:
    | DbProjectTechnology[]
    | null;

  project_links:
    | DbProjectLink[]
    | null;

  project_media:
    | DbProjectMedia[]
    | null;
};

/**
 * Resolve either:
 *
 * - existing /public or external source
 * - Supabase Storage source
 */
function resolveMediaSource(
  supabase: ReturnType<typeof createPublicClient>,
  media: DbProjectMedia,
): string {
  if (media.external_src) {
    return media.external_src;
  }

  if (media.storage_path) {
    return supabase.storage
      .from("portfolio-media")
      .getPublicUrl(
        media.storage_path,
      ).data.publicUrl;
  }

  /**
   * Database constraint should prevent this state,
   * but avoid silently constructing an invalid Storage URL.
   */
  throw new Error(
    "Project media has neither external_src nor storage_path.",
  );
}

/**
 * Load the raw bilingual project store used by the portfolio.
 *
 * Normal path:
 * Supabase -> DB rows -> StoredProject[]
 *
 * Fallback:
 * app/content/projects.ts
 */
export const getStoredProjects =
  unstable_cache(
    async (): Promise<StoredProject[]> => {
      const supabase =
        createPublicClient();

      const {
        data,
        error,
      } = await supabase
        .from("projects")
        .select(`
          id,
          slug,
          title,
          year,
          featured,
          featured_order,
          project_order,
          has_case_study,
          confidentiality,
          initials,
          tone,
          case_study,

          project_translations (
            locale,
            role,
            summary
          ),

          project_field_relations (
            project_fields (
              name,
              sort_order
            )
          ),

          project_technologies (
            technology,
            sort_order
          ),

          project_links (
            type,
            label_en,
            label_ja,
            url,
            sort_order
          ),

          project_media (
            type,
            storage_path,
            external_src,
            alt_en,
            alt_ja,
            caption_en,
            caption_ja,
            is_cover,
            sort_order
          )
        `)
        .eq(
          "published",
          true,
        )
        .order(
          "project_order",
        );

      if (error || !data) {
        console.error(
          "Supabase projects failed:",
          error,
        );

        return fallbackProjects;
      }

      /**
       * We have not generated Supabase Database types yet,
       * so explicitly describe the nested query result.
       *
       * `unknown` is intentional here rather than `any`.
       */
      const rows =
        data as unknown as DbProjectRow[];

      return rows.map(
        (row): StoredProject => {
          const translations =
            row.project_translations ??
            [];

          const en =
            translations.find(
              (item) =>
                item.locale === "en",
            );

          const ja =
            translations.find(
              (item) =>
                item.locale === "ja",
            );

          const media =
            [
              ...(
                row.project_media ??
                []
              ),
            ].sort(
              (a, b) =>
                a.sort_order -
                b.sort_order,
            );

          const cover =
            media.find(
              (item) =>
                item.is_cover,
            );

          const fields =
            (
              row.project_field_relations ??
              []
            )
              .map(
                (relation) =>
                  relation.project_fields,
              )
              .filter(
                (
                  field,
                ): field is DbProjectField =>
                  field !== null,
              )
              .sort(
                (a, b) =>
                  a.sort_order -
                  b.sort_order,
              );

          const technologies =
            [
              ...(
                row.project_technologies ??
                []
              ),
            ]
              .sort(
                (a, b) =>
                  a.sort_order -
                  b.sort_order,
              )
              .map(
                (item) =>
                  item.technology,
              );

          const links =
            [
              ...(
                row.project_links ??
                []
              ),
            ]
              .sort(
                (a, b) =>
                  a.sort_order -
                  b.sort_order,
              )
              .map(
                (link) => ({
                  type:
                    link.type,

                  label: {
                    en:
                      link.label_en,

                    ja:
                      link.label_ja,
                  },

                  url:
                    link.url,
                }),
              );

          const gallery =
            media
              .filter(
                (item) =>
                  !item.is_cover,
              )
              .map(
                (item) => ({
                  type:
                    item.type,

                  src:
                    resolveMediaSource(
                      supabase,
                      item,
                    ),

                  alt: {
                    en:
                      item.alt_en,

                    ja:
                      item.alt_ja,
                  },

                  caption:
                    item.caption_en ||
                    item.caption_ja
                      ? {
                          en:
                            item.caption_en ??
                            "",

                          ja:
                            item.caption_ja ??
                            "",
                        }
                      : undefined,
                }),
              );

          return {
            id:
              row.id,

            slug:
              row.slug,

            title:
              row.title,

            year:
              row.year ??
              undefined,

            role:
              en?.role ||
              ja?.role
                ? {
                    en:
                      en?.role ??
                      "",

                    ja:
                      ja?.role ??
                      "",
                  }
                : undefined,

            summary: {
              en:
                en?.summary ??
                "",

              ja:
                ja?.summary ??
                "",
            },

            fields:
              fields.map(
                (field) =>
                  field.name,
              ),

            stack:
              technologies,

            featured:
              row.featured,

            featuredOrder:
              row.featured_order ??
              undefined,

            projectOrder:
              row.project_order,

            hasCaseStudy:
              row.has_case_study,

            confidentiality:
              row.confidentiality,

            links,

            cover:
              cover
                ? {
                    type:
                      cover.type,

                    src:
                      resolveMediaSource(
                        supabase,
                        cover,
                      ),

                    alt: {
                      en:
                        cover.alt_en,

                      ja:
                        cover.alt_ja,
                    },

                    caption:
                      cover.caption_en ||
                      cover.caption_ja
                        ? {
                            en:
                              cover.caption_en ??
                              "",

                            ja:
                              cover.caption_ja ??
                              "",
                          }
                        : undefined,
                  }
                : undefined,

            gallery,

            caseStudy:
              row.case_study
                ? (
                    row.case_study as
                      CaseStudyContent
                  )
                : undefined,

            initials:
              row.initials,

            tone:
              row.tone,
          };
        },
      );
    },

    [
      "portfolio-projects",
    ],

    {
      revalidate: 60,
      tags: [
        "projects",
      ],
    },
  );