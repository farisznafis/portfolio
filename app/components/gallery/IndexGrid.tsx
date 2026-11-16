"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { mediaUrl, photoFacts, photoHref } from "../../lib/content/gallery";
import { useLang } from "../../lib/i18n";
import type { Print } from "./plan";

const CAPTION = 34;

/**
 * Index view: every photo on one contact sheet, filterable by series, place
 * and year. Plain links and selects, so it works with a keyboard, a screen
 * reader, or no WebGL at all. Only the rows on screen are in the DOM, so it
 * stays fast with thousands of photos.
 */
export function IndexGrid({ prints, onOpen }: { prints: Print[]; onOpen(index: number): void }) {
  const { lang, content } = useLang();
  const copy = content.gallery.index;
  const host = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState({ series: "", place: "", year: "" });
  const [frame, setFrame] = useState({ width: 0, first: 0, last: 12 });

  const rows = useMemo(() => prints.map((print) => ({ print, facts: photoFacts(print.photo, lang) })), [prints, lang]);
  const options = useMemo(() => {
    const distinct = (values: (string | undefined)[]) => [...new Set(values.filter((v): v is string => Boolean(v)))].sort();
    return {
      series: [...new Map(rows.map((row) => [row.print.series.id, row.print.series.title[lang]])).entries()],
      place: distinct(rows.map((row) => row.facts.place)).map((value) => [value, value]),
      year: distinct(rows.map((row) => row.facts.year)).map((value) => [value, value]),
    };
  }, [rows, lang]);
  const shown = useMemo(
    () =>
      rows.filter(
        (row) => (!filter.series || row.print.series.id === filter.series) && (!filter.place || row.facts.place === filter.place) && (!filter.year || row.facts.year === filter.year),
      ),
    [rows, filter],
  );

  const columns = Math.max(2, Math.floor(frame.width / 210));
  const cell = frame.width / columns;
  const rowHeight = cell + CAPTION;

  // Which rows are on screen. Measured from the page scroll, one check per frame at most.
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const box = el.getBoundingClientRect();
      const height = box.width / Math.max(2, Math.floor(box.width / 210)) + CAPTION;
      const first = Math.max(0, Math.floor(-box.top / height) - 2);
      const last = Math.ceil((window.innerHeight - box.top) / height) + 2;
      setFrame((old) => (old.width === box.width && old.first === first && old.last === last ? old : { width: box.width, first, last }));
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, []);

  const select = "h-10 max-w-[46vw] rounded-full border border-line bg-night px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink";
  const visible = frame.width > 0 ? shown.slice(frame.first * columns, frame.last * columns) : [];

  return (
    <div className="container-x pb-32">
      <div className="flex flex-wrap items-center gap-3 border-b border-line pb-5">
        {(["series", "place", "year"] as const).map((name) =>
          options[name].length > 0 ? (
            <label key={name} className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              {copy[name]}
              <select className={select} value={filter[name]} onChange={(e) => setFilter((old) => ({ ...old, [name]: e.target.value }))}>
                <option value="">{copy.all}</option>
                {options[name].map(([value, text]) => (
                  <option key={value} value={value}>
                    {text}
                  </option>
                ))}
              </select>
            </label>
          ) : null,
        )}
        <p aria-live="polite" className="ml-auto font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          {shown.length > 0 ? copy.count.replace("{count}", String(shown.length)) : copy.empty}
        </p>
      </div>

      <div ref={host} className="relative mt-6" style={{ height: Math.ceil(shown.length / columns) * rowHeight || undefined }}>
        <ul className="m-0 list-none p-0">
          {visible.map(({ print, facts }, i) => {
            const at = frame.first * columns + i;
            return (
              <li
                key={print.photo.id}
                className="absolute left-0 top-0 p-1.5"
                style={{ width: cell, height: rowHeight, transform: `translate(${(at % columns) * cell}px, ${Math.floor(at / columns) * rowHeight}px)` }}
              >
                <a
                  href={photoHref(print.series, print.photo)}
                  data-photo={print.photo.id}
                  data-cursor="View"
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                    e.preventDefault();
                    onOpen(print.index);
                  }}
                  className="group block h-full"
                >
                  <span className="flex items-center justify-center bg-elevated p-3" style={{ height: cell - 12 }}>
                    <picture className="contents">
                      <source type="image/avif" srcSet={mediaUrl(print.photo, 256, "avif")} />
                      {/* A plain img: thousands of ready-made 256 px thumbnails, which the optimizer would only slow down. */}
                      <img
                        src={mediaUrl(print.photo, 256)}
                        alt={print.photo.alt[lang]}
                        width={print.photo.width}
                        height={print.photo.height}
                        loading="lazy"
                        decoding="async"
                        style={{ backgroundColor: print.photo.dominantColor }}
                        className="max-h-full w-auto max-w-full object-contain opacity-80 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                      />
                    </picture>
                  </span>
                  <span className="flex h-[34px] items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                    <span className="truncate">{facts.title ?? print.photo.alt[lang]}</span>
                    <span className="shrink-0 opacity-60">{String(print.index + 1).padStart(String(prints.length).length, "0")}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
