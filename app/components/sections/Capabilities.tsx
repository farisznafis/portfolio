"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLang } from "../../lib/i18n";
import { EASE } from "../../lib/motion";

/**
 * Capabilities as a typographic wall: three domains, each a row of large
 * words that answer the pointer with a color fill and a slight shift.
 * No cards, no meters - the type itself is the interface.
 */
export function Capabilities() {
  const reduce = useReducedMotion();
  const { content } = useLang();

  return (
    <section
      id="capabilities"
      aria-label={content.capabilities.ariaSection}
      className="border-t border-line bg-white/[0.02]"
    >
      <div className="container-x py-24 sm:py-32">
        <h2 className="font-display text-section font-semibold tracking-tight text-ink sm:text-title">
          {content.capabilities.heading}
        </h2>
        <p className="mt-5 max-w-xl leading-relaxed text-muted">
          {content.capabilities.blurb}
        </p>

        <div className="mt-16 border-t border-line">
          {content.capabilities.groups.map((group) => (
            <div
              key={group.title}
              className="grid gap-6 border-b border-line py-12 md:grid-cols-[220px_1fr]"
            >
              <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
                {group.title}
              </h3>
              <ul className="-ml-1 flex flex-wrap items-baseline gap-x-10 gap-y-5">
                {group.skills.map((skill, index) => (
                  <motion.li
                    key={skill}
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{
                      duration: 0.55,
                      delay: reduce ? 0 : index * 0.06,
                      ease: EASE,
                    }}
                  >
                    <span className="inline-block font-display text-3xl font-semibold tracking-tight text-ink/80 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-accent-bright sm:text-4xl xl:text-[2.75rem]">
                      {skill}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
