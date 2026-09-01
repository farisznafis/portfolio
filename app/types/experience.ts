/**
 * Experience / education / capabilities domain types.
 *
 * Mirrors the future `experiences`, `education` and `recognitions` tables,
 * with localized text stored per locale (project_translations-style).
 */
import type { LocalizedText } from "./common";

export type ExperienceItem = {
  /** Stable identifier — becomes a UUID in Supabase. */
  id: string;
  year: string;
  period: string;
  current: boolean;
  company: string;
  role: LocalizedText;
  summary: LocalizedText;
  points: LocalizedText[];
  stack: string[];
};

export type EducationItem = {
  school: string;
  program: LocalizedText;
  meta: string;
};

export type CapabilityGroup = {
  title: LocalizedText;
  skills: LocalizedText[];
};