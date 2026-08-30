"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { en, ja, type Content, type Lang } from "./content";

const STORAGE_KEY = "lang";

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  content: Content;
};

const LangContext = createContext<LangContextValue | null>(null);

/**
 * Holds the active language and its content dictionary.
 * Defaults to English; remembers the last choice in localStorage and
 * keeps <html lang> in sync.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Restore the saved preference after hydration (safe default "en" during SSR).
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "ja") setLangState(stored);
    } catch {
      // localStorage unavailable - keep default
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore write failures (private mode etc.)
    }
  }, []);

  const value = useMemo<LangContextValue>(
    () => ({ lang, setLang, content: lang === "ja" ? ja : en }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within a LanguageProvider");
  return ctx;
}