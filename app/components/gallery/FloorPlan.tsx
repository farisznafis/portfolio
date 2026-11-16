"use client";

import { useEffect, useMemo, useRef } from "react";
import { X } from "lucide-react";
import { useLang } from "../../lib/i18n";
import { alongOf, HALL, type HallPlan } from "./plan";

const SCALE = 13; // px per metre along the hall
const DEPTH = 58; // px between the two walls
const PAD = 18;

/**
 * The hall from above, drawn like an architect's plan: thin teal lines, wing
 * names in mono, a dot where you stand. Each wing is a button that walks
 * there.
 */
export function FloorPlan({ plan, onWalk, onClose }: { plan: HallPlan; onWalk(s: number): void; onClose(): void }) {
  const { lang, content } = useLang();
  const copy = content.gallery.plan;
  const dot = useRef<HTMLSpanElement>(null);
  const closer = useRef<HTMLButtonElement>(null);

  // A wing is drawn to scale, but never so short its name would not fit.
  const spans = useMemo(() => {
    let x = 0;
    return plan.wings.map((wing, i) => {
      const from = i === 0 ? HALL.start : wing.s0;
      const to = plan.wings[i + 1]?.s0 ?? plan.end;
      const width = Math.max(260, (to - from) * SCALE);
      const span = { wing, from, to, x, width };
      x += width;
      return span;
    });
  }, [plan]);

  useEffect(() => {
    closer.current?.focus({ preventScroll: true });
    let raf = 0;
    const place = () => {
      raf = 0;
      const s = Math.min(plan.last, alongOf(window.scrollY));
      const span = spans.findLast((item) => s >= item.from) ?? spans[0];
      if (dot.current && span) dot.current.style.transform = `translateX(${span.x + ((s - span.from) / (span.to - span.from)) * span.width}px)`;
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(place);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    place();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("keydown", key);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("keydown", key);
    };
  }, [plan, spans, onClose]);

  const line = { stroke: "var(--color-accent)", strokeWidth: 1, fill: "none", vectorEffect: "non-scaling-stroke" } as const;

  return (
    <div role="dialog" aria-label={copy.title} className="absolute inset-x-0 bottom-9 normal-case tracking-normal">
      <div className="container-x">
        <div className="inline-block max-w-full border border-line bg-night/95 p-5 pt-4 text-left">
          <div className="flex items-center justify-between gap-8 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            <p>
              {copy.title} <span className="ml-3 text-accent-bright">● {copy.here}</span>
            </p>
            <button ref={closer} type="button" aria-label={copy.close} onClick={onClose} className="-m-2 flex size-9 items-center justify-center transition-colors hover:text-ink">
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          <div data-lenis-prevent className="mt-3 overflow-x-auto overscroll-contain pb-1">
            <div className="relative flex w-max">
              {spans.map(({ wing, from, to, width }) => {
                const x = (s: number) => ((s - from) / (to - from)) * width;
                const name = wing.series.title[lang];
                const prints = plan.prints.slice(wing.first, wing.first + wing.count);
                const door = wing.index > 0 ? (HALL.jamb / (HALL.half * 2)) * DEPTH : 0;
                const last = wing.index === plan.wings.length - 1;
                return (
                  <button
                    key={wing.series.id}
                    type="button"
                    aria-label={copy.walk.replace("{name}", name)}
                    onClick={() => onWalk(Math.max(HALL.start, wing.s0 - 1.2))}
                    className="group block text-left transition-colors hover:bg-white/5"
                    style={{ width }}
                  >
                    <svg width={width} height={DEPTH + PAD * 2} aria-hidden="true" className="block">
                      {/* The two walls, and the jambs of the doorway this wing is entered through. */}
                      <line x1={0} x2={width} y1={PAD} y2={PAD} {...line} />
                      <line x1={0} x2={width} y1={PAD + DEPTH} y2={PAD + DEPTH} {...line} />
                      {wing.index === 0 ? <line x1={0.5} x2={0.5} y1={PAD} y2={PAD + DEPTH} {...line} /> : null}
                      {door > 0 ? (
                        <>
                          <line x1={0.5} x2={0.5} y1={PAD} y2={PAD + door} {...line} />
                          <line x1={0.5} x2={0.5} y1={PAD + DEPTH - door} y2={PAD + DEPTH} {...line} />
                        </>
                      ) : null}
                      {/* The title wall, then one tick per print. */}
                      <line x1={x(wing.titleS - HALL.titleWidth / 2)} x2={x(wing.titleS + HALL.titleWidth / 2)} y1={PAD + 3} y2={PAD + 3} stroke="var(--color-amber)" strokeWidth={1} />
                      {prints.map((print) => (
                        <line
                          key={print.index}
                          x1={x(print.s - print.hw)}
                          x2={x(print.s + print.hw)}
                          y1={print.side < 0 ? PAD + 3 : PAD + DEPTH - 3}
                          y2={print.side < 0 ? PAD + 3 : PAD + DEPTH - 3}
                          stroke="var(--color-ink)"
                          strokeOpacity={0.7}
                          strokeWidth={2}
                        />
                      ))}
                      {last ? (
                        <>
                          {/* The end wall and its closed door; the room beyond is not open. */}
                          <line x1={width - 0.5} x2={width - 0.5} y1={PAD} y2={PAD + DEPTH} {...line} />
                          <line x1={width - 0.5} x2={width - 0.5} y1={PAD + DEPTH / 2 - 5} y2={PAD + DEPTH / 2 + 5} stroke="var(--color-night)" strokeWidth={3} />
                          <line x1={width - 0.5} x2={width - 9} y1={PAD + DEPTH / 2 - 5} y2={PAD + DEPTH / 2 - 5} {...line} strokeDasharray="2 2" />
                        </>
                      ) : null}
                    </svg>
                    <span className="block px-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-colors group-hover:text-accent-bright">{name}</span>
                    <span className="mt-1 flex justify-between gap-3 whitespace-nowrap px-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                      {copy.prints.replace("{count}", String(wing.count))}
                      {last ? <span>{copy.closed} →</span> : null}
                    </span>
                  </button>
                );
              })}
              <span ref={dot} aria-hidden="true" className="pointer-events-none absolute left-0 size-2 rounded-full bg-accent-bright" style={{ top: PAD + DEPTH / 2 - 4, marginLeft: -4 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
