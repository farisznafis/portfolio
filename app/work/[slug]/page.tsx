import type { Metadata } from "next";
import { en, type ProjectItem } from "../../lib/content";
import { ProjectDetail } from "../../components/ProjectDetail";
import { PageTransition } from "../../components/ui/PageTransition";

export const dynamicParams = false;

export function generateStaticParams() {
  return en.projects.items.map((item) => ({ slug: item.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = en.projects.items.find((i) => i.key === slug) as
    | ProjectItem
    | undefined;
  if (!item) return { title: "Not found" };
  return {
    title: item.title,
    description: item.description,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <PageTransition>
      <ProjectDetail slug={slug} />
    </PageTransition>
  );
}