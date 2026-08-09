"use client";

import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { Github, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { site } from "../lib/data";
import type { Lang } from "../lib/content";
import { useLang } from "../lib/i18n";
import { DUR, EASE, SPRING, STAGGER } from "../lib/motion";
import { Magnetic } from "./ui/Magnetic";
import { RolloverText } from "./ui/RolloverText";
import { ScrollProgress } from "./ui/ScrollProgress";

const NAV_LINKS = [
  { href: "/work", key: "work" },
  { href: "/about", key: "about" },
  { href: "/skills", key: "skills" },
  { href: "/experience", key: "experience" },
  { href: "/contact", key: "contact" },
] as const;

const LANGS: { value: Lang; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "ja", label: "日本語" },
];

/** Mobile menu choreography — container staggers its links in. */
const menuListVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER.menu, delayChildren: 0.05 },
  },
};

const menuItemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.fast, ease: EASE },
  },
};

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { lang, setLang, content } = useLang();

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="border-b border-line bg-night/70 backdrop-blur-xl">
        <nav
          aria-label={content.nav.ariaPrimary}
          className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5"
        >
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-sm font-bold tracking-[0.3em] text-ink"
            aria-label={`${site.name} — ${content.nav.ariaLogo}`}
          >
            {site.shortName}
            <span className="text-accent">.</span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={clsx(
                      "group relative inline-block rounded-full px-4 py-2 text-sm transition-colors",
                      isActive ? "text-ink" : "text-muted hover:text-ink",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-white/8"
                        transition={SPRING.pill}
                      />
                    )}
                    <RolloverText className="relative" text={content.nav.links[link.key]} />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Magnetic className="hidden md:block">
              <a
                href={site.github}
                target="_blank"
                rel="noreferrer"
                aria-label={content.nav.ariaGithub}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/5 text-ink transition-colors hover:border-accent/60 hover:text-accent"
              >
                <Github size={17} />
              </a>
            </Magnetic>

            {/* Language toggle — EN / 日本語 */}
            <div
              role="group"
              aria-label={content.nav.ariaLang}
              className="flex h-10 items-center gap-0.5 rounded-full border border-line bg-white/5 p-0.5"
            >
              {LANGS.map((option) => {
                const isActive = lang === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setLang(option.value)}
                    aria-pressed={isActive}
                    className={clsx(
                      "relative h-full rounded-full px-2.5 text-xs font-semibold transition-colors",
                      isActive ? "text-on-accent" : "text-muted hover:text-ink",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="lang-pill"
                        className="absolute inset-0 rounded-full bg-accent"
                        transition={SPRING.pill}
                      />
                    )}
                    <span className="relative z-10">{option.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? content.nav.ariaClose : content.nav.ariaMenu}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/5 text-ink md:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Scroll progress — the page timeline rendered as a thin accent line */}
        <ScrollProgress />
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="border-b border-line bg-night/95 backdrop-blur-xl md:hidden"
          >
            <motion.ul
              className="space-y-1 px-5 py-4"
              initial={reduce ? "visible" : "hidden"}
              animate="visible"
              variants={menuListVariants}
            >
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <motion.li key={link.href} variants={menuItemVariants}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={clsx(
                        "block rounded-lg px-4 py-3 text-base transition-colors",
                        isActive
                          ? "bg-white/8 text-ink"
                          : "text-muted hover:text-ink",
                      )}
                    >
                      {content.nav.links[link.key]}
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
