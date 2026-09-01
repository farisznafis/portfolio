"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { site, socials } from "../../content/profile";
import { useLang } from "../../lib/i18n";
import { EASE } from "../../lib/motion";
import { useSmoothScroll } from "../../motion/LenisProvider";
import { Magnetic } from "../ui/Magnetic";

/** Latin words get per-word hover fills; CJK renders as one span. */
function HoverWords({ text }: { text: string }) {
  const isCjk = /[\u3000-\u30ff\u4e00-\u9fff]/.test(text);
  if (isCjk) {
    return (
      <span className="transition-colors duration-300 hover:text-accent-bright">
        {text}
      </span>
    );
  }
  return (
    <>
      {text.split(" ").map((word) => (
        <span key={word} className="inline-block transition-colors duration-300 hover:text-accent-bright">
          {word}
          {"\u00A0"}
        </span>
      ))}
    </>
  );
}

/**
 * The finale: a full-viewport closing statement that visually answers the
 * hero - same scale, same night. The email address is the one contact CTA;
 * socials and footer meta sit beneath it.
 */
export function ContactFinale() {
  const reduce = useReducedMotion();
  const { content } = useLang();
  const { scrollTo } = useSmoothScroll();
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      aria-label={content.contact.ariaSection}
      className="relative border-t border-line bg-night"
    >
      <div className="container-x flex min-h-[100dvh] flex-col justify-between pb-10 pt-28 sm:pt-32">
        <div>
          <h2 className="font-display text-display font-semibold uppercase leading-[0.92] tracking-tight text-ink [text-wrap:balance]">
            <motion.span
              className="block"
              initial={reduce ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <HoverWords text={content.contact.line1} />
            </motion.span>
            <motion.span
              className="block text-gradient"
              initial={reduce ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
            >
              {content.contact.line2}
            </motion.span>
          </h2>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
            className="mt-14"
          >
            <Magnetic>
              <a
                href={`mailto:${site.email}`}
                data-cursor="Write"
                aria-label={content.contact.emailAria}
                className="group inline-flex items-baseline gap-3"
              >
                <span className="relative font-mono text-xl tracking-tight text-ink sm:text-3xl md:text-4xl">
                  {site.email}
                  <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-100 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-0" />
                  <span className="absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-accent-bright transition-transform duration-500 delay-100 ease-out group-hover:scale-x-100" />
                </span>
                <ArrowUpRight
                  size={26}
                  aria-hidden="true"
                  className="self-center text-accent transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:translate-x-1.5"
                />
              </a>
            </Magnetic>
          </motion.div>
        </div>

        {/* Socials */}
        <ul
          aria-label={content.contact.socialsAria}
          className="mt-16 flex flex-wrap gap-x-10 gap-y-3"
        >
          {socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="Open"
                className="group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.22em] text-muted transition-colors hover:text-ink"
              >
                {social.label}
                <ArrowUpRight
                  size={13}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </li>
          ))}
        </ul>

        {/* Footer meta */}
        <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-8">
          <p className="font-mono text-xs text-muted">
            © {year} {site.name}. {content.contact.rights}
          </p>
          <button
            type="button"
            onClick={() => scrollTo(0)}
            className="group inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:border-accent/60 hover:text-ink active:scale-[0.97]"
          >
            <ArrowUp
              size={14}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-y-0.5"
            />
            {content.contact.backTop}
          </button>
        </div>
      </div>
    </footer>
  );
}
