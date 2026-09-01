/**
 * Shared content-domain primitives.
 *
 * `LocalizedText` mirrors the future `project_translations` / locale columns
 * in Supabase: every user-facing string carries both locales so the UI can
 * switch language at runtime without a data round-trip.
 */

export type Lang = "en" | "ja";

/** A string that exists in both supported locales. */
export type LocalizedText = {
  en: string;
  ja: string;
};

/** About-section interest keys. Labels are localized in the copy layer. */
export type InterestKey =
  | "engineering"
  | "ai"
  | "design"
  | "photography"
  | "videography"
  | "experimentation";