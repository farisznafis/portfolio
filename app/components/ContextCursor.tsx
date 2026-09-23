"use client";

import gsap from "gsap";
import {
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * Contextual cursor companion for fine-pointer devices.
 *
 * The component renders only after hydration and only when:
 * - the device has a fine pointer
 * - reduced motion is not enabled
 *
 * This keeps SSR and the client's first render identical.
 */
export function ContextCursor() {
  const ref =
    useRef<HTMLDivElement>(null);

  const [enabled, setEnabled] =
    useState(false);

  const [label, setLabel] =
    useState<string | null>(null);

  /**
   * Detect cursor capability only after hydration.
   *
   * Server render:
   * enabled = false
   *
   * First client render:
   * enabled = false
   *
   * Therefore hydration stays identical.
   */
  useEffect(() => {
    const finePointer =
      window.matchMedia(
        "(pointer: fine)",
      );

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );

    const update = () => {
      setEnabled(
        finePointer.matches &&
          !reducedMotion.matches,
      );
    };

    update();

    finePointer.addEventListener(
      "change",
      update,
    );

    reducedMotion.addEventListener(
      "change",
      update,
    );

    return () => {
      finePointer.removeEventListener(
        "change",
        update,
      );

      reducedMotion.removeEventListener(
        "change",
        update,
      );
    };
  }, []);

  /**
   * Cursor animation / events.
   *
   * This runs only after the cursor has actually
   * been mounted in the DOM.
   */
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const el = ref.current;

    if (!el) {
      return;
    }

    el.style.opacity = "0";

    const xTo = gsap.quickTo(
      el,
      "x",
      {
        duration: 0.4,
        ease: "power3.out",
      },
    );

    const yTo = gsap.quickTo(
      el,
      "y",
      {
        duration: 0.4,
        ease: "power3.out",
      },
    );

    let shown = false;

    const onMove = (
      event: PointerEvent,
    ) => {
      if (
        event.pointerType !==
        "mouse"
      ) {
        return;
      }

      xTo(event.clientX);
      yTo(event.clientY);

      if (!shown) {
        shown = true;
        el.style.opacity = "1";
      }
    };

    const onOver = (
      event: PointerEvent,
    ) => {
      const target =
        event.target as HTMLElement | null;

      const zone =
        target?.closest?.(
          "[data-cursor]",
        );

      if (
        zone instanceof HTMLElement
      ) {
        setLabel(
          zone.dataset.cursor ??
            "",
        );
      } else {
        setLabel(null);
      }
    };

    window.addEventListener(
      "pointermove",
      onMove,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "pointerover",
      onOver,
      {
        passive: true,
      },
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        onMove,
      );

      window.removeEventListener(
        "pointerover",
        onOver,
      );
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      ref={ref}
      className="cursor-ring hidden md:flex"
      data-active={
        label !== null
      }
      aria-hidden="true"
    >
      <span className="cursor-label">
        {label}
      </span>
    </div>
  );
}