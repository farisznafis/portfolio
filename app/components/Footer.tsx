import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { site } from "../lib/data";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 py-8 sm:flex-row">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Next.js · Tailwind · Motion
        </p>
        <Link
          href="/"
          aria-label="Back to home"
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
