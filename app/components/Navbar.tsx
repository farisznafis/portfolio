"use client";

import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight, Github, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { site, socials } from "../lib/data";
import type { Lang } from "../lib/content";
import { useLang } from "../lib/i18n";
import { DUR, EASE, SPRING, STAGGER } from "../lib/motion";
import { useSmoothScroll } from "../motion/LenisProvider";
import { Magnetic } from "./ui/Magnetic";
import { RolloverText } from "./ui/RolloverText";
import { ScrollProgress } from "./ui/ScrollProgress";

const SECTIONS = [
  "work",
  "experience",
  "capabilities",
  "about",
  "contact",
] as const;

type SectionId = (typeof SECTIONS)[number];

const LANGS: { value: Lang; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "ja", label: "日本語" },
];

/** Fullscreen mobile menu choreography - links stagger in like a curtain call. */
const menuListVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER.menu + 0.02, delayChildren: 0.12 },
  },
};

const menuItemVariants: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.fast, ease: EASE },
  },
};

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const reduce = useReducedMotion();
  const { lang, setLang, content } = useLang();
  const { scrollTo } = useSmoothScroll();

  // Expose the current section to the nav highlight. IntersectionObserver
  // only - no scroll listeners.
  useEffect(() => {
    if (!isHome) {
      setActiveSection(null);
      return;
    }
    const elements = SECTIONS.map((id) => document.getElementById(id));
    if (elements.some((el) => !el)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as SectionId);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    elements.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [isHome]);

  // Lock page scroll while the fullscreen menu is open.
  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const goTo = (id: SectionId) => (event: React.MouseEvent) => {
    setOpen(false);
    if (!isHome) return; // let the /#hash navigation happen
    event.preventDefault();
    scrollTo(`#${id}`);
  };

  const linkHref = (id: SectionId) => (isHome ? `/#${id}` : `/#${id}`);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40">
        <div className="border-b border-line bg-night/70 backdrop-blur-xl">
          <nav
            aria-label={content.nav.ariaPrimary}
            className="container-x flex h-16 items-center justify-between"
          >
            {/* Logo */}
            <Link
              href="/"
              className="font-display text-sm font-bold tracking-[0.3em] text-ink"
              aria-label={`${site.name} | ${content.nav.ariaLogo}`}
              onClick={() => setOpen(false)}
            >
              {site.shortName}
              <span className="text-accent">.</span>
            </Link>

            {/* Desktop nav */}
            <ul className="hidden items-center gap-1 md:flex">
              {SECTIONS.map((id) => {
                const isActive = isHome && activeSection === id;
                return (
                  <li key={id}>
                    <Link
                      href={linkHref(id)}
                      onClick={goTo(id)}
                      aria-current={isActive ? "true" : undefined}
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
                      <RolloverText className="relative" text={content.nav.links[id]} />
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
                  data-cursor="Open"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/5 text-ink transition-colors hover:border-accent/60 hover:text-accent"
                >
                  <Github size={17} />
                </a>
              </Magnetic>

              {/* Language toggle - EN / 日本語 */}
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

          {/* Scroll progress - the page timeline rendered as a thin accent line.
              Hidden under reduced motion where it would still animate. */}
          {reduce ? null : <ScrollProgress />}
        </div>

        {/* ── Fullscreen mobile menu ──────────────────────────────────────── */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-nav"
              initial={{ clipPath: "inset(0 0 100% 0)" }}
              animate={{ clipPath: "inset(0 0 0% 0)" }}
              exit={{ clipPath: "inset(0 0 100% 0)" }}
              transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 z-[70] flex flex-col justify-between bg-night px-6 pb-10 pt-24 md:hidden"
            >
              <motion.ul
                className="space-y-2"
                initial={reduce ? "visible" : "hidden"}
                animate="visible"
                variants={menuListVariants}
              >
                {SECTIONS.map((id, index) => (
                  <motion.li key={id} variants={menuItemVariants} className="overflow-hidden">
                    <Link
                      href={linkHref(id)}
                      onClick={goTo(id)}
                      className="group flex items-baseline gap-4 py-1"
                    >
                      <span className="font-mono text-xs text-accent">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-4xl font-semibold tracking-tight text-ink transition-colors group-hover:text-accent-bright">
                        {content.nav.links[id]}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="flex items-end justify-between border-t border-line pt-6"
              >
                <ul className="space-y-1" aria-label={content.contact.socialsAria}>
                  {socials.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
                      >
                        {social.label}
                        <ArrowUpRight size={13} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  {site.location}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
