"use client";

import Link from "next/link";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  ArrowLeft,
  ArrowUpRight,
  ChevronDown,
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

  if (
    !project?.caseStudy
  ) {
    return null;
  }

  const study =
    project.caseStudy;

  const labels =
    content.caseStudy;

  const gallery =
    project.gallery ??
    [];

  const hasFeatures =
    study.features.items.length >
    0;

  const hasOutcomes =
    study.outcomes.items.length >
    0;

  const hasSections =
    study.sections.length >
    0;

  const hasChallenge =
    Boolean(
      study.challenge.lead ||
        study.challenge.body,
    );

  const hasApproach =
    study.approach.steps.length >
    0;

  const hasMeta =
    Boolean(
      project.role ||
        project.year ||
        project.fields.length ||
        project.stack.length,
    );

  const hasLinks =
    project.confidentiality !==
      "public" ||
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

          {study.overview ? (
            <p className="mt-4 max-w-[75ch] text-base leading-relaxed text-muted">
              {
                study.overview
              }
            </p>
          ) : null}
        </motion.div>

        {/* Project metadata */}
        {hasMeta ||
        hasLinks ? (
          <div
            aria-label={
              study.atAGlance
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
                {project.confidentiality !==
                "public" ? (
                  <p className="text-base leading-relaxed text-muted">
                    {
                      content
                        .work
                        .confidentialNote
                    }
                  </p>
                ) : null}

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
            className="aspect-video max-h-[420px] w-full border border-line bg-elevated object-contain"
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
          WHAT SHIPPED + OUTCOMES
      ──────────────────────────────────────────────────────────────── */}
      {hasFeatures ||
      hasOutcomes ? (
        <div
          className={`grid gap-8 border-t border-line pt-8 sm:gap-12 sm:pt-12 ${
            hasFeatures &&
            hasOutcomes
              ? "lg:grid-cols-[1.2fr_1fr]"
              : ""
          }`}
        >
          {hasFeatures ? (
            <section
              aria-labelledby="cs-features"
              className="min-w-0"
            >
              <h2
                id="cs-features"
                className={
                  headingClass
                }
              >
                {
                  study
                    .features
                    .heading
                }
              </h2>

              <ul className="mt-5 space-y-4">
                {study.features.items.map(
                  (
                    feature,
                  ) => (
                    <li
                      key={
                        feature.title
                      }
                    >
                      <h3 className="text-base font-semibold text-ink">
                        {
                          feature.title
                        }
                      </h3>

                      {feature.description ? (
                        <p className="mt-1 text-base leading-relaxed text-muted">
                          {
                            feature.description
                          }
                        </p>
                      ) : null}
                    </li>
                  ),
                )}
              </ul>
            </section>
          ) : null}

          {hasOutcomes ? (
            <section
              aria-labelledby="cs-outcomes"
              className="min-w-0"
            >
              <h2
                id="cs-outcomes"
                className={
                  headingClass
                }
              >
                {
                  study
                    .outcomes
                    .heading
                }
              </h2>

              <ul className="mt-5 list-disc space-y-3 pl-5 marker:text-accent">
                {study.outcomes.items.map(
                  (
                    outcome,
                  ) => (
                    <li
                      key={
                        outcome
                      }
                      className="pl-1 text-base leading-relaxed text-ink"
                    >
                      {
                        outcome
                      }
                    </li>
                  ),
                )}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}

      {/* ────────────────────────────────────────────────────────────────
          LONG-FORM TECHNICAL / METHODOLOGY SECTIONS
      ──────────────────────────────────────────────────────────────── */}
      {hasSections ? (
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
          PROCESS DETAILS
      ──────────────────────────────────────────────────────────────── */}
      {hasChallenge ||
      hasApproach ? (
        <details
          key={slug}
          className="group border-y border-line"
        >
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-semibold text-ink transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
            {
              labels.processDetails
            }

            <ChevronDown
              size={20}
              aria-hidden="true"
              className="shrink-0 group-open:rotate-180 motion-safe:transition-transform"
            />
          </summary>

          <div className="space-y-8 pb-6 pt-2">
            {hasChallenge ? (
              <section
                aria-labelledby="cs-challenge"
                className="max-w-[75ch]"
              >
                <h2
                  id="cs-challenge"
                  className={
                    headingClass
                  }
                >
                  {
                    study
                      .challenge
                      .heading
                  }
                </h2>

                {study.challenge
                  .lead ? (
                  <p className="mt-3 text-base leading-relaxed text-ink">
                    {
                      study
                        .challenge
                        .lead
                    }
                  </p>
                ) : null}

                {study.challenge
                  .body ? (
                  <p className="mt-3 text-base leading-relaxed text-muted">
                    {
                      study
                        .challenge
                        .body
                    }
                  </p>
                ) : null}
              </section>
            ) : null}

            {hasApproach ? (
              <section
                aria-labelledby="cs-approach"
              >
                <h2
                  id="cs-approach"
                  className={
                    headingClass
                  }
                >
                  {
                    study
                      .approach
                      .heading
                  }
                </h2>

                <ol className="mt-5 grid gap-5 md:grid-cols-2">
                  {study.approach.steps.map(
                    (
                      step,
                    ) => (
                      <li
                        key={
                          step.title
                        }
                      >
                        {step.tag ? (
                          <p className="mb-1 text-base text-accent">
                            {
                              step.tag
                            }
                          </p>
                        ) : null}

                        <h3 className="text-base font-semibold text-ink">
                          {
                            step.title
                          }
                        </h3>

                        {step.description ? (
                          <p className="mt-2 max-w-[65ch] text-base leading-relaxed text-muted">
                            {
                              step.description
                            }
                          </p>
                        ) : null}
                      </li>
                    ),
                  )}
                </ol>
              </section>
            ) : null}
          </div>
        </details>
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
                study.galleryLabel
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

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  className={`group min-w-0 ${
                    index ===
                    0
                      ? "sm:col-span-2 lg:col-span-3"
                      : ""
                  }`}
                >
                  <a
                    href={
                      media.src
                    }
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${labels.openImage}: ${media.alt}`}
                    className="block overflow-hidden border border-line bg-elevated"
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
                      className={`w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03] ${
                        index ===
                        0
                          ? "aspect-[16/9] sm:aspect-[21/9]"
                          : "aspect-[4/3]"
                      }`}
                    />
                  </a>

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
            study.nextLabel
          }
          className="border-t border-line pt-6"
        >
          <Link
            href={`/work/${nextKey}`}
            data-cursor="Open"
            aria-label={`${study.nextLabel}: ${next.title}`}
            className="flex items-center justify-between gap-6 py-2 text-ink transition-colors hover:text-accent-bright"
          >
            <div className="min-w-0">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                {
                  study.nextLabel
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