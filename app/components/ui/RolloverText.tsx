"use client";

import type { CSSProperties } from "react";

type RolloverTextProps = {
  text: string;
  className?: string;
};

/**
 * Per-character text rollover: each character is drawn twice (via CSS
 * pseudo-content) inside a one-line mask; hovering or focusing the nearest
 * `.group` ancestor slides the duplicate up with a per-character stagger.
 * Purely CSS-driven (see .rollover-char in globals.css), transform-only,
 * and inert under prefers-reduced-motion. Screen readers get the plain text.
 */
export function RolloverText({ text, className }: RolloverTextProps) {
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {Array.from(text).map((char, i) =>
          char === " " ? (
            <span key={i}>&nbsp;</span>
          ) : (
            <span key={i} className="rollover-char">
              <span
                className="rollover-char-inner"
                data-char={char}
                style={{ "--char-index": i } as CSSProperties}
              />
            </span>
          ),
        )}
      </span>
    </span>
  );
}
