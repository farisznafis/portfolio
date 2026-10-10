"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import CoverImage from "../ui/CoverImage";
import {
  certificateImage,
  certificates,
  type Certificate,
  type CertificateKind,
} from "../../content/certificates";
import type { Lang } from "../../types/common";
import { useLang } from "../../lib/i18n";
import { EASE } from "../../lib/motion";

type Filter = "all" | CertificateKind;
const FILTERS: Filter[] = ["all", "award", "specialization", "course"];

// timeZone UTC: ISO dates parse as UTC midnight, local time could shift the month.
const formatDate = (date: string, lang: Lang) =>
  date.length === 4
    ? date
    : new Intl.DateTimeFormat(lang, { year: "numeric", month: "short", timeZone: "UTC" }).format(
        new Date(date),
      );

/**
 * The /certificates archive. Awards and specializations take wide tiles,
 * courses sit three to a row; labels live under the frame, gallery-style.
 * Clicking a tile opens the full certificate in a native <dialog>
 * (Escape, focus return and top-layer stacking come for free).
 */
export function CertificatesIndex({ initialId }: { initialId?: string }) {
  const reduce = useReducedMotion();
  const { content, lang } = useLang();
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState<Certificate | null>(
    () => certificates.find((c) => c.id === initialId) ?? null,
  );
  const dialogRef = useRef<HTMLDialogElement>(null);

  const filtered = useMemo(
    () => (filter === "all" ? certificates : certificates.filter((c) => c.kind === filter)),
    [filter],
  );

  useEffect(() => {
    if (active) dialogRef.current?.showModal();
  }, [active]);

  const t = content.certificates;

  return (
    <section aria-label={t.ariaSection} className="container-x pb-28 pt-32 sm:pt-40">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
        {t.ariaSection}
      </p>
      <h1 className="mt-4 font-display text-display font-semibold uppercase leading-[0.9] tracking-tight text-ink">
        {t.heading}
      </h1>
      <p className="mt-6 max-w-2xl text-lede leading-relaxed text-muted">{t.blurb}</p>

      <div role="group" aria-label={t.filterAria} className="mt-12 flex flex-wrap gap-2">
        {FILTERS.map((option) => {
          const isActive = filter === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              aria-pressed={isActive}
              className={clsx(
                "rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] transition-colors active:scale-[0.98]",
                isActive
                  ? "border-accent bg-accent text-on-accent"
                  : "border-line bg-white/[0.03] text-muted hover:border-accent/50 hover:text-ink",
              )}
            >
              {t.filters[option]}
            </button>
          );
        })}
      </div>

      <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-muted">
        {t.countLabel.replace("{count}", String(filtered.length).padStart(2, "0"))}
      </p>

      <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-12 border-t border-line pt-10 sm:grid-cols-2 md:grid-cols-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((cert, index) => (
            <motion.li
              key={cert.id}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: Math.min((index % 6) * 0.05, 0.25), ease: EASE }}
              className={cert.kind === "course" ? "md:col-span-2" : "sm:col-span-2 md:col-span-3"}
            >
              <button
                type="button"
                onClick={() => setActive(cert)}
                aria-label={t.openAria.replace("{title}", cert.title)}
                data-cursor="View"
                className="group block w-full text-left"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden border border-line/60 bg-elevated">
                  <CoverImage
                    src={certificateImage(cert.id)}
                    alt=""
                    sizes={
                      cert.kind === "course"
                        ? "(min-width: 768px) 30vw, (min-width: 640px) 50vw, 100vw"
                        : "(min-width: 768px) 46vw, 100vw"
                    }
                    className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-4 flex items-baseline gap-4">
                  <span
                    className={clsx(
                      "font-mono text-xs",
                      cert.kind === "award" ? "text-amber" : "text-accent",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h2
                      className={clsx(
                        "font-display font-semibold tracking-tight text-ink transition-colors duration-300 group-hover:text-accent-bright",
                        cert.kind === "course" ? "text-base sm:text-lg" : "text-xl sm:text-2xl",
                      )}
                    >
                      {cert.title}
                    </h2>
                    <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                      {cert.issuer} · {formatDate(cert.date, lang)}
                    </p>
                  </div>
                </div>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <dialog
        ref={dialogRef}
        data-lenis-prevent
        onClose={() => {
          setActive(null);
          // Drop the ?c= deep link so a refresh doesn't reopen it.
          window.history.replaceState(null, "", window.location.pathname);
        }}
        onClick={(event) => event.target === event.currentTarget && event.currentTarget.close()}
        aria-label={active?.title}
        className="fixed inset-0 m-auto h-fit max-h-[92dvh] w-[min(1100px,calc(100vw-2rem))] overflow-y-auto border border-line bg-elevated p-0 text-ink backdrop:bg-night/85 backdrop:backdrop-blur-sm"
      >
        {active ? (
          <div>
            <Image
              src={certificateImage(active.id)}
              alt={active.title}
              width={1400}
              height={1082}
              sizes="(min-width: 1100px) 1100px, 100vw"
              className="h-auto max-h-[72dvh] w-full bg-white object-contain"
            />
            <div className="flex flex-wrap items-end justify-between gap-4 border-t border-line p-5 sm:p-6">
              <div className="min-w-0">
                <p className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                  {active.title}
                </p>
                <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                  {t.filters[active.kind]} · {active.issuer} · {formatDate(active.date, lang)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {active.verifyUrl ? (
                  <a
                    href={active.verifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-accent-bright transition-colors hover:text-accent"
                  >
                    {t.verifyCta}
                    <ArrowUpRight
                      size={15}
                      aria-hidden="true"
                      className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                    />
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={() => dialogRef.current?.close()}
                  aria-label={t.close}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/5 transition-colors hover:border-accent/60 hover:text-accent active:scale-[0.98]"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
