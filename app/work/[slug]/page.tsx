import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CaseStudy } from "../../components/CaseStudy";
import { PageTransition } from "../../components/ui/PageTransition";
import { en } from "../../lib/content";
import { projectOrder, type ProjectKey } from "../../lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return projectOrder.map((slug) => ({ slug }));
}

/** Metadata uses the English dictionary, matching the static pages. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!(slug in en.caseStudies)) notFound();
  const key = slug as ProjectKey;
  const item = en.projects.items.find((project) => project.key === key);
  return {
    title: `${item?.title ?? "Project"} | Faris Znafis`,
    description: en.caseStudies[key].overview,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!(slug in en.caseStudies)) notFound();

  return (
    <PageTransition>
      <CaseStudy slug={slug as ProjectKey} />
    </PageTransition>
  );
}
