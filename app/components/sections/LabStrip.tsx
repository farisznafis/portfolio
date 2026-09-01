"use client";

import { labItems } from "../../content/profile";
import { useLang } from "../../lib/i18n";

/**
 * The lab ticker - the page's single marquee. Experiment names are proper
 * nouns shared across languages. Duplicates are aria-hidden from screen
 * readers; the animation itself collapses under reduced motion.
 */
export function LabStrip() {
  const { content } = useLang();

  return (
    <section id="lab" aria-label={content.lab.ariaSection} className="border-t border-line">
      <p className="container-x pt-12 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
        {content.lab.heading}
      </p>

      <div className="marquee relative overflow-hidden py-8">
        <h2 className="sr-only">{content.lab.heading}</h2>
        <div className="marquee-track animate-marquee flex w-max items-center gap-12">
          {[...labItems, ...labItems].map((item, index) => (
            <span
              key={`${item}-${index}`}
              aria-hidden={index >= labItems.length}
              className="flex items-center gap-12 whitespace-nowrap font-display text-2xl font-semibold tracking-tight text-ink/60 transition-colors duration-300 hover:text-accent-bright sm:text-4xl"
            >
              {item}
              <span className="text-accent" aria-hidden="true">
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
