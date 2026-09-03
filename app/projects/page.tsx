import type { Metadata } from "next";

import { PageTransition } from "../components/ui/PageTransition";
import { ProjectsIndex } from "../components/sections/ProjectsIndex";
import { getStoredProjects } from "../lib/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "All projects by Faris Zaidan Nafis across frontend, AI/ML, data, and design — filterable by field.",
};

export default async function ProjectsPage() {
  const projects = await getStoredProjects();

  return (
    <PageTransition>
      <ProjectsIndex projects={projects} />
    </PageTransition>
  );
}