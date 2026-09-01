"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import {
  getAllProjects,
  getPrimaryLink,
  type ProjectView,
} from "../../lib/content/projects";
import { useLang } from "../../lib/i18n";
import { EASE } from "../../lib/motion";
import { PROJECT_FIELDS, type ProjectField } from "../../types/project";

type Filter = "All" | ProjectField;

/**
 * The /projects index: every real project, filterable by field.
 * A project may belong to several fields - it appears under each of them.
 * Editorial rows (not cards) to match the home reel's typographic language.
 * Reduced motion: entrances collapse to static.
 */
export function ProjectsIndex() {
  const reduce = useReducedMotion();
  const { content, lang } = useLang();
  const [filter, setFilter] = useState<Filter>("All");

  const all = useMemo(() => getAllProjects(lang), [lang]);

  const filtered = useMemo(
    () =>
      filter === "All"
        ? all
        : all.filter((project) => project.fields.includes(filter)),
    [all, filter],
  );

  const filters: Filter[] = ["All", ...PROJECT_FIELDS];

  return (
    <section aria-label={content.projects.ariaSection} className="container-x pb-28 pt-32 sm:pt-40">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
        {content.projects.ariaSection}
      </p>
      <h1 className="mt-4 font-display text-display font-semibold uppercase leading-[0.9] tracking-tight text-ink">
        {content.projects.heading}
      </h1>
      <p className="mt-6 max-w-2xl text-lede leading-relaxed text-muted">
        {content.projects.blurb}
      </p>

      {/* Field filters */}
      <div
        role="group"
        aria-label={content.projects.filterAria}
        className="mt-12 flex flex-wrap gap-2"
      >
        {filters.map((option) => {
          const isActive = filter === option;
          const label = option === "All" ? content.fieldsAll : content.fields[option];
          return (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              aria-pressed={isActive}
              className={clsx(
                "rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] transition-colors",
                isActive
                  ? "border-accent bg-accent text-on-accent"
                  : "border-line bg-white/[0.03] text-muted hover:border-accent/50 hover:text-ink",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-muted">
        {content.projects.countLabel.replace("{count}", String(filtered.length).padStart(2, "0"))}
      </p>

      {/* Project rows */}
      {filtered.length === 0 ? (
        <p className="mt-16 border-t border-line pt-16 text-muted">{content.projects.empty}</p>
      ) : (
        <ul className="mt-8 divide-y divide-line border-t border-line">
          {filtered.map((project, index) => (
            <ProjectRow
              key={project.slug}
              project={project}
              index={index}
              reduce={Boolean(reduce)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function ProjectRow({
  project,
  index,
  reduce,
}: {
  project: ProjectView;
  index: number;
  reduce: boolean;
}) {
  const { content } = useLang();

  // Primary destination: case study when one exists, otherwise the first
  // public link (demo > github > figma > ...). Projects with no links at
  // all render without a CTA.
  const primaryLink = getPrimaryLink(project);
  const primaryHref = project.hasCaseStudy
    ? `/work/${project.slug}`
    : primaryLink?.url;
  const primaryLabel = project.hasCaseStudy
    ? content.projects.caseStudyCta
    : primaryLink?.label ?? content.projects.linkCta;

  return (
    <motion.li
      initial={reduce ? {} : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.3), ease: EASE }}
      className="group grid gap-6 py-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-10"
    >
      {/* Copy */}
      <div>
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <span className="font-mono text-xs text-accent">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink transition-colors duration-300 group-hover:text-accent-bright sm:text-3xl">
            {project.title}
          </h2>
          {project.year ? (
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              {project.year}
            </span>
          ) : null}
        </div>

        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          {project.fields.map((field) => (
            <li key={field} className="text-accent/90">
              {content.fields[field]}
            </li>
          ))}
          {project.role ? <li>{project.role}</li> : null}
        </ul>

        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
          {project.description}
        </p>

        {/* Stack chips */}
        <ul className="mt-5 flex flex-wrap gap-2" aria-label={content.work.techAria}>
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-line bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-muted"
            >
              {tech}
            </li>
          ))}
        </ul>

        {/* Confidentiality note for professional/confidential work */}
        {project.confidentiality !== "public" ? (
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted/70">
            {content.projects.confidentialNote}
          </p>
        ) : null}
      </div>

      {/* Media + links */}
      <div className="flex flex-col justify-between gap-6">
        <div className="relative aspect-[16/9] w-full overflow-hidden border border-line/60 bg-elevated">
          {project.cover ? (
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              fill
              sizes="(min-width: 768px) 42vw, 100vw"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center"
            >
              <span
                className={clsx(
                  "font-display text-6xl font-semibold leading-none tracking-tighter text-outline sm:text-7xl",
                  project.tone === "accent" ? "opacity-90" : "opacity-70",
                )}
              >
                {project.initials}
              </span>
            </div>
          )}
        </div>

        {/* Links - rendered only when they actually exist */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {primaryHref ? (
            project.hasCaseStudy ? (
              <Link
                href={primaryHref}
                data-cursor="View"
                className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-accent-bright transition-colors hover:text-accent"
              >
                {primaryLabel}
                <ArrowUpRight
                  size={15}
                  aria-hidden="true"
                  className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                />
              </Link>
            ) : (
              <a
                href={primaryHref}
                target="_blank"
                rel="noreferrer"
                data-cursor="Open"
                className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-accent-bright transition-colors hover:text-accent"
              >
                {primaryLabel}
                <ArrowUpRight
                  size={15}
                  aria-hidden="true"
                  className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                />
              </a>
            )
          ) : null}

          {/* Secondary public links */}
          {project.links
            .filter((link) => link.url !== primaryHref)
            .map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
        </div>
      </div>
    </motion.li>
  );
}