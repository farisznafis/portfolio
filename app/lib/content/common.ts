/**
 * Shared helpers for the content data-access layer.
 *
 * These are the small, typed functions that sit between the static content
 * store (app/content/*) and the UI. When the store later becomes Supabase,
 * only the access functions change — components keep the same signatures.
 */
import type { Lang, LocalizedText } from "../../types/common";

/** Resolve a bilingual value for one locale, falling back to English. */
export function localized(
  text: LocalizedText | undefined,
  lang: Lang,
): string | undefined {
  if (!text) return undefined;
  return text[lang] || text.en;
}