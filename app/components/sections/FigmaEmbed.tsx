"use client";

import {
  ArrowUpRight,
} from "lucide-react";

import type {
  ProjectView,
} from "../../lib/content/projects";

type Labels = {
  figmaHeading: string;
  figmaHint: string;
  figmaOpen: string;
};

/**
 * Interactive Figma file embedded in the case study.
 *
 * `loading="lazy"` defers the Figma viewer (several MB) until the
 * section approaches the viewport.
 */
export function FigmaEmbed({
  embed,
  labels,
  headingClass,
}: {
  embed: NonNullable<
    ProjectView["figmaEmbed"]
  >;
  labels: Labels;
  headingClass: string;
}) {
  return (
    <section
      aria-labelledby="cs-figma"
      className="border-t border-line pt-8 sm:pt-12"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h2
          id="cs-figma"
          className={
            headingClass
          }
        >
          {
            labels.figmaHeading
          }
        </h2>

        <a
          href={
            embed.url
          }
          target="_blank"
          rel="noreferrer"
          data-cursor="Open"
          className="inline-flex min-h-11 items-center gap-1.5 text-base font-semibold text-accent-bright transition-colors hover:text-accent"
        >
          {
            labels.figmaOpen
          }

          <ArrowUpRight
            size={16}
            aria-hidden="true"
          />
        </a>
      </div>

      <figure className="mt-6">
        <div className="relative aspect-[4/3] w-full overflow-hidden border border-line bg-elevated sm:aspect-video">
          <iframe
            src={
              embed.src
            }
            title={
              embed.title
            }
            loading="lazy"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>

        <figcaption className="mt-2 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          {embed.caption ? (
            <span className="text-base leading-relaxed text-muted">
              {
                embed.caption
              }
            </span>
          ) : null}

          <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted">
            {
              labels.figmaHint
            }
          </span>
        </figcaption>
      </figure>
    </section>
  );
}
