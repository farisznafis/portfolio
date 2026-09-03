"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import clsx from "clsx";
import { getFeaturedProjects, getProjectHref, type ProjectView } from "../../lib/content/projects";
import { useLang } from "../../lib/i18n";
import { gsap, ScrollTrigger } from "../../motion/gsap";
import type { StoredProject } from "../../types/project";

type ReelProject = ProjectView & { index: number };

/**
 * Selected work as a horizontal editorial reel.
 *
 * Reads from `getFeaturedProjects(projects, lang)` (exactly the featured set,
 * in featuredOrder), never the full project list.
 *
 * Desktop: the section pins and the track pans horizontally (GSAP
 * ScrollTrigger, scrub 1). Scroll velocity adds a slight skew to the media,
 * settling back when scrolling stops. Mobile / reduced motion: the same
 * panels stack vertically in natural flow - one render path, orientation is
 * CSS; only the pin is conditional.
 *
 * Media: projects without a real screenshot yet render a typographic
 * fallback built from the project initials and the site's design tokens
 * (no stock photography).
 */
export function WorkReel({
  projects,
}: {
  projects: StoredProject[];
}) {
  const wrapRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { content, lang } = useLang();

  // Featured projects from the data-access layer, in featuredOrder.
  const projectsList: ReelProject[] = useMemo(
    () =>
      getFeaturedProjects(projects, lang).map((project, index) => ({
        ...project,
        index,
      })),
    [projects, lang],
  );

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Velocity skew - fast scrolls tilt the media slightly; it settles.
      const skewTo = gsap.quickTo(track, "skewX", {
        duration: 0.5,
        ease: "power3.out",
      });
      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          const v = self.getVelocity();
          skewTo(gsap.utils.clamp(-4, 4, v / -400));
        },
      });

      return () => {
        st.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="work" ref={wrapRef} aria-label={content.work.ariaSection}>
      <div
        ref={trackRef}
        className="flex flex-col lg:h-[100dvh] lg:w-max lg:flex-row lg:items-stretch"
      >
        {/* Section header - first cell of the reel on desktop */}
        <div className="container-x flex flex-col justify-center py-24 lg:w-[42vw] lg:shrink-0 lg:py-0">
          <h2 className="font-display text-display font-semibold uppercase leading-[0.9] tracking-tight text-ink">
            {content.work.heading}
          </h2>
          <p className="mt-6 font-mono text-sm tracking-[0.2em] text-muted">
            {String(projectsList.length).padStart(2, "0")} {content.work.countLabel}
          </p>
        </div>

        {projectsList.map((project) => (
          <ReelPanel key={project.slug} project={project} />
        ))}

        {/* Trailing cell - view-all CTA keeps the reel's editorial rhythm */}
        <div className="container-x flex items-center py-24 lg:w-[46vw] lg:shrink-0 lg:py-0">
          <Link
            href="/projects"
            data-cursor="Open"
            className="group inline-flex flex-col gap-4"
          >
            <span className="font-mono text-sm tracking-[0.3em] text-accent">
              {String(projectsList.length + 1).padStart(2, "0")}
            </span>
            <span className="font-display text-section font-semibold uppercase leading-[0.95] tracking-tight text-ink transition-colors duration-500 group-hover:text-accent-bright sm:text-title">
              {content.work.viewAll}
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors group-hover:text-ink">
              {content.projects.heading}
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="text-accent transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </span>
          </Link>
        </div>

        {/* Trailing spacer so the last panel breathes before unpinning */}
        <div aria-hidden="true" className="hidden w-[10vw] shrink-0 lg:block" />
      </div>
    </section>
  );
}

/**
 * Typographic media fallback for projects without a real screenshot yet.
 * Uses the project's initials and the existing design tokens - no stock
 * imagery. TODO_REAL_IMAGE: replace with real screenshots as they arrive.
 */
function TypographicMedia({
  initials,
  title,
  tone,
}: {
  initials: string;
  title: string;
  tone: "accent" | "amber";
}) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-elevated"
    >
      <span
        className={clsx(
          "font-display text-[7rem] font-semibold leading-none tracking-tighter text-outline transition-transform duration-700 ease-out group-hover:scale-[1.04] sm:text-[9rem]",
          tone === "accent" ? "opacity-90" : "opacity-70",
        )}
      >
        {initials}
      </span>
      <span className="absolute bottom-4 left-5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted/70">
        {title}
      </span>
    </div>
  );
}

function ReelPanel({ project }: { project: ReelProject }) {
  const { content } = useLang();
  const flip = project.index % 2 === 1; // alternate composition per campaign

  return (
    <article className="group relative flex items-center py-20 lg:w-[74vw] lg:shrink-0 lg:py-0">
      <Link
        href={getProjectHref(project)}
        data-cursor="View"
        aria-label={content.work.viewCaseStudy.replace("{title}", project.title)}
        className="container-x grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10"
      >
        {/* Copy block */}
        <div className={clsx("lg:col-span-5", flip && "lg:order-last")}>
          <span className="font-mono text-sm tracking-[0.3em] text-accent">
            {String(project.index + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-4 font-display text-title font-semibold uppercase leading-[0.95] tracking-tight text-ink transition-colors duration-500 group-hover:text-accent-bright">
            {project.title}
          </h3>
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            {project.year ? <li>{project.year}</li> : null}
            {project.fields.map((field) => (
              <li key={field}>{content.fields[field]}</li>
            ))}
            {project.role ? <li>{project.role}</li> : null}
          </ul>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted lg:text-base">
            {project.description}
          </p>
          <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-ink">
            <span className="relative">
              {content.projects.caseStudyCta}
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100" />
            </span>
            <ArrowUpRight
              size={15}
              aria-hidden="true"
              className="text-accent transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </span>
        </div>

        {/* Media block - real screenshot when available, typographic fallback otherwise */}
        <div
          className={clsx(
            "relative aspect-[16/10] w-full overflow-hidden border border-line/60 bg-elevated lg:col-span-7 lg:h-[58vh] lg:w-auto",
            flip && "lg:order-first",
          )}
        >
          {project.cover ? (
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <TypographicMedia
              initials={project.initials}
              title={project.title}
              tone={project.tone}
            />
          )}
        </div>
      </Link>
    </article>
  );
}