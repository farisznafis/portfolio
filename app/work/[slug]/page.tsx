import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CaseStudy } from "../../components/sections/CaseStudy";
import { PageTransition } from "../../components/ui/PageTransition";
import { en } from "../../lib/content";
import { caseStudiesEn } from "../../lib/caseStudies";
import { caseStudyOrder, type CaseStudyKey } from "../../lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudyOrder.map((slug) => ({ slug }));
}

/** Metadata uses the English dictionary, matching the static pages. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!(slug in caseStudiesEn)) notFound();
  const key = slug as CaseStudyKey;
  const item = en.work.items.find((project) => project.key === key);
  return {
    title: `${item?.title ?? "Project"} | Faris Zaidan Nafis`,
    description: caseStudiesEn[key].overview,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!(slug in caseStudiesEn)) notFound();

  return (
    <PageTransition>
      <CaseStudy slug={slug as CaseStudyKey} />
    </PageTransition>
  );
}