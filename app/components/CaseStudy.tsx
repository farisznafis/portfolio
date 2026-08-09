"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import clsx from "clsx";
import { useLang } from "../lib/i18n";
import { nextProject, projectMeta, type ProjectKey } from "../lib/data";
import { EASE, fadeUp, staggerContainer } from "../lib/motion";
import { MaskedText } from "./ui/MaskedText";

/** Placeholder gallery shots — TODO: replace with real project screenshots
    dropped into /public/images/projects/. */
const GALLERY = [
  { seed: "01", wide: true, ratio: "aspect-[21/10]" },
  { seed: "02", wide: false, ratio: "aspect-[16/10]" },
  { seed: "03", wide: false, ratio: "aspect-[16/10]" },
] as const;

export function CaseStudy({ slug }: { slug: ProjectKey }) {
  const reduce = useReducedMotion();
  const { content } = useLang();

  const item = content.projects.items.find((project) => project.key === slug);
  const study = content.caseStudies[slug];
  const meta = projectMeta[slug];
  const next = content.projects.items.find(
    (project) => project.key === nextProject(slug),
  );

  if (!item || !study || !next) return null;

  const isTeal = meta.tone === "accent";

  return (
    <article className="relative z-10">
      {/* Hero */}
      <header className="pt-28">
        <div className="mx-auto w-full max-w-6xl px-5 pb-16 sm:pb-24">
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <Link
              href="/work"
              className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
            >
              <ArrowLeft
                size={14}
                aria-hidden="true"
                className="transition-transform group-hover:-translate-x-1"
              />
              {content.nav.links.work}
            </Link>
          </motion.div>

          <p className="mt-10 font-mono text-xs uppercase tracking-[0.3em] text-accent">
            {content.projects.categories[item.category]} · {item.year} · {item.role}
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-6xl">
            <MaskedText text={item.title} onMount delay={0.1} />
          </h1>
          <motion.p
            className="mt-6 max-w-2xl leading-relaxed text-muted"
            initial={reduce ? {} : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
          >
            {study.overview}
          </motion.p>
        </div>
      </header>

      {/* Meta panel */}
      <motion.section
        aria-label={study.atAGlance}
        className="mx-auto w-full max-w-6xl px-5"
        variants={reduce ? {} : fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <dl className="grid border-y border-line sm:grid-cols-3 lg:grid-cols-4">
          <div className="border-b border-line py-5 pr-6 sm:border-b-0">
            <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Role</dt>
            <dd className="mt-2 text-sm font-medium text-ink">{item.role}</dd>
          </div>
          <div className="border-b border-line py-5 pr-6 sm:border-b-0">
            <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Year</dt>
            <dd className="mt-2 text-sm font-medium text-ink">{item.year}</dd>
          </div>
          <div className="border-b border-line py-5 pr-6 sm:border-b-0">
            <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Category</dt>
            <dd className="mt-2 text-sm font-medium text-ink">
              {content.projects.categories[item.category]}
            </dd>
          </div>
          <div className="border-b border-line py-5 lg:border-b-0">
            <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Stack
            </dt>
            <dd className="mt-2">
              <ul className="flex flex-wrap gap-2" aria-label={content.projects.techAria}>
                {meta.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-line bg-white/5 px-3 py-1 font-mono text-xs text-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div className="flex flex-wrap items-center gap-4 py-5 lg:col-span-4 lg:pt-3 lg:pb-6">
            <a
              href={meta.demo}
              target="_blank"
              rel="noreferrer"
              className={clsx(
                "group/link inline-flex items-center gap-1.5 text-sm font-semibold transition-colors",
                isTeal ? "text-accent-bright hover:text-accent" : "text-amber hover:text-amber/80",
              )}
            >
              {content.projects.liveDemo}
              <ArrowUpRight
                size={15}
                aria-hidden="true"
                className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
              />
            </a>
            <a
              href={meta.repo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-ink"
            >
              <Github size={15} aria-hidden="true" /> {content.projects.source}
            </a>
          </div>
        </dl>
      </motion.section>

      {/* Challenge */}
      <section
        aria-labelledby="cs-challenge"
        className="mx-auto w-full max-w-6xl px-5 py-24 sm:py-32"
      >
        <div className="max-w-3xl">
          <motion.h2
            id="cs-challenge"
            className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
            initial={reduce ? {} : { opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <MaskedText text={study.challenge.heading} delay={0.1} />
          </motion.h2>
          <motion.div
            className="mt-8 space-y-5"
            initial={reduce ? {} : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          >
            <p className="text-lg font-medium leading-relaxed text-ink">
              {study.challenge.lead}
            </p>
            <p className="leading-relaxed text-muted">{study.challenge.body}</p>
          </motion.div>
        </div>
      </section>

      {/* Approach */}
      <section
        aria-labelledby="cs-approach"
        className="border-t border-line bg-white/[0.02]"
      >
        <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:py-32">
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              {study.approach.kicker}
            </p>
            <h2
              id="cs-approach"
              className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl"
            >
              <MaskedText text={study.approach.heading} delay={0.1} />
            </h2>
          </motion.div>

          <motion.ol
            className="mt-14 border-t border-line"
            variants={reduce ? {} : staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {study.approach.steps.map((step, index) => (
              <motion.li
                key={step.title}
                className="grid gap-3 border-b border-line py-8 md:grid-cols-[200px_1fr] md:gap-12"
                variants={reduce ? {} : fadeUp}
              >
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                  {String(index + 1).padStart(2, "0")} · {step.tag}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted">{step.description}</p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* Features — asymmetric bento, no repeated rows */}
      <section aria-labelledby="cs-features" className="mx-auto w-full max-w-6xl px-5 py-24 sm:py-32">
        <motion.h2
          id="cs-features"
          className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl"
          initial={reduce ? {} : { opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <MaskedText text={study.features.heading} delay={0.1} />
        </motion.h2>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-2">
          {study.features.items.map((feature, index) => {
            const wide =
              study.features.items.length === 3 ? index === 0 : index === study.features.items.length - 1;
            return (
              <motion.div
                key={feature.title}
                className={clsx("bg-elevated p-8 sm:p-10", wide && "lg:col-span-2")}
                initial={reduce ? {} : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: index * 0.08, ease: EASE }}
              >
                <h3 className="font-display text-xl font-semibold text-ink">
                  {feature.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Gallery */}
      <section
        aria-labelledby="cs-gallery"
        className="border-t border-line bg-white/[0.02]"
      >
        <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:py-32">
          <h2 id="cs-gallery" className="sr-only">
            {study.galleryLabel}
          </h2>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {GALLERY.map((shot, index) => (
              <motion.figure
                key={shot.seed}
                className={clsx(shot.wide && "lg:col-span-2")}
                initial={reduce ? {} : { opacity: 0, scale: 0.985 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.9, delay: index * 0.08, ease: EASE }}
              >
                <div className={clsx("relative overflow-hidden rounded-2xl border border-line", shot.ratio)}>
                  <Image
                    src={`https://picsum.photos/seed/${slug}-${shot.seed}/${shot.wide ? 1920 : 1280}/${shot.wide ? 914 : 800}`}
                    alt={`${item.title}, ${study.galleryLabel} ${index + 1}`}
                    fill
                    sizes={shot.wide ? "(min-width: 1024px) 1100px, 100vw" : "(min-width: 1024px) 540px, 100vw"}
                    className="object-cover"
                  />
                </div>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section aria-labelledby="cs-outcomes" className="mx-auto w-full max-w-6xl px-5 py-24 sm:py-32">
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            {study.outcomes.kicker}
          </p>
          <h2
            id="cs-outcomes"
            className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl"
          >
            <MaskedText text={study.outcomes.heading} delay={0.1} />
          </h2>
        </motion.div>

        <ul className="mt-12 border-t border-line">
          {study.outcomes.items.map((outcome, index) => (
            <motion.li
              key={outcome}
              className="flex items-center justify-between gap-6 border-b border-line py-5"
              initial={reduce ? {} : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.15 + index * 0.08, ease: EASE }}
            >
              <p className="max-w-2xl leading-relaxed text-ink">{outcome}</p>
              <span className="h-1 w-6 shrink-0 rounded-full bg-accent/60" aria-hidden="true" />
            </motion.li>
          ))}
        </ul>
      </section>

      {/* Next project */}
      <section aria-labelledby="cs-next" className="border-t border-line">
        <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:py-36">
          <h2 id="cs-next" className="sr-only">
            {study.nextLabel}
          </h2>
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <Link
              href={`/work/${next.key}`}
              className="group block"
              aria-label={`${study.nextLabel}: ${next.title}`}
            >
              <MaskedText
                text={next.title}
                className="block font-display text-4xl font-semibold tracking-tight text-ink transition-colors group-hover:text-accent-bright sm:text-7xl"
              />
              <ArrowUpRight
                size={44}
                aria-hidden="true"
                className="mt-8 text-accent transition-transform duration-500 group-hover:-translate-y-2 group-hover:translate-x-2"
              />
            </Link>
          </motion.div>
        </div>
      </section>
    </article>
  );
}
