"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { photoHref } from "../../lib/content/gallery";
import { useLang } from "../../lib/i18n";
import { useSmoothScroll } from "../../motion/LenisProvider";
import type { Gallery } from "../../types/gallery";
import { useIntro } from "../Loader";
import { fixtureGallery } from "./fixture";
import { FloorPlan } from "./FloorPlan";
import { IndexGrid } from "./IndexGrid";
import { alongOf, attractAt, planHall, scrollOf, stationOf } from "./plan";
import { Lightbox } from "./Lightbox";
import type { GallerySound } from "./sound";

// three.js stays out of every other route's bundle and off the server.
const Hall = dynamic(() => import("./Hall"), { ssr: false });

/** `?view=`, `?t=` and the dev-only `?fixture=` are read once: they describe a starting state. */
interface Setup {
  fixture: number;
  t: number | null;
  named: string | null;
  low: boolean;
  webgl: boolean;
}

/**
 * /gallery - route shell. Owns what is open (the URL), which view is showing
 * (Hall or Index) and the quiet HUD; the hall itself is lazy-loaded. Every
 * photo is reachable without WebGL through the Index and the hidden wing list.
 */
export function GalleryExperience({ gallery: published }: { gallery: Gallery }) {
  const { lang, content } = useLang();
  const copy = content.gallery;
  const { done } = useIntro();
  const reduce = useReducedMotion() ?? false;
  const pathname = usePathname();
  const { scrollTo } = useSmoothScroll();

  const [setup, setSetup] = useState<Setup | null>(null);
  const [view, setView] = useState<"hall" | "index">("hall");
  const [failed, setFailed] = useState(false);
  const [attract, setAttract] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [audible, setAudible] = useState(false);
  const [wing, setWing] = useState(0);
  const [visible, setVisible] = useState(true);
  const sound = useRef<GallerySound | null>(null);
  const pushed = useRef(0);
  const hallScroll = useRef(0);

  const gallery = useMemo(
    () => (process.env.NODE_ENV !== "production" && setup && setup.fixture > 0 ? fixtureGallery(setup.fixture) : published),
    [published, setup],
  );
  const plan = useMemo(() => planHall(gallery), [gallery]);

  // The open photo is whatever the URL names.
  const open = useMemo(() => {
    const [, , series, photo] = pathname.split("/");
    return series && photo ? (plan.prints.find((print) => print.series.slug === series && print.photo.slug === photo) ?? null) : null;
  }, [pathname, plan]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const t = query.get("t");
    const named = query.get("view");
    const next: Setup = {
      fixture: process.env.NODE_ENV !== "production" ? Math.min(5000, Number(query.get("fixture")) || 0) : 0,
      t: t === null || Number.isNaN(Number(t)) ? null : Number(t),
      named,
      low: window.matchMedia("(pointer: coarse), (max-width: 820px)").matches,
      webgl: Boolean(document.createElement("canvas").getContext("webgl2")),
    };
    setSetup(next);
    if (named === "index" || !next.webgl) setView("index");
    if (named === "plan") setPlanOpen(true);
  }, []);

  // Stand where the URL says: at the open print, a named wing, or a frozen moment of the attract walk.
  useEffect(() => {
    if (!setup) return;
    const named = /^wing-(.+)$/.exec(setup.named ?? "");
    const target = plan.wings.find((item) => item.series.slug === named?.[1]);
    const s = open ? stationOf(open) : target ? target.s0 - 1.2 : setup.t !== null ? attractAt(setup.t) : null;
    if (s !== null) window.scrollTo(0, scrollOf(Math.min(plan.last, s)));
    setAttract(!open && !setup.named && setup.t === null && !reduce);
    // Only on arrival: later changes to `open` are steps inside the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setup, plan]);

  // Which wing the camera is in (for the hidden list), and whether the tab is showing.
  useEffect(() => {
    let raf = 0;
    const place = () => {
      raf = 0;
      const s = alongOf(window.scrollY);
      setWing(Math.max(0, plan.wings.findLastIndex((item) => s >= item.s0 - 1.5)));
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(place);
    };
    const show = () => setVisible(document.visibilityState === "visible");
    place();
    window.addEventListener("scroll", queue, { passive: true });
    document.addEventListener("visibilitychange", show);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", queue);
      document.removeEventListener("visibilitychange", show);
    };
  }, [plan]);

  const inHall = view === "hall" && Boolean(setup?.webgl);

  // In the Index nothing has to fly anywhere: the photo is simply shown.
  useEffect(() => {
    if (!open) setArrived(false);
    else if (!inHall) setArrived(true);
  }, [open, inHall]);

  // Moves inside the page (open, step, close, browser back): retitle the tab, and hand focus back to the
  // print's link when the viewer closes. The page the server rendered already carries its own title.
  const shown = useRef(open?.photo.id ?? null);
  useEffect(() => {
    const id = open?.photo.id ?? null;
    const was = shown.current;
    if (id === was) return;
    shown.current = id;
    document.title = `${open ? `${open.photo.title?.en || open.photo.alt.en} — ${open.series.title.en}` : "Gallery"} | Faris Zaidan Nafis`;
    if (!id) requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-photo="${was}"]`)?.focus({ preventScroll: true }));
  }, [open]);

  const go = (print: (typeof plan.prints)[number] | null, how: "push" | "replace") => {
    const url = (print ? photoHref(print.series, print.photo) : "/gallery") + window.location.search;
    if (how === "push") {
      pushed.current++;
      window.history.pushState(null, "", url);
    } else window.history.replaceState(null, "", url);
  };
  const openPrint = (index: number) => {
    setAttract(false);
    setPlanOpen(false);
    go(plan.prints[index], "push");
  };
  const step = (direction: -1 | 1) => {
    const next = open && plan.prints[open.index + direction];
    if (!next) return;
    go(next, "replace");
    // Behind the lightbox the walk moves too, so closing lands beside the print that is open.
    if (inHall) window.scrollTo(0, scrollOf(stationOf(next)));
  };
  const close = () => {
    // Opened from here: browser back is the same gesture. Opened from a link: there is nothing to go back to.
    if (pushed.current > 0) {
      pushed.current--;
      window.history.back();
    } else go(null, "replace");
  };

  const switchView = (next: "hall" | "index") => {
    if (next === view) return;
    if (view === "hall") hallScroll.current = window.scrollY;
    setAttract(false);
    setPlanOpen(false);
    setView(next);
    requestAnimationFrame(() => window.scrollTo(0, next === "hall" ? hallScroll.current : 0));
  };
  const fail = useCallback(() => {
    hallScroll.current = window.scrollY;
    setFailed(true);
    setView("index");
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }, []);
  const walk = useCallback(
    (s: number) => {
      setAttract(false);
      scrollTo(scrollOf(s));
    },
    [scrollTo],
  );
  const closePlan = useCallback(() => setPlanOpen(false), []);

  useEffect(
    () => () => {
      sound.current?.dispose();
      sound.current = null;
    },
    [],
  );
  // The sound module is only fetched, and the audio context only made, on this click.
  const toggleSound = async () => {
    if (sound.current) {
      sound.current.dispose();
      sound.current = null;
    } else sound.current = new (await import("./sound")).GallerySound();
    setAudible(Boolean(sound.current));
  };

  const current = plan.wings[wing];
  const inWing = current ? plan.prints.slice(current.first, current.first + current.count) : [];
  const openWing = open ? plan.wings[open.wing] : null;
  const text = "transition-colors hover:text-ink aria-pressed:text-ink";

  const header = (
    <header className={clsx("pointer-events-none container-x pt-24 transition-opacity duration-300", inHall ? "absolute left-0 top-0 w-auto" : "pb-10", open && "opacity-0")}>
      <h1 className="font-display text-xl font-semibold tracking-tight text-muted">{copy.title}</h1>
      <p className="mt-2 max-w-xs font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-muted">
        {inHall ? copy.hint : failed ? copy.fallbackNote : copy.indexHint}
      </p>
    </header>
  );

  // Nothing here is `position: fixed` except the lightbox (portalled to <body>): the page-transition
  // wrapper can be a containing block, and a fixed HUD would scroll away with the hall.
  return (
    <section aria-label={copy.ariaSection} className="relative bg-night">
      {/* The hall: a tall page whose scroll position is the walk. */}
      <div className={clsx("relative", !inHall && "hidden")} style={{ height: `calc(100svh + ${scrollOf(plan.last)}px)` }}>
        <div className="sticky top-0 h-[100svh] min-h-[420px] overflow-hidden">
          {setup?.webgl ? (
            <Hall
              plan={plan}
              lang={lang}
              printsLabel={copy.plan.prints}
              low={setup.low}
              reduce={reduce}
              running={done && visible && inHall}
              covered={Boolean(open) && arrived}
              attract={attract}
              frozen={setup.t}
              focus={inHall && open ? open.index : null}
              sound={sound}
              onOpen={openPrint}
              onArrive={() => setArrived(true)}
              onFail={fail}
            />
          ) : null}
          {/* Falloff to the corners of the frame, as a lens would give. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse 85% 80% at 50% 52%, transparent 55%, rgba(10,15,17,0.55) 100%)" }}
          />
          {header}

          {/* For keyboards and screen readers: the wing the camera is in, as links. */}
          {inHall && current ? (
            <nav aria-label={copy.wingList} className="sr-only right-6 top-24 max-h-[60svh] overflow-auto border border-line bg-night/95 p-4 has-[:focus-visible]:not-sr-only has-[:focus-visible]:absolute">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{current.series.title[lang]}</p>
              <ul className="mt-2 space-y-1">
                {inWing.map((print) => (
                  <li key={print.photo.id}>
                    <a
                      href={photoHref(print.series, print.photo)}
                      data-photo={print.photo.id}
                      onClick={(e) => {
                        e.preventDefault();
                        openPrint(print.index);
                      }}
                      className="text-sm text-ink underline decoration-accent underline-offset-4"
                    >
                      {print.photo.alt[lang]}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </div>

      {inHall ? null : (
        <>
          {header}
          <IndexGrid prints={plan.prints} onOpen={openPrint} />
        </>
      )}

      {/* The controls ride the bottom of the window in both views; the negative margin keeps them out of the page's length. */}
      <div className={clsx("pointer-events-none sticky bottom-6 z-30 -mt-10 h-10 transition-opacity duration-300", open && "invisible opacity-0")}>
        <div className="relative container-x w-auto font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          <div className={clsx("pointer-events-auto flex w-fit flex-wrap items-end gap-x-6 gap-y-1", !inHall && "-ml-4 rounded-full border border-line bg-night/95 px-4 py-2.5")}>
          {planOpen && inHall ? <FloorPlan plan={plan} onWalk={walk} onClose={closePlan} /> : null}
          {inHall ? (
            <button type="button" className={text} aria-pressed={planOpen} onClick={() => setPlanOpen((on) => !on)}>
              {copy.controls.plan}
            </button>
          ) : null}
          {setup?.webgl ? (
            <span role="group" aria-label={`${copy.controls.hall} / ${copy.controls.index}`}>
              <button type="button" className={text} aria-pressed={view === "hall"} onClick={() => switchView("hall")}>
                {copy.controls.hall}
              </button>
              <span aria-hidden="true"> / </span>
              <button type="button" className={text} aria-pressed={view === "index"} onClick={() => switchView("index")}>
                {copy.controls.index}
              </button>
            </span>
          ) : null}
          {inHall ? (
            <button type="button" className={text} aria-pressed={audible} onClick={() => void toggleSound()}>
              {audible ? copy.controls.soundOff : copy.controls.soundOn}
            </button>
          ) : null}
          </div>
        </div>
      </div>

      {setup
        ? createPortal(
            <AnimatePresence>
              {open && arrived && openWing ? (
                <Lightbox
                  key="lightbox"
                  print={open}
                  n={open.index - openWing.first + 1}
                  total={openWing.count}
                  overHall={inHall}
                  onStep={step}
                  canStep={{ prev: open.index > 0, next: open.index < plan.prints.length - 1 }}
                  onClose={close}
                />
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </section>
  );
}
