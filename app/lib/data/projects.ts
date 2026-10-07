import { projects } from "@/app/content/projects";

import type { StoredProject } from "@/app/types/project";

function assertUniqueProjectValues(
  items: StoredProject[],
  valueOf: (project: StoredProject) => string | number,
  label: string,
) {
  const seen = new Set<string | number>();

  for (const project of items) {
    const value = valueOf(project);

    if (seen.has(value)) {
      throw new Error(`Duplicate project ${label}: ${value}`);
    }

    seen.add(value);
  }
}

function validateProjects(items: StoredProject[]) {
  assertUniqueProjectValues(items, (project) => project.id, "id");
  assertUniqueProjectValues(items, (project) => project.slug, "slug");
  assertUniqueProjectValues(
    items,
    (project) => project.projectOrder,
    "order",
  );
}

validateProjects(projects);

/**
 * Return the canonical, repository-managed project content.
 *
 * Project pages deliberately read from this local store so rendering and
 * deployments do not depend on Supabase availability. The async interface is
 * retained because the server pages already await this function and may keep
 * doing so without knowing where the data is stored.
 *
 * `npm run seed:projects` is an optional one-way export to Supabase. It is not
 * part of the website's runtime data flow.
 */
export async function getStoredProjects(): Promise<StoredProject[]> {
  return projects;
}
