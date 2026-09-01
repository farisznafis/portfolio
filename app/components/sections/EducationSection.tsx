"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";
import { useMemo } from "react";
import { useLang } from "../../lib/i18n";
import { getEducation } from "../../lib/content/experience";
import { EASE } from "../../lib/motion";

/**
 * Compact education & recognition strip for early-career credibility.
 * Only verified items are rendered (data lives in the content domain).
 */
export function EducationSection() {
  const reduce = useReducedMotion();
  const { content, lang } = useLang();
  const education = useMemo(() => getEducation(lang), [lang]);

  const rise = {
    initial: reduce ? {} : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 0.7, ease: EASE },
  } as const;

  return (
    <section
      id="education"
      aria-label={content.education.ariaSection}
      className="border-t border-line"
    >
      <div className="container-x py-20 sm:py-24">
        <h2 className="font-display text-section font-semibold tracking-tight text-ink sm:text-title">
          {content.education.heading}
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {/* Education */}
          <motion.div {...rise}>
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
              <GraduationCap size={14} aria-hidden="true" className="text-accent" />
              {content.education.heading.split("&")[0]?.trim()}
            </p>
            <ul className="mt-5 divide-y divide-line border-t border-line">
              {education.items.map((item) => (
                <li key={item.school} className="py-5">
                  <p className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                    {item.school}
                  </p>
                  <p className="mt-1 text-sm text-muted">{item.program}</p>
                  <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-accent">
                    {item.meta}
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Recognition */}
          <motion.div {...rise}>
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
              <Award size={14} aria-hidden="true" className="text-accent" />
              {content.education.recognitionHeading}
            </p>
            <ul className="mt-5 divide-y divide-line border-t border-line">
              {education.recognition.map((item) => (
                <li
                  key={item}
                  className="flex items-baseline justify-between gap-6 py-5"
                >
                  <p className="font-display text-lg font-semibold tracking-tight text-ink sm:text-xl">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}