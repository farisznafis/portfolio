"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { mediaUrl, photoFacts } from "../../lib/content/gallery";
import { useLang } from "../../lib/i18n";
import { DUR, EASE } from "../../lib/motion";
import { lightboxRect, type Print } from "./plan";

interface LightboxProps {
  print: Print;
  /** Position within the wing, 1-based, and the wing's size. */
  n: number;
  total: number;
  /** Over the hall the frozen 3D print shows through; over the Index the backdrop is solid. */
  overHall: boolean;
  onStep: ((direction: -1 | 1) => void) | null;
  canStep: { prev: boolean; next: boolean };
  onClose(): void;
}

/**
 * The open photo: the full-resolution file as a real <img>, laid exactly
 * over the 3D print (both read `lightboxRect`), with its label as real text.
 * Modal: focus is trapped, the page behind does not scroll.
 */
export function Lightbox({ print, n, total, overHall, onStep, canStep, onClose }: LightboxProps) {
  const { lang, content } = useLang();
  const copy = content.gallery.lightbox;
  const root = useRef<HTMLDivElement>(null);
  const closer = useRef<HTMLButtonElement>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const [loaded, setLoaded] = useState<string | null>(null);
  const facts = photoFacts(print.photo, lang);
  const src = mediaUrl(print.photo, 2560);
  const latest = useRef({ onStep, onClose, canStep });
  latest.current = { onStep, onClose, canStep };

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    closer.current?.focus({ preventScroll: true });
    const step = (direction: -1 | 1) => {
      if (direction < 0 ? latest.current.canStep.prev : latest.current.canStep.next) latest.current.onStep?.(direction);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") latest.current.onClose();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "Tab") {
        // Focus stays inside the viewer.
        const stops = [...el.querySelectorAll<HTMLElement>("button:not(:disabled)")];
        const at = stops.indexOf(document.activeElement as HTMLElement);
        e.preventDefault();
        stops[(at + (e.shiftKey ? -1 : 1) + stops.length) % stops.length]?.focus();
      } else if (!["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(e.key)) return;
      if (e.key !== "Tab") e.preventDefault();
    };
    // The page behind stays where it is.
    const hold = (e: Event) => e.preventDefault();
    let from: number | null = null;
    const down = (e: PointerEvent) => {
      from = e.pointerType === "mouse" ? null : e.clientX;
    };
    const up = (e: PointerEvent) => {
      if (from !== null && Math.abs(e.clientX - from) > 48) step(e.clientX < from ? 1 : -1);
      from = null;
    };
    window.addEventListener("keydown", key);
    el.addEventListener("wheel", hold, { passive: false });
    el.addEventListener("touchmove", hold, { passive: false });
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("keydown", key);
      el.removeEventListener("wheel", hold);
      el.removeEventListener("touchmove", hold);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
    };
  }, []);

  const rect = box ? lightboxRect(box.w, box.h, print) : null;
  const round = "flex size-11 items-center justify-center rounded-full border border-line bg-night/70 text-ink transition-colors hover:border-accent/60 hover:text-accent disabled:opacity-30 disabled:hover:border-line disabled:hover:text-ink";
  const meta = [facts.place, facts.date, facts.camera, facts.lens, facts.settings].filter(Boolean);

  return (
    <motion.div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={copy.aria}
      data-lenis-prevent
      className="fixed inset-x-0 top-0 z-[55] h-[100svh] touch-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: EASE }}
    >
      <button type="button" tabIndex={-1} aria-hidden="true" onClick={onClose} className={clsx("absolute inset-0 cursor-default", overHall ? "bg-night/25" : "bg-night")} />

      {rect ? (
        <div
          className="absolute overflow-hidden"
          style={{
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
            // Over the Index there is no print behind: hold the place with the photo's own blur.
            ...(overHall ? {} : { backgroundColor: print.photo.dominantColor, backgroundImage: print.photo.blurDataURL ? `url(${print.photo.blurDataURL})` : undefined, backgroundSize: "cover" }),
          }}
        >
          <Image
            key={src}
            src={src}
            alt={print.photo.alt[lang]}
            fill
            priority
            quality={90}
            unoptimized={src.startsWith("data:")}
            sizes={`${Math.ceil(rect.width)}px`}
            onLoad={() => setLoaded(src)}
            className={clsx("object-cover transition-opacity duration-300", loaded === src ? "opacity-100" : "opacity-0")}
          />
        </div>
      ) : null}

      <motion.div
        key={print.photo.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR.micro, ease: EASE, delay: 0.08 }}
        className="pointer-events-none absolute inset-x-0 bottom-0 container-x flex h-[150px] items-center justify-between gap-6"
      >
        <div className="min-w-0">
          {facts.title ? <h2 className="truncate font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">{facts.title}</h2> : null}
          {meta.length > 0 ? <p className="mt-2 font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-muted">{meta.join(" · ")}</p> : null}
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            <span className="text-accent-bright">{print.series.title[lang]}</span> — {copy.counter.replace("{n}", String(n)).replace("{total}", String(total))}
          </p>
        </div>
        <div className="pointer-events-auto flex shrink-0 gap-2">
          <button type="button" className={round} aria-label={copy.prev} disabled={!canStep.prev} onClick={() => onStep?.(-1)}>
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <button type="button" className={round} aria-label={copy.next} disabled={!canStep.next} onClick={() => onStep?.(1)}>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </motion.div>

      <button ref={closer} type="button" className={clsx(round, "absolute right-5 top-4 sm:right-10")} aria-label={copy.close} onClick={onClose}>
        <X size={18} aria-hidden="true" />
      </button>
    </motion.div>
  );
}
