"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import clsx from "clsx";
import { useLang } from "../../lib/i18n";
import { nextProject, projectImage, projectMeta, type ProjectKey } from "../../lib/data";
import { EASE } from "../../lib/motion";
import { MaskedText } from "../ui/MaskedText";

/**
 * Image block with a slow scroll parallax: the frame stays put while the
 * media drifts inside an oversized container. Static under reduced motion.
 */
function ParallaxFigure({
  src,
  alt,
  className,
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  return (
    <figure
      ref={ref}
      className={clsx(
        "relative overflow-hidden border border-line/60 bg-elevated",
        className,
      )}
    >
      <motion.div
        style={{ y: reduce ? 0 : y }}
        className="absolute -inset-y-[9%] inset-x-0"
      >
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" priority={priority} />
      </motion.div>
    </figure>
  );
}

export function CaseStudy({ slug }: { slug: ProjectKey }) {
  const reduce = useReducedMotion();
  const { content } = useLang();

  const item = content.work.items.find((project) => project.key === slug);
  const study = content.caseStudies[slug];
  const next = content.work.items.find((project) => project.key === nextProject(slug));

  if (!item || !study || !next) return null;

  const rise = {
    initial: reduce ? {} : { opacity: 0, y: 36 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.9, ease: EASE },
  } as const;

  return (
    <article className="relative">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <header className="container-x pb-14 pt-32 sm:pt-40">
        <motion.div
          initial={reduce ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/#work"
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

        <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          <li className="text-accent">{content.work.categories[item.category]}</li>
          <li>{item.year}</li>
          <li>{item.role}</li>
        </ul>

        <h1 className="mt-5 font-display text-display font-semibold uppercase leading-[0.9] tracking-tight text-ink">
          <MaskedText text={item.title} onMount play delay={0.1} />
        </h1>

        <motion.p
          className="mt-8 max-w-2xl text-lede leading-relaxed text-muted"
          initial={reduce ? {} : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
        >
          {study.overview}
        </motion.p>
      </header>

      {/* Cinematic hero image */}
      <ParallaxFigure
        src={projectImage(slug, 1920, 914)}
        alt={`${item.title}, hero image`}
        className="aspect-[16/10] border-x-0 sm:aspect-[21/10]"
        sizes="(min-width: 1024px) 100vw, 100vw"
        priority
      />

      {/* ── Meta panel ────────────────────────────────────────────────────── */}
      <section aria-label={study.atAGlance} className="container-x" {...rise}>
        <dl className="grid gap-x-10 gap-y-6 border-b border-line py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Role</dt>
            <dd className="mt-2 text-sm font-medium text-ink">{item.role}</dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Year</dt>
            <dd className="mt-2 text-sm font-medium text-ink">{item.year}</dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Category</dt>
            <dd className="mt-2 text-sm font-medium text-ink">
              {content.work.categories[item.category]}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              Stack
            </dt>
            <dd className="mt-2">
              <ul className="flex flex-wrap gap-2" aria-label={content.work.techAria}>
                {projectMeta[slug].stack.map((tech) => (
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
        </dl>

        <div className="flex flex-wrap items-center gap-6 pb-10">
          <a
            href={projectMeta[slug].demo}
            target="_blank"
            rel="noreferrer"
            data-cursor="Open"
            className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-accent-bright transition-colors hover:text-accent"
          >
            {content.work.liveDemo}
            <ArrowUpRight
              size={15}
              aria-hidden="true"
              className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
            />
          </a>
          <a
            href={projectMeta[slug].repo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-ink"
          >
            {content.work.source}
          </a>
        </div>
      </section>

      {/* ── Challenge ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="cs-challenge" className="container-x py-24 sm:py-32">
        <div className="max-w-3xl">
          <motion.h2
            id="cs-challenge"
            className="font-display text-section font-semibold tracking-tight text-ink"
            {...rise}
          >
            <MaskedText text={study.challenge.heading} delay={0.1} />
          </motion.h2>
          <motion.div className="mt-8 space-y-5" {...rise}>
            <p className="text-lg font-medium leading-relaxed text-ink">
              {study.challenge.lead}
            </p>
            <p className="leading-relaxed text-muted">{study.challenge.body}</p>
          </motion.div>
        </div>
      </section>

      {/* ── Approach - sticky numerals beside each step ───────────────────── */}
      <section aria-labelledby="cs-approach" className="border-t border-line bg-white/[0.02]">
        <div className="container-x py-24 sm:py-32">
          <motion.div {...rise}>
            <h2
              id="cs-approach"
              className="font-display text-section font-semibold tracking-tight text-ink sm:text-title"
            >
              <MaskedText text={study.approach.heading} delay={0.1} />
            </h2>
          </motion.div>

          <ol className="mt-16">
            {study.approach.steps.map((step, index) => (
              <li
                key={step.title}
                className="grid items-start gap-4 border-t border-line py-10 first:border-t-0 first:pt-0 md:grid-cols-[190px_1fr] md:gap-14"
              >
                <div className="flex items-baseline gap-4 md:sticky md:top-28 md:flex-col md:items-start md:gap-2">
                  <span
                    aria-hidden="true"
                    className="font-display text-6xl font-semibold leading-none text-outline"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
                    {step.tag}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-ink">{step.title}</h3>
                  <p className="mt-3 max-w-2xl leading-relaxed text-muted">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Features - asymmetric grid, tint variation across cells ──────── */}
      <section aria-labelledby="cs-features" className="container-x py-24 sm:py-32">
        <motion.h2
          id="cs-features"
          className="font-display text-section font-semibold tracking-tight text-ink sm:text-title"
          {...rise}
        >
          <MaskedText text={study.features.heading} delay={0.1} />
        </motion.h2>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line lg:grid-cols-2">
          {study.features.items.map((feature, index) => {
            const wide =
              study.features.items.length === 3
                ? index === 0
                : index === study.features.items.length - 1;
            const tinted = index === (study.features.items.length === 3 ? 0 : 1);
            return (
              <motion.div
                key={feature.title}
                className={clsx(
                  "p-8 sm:p-10",
                  tinted ? "bg-accent/[0.06]" : "bg-elevated",
                  wide && "lg:col-span-2",
                )}
                initial={reduce ? {} : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: index * 0.08, ease: EASE }}
              >
                <h3 className="font-display text-xl font-semibold text-ink">{feature.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Gallery - one wide plate, then a paired row ──────────────────── */}
      <section aria-label={study.galleryLabel} className="container-x pb-24 sm:pb-32">
        <h2 className="sr-only">{study.galleryLabel}</h2>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <ParallaxFigure
              src={projectImage(slug, 1920, 914, "b")}
              alt={`${item.title}, ${study.galleryLabel.toLowerCase()} 1`}
              className="aspect-[21/10]"
              sizes="(min-width: 1024px) 100vw, 100vw"
            />
          </div>
          <ParallaxFigure
            src={projectImage(slug, 1280, 960, "c")}
            alt={`${item.title}, ${study.galleryLabel.toLowerCase()} 2`}
            className="aspect-[4/3]"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <ParallaxFigure
            src={projectImage(slug, 1280, 960, "d")}
            alt={`${item.title}, ${study.galleryLabel.toLowerCase()} 3`}
            className="aspect-[4/3]"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </section>

      {/* ── Outcomes ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="cs-outcomes" className="container-x pb-24 sm:pb-32">
        <motion.div {...rise}>
          <h2
            id="cs-outcomes"
            className="font-display text-section font-semibold tracking-tight text-ink sm:text-title"
          >
            <MaskedText text={study.outcomes.heading} delay={0.1} />
          </h2>
        </motion.div>

        <ul className="mt-12 divide-y divide-line">
          {study.outcomes.items.map((outcome, index) => (
            <motion.li
              key={outcome}
              className="flex items-baseline justify-between gap-6 py-6"
              initial={reduce ? {} : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.07, ease: EASE }}
            >
              <p className="max-w-2xl leading-relaxed text-ink">{outcome}</p>
              <span className="font-mono text-xs text-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* ── Next project - full-bleed teaser ─────────────────────────────── */}
      <section aria-labelledby="cs-next" className="border-t border-line">
        <h2 id="cs-next" className="sr-only">
          {study.nextLabel}
        </h2>
        <Link
          href={`/work/${next.key}`}
          data-cursor="Open"
          aria-label={`${study.nextLabel}: ${next.title}`}
          className="group relative block overflow-hidden bg-night"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-35 transition-opacity duration-700 group-hover:opacity-50"
          >
            <Image
              src={projectImage(next.key, 1920, 1080)}
              alt=""
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-linear-to-r from-night via-night/60 to-night/20" />
          </div>

          <div className="container-x relative z-10 flex min-h-[72vh] flex-col justify-center py-24">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
              {study.nextLabel}
            </p>
            <span className="mt-5 block font-display text-title font-semibold uppercase leading-[0.95] tracking-tight text-ink transition-colors duration-500 group-hover:text-accent-bright sm:max-w-3xl sm:text-display">
              {next.title}
            </span>
            <ArrowUpRight
              size={44}
              aria-hidden="true"
              className="mt-10 text-accent transition-transform duration-500 group-hover:-translate-y-2 group-hover:translate-x-2"
            />
          </div>
        </Link>
      </section>
    </article>
  );
}
