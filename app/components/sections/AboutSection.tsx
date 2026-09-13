"use client";

import Image from "next/image";

import {
  ArrowUpRight,
  Play,
} from "lucide-react";

import {
  visualJournal,
} from "../../content/profile";

import {
  useLang,
} from "../../lib/i18n";

export function AboutSection() {
  const {
    content,
    lang,
  } = useLang();

  const {
    photos = [],
    video,
    youtube,
  } = visualJournal;

  /**
   * The design is intentionally built around up to
   * three editorial images.
   *
   * Extra images can be supported later as a gallery.
   */
  const primaryPhoto =
    photos[0];

  const secondaryPhotos =
    photos.slice(
      1,
      3,
    );

  const hasPhotos =
    photos.length > 0;

  const hasDirectVideo =
    Boolean(
      video?.src,
    );

  const hasYoutubeEmbed =
    Boolean(
      youtube?.id,
    );

  const hasYoutubeLink =
    Boolean(
      youtube?.url,
    );

  const hasPlayableVideo =
    hasDirectVideo ||
    hasYoutubeEmbed;

  const hasMedia =
    hasPhotos ||
    hasPlayableVideo ||
    hasYoutubeLink;

  const videoTitle =
    video?.title?.[lang] ??
    youtube?.title?.[lang] ??
    content.about.mediaLabel ??
    "Visual journal";

  return (
    <section
      id="about"
      aria-label={
        content.about
          .ariaSection
      }
      className="border-t border-line"
    >
      <div className="container-x py-24 sm:py-32">
        {/* ────────────────────────────────────────────────────────────────
            INTRO
        ──────────────────────────────────────────────────────────────── */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            {content.about
              .kicker ? (
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
                {
                  content.about
                    .kicker
                }
              </p>
            ) : null}

            {content.about
              .heading ? (
              <h2 className="mt-4 max-w-xl font-display text-section font-semibold leading-[0.95] tracking-tight text-ink sm:text-title">
                {
                  content.about
                    .heading
                }
              </h2>
            ) : null}
          </div>

          {content.about
            .paragraphs
            ?.length ? (
            <div className="lg:col-span-7 lg:col-start-6">
              {content.about.paragraphs.map(
                (
                  paragraph,
                  index,
                ) => (
                  <p
                    key={`${index}-${paragraph.slice(
                      0,
                      24,
                    )}`}
                    className="mt-6 max-w-[65ch] text-base leading-relaxed text-muted first:mt-0 sm:text-lg"
                  >
                    {
                      paragraph
                    }
                  </p>
                ),
              )}
            </div>
          ) : null}
        </div>

        {/* ────────────────────────────────────────────────────────────────
            MEDIA
        ──────────────────────────────────────────────────────────────── */}
        {hasMedia ? (
          <div className="mt-16 sm:mt-24">
            {content.about
              .mediaLabel ? (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
                {/* <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                  {
                    content.about
                      .mediaLabel
                  }
                </p>

                <p
                  aria-hidden="true"
                  className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted/60"
                >
                  Photo / Video
                </p> */}
              </div>
            ) : null}

            {/* ────────────────────────────────────────────────────────────
                PHOTOS

                Desktop with 3 photos:

                ┌─────────────────┬───────────────┐
                │                 │   photo 02    │
                │    photo 01     ├───────────────┤
                │                 │   photo 03    │
                └─────────────────┴───────────────┘

                With only one photo it becomes full width.
            ──────────────────────────────────────────────────────────── */}
            {primaryPhoto ? (
              <div className="grid gap-4 md:grid-cols-12">
                <figure
                  className={
                    secondaryPhotos.length >
                      0
                      ? "group md:col-span-7"
                      : "group md:col-span-12"
                  }
                >
                  <div
                    className={
                      secondaryPhotos.length >
                        0
                        ? "relative aspect-[4/5] overflow-hidden bg-elevated"
                        : "relative aspect-[16/9] overflow-hidden bg-elevated"
                    }
                  >
                    <Image
                      src={
                        primaryPhoto.src
                      }
                      alt={
                        primaryPhoto
                          .alt[lang]
                      }
                      fill
                      sizes={
                        secondaryPhotos.length >
                          0
                          ? "(min-width: 768px) 58vw, 100vw"
                          : "100vw"
                      }
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                    />
                  </div>

                  {primaryPhoto
                    .caption ? (
                    <figcaption className="mt-2 text-sm leading-relaxed text-muted">
                      {
                        primaryPhoto
                          .caption[
                        lang
                        ]
                      }
                    </figcaption>
                  ) : null}
                </figure>

                {secondaryPhotos.length >
                  0 ? (
                  <div className="grid content-start gap-4 md:col-span-5">
                    {secondaryPhotos.map(
                      (
                        photo,
                        index,
                      ) => (
                        <figure
                          key={
                            photo.src
                          }
                          className="group"
                        >
                          <div className="relative aspect-[4/3] overflow-hidden bg-elevated">
                            <Image
                              src={
                                photo.src
                              }
                              alt={
                                photo
                                  .alt[
                                lang
                                ]
                              }
                              fill
                              sizes="(min-width: 768px) 42vw, 100vw"
                              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                            />
                          </div>

                          {photo.caption ? (
                            <figcaption className="mt-2 text-sm leading-relaxed text-muted">
                              {
                                photo
                                  .caption[
                                lang
                                ]
                              }
                            </figcaption>
                          ) : null}

                          <span className="sr-only">
                            Photo{" "}
                            {
                              index +
                              2
                            }
                          </span>
                        </figure>
                      ),
                    )}
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* ────────────────────────────────────────────────────────────
                VIDEO
            ──────────────────────────────────────────────────────────── */}
            {hasPlayableVideo ? (
              <div
                className={
                  hasPhotos
                    ? "mt-4"
                    : ""
                }
              >
                <div className="group relative aspect-video overflow-hidden border border-line/60 bg-elevated">
                  {hasDirectVideo &&
                    video ? (
                    <video
                      controls
                      playsInline
                      preload="metadata"
                      poster={
                        video.poster
                      }
                      className="h-full w-full object-cover"
                    >
                      <source
                        src={
                          video.src
                        }
                        type="video/mp4"
                      />

                      Your browser
                      does not support
                      video playback.
                    </video>
                  ) : hasYoutubeEmbed &&
                    youtube?.id ? (
                    <iframe
                      src={`https://www.youtube.com/embed/nhUbSx-ovoU?si=rZd66amkgkFXvGeq`}
                      title={
                        videoTitle
                      }
                      loading="lazy"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full border-0"
                    />
                  ) : null}

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-night/55 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white backdrop-blur-md"
                  >
                    <Play
                      size={11}
                    />

                    <span>
                      Visual
                      journal
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            {/* ────────────────────────────────────────────────────────────
                YOUTUBE LINK

                Works with:
                - YouTube embed
                - direct MP4 + external YouTube link
                - link only, no embedded player
            ──────────────────────────────────────────────────────────── */}
            {hasYoutubeLink &&
              youtube?.url &&
              content.about
                .youtubeCta ? (
              <div className="mt-5 flex justify-end">
                <a
                  href={
                    youtube.url
                  }
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="Open"
                  className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-accent-bright"
                >
                  <span className="relative">
                    {
                      content
                        .about
                        .youtubeCta
                    }

                    <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
                  </span>

                  <ArrowUpRight
                    size={15}
                    aria-hidden="true"
                    className="text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}