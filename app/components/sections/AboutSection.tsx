"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import {
  heroImages,
  interestOrder,
  type InterestKey,
} from "../../lib/data";
import { useLang } from "../../lib/i18n";

/**
 * About as an interactive identity sheet: a sticky portrait on one side,
 * biography and an interest index on the other. Hovering (or focusing, or
 * tapping) an interest highlights the row; the portrait stays the real photo
 * (interest tiles are typographic - no stock photography).
 */
export function AboutSection() {
  const { content } = useLang();
  const [activeKey, setActiveKey] = useState<InterestKey | null>(null);

  return (
    <section
      id="about"
      aria-label={content.about.ariaSection}
      className="border-t border-line"
    >
      <div className="container-x py-24 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          {/* Sticky portrait frame */}
          <div className="order-first lg:order-none">
            <div className="sticky top-24 overflow-hidden border border-line/60 bg-elevated">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={heroImages.base}
                  alt="Portrait of Faris Znafis"
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-linear-to-t from-night/40 to-transparent"
                />
              </div>
            </div>
          </div>

          {/* Biography + interest index */}
          <div>
            <h2 className="font-display text-section font-semibold tracking-tight text-ink sm:text-title sm:max-w-xl">
              {content.about.heading}
            </h2>

            {content.about.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="mt-5 max-w-2xl leading-relaxed text-muted first:mt-8"
              >
                {paragraph}
              </p>
            ))}

            <blockquote className="mt-10 max-w-xl border-l-2 border-accent/70 pl-6 text-lede italic leading-relaxed text-ink/90 [text-wrap:balance]">
              {content.about.quote}
            </blockquote>

            <p className="mt-14 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
              {content.about.interestsIntro}
            </p>
            <ul className="mt-4 divide-y divide-line border-t border-line">
              {interestOrder.map((key, index) => {
                const label = content.about.interests[key].label;
                const isActive = activeKey === key;
                return (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => setActiveKey((prev) => (prev === key ? null : key))}
                      onMouseEnter={() => setActiveKey(key)}
                      onMouseLeave={() => setActiveKey(null)}
                      onFocus={() => setActiveKey(key)}
                      onBlur={() => setActiveKey(null)}
                      aria-pressed={isActive}
                      data-cursor="Peek"
                      className="group flex w-full items-baseline gap-5 py-4 text-left"
                    >
                      <span className="font-mono text-xs text-accent">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={clsx(
                          "font-display text-2xl font-semibold tracking-tight transition-colors duration-300 sm:text-3xl",
                          isActive ? "text-accent-bright" : "text-ink group-hover:text-accent-bright",
                        )}
                      >
                        {label}
                      </span>
                      <ArrowUpRight
                        size={16}
                        aria-hidden="true"
                        className={clsx(
                          "ml-auto self-center transition-all duration-300",
                          isActive ? "text-accent opacity-100" : "opacity-0 group-hover:opacity-60",
                        )}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}