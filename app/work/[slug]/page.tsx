import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { CaseStudy } from "../../components/sections/CaseStudy";
import { PageTransition } from "../../components/ui/PageTransition";

import { getStoredProjects } from "../../lib/data/projects";

import {
  getCaseStudySlugs,
  getProjectBySlug,
} from "../../lib/content/projects";

export const dynamicParams = true;

export async function generateStaticParams() {
  const projects = await getStoredProjects();

  return getCaseStudySlugs(projects).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const projects = await getStoredProjects();

  const project = getProjectBySlug(
    projects,
    "en",
    slug,
  );

  if (!project) {
    notFound();
  }

  return {
    title: `${project.title} | Faris Zaidan Nafis`,
    description: project.description,

    ...(project.cover
      ? {
          openGraph: {
            title: `${project.title} | Faris Zaidan Nafis`,
            description: project.description,
            images: [
              {
                url: project.cover.src,
                alt: project.cover.alt,
              },
            ],
          },
        }
      : {}),
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const projects = await getStoredProjects();

  const validSlug = getCaseStudySlugs(
    projects,
  ).includes(slug);

  if (!validSlug) {
    notFound();
  }

  return (
    <PageTransition>
      <CaseStudy
        slug={slug}
        projects={projects}
      />
    </PageTransition>
  );
}