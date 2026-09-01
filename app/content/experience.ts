/**
 * Experience / education / recognition domain content (both locales).
 *
 * Only verified items are stored. Roles, summaries, and bullet points carry
 * both locales so the UI can switch language at runtime; companies, years,
 * and tech stack are language-neutral.
 */
import type { EducationItem, ExperienceItem } from "../types/experience";
import type { LocalizedText } from "../types/common";

export const experience: ExperienceItem[] = [
  {
    id: "kct-system-engineer",
    year: "2026",
    role: { en: "System Engineer", ja: "システムエンジニア" },
    company: "Knowledge Creation Technology Co., Ltd.",
    period: "2026 - Present",
    current: true,
    summary: {
      en: "Developing web applications by understanding requirements, system design documents, and business flows; working on UI/UX, frontend implementation, and API integration.",
      ja: "要件定義とシステム設計書、業務フローを理解した上でWebアプリケーションの開発を担当。UI/UX、フロントエンド実装、API連携を担っています。",
    },
    points: [
      {
        en: "Translate requirements and system design documents into working web applications.",
        ja: "要件とシステム設計書を、動くWebアプリケーションに落とし込みます。",
      },
      {
        en: "Own UI/UX decisions and frontend implementation feature by feature.",
        ja: "UI/UXの判断とフロントエンド実装を機能単位で担当。",
      },
      {
        en: "Integrate REST APIs along defined business flows.",
        ja: "業務フローに沿ったREST API連携を実装。",
      },
    ],
    stack: ["Web Applications", "UI/UX", "Frontend", "API Integration"],
  },
  {
    id: "kct-frontend-intern",
    year: "2025",
    role: { en: "Frontend Developer Intern", ja: "フロントエンド開発インターン" },
    company: "Knowledge Creation Technology Co., Ltd.",
    period: "2025",
    current: false,
    summary: {
      en: "Frontend internship centered on an interactive AI conversation bot for Kumamoto EXPO 2025.",
      ja: "熊本EXPO 2025向けの対話型AI会話ボットのフロントエンドを中心に担当したインターン。",
    },
    points: [
      {
        en: "Designed and implemented the frontend of an interactive AI conversation bot.",
        ja: "対話型AIボットのフロントエンド設計とUI/UXデザインを担当。",
      },
      {
        en: "Built face-detection and microphone-aware interactions.",
        ja: "顔検出とマイク状態を反映したインタラクションを設計・実装。",
      },
      {
        en: "Shipped with a 3-person team; used by 80+ visitors at the expo.",
        ja: "3人のチームで開発し、来場者80名以上に利用されました。",
      },
    ],
    stack: ["Next.js", "React", "TypeScript", "face-api.js", "TensorFlow.js"],
  },
  {
    id: "goto-data-scientist-intern",
    year: "2024",
    role: { en: "Data Scientist Intern", ja: "データサイエンティストインターン" },
    company: "GoTo",
    period: "2024 - 2025",
    current: false,
    summary: {
      en: "Data science internship on an LLM-related data project.",
      ja: "LLM関連のデータプロジェクトに取り組んだインターン。",
    },
    points: [
      {
        en: "Built a data scraping and pipeline project for LLM-related data in a 2-person team.",
        ja: "LLM関連データのスクレイピングとパイプライン構築を2人チームで担当。",
      },
      {
        en: "Coordinated the work with a Singapore-based teammate.",
        ja: "シンガポール拠点のチームメイトと連携しながら進行。",
      },
    ],
    stack: ["Data Pipeline", "LLM", "Web Scraping"],
  },
  {
    id: "telkom-data-scientist-intern",
    year: "2024",
    role: { en: "Data Scientist Intern", ja: "データサイエンティストインターン" },
    company: "Telkom Indonesia",
    period: "2024",
    current: false,
    summary: {
      en: "Data science internship focused on optimization models and deployment.",
      ja: "最適化モデルの構築とデプロイを中心に担当したインターン。",
    },
    points: [
      {
        en: "Built 4 optimization models using Gurobi.",
        ja: "Gurobiを用いた最適化モデルを4本構築。",
      },
      {
        en: "Worked on deployment with Docker and Google Kubernetes Engine.",
        ja: "DockerとGoogle Kubernetes Engineを用いたデプロイ関連の作業を担当。",
      },
    ],
    stack: ["Gurobi", "Docker", "Google Kubernetes Engine"],
  },
];

export const education: EducationItem[] = [
  {
    school: "Universitas Gadjah Mada",
    program: { en: "Computer Science", ja: "コンピュータサイエンス" },
    meta: "GPA 3.83 / 4.00",
  },
];

export const recognitions: LocalizedText[] = [
  { en: "Bangkit Distinction Graduate — Top 10%", ja: "Bangkit Distinction Graduate — 上位10%" },
  { en: "3rd Place — Data Royale 2023", ja: "Data Royale 2023 — 3位" },
];