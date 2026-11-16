/**
 * Pop-up book data-access layer.
 *
 * Resolves everything the book prints (and its hidden HTML story) for one
 * locale. Every name, date and number is read from the domain store
 * (app/content/*); framing copy comes from the `book` dictionary in
 * app/lib/content.ts. Nothing here is invented.
 */
import { certificates } from "../../content/certificates";
import { education, experience, leadership, recognitions } from "../../content/experience";
import { site } from "../../content/profile";
import type { Lang } from "../../types/common";
import type { ExperienceItem } from "../../types/experience";
import type { Content } from "../content";
import { localized } from "./common";

/** The half-open still shown by the homepage teaser and the low-end fallback (rendered from /book?view=half-5). */
export const BOOK_STILL = "/images/book/half-5.jpg";

export type BookRole = {
  company: string;
  role: string;
  period: string;
  summary: string;
  point: string;
  stack: string;
  year: string;
};

export type BookView = {
  lang: Lang;
  author: string;
  cover: Content["book"]["cover"];
  pull: string;
  yogyakarta: { place: string; school: string; program: string; meta: string; caption: string };
  bangkit: {
    program: string;
    path: string;
    period: string;
    title: string;
    scoreLabel: string;
    score: string;
    points: string[];
    capstoneLabel: string;
    capstone: string;
    specialisations: string[];
  };
  products: { title: string; roles: [BookRole, BookRole] };
  crossing: { title: string; from: string; to: string } & BookRole;
  kumamoto: { title: string; cardLine: string; email: string; location: string } & BookRole;
  /** The same story as plain text: one heading and its paragraphs per spread. */
  story: { title: string; lines: string[] }[];
};

function role(id: string, lang: Lang): BookRole {
  const item = experience.find((entry) => entry.id === id) as ExperienceItem;
  return {
    company: item.company,
    role: localized(item.role, lang) ?? "",
    period: item.period,
    summary: localized(item.summary, lang) ?? "",
    point: localized(item.points[0], lang) ?? "",
    stack: item.stack.join(" · "),
    year: item.year,
  };
}

export function getBook(lang: Lang, content: Content): BookView {
  const copy = content.book;
  const school = education[0];
  const program = localized(school.program, lang) ?? "";
  const bangkit = recognitions[0];
  // "Bangkit Academy 2023 Batch 2 · Machine Learning Path · Remote · August 2023 - January 2024"
  const meta = (localized(bangkit.meta, lang) ?? "").split(/\s*[·・]\s*/);
  const points = (bangkit.points ?? []).map((point) => localized(point, lang) ?? "");

  const telkom = role("telkom-data-scientist-intern", lang);
  const goto = role("goto-data-scientist-intern", lang);
  const intern = role("kct-frontend-intern", lang);
  const now = role("kct-system-engineer", lang);

  const yogyakarta = {
    place: localized(leadership[0].location, lang) ?? "",
    school: school.school,
    program,
    meta: school.meta,
    caption: copy.yogyakarta.caption.replace("{program}", program).replace("{school}", school.school),
  };
  const bangkitView = {
    program: meta[0] ?? "",
    path: meta[1] ?? "",
    period: meta[meta.length - 1] ?? "",
    title: localized(bangkit.title, lang) ?? "",
    scoreLabel: copy.bangkit.scoreLabel,
    score: points[0]?.match(/\d+\.\d+/)?.[0] ?? "",
    points,
    capstoneLabel: copy.bangkit.capstoneLabel,
    capstone: points[2] ?? "",
    specialisations: certificates
      .filter((certificate) => certificate.kind === "specialization")
      .map((certificate) => certificate.title),
  };

  return {
    lang,
    author: site.name,
    cover: copy.cover,
    pull: copy.pull,
    yogyakarta,
    bangkit: bangkitView,
    products: { title: copy.products.title, roles: [telkom, goto] },
    crossing: { ...copy.crossing, ...intern },
    kumamoto: { ...copy.kumamoto, email: site.email, location: site.location, ...now },
    story: [
      { title: yogyakarta.place, lines: [yogyakarta.caption, yogyakarta.meta] },
      { title: bangkitView.program, lines: [bangkitView.title, bangkitView.path, ...points] },
      {
        title: copy.products.title,
        lines: [telkom, goto].map((r) => `${r.company}. ${r.role}, ${r.period}. ${r.point}`),
      },
      {
        title: copy.crossing.title,
        lines: [`${intern.company}. ${intern.role}, ${intern.period}.`, intern.summary],
      },
      {
        title: copy.kumamoto.title,
        lines: [`${now.company}. ${now.role}, ${now.period}.`, now.summary, copy.kumamoto.cardLine],
      },
    ],
  };
}
