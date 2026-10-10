"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useRef } from "react";
import clsx from "clsx";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { getFeaturedProjects, getProjectHref, type ProjectView } from "../../lib/content/projects";
import { useLang } from "../../lib/i18n";
import { DUR, EASE } from "../../lib/motion";
import type { StoredProject } from "../../types/project";

/**
 * Selected work as a broken editorial grid.
 *
 * No pinning and no horizontal scroll-jacking: the page scrolls naturally and
 * each project sits at its own offset on a 12-col grid. Media reveals with a
 * clip-path wipe and drifts with a per-card parallax (transform only). Mobile
 * collapses every slot to a single column.
 */

// Per-slot placement on the desktop grid; cycles if more than three projects.
const SLOTS = [
  { media: "lg:col-span-8 lg:col-start-1", copy: "lg:col-span-3 lg:col-start-10 lg:self-end", num: "lg:-right-[0.06em]" },
  { media: "lg:col-span-7 lg:col-start-6 lg:row-start-1", copy: "lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:self-center", num: "lg:right-auto lg:-left-[0.1em]" },
  { media: "lg:col-span-10 lg:col-start-2", copy: "lg:col-span-4 lg:col-start-8", num: "lg:right-auto lg:-left-[0.1em]" },
] as const;

export function WorkReel({ projects }: { projects: StoredProject[] }) {
  const { content, lang } = useLang();

  const featured = useMemo(
    () => getFeaturedProjects(projects, lang).slice(0, 2),
    [projects, lang],
  );

  return (
    <section id="work" aria-label={content.work.ariaSection} className="relative py-28 sm:py-40">
      <div className="container-x">
        <header className="mb-20 grid items-end gap-6 sm:mb-32 lg:grid-cols-12">
          <h2 className="font-display text-display font-semibold uppercase leading-[0.85] tracking-tight text-ink lg:col-span-9">
            {content.work.heading}
          </h2>
          <p className="font-mono text-xs tracking-[0.25em] text-muted lg:col-span-3 lg:pb-3 lg:text-right">
            <span className="text-accent">{String(featured.length).padStart(2, "0")}</span>{" "}
            {content.work.countLabel}
          </p>
        </header>

        <div className="flex flex-col gap-28 sm:gap-44">
          {featured.map((project, index) => (
            <WorkPiece key={project.slug} project={project} index={index} />
          ))}
        </div>

        <Link
          href="/projects"
          data-cursor="Open"
          className="group mt-32 flex items-end justify-between gap-6 border-t border-line pt-8 sm:mt-48"
        >
          <span className="font-display text-title font-semibold uppercase leading-[0.9] tracking-tight text-ink transition-colors duration-500 group-hover:text-accent-bright">
            {content.work.viewAll}
          </span>
          <ArrowUpRight
            aria-hidden="true"
            className="size-12 shrink-0 text-accent transition-transform duration-500 group-hover:-translate-y-2 group-hover:translate-x-2 sm:size-20"
            strokeWidth={1.25}
          />
        </Link>
      </div>
    </section>
  );
}

function WorkPiece({ project, index }: { project: ProjectView; index: number }) {
  const { content } = useLang();
  const reduce = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const slot = SLOTS[index % SLOTS.length];

  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-7%", "7%"]);
  const numberY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["40%", "-40%"]);

  const number = String(index + 1).padStart(2, "0");

  return (
    <article className="group relative">
      <Link
        href={getProjectHref(project)}
        data-cursor="View"
        aria-label={content.work.viewCaseStudy.replace("{title}", project.title)}
        className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-x-10"
      >
        <div ref={frameRef} className={clsx("relative min-w-0", slot.media)}>
          <motion.div
            className="relative aspect-[16/10] overflow-hidden bg-elevated"
            initial={reduce ? false : { clipPath: "inset(12% 12% 12% 12%)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: DUR.slow * 1.4, ease: EASE }}
          >
            <motion.div style={{ y: imageY }} className="absolute -inset-y-[8%] inset-x-0">
              {project.cover ? (
                <Image
                  src={project.cover.src}
                  alt={project.cover.alt}
                  fill
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-signature)] group-hover:scale-[1.05]"
                />
              ) : (
                <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-[8rem] font-semibold leading-none tracking-tighter text-outline sm:text-[12rem]">
                    {project.initials}
                  </span>
                </div>
              )}
            </motion.div>
            {/* Teal wash that slides off on hover - brand tint over raw screenshots */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 origin-bottom bg-accent/15 mix-blend-color transition-transform duration-700 ease-[var(--ease-signature)] group-hover:scale-y-0"
            />
          </motion.div>

          {/* Oversized outlined index, drifting against the scroll */}
          <motion.span
            aria-hidden="true"
            style={{ y: numberY }}
            className={clsx(
              "pointer-events-none absolute -top-[0.5em] right-0 font-display lg:top-auto lg:-bottom-[0.42em] text-[clamp(5rem,14vw,13rem)] font-semibold leading-none tracking-tighter text-outline transition-colors duration-500 group-hover:text-accent/20",
              slot.num,
            )}
          >
            {number}
          </motion.span>
        </div>

        <div className={clsx("min-w-0", slot.copy)}>
          <h3 className="break-words font-display text-[clamp(1.9rem,3vw,3.25rem)] font-semibold uppercase leading-[0.95] tracking-tight text-ink [text-wrap:balance] transition-colors duration-500 group-hover:text-accent-bright">
            {project.title}
          </h3>
          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            {project.year ? <li>{project.year}</li> : null}
            {project.fields.map((field) => (
              <li key={field}>/ {content.fields[field]}</li>
            ))}
          </ul>
          {project.role ? (
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{project.role}</p>
          ) : null}
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted lg:line-clamp-5">
            {project.description}
          </p>
          <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-ink">
            <span className="relative">
              {content.projects.caseStudyCta}
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100" />
            </span>
            <ArrowUpRight
              size={15}
              aria-hidden="true"
              className="text-accent transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </span>
        </div>
      </Link>
    </article>
  );
}
