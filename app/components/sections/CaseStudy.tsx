"use client";

import Link from "next/link";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  ArrowLeft,
  ArrowUpRight,
} from "lucide-react";

import {
  getNextCaseStudySlug,
  getProjectBySlug,
} from "../../lib/content/projects";

import {
  useLang,
} from "../../lib/i18n";

import {
  EASE,
} from "../../lib/motion";

import type {
  StoredProject,
} from "../../types/project";

import {
  FigmaEmbed,
} from "./FigmaEmbed";

export function CaseStudy({
  slug,
  projects,
}: {
  slug: string;
  projects: StoredProject[];
}) {
  const reduce =
    useReducedMotion();

  const {
    content,
    lang,
  } = useLang();

  const project =
    getProjectBySlug(
      projects,
      lang,
      slug,
    );

  const nextKey =
    getNextCaseStudySlug(
      projects,
      slug,
    );

  const next =
    getProjectBySlug(
      projects,
      lang,
      nextKey,
    );

  if (!project) {
    return null;
  }

  // Projects without a long-form case study still get a detail page:
  // hero, metadata, links, cover and gallery, with label fallbacks.
  const study =
    project.caseStudy;

  const labels =
    content.caseStudy;

  const overview =
    study?.overview ||
    project.description;

  const atAGlance =
    labels.atAGlance;

  const galleryLabel =
    labels.gallery;

  const nextLabel =
    labels.nextProject;

  const gallery =
    project.gallery ??
    [];

  const hasSections =
    (study?.sections.length ??
      0) > 0;

  // Problem → tech & why → results, numbered ahead of the technical sections.
  const summary = study
    ? [
        study.problem
          ? {
              id: "problem",
              label: labels.problem,
              body: (
                <p className="max-w-[75ch] text-base leading-relaxed text-ink">
                  {study.problem}
                </p>
              ),
            }
          : null,
        study.howItWorks.length > 0
          ? {
              id: "how-it-works",
              label: labels.howItWorks,
              body: (
                <ol className="space-y-2">
                  {study.howItWorks.map((step, index) => (
                    <li key={step} className="flex gap-3 text-base leading-relaxed text-ink">
                      <span aria-hidden="true" className="pt-1 font-mono text-xs text-accent">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              ),
            }
          : null,
        study.decisions.length > 0
          ? {
              id: "decisions",
              label: labels.decisions,
              body: (
                <dl className="grid gap-x-8 gap-y-5 md:grid-cols-2">
                  {study.decisions.map((item) => (
                    <div key={item.title} className="border-t border-line pt-4">
                      <dt className="text-base font-semibold text-ink">{item.title}</dt>
                      <dd className="mt-1 text-base leading-relaxed text-muted">
                        {item.description}
                      </dd>
                    </div>
                  ))}
                </dl>
              ),
            }
          : null,
        study.results.length > 0
          ? {
              id: "results",
              label: labels.results,
              body: (
                <ul className="list-disc space-y-2 pl-5 marker:text-accent">
                  {study.results.map((item) => (
                    <li key={item} className="pl-1 text-base leading-relaxed text-ink">
                      {item}
                    </li>
                  ))}
                </ul>
              ),
            }
          : null,
      ].filter((row) => row !== null)
    : [];

  const hasMeta =
    Boolean(
      project.role ||
        project.year ||
        project.fields.length ||
        project.stack.length,
    );

  const hasLinks =
    project.links.length > 0;

  const headingClass =
    "font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl";

  const sectionHeadingClass =
    "font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl";

  const metaLabelClass =
    "font-mono text-xs uppercase tracking-[0.12em] text-muted";

  return (
    <article className="container-x space-y-8 pb-8 pt-24 sm:space-y-12 sm:pb-12">
      {/* ────────────────────────────────────────────────────────────────
          HERO
      ──────────────────────────────────────────────────────────────── */}
      <header>
        <Link
          href="/#work"
          className="inline-flex min-h-11 items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft
            size={14}
            aria-hidden="true"
          />

          {
            content.nav
              .links.work
          }
        </Link>

        <motion.div
          initial={
            reduce
              ? false
              : {
                  opacity: 0,
                  y: 12,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.35,
            ease: EASE,
          }}
        >
          <h1 className="mt-4 max-w-5xl break-words font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold uppercase leading-[1.1] tracking-tight text-ink">
            {
              project.title
            }
          </h1>

          {overview ? (
            <p className="mt-4 max-w-[75ch] text-base leading-relaxed text-muted">
              {
                overview
              }
            </p>
          ) : null}
        </motion.div>

        {/* Project metadata */}
        {hasMeta ||
        hasLinks ? (
          <div
            aria-label={
              atAGlance
            }
            className="mt-6 border-t border-line pt-5"
          >
            {hasMeta ? (
              <dl className="flex flex-wrap gap-x-10 gap-y-4">
                {project.role ? (
                  <div className="min-w-0 max-w-full">
                    <dt
                      className={
                        metaLabelClass
                      }
                    >
                      {
                        labels.role
                      }
                    </dt>

                    <dd className="mt-1 break-words text-base text-ink">
                      {
                        project.role
                      }
                    </dd>
                  </div>
                ) : null}

                {project.year ? (
                  <div>
                    <dt
                      className={
                        metaLabelClass
                      }
                    >
                      {
                        labels.year
                      }
                    </dt>

                    <dd className="mt-1 text-base text-ink">
                      {
                        project.year
                      }
                    </dd>
                  </div>
                ) : null}

                {project.fields
                  .length >
                0 ? (
                  <div>
                    <dt
                      className={
                        metaLabelClass
                      }
                    >
                      {
                        labels.fields
                      }
                    </dt>

                    <dd className="mt-1 text-base text-ink">
                      {project.fields
                        .map(
                          (
                            field,
                          ) =>
                            content
                              .fields[
                              field
                            ],
                        )
                        .join(
                          " / ",
                        )}
                    </dd>
                  </div>
                ) : null}

                {project.stack
                  .length >
                0 ? (
                  <div className="w-full">
                    <dt
                      className={
                        metaLabelClass
                      }
                    >
                      {
                        labels.stack
                      }
                    </dt>

                    <dd className="mt-1">
                      <ul
                        className="flex flex-wrap gap-x-4 gap-y-1 text-base text-muted"
                        aria-label={
                          content
                            .work
                            .techAria
                        }
                      >
                        {project.stack.map(
                          (
                            tech,
                          ) => (
                            <li
                              key={
                                tech
                              }
                            >
                              {
                                tech
                              }
                            </li>
                          ),
                        )}
                      </ul>
                    </dd>
                  </div>
                ) : null}
              </dl>
            ) : null}

            {hasLinks ? (
              <div
                className={`${
                  hasMeta
                    ? "mt-4 "
                    : ""
                }flex flex-wrap items-center gap-x-6 gap-y-2`}
              >
                {project.links.map(
                  (
                    link,
                  ) => (
                    <a
                      key={
                        link.url
                      }
                      href={
                        link.url
                      }
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="Open"
                      className="inline-flex min-h-11 items-center gap-1.5 text-base font-semibold text-accent-bright transition-colors hover:text-accent"
                    >
                      {
                        link.label
                      }

                      <ArrowUpRight
                        size={
                          16
                        }
                        aria-hidden="true"
                      />
                    </a>
                  ),
                )}
              </div>
            ) : null}
          </div>
        ) : null}
      </header>

      {/* ────────────────────────────────────────────────────────────────
          COVER
      ──────────────────────────────────────────────────────────────── */}
      {project.cover ? (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              project.cover
                .src
            }
            alt={
              project.cover
                .alt
            }
            className="mx-auto block h-auto max-h-[80vh] w-auto max-w-full border border-line bg-elevated"
            loading="eager"
            fetchPriority="high"
          />

          {project.cover
            .caption ? (
            <figcaption className="mt-2 text-base text-muted">
              {
                project
                  .cover
                  .caption
              }
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      {/* ────────────────────────────────────────────────────────────────
          PROBLEM · TECH & WHY · RESULTS
      ──────────────────────────────────────────────────────────────── */}
      {summary.length > 0 ? (
        <div className="space-y-10 border-t border-line pt-8 sm:space-y-14 sm:pt-12">
          {summary.map((row, index) => (
            <section
              key={row.id}
              aria-labelledby={`cs-${row.id}`}
              className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12"
            >
              <h2
                id={`cs-${row.id}`}
                className="font-mono text-xs uppercase tracking-[0.18em] text-accent"
              >
                {`${String(index + 1).padStart(2, "0")} / ${row.label}`}
              </h2>

              <div className="min-w-0">{row.body}</div>
            </section>
          ))}
        </div>
      ) : null}

      {/* ────────────────────────────────────────────────────────────────
          LONG-FORM TECHNICAL / METHODOLOGY SECTIONS
      ──────────────────────────────────────────────────────────────── */}
      {study &&
      hasSections ? (
        <div className="space-y-14 border-t border-line pt-8 sm:space-y-20 sm:pt-12">
          {study.sections.map(
            (
              section,
              index,
            ) => (
              <motion.section
                key={
                  section.id
                }
                id={`cs-${section.id}`}
                initial={
                  reduce
                    ? false
                    : {
                        opacity:
                          0,
                        y: 18,
                      }
                }
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.12,
                }}
                transition={{
                  duration: 0.5,
                  ease: EASE,
                }}
              >
                <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
                  {/* Section index */}
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
                      {String(
                        summary.length +
                          index +
                          1,
                      ).padStart(
                        2,
                        "0",
                      )}

                      {section.kicker
                        ? ` / ${section.kicker}`
                        : ""}
                    </p>
                  </div>

                  {/* Section content */}
                  <div className="min-w-0">
                    <h2
                      className={
                        sectionHeadingClass
                      }
                    >
                      {
                        section.heading
                      }
                    </h2>

                    {section.paragraphs
                      .length >
                    0 ? (
                      <div className="mt-5 max-w-[78ch] space-y-4">
                        {section.paragraphs.map(
                          (
                            paragraph,
                          ) => (
                            <p
                              key={
                                paragraph
                              }
                              className="text-base leading-relaxed text-muted"
                            >
                              {
                                paragraph
                              }
                            </p>
                          ),
                        )}
                      </div>
                    ) : null}

                    {/* Technical facts */}
                    {section.facts
                      .length >
                    0 ? (
                      <dl className="mt-7 grid overflow-hidden border border-line sm:grid-cols-2 xl:grid-cols-3">
                        {section.facts.map(
                          (
                            fact,
                          ) => (
                            <div
                              key={`${fact.label}-${fact.value}`}
                              className="border-b border-line p-4 last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 xl:[&:nth-child(2n)]:border-r xl:[&:nth-child(3n)]:border-r-0"
                            >
                              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                                {
                                  fact.label
                                }
                              </dt>

                              <dd className="mt-2 break-words text-base font-medium leading-relaxed text-ink">
                                {
                                  fact.value
                                }
                              </dd>
                            </div>
                          ),
                        )}
                      </dl>
                    ) : null}

                    {/* Detailed items */}
                    {section.items
                      .length >
                    0 ? (
                      <ul className="mt-7 grid gap-x-8 gap-y-6 md:grid-cols-2">
                        {section.items.map(
                          (
                            item,
                          ) => (
                            <li
                              key={
                                item.title
                              }
                              className="border-t border-line pt-4"
                            >
                              <h3 className="text-base font-semibold text-ink">
                                {
                                  item.title
                                }
                              </h3>

                              {item.description ? (
                                <p className="mt-2 text-base leading-relaxed text-muted">
                                  {
                                    item.description
                                  }
                                </p>
                              ) : null}
                            </li>
                          ),
                        )}
                      </ul>
                    ) : null}

                    {/* Important interpretation / caveat */}
                    {section.note ? (
                      <aside className="mt-7 max-w-[78ch] border-l-2 border-accent/70 pl-5">
                        <p className="text-sm leading-relaxed text-ink/85">
                          {
                            section.note
                          }
                        </p>
                      </aside>
                    ) : null}
                  </div>
                </div>
              </motion.section>
            ),
          )}
        </div>
      ) : null}

      {/* ────────────────────────────────────────────────────────────────
          FIGMA EMBED
      ──────────────────────────────────────────────────────────────── */}
      {project.figmaEmbed ? (
        <FigmaEmbed
          embed={
            project.figmaEmbed
          }
          labels={
            labels
          }
          headingClass={
            headingClass
          }
        />
      ) : null}

      {/* ────────────────────────────────────────────────────────────────
          GALLERY
      ──────────────────────────────────────────────────────────────── */}
      {gallery.length >
      0 ? (
        <section
          aria-labelledby="cs-gallery"
          className="border-t border-line pt-8 sm:pt-12"
        >
          <div className="flex items-baseline justify-between gap-4">
            <h2
              id="cs-gallery"
              className={
                headingClass
              }
            >
              {
                galleryLabel
              }
            </h2>

            <p
              className={
                metaLabelClass
              }
              aria-hidden="true"
            >
              {String(
                gallery.length,
              ).padStart(
                2,
                "0",
              )}
            </p>
          </div>

          {/* Masonry columns so every image keeps its own aspect ratio */}
          <div className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {gallery.map(
              (
                media,
                index,
              ) => (
                <motion.figure
                  key={
                    media.src
                  }
                  initial={
                    reduce
                      ? false
                      : {
                          opacity:
                            0,
                          y: 16,
                        }
                  }
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: EASE,
                    delay:
                      reduce
                        ? 0
                        : (
                            index %
                            3
                          ) *
                          0.06,
                  }}
                  className={`group mb-4 min-w-0 break-inside-avoid ${
                    index ===
                    0
                      ? "[column-span:all]"
                      : ""
                  }`}
                >
                  {media.type ===
                  "embed" ? (
                    <div
                      className="relative w-full overflow-hidden border border-line bg-elevated"
                      style={{
                        aspectRatio:
                          media.aspect ??
                          "16 / 9",
                      }}
                    >
                      <iframe
                        src={
                          media.src
                        }
                        title={
                          media.alt
                        }
                        loading="lazy"
                        allow="autoplay; fullscreen"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full"
                      />
                    </div>
                  ) : (
                  <a
                    href={
                      media.src
                    }
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${labels.openImage}: ${media.alt}`}
                    className={`block overflow-hidden border border-line bg-elevated ${
                      index ===
                      0
                        ? "mx-auto w-fit max-w-full"
                        : ""
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        media.src
                      }
                      alt={
                        media.alt
                      }
                      loading="lazy"
                      className={`block h-auto transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03] ${
                        index ===
                        0
                          ? "max-h-[80vh] w-auto max-w-full"
                          : "w-full"
                      }`}
                    />
                  </a>
                  )}

                  {media.caption ? (
                    <figcaption className="mt-2 text-base leading-relaxed text-muted">
                      {
                        media.caption
                      }
                    </figcaption>
                  ) : null}
                </motion.figure>
              ),
            )}
          </div>
        </section>
      ) : null}

      {/* ────────────────────────────────────────────────────────────────
          NEXT PROJECT
      ──────────────────────────────────────────────────────────────── */}
      {next &&
      nextKey !==
        slug ? (
        <nav
          aria-label={
            nextLabel
          }
          className="border-t border-line pt-6"
        >
          <Link
            href={`/work/${nextKey}`}
            data-cursor="Open"
            aria-label={`${nextLabel}: ${next.title}`}
            className="flex items-center justify-between gap-6 py-2 text-ink transition-colors hover:text-accent-bright"
          >
            <div className="min-w-0">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                {
                  nextLabel
                }
              </p>

              <p className="mt-2 break-words font-display text-xl font-semibold leading-snug sm:text-2xl">
                {
                  next.title
                }
              </p>
            </div>

            <ArrowUpRight
              size={28}
              aria-hidden="true"
              className="shrink-0 text-accent"
            />
          </Link>
        </nav>
      ) : null}
    </article>
  );
}