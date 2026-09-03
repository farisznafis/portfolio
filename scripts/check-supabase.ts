import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({
  path: ".env.local",
});

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL is missing",
  );
}

if (!publishableKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is missing",
  );
}

const supabase = createClient(
  url,
  publishableKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);

async function check() {
  console.log("Checking Supabase connection...");

  const {
    data,
    error,
  } = await supabase
    .from("projects")
    .select(`
      id,
      slug,
      title,
      published
    `)
    .eq("published", true)
    .order("project_order")
    .limit(10);

  if (error) {
    console.error(
      "❌ Supabase connection/query failed",
    );

    console.error({
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });

    process.exit(1);
  }

  console.log(
    "✅ Supabase connection successful",
  );

  console.log(
    `✅ Public RLS query returned ${data.length} project(s)`,
  );

  console.table(
    data.map((project) => ({
      slug: project.slug,
      title: project.title,
      published: project.published,
    })),
  );
}

check().catch((error) => {
  console.error(error);
  process.exit(1);
});