"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { site, socials } from "../lib/data";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

type Status = "idle" | "sending" | "sent";

const FIELD_CLASSES =
  "w-full rounded-xl border border-line bg-white/5 px-4 py-3 text-sm text-ink placeholder:text-muted/60 transition-colors hover:border-white/25 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status !== "idle") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const message = String(data.get("message") ?? "");
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(message);

    setStatus("sending");
    window.setTimeout(() => {
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      setStatus("sent");
      form.reset();
      resetTimer.current = setTimeout(() => setStatus("idle"), 4000);
    }, 600);
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative z-10 mx-auto max-w-6xl px-5 py-24 sm:py-32"
    >
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            headingId="contact-heading"
            eyebrow="Contact"
            title="Let's build something memorable"
            description="Have a project in mind, a role to fill, or just want to talk shop about motion on the web? My inbox is open."
          />

          <Reveal delay={0.2} className="mt-10">
            <a
              href={`mailto:${site.email}`}
              className="group inline-flex items-center gap-2 font-display text-xl font-semibold text-ink transition-colors hover:text-accent sm:text-2xl"
            >
              {site.email}
              <ArrowUpRight
                size={20}
                aria-hidden="true"
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </Reveal>

          <Reveal delay={0.3} className="mt-10">
            <ul className="divide-y divide-line border-y border-line">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between py-4 font-mono text-sm uppercase tracking-[0.2em] text-muted transition-colors hover:text-ink"
                  >
                    <span className="transition-transform duration-300 group-hover:translate-x-2">
                      {social.label}
                    </span>
                    <ArrowUpRight
                      size={16}
                      aria-hidden="true"
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <form onSubmit={onSubmit} className="glass rounded-2xl p-7 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-muted"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Jane Doe"
                  className={FIELD_CLASSES}
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-muted"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="jane@company.com"
                  className={FIELD_CLASSES}
                />
              </div>
            </div>
            <div className="mt-5">
              <label
                htmlFor="contact-message"
                className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-muted"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                placeholder="Tell me about your project…"
                className={`${FIELD_CLASSES} resize-y`}
              />
            </div>

            <button
              type="submit"
              disabled={status !== "idle"}
              className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-bright disabled:cursor-default disabled:opacity-90 sm:w-auto"
            >
              <AnimatePresence mode="wait" initial={false}>
                {status === "idle" && (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="inline-flex items-center gap-2"
                  >
                    Send message <Send size={16} aria-hidden="true" />
                  </motion.span>
                )}
                {status === "sending" && (
                  <motion.span
                    key="sending"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="inline-flex items-center gap-2"
                  >
                    Opening mail app… <Loader2 size={16} aria-hidden="true" className="animate-spin" />
                  </motion.span>
                )}
                {status === "sent" && (
                  <motion.span
                    key="sent"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="inline-flex items-center gap-2"
                  >
                    Message ready <Check size={16} aria-hidden="true" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <p aria-live="polite" className="sr-only">
              {status === "sent" ? "Your email draft is ready in your mail app." : ""}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
