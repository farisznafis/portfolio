/**
 * Experience / education / capabilities data-access layer.
 *
 * Same pattern as app/lib/content/projects.ts: small typed functions that
 * resolve the domain store (app/content/*) for a locale. The store can later
 * become Supabase without changing these signatures.
 */
import { capabilityGroups } from "../../content/capabilities";
import { education as educationStore, experience as experienceStore, recognitions } from "../../content/experience";
import type { Lang } from "../../types/common";
import { localized } from "./common";

/** One experience chapter, resolved for a locale. */
export type ExperienceView = {
  year: string;
  period: string;
  current: boolean;
  company: string;
  role: string;
  summary: string;
  points: string[];
  stack: string[];
};

export type EducationView = {
  items: { school: string; program: string; meta: string }[];
  recognition: string[];
};

export type CapabilityView = { title: string; skills: string[] };

export function getExperience(lang: Lang): ExperienceView[] {
  return experienceStore.map((item) => ({
    year: item.year,
    period: item.period,
    current: item.current,
    company: item.company,
    role: localized(item.role, lang) ?? item.company,
    summary: localized(item.summary, lang) ?? "",
    points: item.points.map((point) => localized(point, lang) ?? ""),
    stack: item.stack,
  }));
}

export function getEducation(lang: Lang): EducationView {
  return {
    items: educationStore.map((item) => ({
      school: item.school,
      program: localized(item.program, lang) ?? item.school,
      meta: item.meta,
    })),
    recognition: recognitions.map((item) => localized(item, lang) ?? ""),
  };
}

export function getCapabilities(lang: Lang): CapabilityView[] {
  return capabilityGroups.map((group) => ({
    title: localized(group.title, lang) ?? "",
    skills: group.skills.map((skill) => localized(skill, lang) ?? ""),
  }));
}