"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { BOOK_STILL, getBook } from "../../lib/content/book";
import { useLang } from "../../lib/i18n";

// three.js stays out of every other route's bundle and off the server.
const PopUpBook = dynamic(() => import("./PopUpBook"), { ssr: false });

/**
 * /book - the pop-up book filling the window, a quiet title and hint, and
 * the same story as real text for assistive tech. If the device cannot draw
 * the book (no WebGL, or under 30 fps at the lowest resolution) the still
 * takes over and the story becomes visible HTML.
 */
export function BookExperience() {
  const { lang, content } = useLang();
  const copy = content.book;
  const view = useMemo(() => getBook(lang, content), [lang, content]);
  const [still, setStill] = useState(false);

  useEffect(() => {
    if (!document.createElement("canvas").getContext("webgl2")) setStill(true);
  }, []);

  return (
    <section aria-label={copy.ariaSection} className="relative bg-night">
      <div className="relative h-[100svh] min-h-[540px] overflow-hidden">
        {still ? (
          <Image src={BOOK_STILL} alt={copy.stillAlt} fill priority sizes="100vw" className="object-cover" />
        ) : (
          <PopUpBook onFail={() => setStill(true)} />
        )}
        <header className="pointer-events-none absolute left-0 top-0 container-x w-auto pt-24">
          <h1 className="font-display text-xl font-semibold tracking-tight text-muted">{copy.title}</h1>
          <p className="mt-2 max-w-xs font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-muted">
            {still ? copy.fallbackNote : copy.hint}
          </p>
        </header>
      </div>

      <div className={clsx(still ? "container-x grid gap-10 py-20 md:grid-cols-2" : "sr-only")}>
        {view.story.map((spread, i) => (
          <article key={i}>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">{spread.title}</h2>
            {spread.lines.map((line, n) => (
              <p key={n} className="mt-3 text-base leading-relaxed text-muted">
                {line}
              </p>
            ))}
            {i === view.story.length - 1 ? (
              <p className="mt-3">
                <a href={`mailto:${view.kumamoto.email}`} className="text-ink underline decoration-accent underline-offset-4">
                  {view.kumamoto.email}
                </a>
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
