"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import clsx from "clsx";
import { projectMeta } from "../lib/data";
import { useLang } from "../lib/i18n";
import { EASE, PARALLAX } from "../lib/motion";
import { MaskedText } from "./ui/MaskedText";
import { Parallax } from "./ui/Parallax";

export function ProjectDetail({ slug }: { slug: string }) {
  const reduce = useReducedMotion();
  const { content } = useLang();

  const items = content.projects.items;
  const index = items.findIndex((item) => item.key === slug);
  if (index === -1) notFound();

  const item = items[index];
  const meta = projectMeta[item.key];
  const isTeal = meta.tone === "accent";
  const prevItem = items[(index - 1 + items.length) % items.length];
  const nextItem = items[(index + 1) % items.length];

  return (
    <section className="relative z-10 min-h-screen pt-28">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:py-24">
        {/* Back link */}
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft
              size={16}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            {content.projectDetail.back}
          </Link>
        </motion.div>

        {/* Hero */}
        <motion.header
          className="mt-10 max-w-3xl"
          initial={reduce ? {} : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            {content.projects.categories[item.category]} · {item.year}
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-6xl md:text-7xl">
            <MaskedText text={item.title} delay={0.15} />
          </h1>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-muted">
            {item.role}
          </p>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            {item.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={meta.demo}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-medium text-on-accent transition-all hover:scale-[1.03] hover:bg-accent-bright hover:shadow-lg hover:shadow-accent/30 active:scale-95"
            >
              {content.projects.liveDemo}
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
            <a
              href={meta.repo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-accent/50 hover:text-accent"
            >
              <Github size={16} aria-hidden="true" /> {content.projects.source}
            </a>
          </div>
        </motion.header>

        {/* Visual panel */}
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 40, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.15, ease: EASE }}
          className="relative mt-14 overflow-hidden rounded-3xl border border-line"
        >
          <div
            className={clsx(
              "relative aspect-[16/9] overflow-hidden sm:aspect-[21/9]",
              isTeal
                ? "bg-gradient-to-br from-accent/25 via-night to-elevated"
                : "bg-gradient-to-br from-amber/20 via-night to-elevated",
            )}
            aria-hidden="true"
          >
            <Parallax className="absolute inset-0" strength={PARALLAX.subtle}>
              <div
                className={clsx(
                  "absolute -right-20 -top-20 h-72 w-72 rounded-full blur-3xl",
                  isTeal ? "bg-accent/20" : "bg-amber/15",
                )}
              />
              <span className="absolute bottom-6 right-10 select-none font-display text-8xl font-bold tracking-tight text-white/[0.06] sm:text-9xl">
                {meta.initials}
              </span>
            </Parallax>
            <div className="absolute left-6 top-6 flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span
                className={clsx(
                  "h-2.5 w-2.5 rounded-full",
                  isTeal ? "bg-accent/70" : "bg-amber/70",
                )}
              />
            </div>
          </div>
        </motion.div>

        {/* Highlights */}
        <motion.section
          className="mt-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"
          initial={reduce ? {} : { opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {content.projectDetail.highlights}
          </h2>
          <ul className="space-y-4">
            {item.highlights.map((point, i) => (
              <li key={point} className="flex items-start gap-4">
                <span className="mt-0.5 font-mono text-xs tracking-[0.2em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="leading-relaxed text-muted">{point}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Tech stack */}
        <motion.section
          className="mt-16"
          initial={reduce ? {} : { opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {content.projectDetail.techStack}
          </h2>
          <ul
            className="mt-6 flex flex-wrap gap-2"
            aria-label={content.projects.techAria}
          >
            {meta.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-line bg-white/5 px-4 py-1.5 font-mono text-sm text-muted"
              >
                {tech}
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Prev / Next */}
        <motion.nav
          className="mt-20 grid gap-4 border-t border-line pt-10 sm:grid-cols-2"
          aria-label={content.projectDetail.navAria}
          initial={reduce ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <Link
            href={`/work/${prevItem.key}`}
            className="group rounded-2xl border border-line bg-white/[0.03] p-6 transition-colors hover:border-accent/40"
          >
            <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-muted">
              <ArrowLeft
                size={14}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
              {content.projectDetail.prev}
            </span>
            <span className="mt-3 block font-display text-xl font-semibold text-ink transition-colors group-hover:text-accent-bright">
              {prevItem.title}
            </span>
            <span className="mt-1 block font-mono text-xs text-muted">
              {content.projects.categories[prevItem.category]} · {prevItem.year}
            </span>
          </Link>
          <Link
            href={`/work/${nextItem.key}`}
            className="group rounded-2xl border border-line bg-white/[0.03] p-6 text-right transition-colors hover:border-accent/40"
          >
            <span className="flex items-center justify-end gap-2 text-xs font-mono uppercase tracking-[0.2em] text-muted">
              {content.projectDetail.next}
              <ArrowRight
                size={14}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
            <span className="mt-3 block font-display text-xl font-semibold text-ink transition-colors group-hover:text-accent-bright">
              {nextItem.title}
            </span>
            <span className="mt-1 block font-mono text-xs text-muted">
              {content.projects.categories[nextItem.category]} · {nextItem.year}
            </span>
          </Link>
        </motion.nav>
      </div>
    </section>
  );
}