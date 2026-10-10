"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import clsx from "clsx";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import { visualJournal, type JournalFilm } from "../../content/profile";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useLang } from "../../lib/i18n";
import { DUR, EASE } from "../../lib/motion";

/**
 * "Outside the code" - a darkroom table.
 *
 * Prints from `visualJournal.photos` are scattered over the oversized heading
 * and can be dragged around (fine pointers only, so touch scrolling is never
 * hijacked). Films below are click-to-load YouTube facades: no iframe cost
 * until the visitor asks for it.
 */

// shortcut: three fixed print slots with fixed aspect ratios (portrait, landscape, landscape);
// extra photos are ignored and other orientations get cropped. Add slots if the journal grows.
const PRINTS = [
  { pos: "left-[2%] top-[3%] w-[46%] md:left-[3%] md:top-[6%] md:w-[21%]", aspect: "aspect-[3/4]", rotate: -5 },
  { pos: "right-[2%] top-[24%] w-[58%] md:right-auto md:left-[35%] md:top-[47%] md:w-[30%]", aspect: "aspect-[4/3]", rotate: 3 },
  { pos: "left-[6%] top-[60%] w-[66%] md:left-auto md:right-[3%] md:top-[3%] md:w-[28%]", aspect: "aspect-[4/3]", rotate: -2 },
] as const;

export function AboutSection() {
  const { content, lang } = useLang();
  const reduce = useReducedMotion();
  const canDrag = useMediaQuery("(pointer: fine) and (min-width: 768px)");
  const tableRef = useRef<HTMLDivElement>(null);
  const photos = (visualJournal.photos ?? []).slice(0, PRINTS.length);
  // Last-touched print renders on top.
  const [stack, setStack] = useState(() => photos.map((_, i) => i));
  const raise = (i: number) => setStack((s) => [...s.filter((x) => x !== i), i]);

  return (
    <section id="about" aria-label={content.about.ariaSection} className="relative overflow-hidden border-t border-line py-24 sm:py-36">
      <div className="container-x">
        <div className="flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.25em]">
          {content.about.kicker ? <p className="text-accent">{content.about.kicker}</p> : <span />}
          {canDrag && photos.length > 0 ? <p aria-hidden="true" className="text-muted">Drag the prints</p> : null}
        </div>

        {/* The table: on md+ the heading sits underneath the prints; on mobile it stacks above them */}
        <div className="relative mt-8 md:aspect-[2/1]">
          {content.about.heading ? (
            <h2 className="pointer-events-none mb-10 select-none md:absolute md:inset-x-0 md:top-1/2 md:mb-0 md:-translate-y-1/2 md:text-center font-display text-hero font-semibold leading-[0.85] tracking-tighter text-ink [text-wrap:balance]">
              {content.about.heading}
            </h2>
          ) : null}

          <div ref={tableRef} className="relative aspect-[4/5] md:absolute md:inset-0 md:aspect-auto">
            {photos.map((photo, i) => {
              const print = PRINTS[i];
              return (
                <motion.figure
                  key={photo.src}
                  drag={canDrag}
                  dragConstraints={tableRef}
                  dragElastic={0.12}
                  dragMomentum={false}
                  onPointerDown={() => raise(i)}
                  whileDrag={{ scale: 1.04, rotate: 0 }}
                  initial={reduce ? { rotate: print.rotate } : { opacity: 0, y: 80, rotate: 0 }}
                  whileInView={{ opacity: 1, y: 0, rotate: print.rotate }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: DUR.slow, delay: i * 0.12, ease: EASE }}
                  style={{ zIndex: stack.indexOf(i) + 1 }}
                  data-cursor={canDrag ? "Drag" : undefined}
                  className={clsx(
                    "absolute m-0 bg-ink p-1.5 pb-0 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] sm:p-2.5 sm:pb-0",
                    canDrag && "cursor-grab active:cursor-grabbing",
                    print.pos,
                  )}
                >
                  <div className={clsx("relative overflow-hidden bg-elevated", print.aspect)}>
                    <Image
                      src={photo.src}
                      alt={photo.alt[lang]}
                      fill
                      draggable={false}
                      sizes="(min-width: 768px) 30vw, 60vw"
                      className="pointer-events-none object-cover"
                    />
                  </div>
                  <figcaption className="flex items-center justify-between gap-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-night sm:py-3 sm:text-[10px]">
                    <span className="truncate">{(photo.caption ?? photo.alt)[lang]}</span>
                    <span className="shrink-0 opacity-50">{String(i + 1).padStart(2, "0")}</span>
                  </figcaption>
                </motion.figure>
              );
            })}
          </div>
        </div>

        {content.about.paragraphs?.length ? (
          <div className="mt-20 grid gap-8 sm:mt-28 md:grid-cols-12">
            <span aria-hidden="true" className="hidden font-mono text-[11px] tracking-[0.25em] text-muted md:col-span-3 md:block">
              ( {lang === "ja" ? "記録について" : "on keeping"} )
            </span>
            <div className="grid gap-6 md:col-span-9 md:grid-cols-2 md:gap-10">
              {content.about.paragraphs.map((paragraph, i) => (
                <p key={i} className={clsx("text-base leading-relaxed text-muted sm:text-lg", i === 0 && "text-ink")}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ) : null}

        <Films films={visualJournal.films ?? []} />
      </div>
    </section>
  );
}

function Films({ films }: { films: JournalFilm[] }) {
  const { lang } = useLang();
  if (films.length === 0) return null;
  let landscapes = 0;

  return (
    <div className="mt-24 sm:mt-36">
      <div className="flex items-baseline justify-between border-b border-line pb-4 font-mono text-[11px] uppercase tracking-[0.25em]">
        <p className="text-accent">{lang === "ja" ? "映像" : "Films"}</p>
        <p className="text-muted">{String(films.length).padStart(2, "0")}</p>
      </div>

      {/* 16:9 spans 9 cols, 9:16 spans 3 - near-equal heights, so any mix of
          orientations packs into rows; every second landscape shifts right. */}
      <div className="mt-10 grid grid-flow-dense items-start gap-x-6 gap-y-16 md:grid-cols-12">
        {films.map((film, i) => {
          const portrait = film.orientation === "portrait";
          const shift = !portrait && landscapes++ % 2 === 1;
          return (
            <FilmCard
              key={film.youtubeId ?? film.src ?? i}
              film={film}
              index={i}
              className={portrait ? "mx-auto w-3/4 md:col-span-3 md:mx-0 md:w-auto" : clsx("md:col-span-9", shift && "md:col-start-4")}
            />
          );
        })}
      </div>
    </div>
  );
}

function FilmCard({ film, index, className }: { film: JournalFilm; index: number; className: string }) {
  const { content, lang } = useLang();
  const [playing, setPlaying] = useState(false);
  const portrait = film.orientation === "portrait";
  const title = film.title[lang];
  const id = film.youtubeId;
  const youtubeUrl = id ? (portrait ? `https://www.youtube.com/shorts/${id}` : `https://www.youtube.com/watch?v=${id}`) : null;
  const thumb = film.poster ?? (id ? `https://i.ytimg.com/vi/${id}/${portrait ? "oardefault" : "maxresdefault"}.jpg` : undefined);

  return (
    <figure className={clsx("m-0 min-w-0", className)}>
      <div className={clsx("relative overflow-hidden bg-elevated", portrait ? "aspect-[9/16]" : "aspect-video")}>
        {film.src ? (
          <video controls playsInline preload="metadata" poster={film.poster} className="h-full w-full object-cover">
            <source src={film.src} type="video/mp4" />
          </video>
        ) : id && playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : id ? (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            data-cursor="Play"
            aria-label={`Play ${title}`}
            className="group absolute inset-0 h-full w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumb}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
              }}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-70 transition-[transform,opacity] duration-[1.2s] ease-[var(--ease-signature)] group-hover:scale-[1.03] group-hover:opacity-90"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night/80 via-transparent to-night/30" />
            <PlayDisc />
          </button>
        ) : null}
      </div>

      <figcaption className="mt-4 flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
          {String(index + 1).padStart(2, "0")} / {portrait ? "9:16" : "16:9"}
        </span>
        <span className={clsx("font-display font-semibold leading-[1.05] tracking-tight text-ink", portrait ? "text-lg" : "text-[clamp(1.4rem,2.4vw,2.25rem)]")}>
          {title}
        </span>
        {youtubeUrl && content.about.youtubeCta ? (
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noreferrer"
            data-cursor="Open"
            className="group inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-ink transition-colors hover:text-accent-bright"
          >
            {content.about.youtubeCta}
            <ArrowUpRight size={15} aria-hidden="true" className="text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        ) : null}
      </figcaption>
    </figure>
  );
}

/** Spinning circular label around a play glyph. */
function PlayDisc() {
  const pathId = useId();
  return (
    <span aria-hidden="true" className="absolute left-1/2 top-1/2 flex size-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:size-40">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-[spin_14s_linear_infinite] motion-reduce:animate-none">
        <defs>
          <path id={pathId} d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" />
        </defs>
        <text className="fill-ink font-mono text-[8.5px] uppercase tracking-[0.3em]">
          <textPath href={`#${pathId}`}>Play the film · Play the film · </textPath>
        </text>
      </svg>
      <span className="flex size-14 items-center justify-center rounded-full bg-accent text-on-accent transition-transform duration-500 ease-[var(--ease-signature)] group-hover:scale-110 sm:size-20">
        <Play className="ml-1 size-5 fill-current sm:size-7" />
      </span>
    </span>
  );
}
