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
import { PROJECT_FIELDS, type ProjectField, type StoredProject } from "../../types/project";

type Filter = "All" | ProjectField;

const MAX_STACK = 4;

/**
 * The /projects index: every real project, filterable by field.
 * A project may belong to several fields - it appears under each of them.
 * Gallery cards: a large cover on top, tight copy underneath.
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

      {/* Cover-first gallery: 1 / 2 / 3 columns keeps the page short without shrinking covers */}
      {filtered.length === 0 ? (
        <p className="mt-10 border-t border-line pt-10 text-muted">{content.projects.empty}</p>
      ) : (
        <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
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
  const extraStack = project.stack.length - MAX_STACK;

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: Math.min((index % 3) * 0.06, 0.18), ease: EASE }}
      className="group relative flex flex-col"
    >
      {/* Cover */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-line bg-elevated shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-[border-color] duration-500 group-hover:border-accent/40">
        {project.cover ? (
          <CoverImage
            src={project.cover.src}
            alt={project.cover.alt}
            sizes="(min-width: 1280px) 400px, (min-width: 640px) 50vw, 100vw"
            className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
            <span
              className={clsx(
                "font-display text-6xl font-semibold leading-none tracking-tighter text-outline",
                project.tone === "accent" ? "opacity-90" : "opacity-70",
              )}
            >
              {project.initials}
            </span>
          </div>
        )}

        {/* Index + year chips over the cover */}
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
          <span className="rounded-full bg-night/75 px-2 py-1 text-accent backdrop-blur-md">
            {String(index + 1).padStart(2, "0")}
          </span>
          {project.year ? (
            <span className="rounded-full bg-night/75 px-2 py-1 text-ink/80 backdrop-blur-md">
              {project.year}
            </span>
          ) : null}
        </div>

        <span
          aria-hidden="true"
          className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full bg-accent text-on-accent opacity-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-2 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ArrowUpRight size={16} />
        </span>
      </div>

      {/* Copy */}
      <div className="mt-4 flex min-w-0 flex-1 flex-col">
        <ul className="flex flex-wrap gap-x-3 gap-y-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-accent/90">
          {project.fields.map((field) => (
            <li key={field}>{content.fields[field]}</li>
          ))}
        </ul>

        <h2 className="mt-1.5 font-display text-lg font-semibold leading-snug tracking-tight text-ink transition-colors duration-300 group-hover:text-accent-bright sm:text-xl">
          {/* Stretched link: the whole card is the hit area; secondary links sit above it */}
          <Link
            href={detailHref}
            data-cursor="View"
            className="before:absolute before:inset-0 focus-visible:outline-none focus-visible:before:rounded-lg focus-visible:before:outline focus-visible:before:outline-1 focus-visible:before:outline-offset-4 focus-visible:before:outline-accent"
          >
            {project.title}
          </Link>
        </h2>

        {project.role || project.confidentiality !== "public" ? (
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            {project.role}
            {project.role && project.confidentiality !== "public" ? " — " : null}
            {project.confidentiality !== "public" ? (
              <span className="text-muted/70">{content.projects.confidentialNote}</span>
            ) : null}
          </p>
        ) : null}

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {project.description}
        </p>

        {/* Pinned to the card bottom so rows line up across columns */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-4">
          <ul className="flex flex-wrap gap-1.5" aria-label={content.work.techAria}>
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

          {project.links.length > 0 ? (
            <div className="relative z-10 flex flex-wrap gap-x-3 text-xs">
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
            </div>
          ) : null}
        </div>
      </div>
    </motion.li>
  );
}
