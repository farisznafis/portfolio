"use client";

import CoverImage from "../ui/CoverImage";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import {
  getAllProjects,
  getProjectHref,
  type ProjectView,
} from "../../lib/content/projects";
import { useLang } from "../../lib/i18n";
import { EASE } from "../../lib/motion";
import {
  certificateHref,
  certificates,
  fieldCertificateIds,
} from "../../content/certificates";
import { PROJECT_FIELDS, type ProjectField, type StoredProject } from "../../types/project";

type Filter = "All" | ProjectField;

const MAX_STACK = 4;

/**
 * The /projects index: every real project, filterable by field.
 * A project may belong to several fields - it appears under each of them.
 * Compact editorial rows (thumbnail + copy), two columns on wide screens.
 * Reduced motion: entrances collapse to static.
 */
export function ProjectsIndex({
  projects,
}: {
  projects: StoredProject[];
}) {
  const reduce = useReducedMotion();
  const { content, lang } = useLang();
  const [filter, setFilter] = useState<Filter>("All");

  const all = useMemo(
    () => getAllProjects(projects, lang),
    [projects, lang],
  );

  const filtered = useMemo(
    () =>
      filter === "All"
        ? all
        : all.filter((project) => project.fields.includes(filter)),
    [all, filter],
  );

  const filters: Filter[] = ["All", ...PROJECT_FIELDS];
  const countFor = (option: Filter) =>
    option === "All" ? all.length : all.filter((p) => p.fields.includes(option)).length;

  return (
    <section aria-label={content.projects.ariaSection} className="container-x pb-24 pt-28 sm:pt-32">
      <div className="grid gap-6 md:grid-cols-2 md:items-end">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
            {content.projects.ariaSection}
          </p>
          <h1 className="mt-3 font-display text-5xl font-semibold uppercase leading-[0.9] tracking-tight text-ink md:text-7xl">
            {content.projects.heading}
          </h1>
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-muted md:text-base">
          {content.projects.blurb}
        </p>
      </div>

      {/* Field filters + live count */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label={content.projects.filterAria} className="flex flex-wrap gap-2">
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
                  "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-[color,background-color,border-color,transform] active:scale-[0.97]",
                  isActive
                    ? "border-accent bg-accent text-on-accent"
                    : "border-line bg-white/[0.03] text-muted hover:border-accent/50 hover:text-ink",
                )}
              >
                {label}
                <span className={isActive ? "opacity-70" : "text-muted/60"}>{countFor(option)}</span>
              </button>
            );
          })}
        </div>
        <p aria-live="polite" className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          {content.projects.countLabel.replace("{count}", String(filtered.length).padStart(2, "0"))}
        </p>
      </div>

      {/* Two columns on wide screens to halve the scroll length */}
      {filtered.length === 0 ? (
        <p className="mt-10 border-t border-line pt-10 text-muted">{content.projects.empty}</p>
      ) : (
        <ul className="mt-6 grid border-t border-line lg:grid-cols-2 lg:gap-x-12">
          {filtered.map((project, index) => (
            <ProjectRow
              key={`${filter}-${project.slug}`}
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

  // Every project has a detail page; public links stay as secondary CTAs.
  const detailHref = getProjectHref(project);

  // Credentials behind this project's fields, deduped (AI + Data can share one).
  const backing = certificates.filter((cert) =>
    project.fields.some((field) => fieldCertificateIds[field] === cert.id),
  );

  const extraStack = project.stack.length - MAX_STACK;

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.24), ease: EASE }}
      className="group relative grid grid-cols-[112px_minmax(0,1fr)] gap-4 border-b border-line py-5 sm:grid-cols-[176px_minmax(0,1fr)] sm:gap-5"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] w-full self-start overflow-hidden border border-line/60 bg-elevated">
        {project.cover ? (
          <CoverImage
            src={project.cover.src}
            alt={project.cover.alt}
            sizes="(min-width: 640px) 176px, 112px"
            className="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
            <span
              className={clsx(
                "font-display text-3xl font-semibold leading-none tracking-tighter text-outline sm:text-4xl",
                project.tone === "accent" ? "opacity-90" : "opacity-70",
              )}
            >
              {project.initials}
            </span>
          </div>
        )}
      </div>

      {/* Copy */}
      <div className="min-w-0">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[11px] text-accent">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h2 className="min-w-0 flex-1 font-display text-lg font-semibold leading-tight tracking-tight text-ink transition-colors duration-300 group-hover:text-accent-bright sm:text-xl">
            {/* Stretched link: the whole row is the hit area; secondary links sit above it */}
            <Link
              href={detailHref}
              data-cursor="View"
              className="before:absolute before:inset-0 focus-visible:outline-none focus-visible:before:outline focus-visible:before:outline-1 focus-visible:before:outline-accent"
            >
              {project.title}
            </Link>
          </h2>
          {project.year ? (
            <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              {project.year}
            </span>
          ) : null}
          <ArrowUpRight
            size={16}
            aria-hidden="true"
            className="shrink-0 self-center text-muted transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-bright"
          />
        </div>

        <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          {project.fields.map((field) => (
            <li key={field} className="text-accent/90">
              {content.fields[field]}
            </li>
          ))}
          {project.role ? <li>{project.role}</li> : null}
          {project.confidentiality !== "public" ? (
            <li className="text-muted/70">{content.projects.confidentialNote}</li>
          ) : null}
        </ul>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {project.description}
        </p>

        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={content.work.techAria}>
          {project.stack.slice(0, MAX_STACK).map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-line bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10px] text-muted"
            >
              {tech}
            </li>
          ))}
          {extraStack > 0 ? (
            <li
              className="px-1 py-0.5 font-mono text-[10px] text-muted/70"
              title={project.stack.slice(MAX_STACK).join(", ")}
            >
              +{extraStack}
            </li>
          ) : null}
        </ul>

        {backing.length > 0 || project.links.length > 0 ? (
          <div className="relative z-10 mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs">
            {project.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-ink/85 underline decoration-line underline-offset-4 transition-colors hover:text-accent-bright hover:decoration-accent"
              >
                {link.label}
              </a>
            ))}
            {backing.length > 0 ? (
              <span className="inline-flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  {content.projects.backedBy}
                </span>
                {backing.map((cert) => (
                  <Link
                    key={cert.id}
                    href={certificateHref(cert.id)}
                    data-cursor="View"
                    className="font-semibold text-ink/70 transition-colors hover:text-accent-bright"
                  >
                    {cert.title}
                  </Link>
                ))}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </motion.li>
  );
}
