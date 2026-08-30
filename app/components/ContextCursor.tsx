"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

/**
 * Contextual cursor companion for fine-pointer devices.
 *
 * A small teal ring trails the pointer and morphs into a labeled pill when
 * hovering elements that opt in via `data-cursor="View"` (etc.). The native
 * cursor stays visible and fully functional - this is an affordance layer,
 * not a replacement - and everything disables under reduced motion or touch.
 */
export function ContextCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = ref.current;
    if (!el) return;

    el.style.opacity = "0";

    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

    let shown = false;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      xTo(event.clientX);
      yTo(event.clientY);
      if (!shown) {
        shown = true;
        el.style.opacity = "1";
      }
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const zone = target?.closest?.("[data-cursor]");
      if (zone instanceof HTMLElement) {
        setLabel(zone.dataset.cursor ?? "");
      } else {
        setLabel(null);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
    };
  }, []);

  // Touch devices and reduced-motion users get nothing rendered at all.
  if (typeof window === "undefined") return null;

  return (
    <div
      ref={ref}
      className="cursor-ring hidden md:flex"
      data-active={label !== null}
      aria-hidden="true"
    >
      <span className="cursor-label">{label}</span>
    </div>
  );
}
