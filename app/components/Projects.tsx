"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { projectMeta, type Project, type ProjectCategory } from "../lib/data";
import { useLang } from "../lib/i18n";
import { EASE, PARALLAX, SPRING } from "../lib/motion";
import { MaskedText } from "./ui/MaskedText";
import { Parallax } from "./ui/Parallax";
import { TiltCard } from "./ui/TiltCard";

export function Projects() {
  const [category, setCategory] = useState<ProjectCategory>("All");
  const reduce = useReducedMotion();
  const { content } = useLang();

  // Merge localized copy with language-neutral metadata (links, stack, tone).
  const projects: Project[] = content.projects.items.map((item) => ({
    ...projectMeta[item.key],
    ...item,
  }));

  const visible =
    category === "All" ? projects : projects.filter((p) => p.category === category);

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="relative z-10 min-h-screen pt-28"
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:py-32">
        {/* Header row */}
        <motion.div
          className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
          initial={reduce ? {} : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              {content.projects.eyebrow}
            </p>
            <h2
              id="work-heading"
              className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl"
            >
              <MaskedText text={content.projects.heading} delay={0.1} />
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              {content.projects.subtitle}
            </p>
          </div>
          <div role="group" aria-label={content.projects.filterAria} className="flex flex-wrap gap-2">
            {(Object.keys(content.projects.categories) as ProjectCategory[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={clsx(
                  "relative rounded-full border px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors",
                  category === item
                    ? "border-accent text-on-accent"
                    : "border-line text-muted hover:border-white/30 hover:text-ink",
                )}
              >
                {category === item && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={SPRING.pill}
                  />
                )}
                <span className="relative z-10">{content.projects.categories[item]}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Project grid */}
        <motion.div layout className="mt-12 grid gap-5 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduce = useReducedMotion();
  const isTeal = project.tone === "accent";
  const { content } = useLang();

  return (
    <motion.article
      layout
      initial={reduce ? {} : { opacity: 0, y: 50, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: EASE }}
      className={clsx("h-full", project.featured && "sm:col-span-2")}
    >
      <TiltCard className="group glass h-full overflow-hidden rounded-2xl">
        {/* Thumbnail */}
        <div
          className={clsx(
            "relative overflow-hidden border-b border-line",
            project.featured ? "aspect-[21/9]" : "aspect-[16/9]",
          )}
        >
          <div
            aria-hidden="true"
            className={clsx(
              "absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105",
              isTeal
                ? "bg-gradient-to-br from-accent/25 via-night to-elevated"
                : "bg-gradient-to-br from-amber/20 via-night to-elevated",
            )}
          >
            <Parallax className="absolute inset-0" strength={PARALLAX.subtle}>
              <div
                className={clsx(
                  "absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl",
                  isTeal ? "bg-accent/20" : "bg-amber/15",
                )}
              />
              <span className="absolute bottom-4 right-6 select-none font-display text-7xl font-bold tracking-tight text-white/[0.06] sm:text-8xl">
                {project.initials}
              </span>
            </Parallax>
            <div className="absolute left-5 top-5 flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className={clsx("h-2.5 w-2.5 rounded-full", isTeal ? "bg-accent/70" : "bg-amber/70")} />
            </div>
          </div>
          <a
            href={project.demo}
            target="_blank"
            rel="noreferrer"
            aria-label={content.projects.openDemo.replace("{title}", project.title)}
            className="absolute inset-0 flex items-center justify-center bg-night/60 opacity-0 backdrop-blur-sm transition-opacity duration-300 focus-visible:opacity-100 group-hover:opacity-100"
          >
            <span className="inline-flex translate-y-2 items-center gap-2 rounded-full border border-line bg-white/10 px-5 py-2.5 text-sm font-semibold text-ink transition-transform duration-300 group-hover:translate-y-0">
              {content.projects.viewProject} <ArrowUpRight size={16} aria-hidden="true" />
            </span>
          </a>
        </div>

        <div className="p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            <span className={isTeal ? "text-accent" : "text-amber"}>
              {content.projects.categories[project.category]}
            </span>
            <span>
              {project.year} · {project.role}
            </span>
          </div>
          <h3 className="mt-3 font-display text-2xl font-semibold text-ink transition-colors group-hover:text-accent-bright">
            {project.title}
          </h3>
          <p className="mt-3 leading-relaxed text-muted">{project.description}</p>

          <ul className="mt-5 flex flex-wrap gap-2" aria-label={content.projects.techAria}>
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-line bg-white/5 px-3 py-1 font-mono text-xs text-muted"
              >
                {tech}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center gap-4 text-sm font-semibold">
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="group/link inline-flex items-center gap-1.5 text-ink transition-colors hover:text-accent"
            >
              {content.projects.liveDemo}
              <ArrowUpRight
                size={15}
                aria-hidden="true"
                className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
              />
            </a>
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-ink"
            >
              <Github size={15} aria-hidden="true" /> {content.projects.source}
            </a>
          </div>
        </div>
      </TiltCard>
    </motion.article>
  );
}
