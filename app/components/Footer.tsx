"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { site } from "../lib/data";
import { useLang } from "../lib/i18n";

export function Footer() {
  const { content } = useLang();

  return (
    <footer className="relative z-10 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 py-8 sm:flex-row">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {site.name}. {content.footer.rights}
        </p>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Next.js / Tailwind / Motion
        </p>
        <Link
          href="/"
          aria-label={content.footer.backHome}
          className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/5 text-ink transition-colors hover:border-accent/60 hover:text-accent"
        >
          <ArrowUp
            size={17}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>
    </footer>
  );
}