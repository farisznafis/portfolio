"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { useLang } from "../../lib/i18n";
import { getExperience } from "../../lib/content/experience";
import { gsap, ScrollTrigger } from "../../motion/gsap";

/**
 * Career history as chapters: the left rail pins a giant year that swaps as
 * each chapter crosses the viewport middle; the right column scrolls the
 * roles. Mobile and reduced motion fall back to a clean stacked flow where
 * each chapter carries its own year heading.
 */
export function ExperienceChapters() {
  const reduce = useReducedMotion();
  const { content, lang } = useLang();
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const items = useMemo(() => getExperience(lang), [lang]);

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const chapters = gsap.utils.toArray<HTMLElement>("[data-chapter]");
      chapters.forEach((chapter, index) => {
        ScrollTrigger.create({
          trigger: chapter,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setActive(index);
          },
        });
      });
    }, el);

    return () => ctx.revert();
  }, [reduce]);

  const current = items[active];

  return (
    <section
      id="experience"
      ref={ref}
      aria-label={content.experience.ariaSection}
      className="border-t border-line"
    >
      <div className="container-x py-24 sm:py-32">
        <h2 className="font-display text-section font-semibold tracking-tight text-ink sm:text-title">
          {content.experience.heading}
        </h2>

        <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          {/* Pinned year rail */}
          {!reduce && (
            <div aria-hidden="true" className="hidden lg:block">
              <div className="sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden">
                <div className="relative h-40 overflow-hidden">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={current.year}
                      initial={{ y: "70%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      exit={{ y: "-70%", opacity: 0 }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 font-display text-[9rem] font-semibold leading-none tracking-tighter text-outline xl:text-[11rem]"
                    >
                      {current.year}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <p className="mt-4 font-mono text-xs uppercase tracking-[0.22em] text-muted">
                  {current.role} / {current.company}
                </p>
              </div>
            </div>
          )}

          {/* Chapters */}
          <div>
            {items.map((item) => (
              <article
                key={item.company + item.period}
                data-chapter={!reduce || undefined}
                className={clsx(
                  "flex flex-col justify-center",
                  !reduce && "min-h-[80vh]",
                )}
              >
                {/* Mobile year heading */}
                <p className="font-display text-6xl font-semibold leading-none tracking-tighter text-outline lg:hidden">
                  {item.year}
                </p>

                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted lg:mt-0">
                  {item.period}
                </p>
                <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  {item.role}
                </h3>
                <p className="mt-1 font-mono text-sm uppercase tracking-[0.18em] text-accent">
                  {item.company}
                </p>

                <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/85">
                  {item.summary}
                </p>

                <ul className="mt-7 space-y-3">
                  {item.points.map((point) => (
                    <li key={point} className="flex gap-4 leading-relaxed text-muted">
                      <span aria-hidden="true" className="mt-[0.65em] h-px w-5 shrink-0 bg-accent/60" />
                      {point}
                    </li>
                  ))}
                </ul>

                <ul className="mt-8 flex flex-wrap gap-2" aria-label={content.experience.techAria}>
                  {item.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-line bg-white/[0.03] px-3 py-1 font-mono text-xs text-muted"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
