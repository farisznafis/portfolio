"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useLang } from "../../lib/i18n";
import { getLeadership } from "../../lib/content/experience";
import { EASE } from "../../lib/motion";

/**
 * Student leadership and organisation roles. Same row typography as the
 * Experience chapters, without the pinned rail - two entries don't need it.
 */
export function LeadershipSection() {
  const reduce = useReducedMotion();
  const { content, lang } = useLang();
  const items = useMemo(() => getLeadership(lang), [lang]);

  return (
    <section
      id="leadership"
      aria-label={content.leadership.ariaSection}
      className="border-t border-line"
    >
      <div className="container-x py-24 sm:py-32">
        <h2 className="break-keep font-display text-section font-semibold tracking-tight text-ink sm:text-title">
          {content.leadership.heading}
        </h2>

        <ul className="mt-16 divide-y divide-line border-t border-line">
          {items.map((item) => (
            <motion.li
              key={item.organisation + item.period}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="grid gap-6 py-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20"
            >
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                  {item.period}
                </p>
                <p className="mt-3 font-mono text-sm uppercase tracking-[0.18em] text-accent">
                  {item.organisation}
                </p>
                <p className="mt-1 text-sm text-muted">{item.location}</p>
              </div>

              <div>
                <h3 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  {item.role}
                </h3>
                {item.unit && <p className="mt-2 text-sm text-muted">{item.unit}</p>}

                <ul className="mt-6 space-y-3">
                  {item.points.map((point) => (
                    <li key={point} className="flex gap-4 leading-relaxed text-muted">
                      <span aria-hidden="true" className="mt-[0.65em] h-px w-5 shrink-0 bg-accent/60" />
                      {point}
                    </li>
                  ))}
                </ul>

                {item.href && (
                  <Link
                    href={item.href}
                    data-cursor="View"
                    className="group/link mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-bright transition-colors hover:text-accent"
                  >
                    {content.leadership.caseStudyCta}
                    <ArrowUpRight
                      size={15}
                      aria-hidden="true"
                      className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                    />
                  </Link>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
