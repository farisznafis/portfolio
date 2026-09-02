import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

import { projects } from "../app/content/projects";

dotenv.config({
  path: ".env.local",
});

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const secretKey =
  process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL is missing",
  );
}

if (!secretKey) {
  throw new Error(
    "SUPABASE_SECRET_KEY is missing",
  );
}

const supabase = createClient(
  supabaseUrl,
  secretKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);

async function seed() {
  for (const project of projects) {
    console.log(`Seeding: ${project.slug}`);

    const {
      data: projectRow,
      error: projectError,
    } = await supabase
      .from("projects")
      .upsert(
        {
          slug: project.slug,
          title: project.title,

          year:
            project.year ?? null,

          featured:
            project.featured,

          featured_order:
            project.featuredOrder ?? null,

          project_order:
            project.projectOrder,

          has_case_study:
            project.hasCaseStudy,

          confidentiality:
            project.confidentiality,

          initials:
            project.initials,

          tone:
            project.tone,

          case_study:
            project.caseStudy ?? null,

          published: true,
        },
        {
          onConflict: "slug",
        },
      )
      .select("id")
      .single();

    if (projectError) {
      throw projectError;
    }

    const projectId =
      projectRow.id;


    // -----------------------------------
    // reset child records
    // -----------------------------------

    await supabase
      .from("project_translations")
      .delete()
      .eq("project_id", projectId);

    await supabase
      .from("project_field_relations")
      .delete()
      .eq("project_id", projectId);

    await supabase
      .from("project_technologies")
      .delete()
      .eq("project_id", projectId);

    await supabase
      .from("project_links")
      .delete()
      .eq("project_id", projectId);

    await supabase
      .from("project_media")
      .delete()
      .eq("project_id", projectId);


    // -----------------------------------
    // translations
    // -----------------------------------

    const {
      error: translationError,
    } = await supabase
      .from("project_translations")
      .insert([
        {
          project_id: projectId,
          locale: "en",
          role:
            project.role?.en ?? null,
          summary:
            project.summary.en,
        },
        {
          project_id: projectId,
          locale: "ja",
          role:
            project.role?.ja ?? null,
          summary:
            project.summary.ja,
        },
      ]);

    if (translationError) {
      throw translationError;
    }


    // -----------------------------------
    // fields
    // -----------------------------------

    if (project.fields.length > 0) {
      const { error } = await supabase
        .from("project_field_relations")
        .insert(
          project.fields.map(
            (field) => ({
              project_id: projectId,
              field_name: field,
            }),
          ),
        );

      if (error) {
        throw error;
      }
    }


    // -----------------------------------
    // technologies
    // -----------------------------------

    if (project.stack.length > 0) {
      const { error } = await supabase
        .from("project_technologies")
        .insert(
          project.stack.map(
            (
              technology,
              index,
            ) => ({
              project_id: projectId,
              technology,
              sort_order: index,
            }),
          ),
        );

      if (error) {
        throw error;
      }
    }


    // -----------------------------------
    // links
    // -----------------------------------

    if (project.links.length > 0) {
      const { error } = await supabase
        .from("project_links")
        .insert(
          project.links.map(
            (link, index) => ({
              project_id: projectId,

              type: link.type,

              label_en:
                link.label.en,

              label_ja:
                link.label.ja,

              url: link.url,

              sort_order: index,
            }),
          ),
        );

      if (error) {
        throw error;
      }
    }


    // -----------------------------------
    // current media
    // masih /public path
    // -----------------------------------

    const media = [
      ...(project.cover
        ? [
            {
              item:
                project.cover,
              cover: true,
              order: 0,
            },
          ]
        : []),

      ...(project.gallery ?? [])
        .map(
          (item, index) => ({
            item,
            cover: false,
            order: index,
          }),
        ),
    ];

    if (media.length > 0) {
      const { error } = await supabase
        .from("project_media")
        .insert(
          media.map(
            ({
              item,
              cover,
              order,
            }) => ({
              project_id:
                projectId,

              type:
                item.type,

              storage_path:
                null,

              external_src:
                item.src,

              alt_en:
                item.alt.en,

              alt_ja:
                item.alt.ja,

              caption_en:
                item.caption?.en ??
                null,

              caption_ja:
                item.caption?.ja ??
                null,

              is_cover:
                cover,

              sort_order:
                order,
            }),
          ),
        );

      if (error) {
        throw error;
      }
    }
  }

  console.log(
    "✓ Project seed complete",
  );
}

seed().catch((error) => {
  console.error(
    "Seed failed:",
    error,
  );

  process.exit(1);
});