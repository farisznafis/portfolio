/**
 * Experience / education / recognition domain content (both locales).
 *
 * Only verified items are stored. Roles, summaries, and bullet points carry
 * both locales so the UI can switch language at runtime; companies, years,
 * and tech stack are language-neutral.
 */
import type {
  EducationItem,
  ExperienceItem,
  LanguageItem,
  LeadershipItem,
  RecognitionItem,
} from "../types/experience";

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
    stack: ["React", "TypeScript", "Figma", "REST API Integration"],
  },
  {
    id: "kct-frontend-intern",
    year: "2025",
    role: { en: "Frontend Developer Intern", ja: "フロントエンド開発インターン" },
    company: "Knowledge Creation Technology Co., Ltd.",
    period: "February 2025 - March 2025",
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
    stack: ["Next.js", "React", "TypeScript", "FastAPI"],
  },
  {
    id: "goto-data-scientist-intern",
    year: "2024",
    role: { en: "Data Scientist Intern", ja: "データサイエンティストインターン" },
    company: "GoTo",
    period: "September 2024 - February 2025",
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
    stack: ["Selenium", "LLM", "Web Scraping"],
  },
  {
    id: "telkom-data-scientist-intern",
    year: "2024",
    role: { en: "Data Scientist Intern", ja: "データサイエンティストインターン" },
    company: "Telkom Indonesia",
    period: "January 2024 - June 2024",
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

export const recognitions: RecognitionItem[] = [
  {
    title: { en: "Bangkit Distinction Graduate — Valedictorian", ja: "Bangkit Distinction Graduate — 最優秀者" },
    meta: {
      en: "Bangkit Academy 2023 Batch 2 · Machine Learning Path · Remote · August 2023 - January 2024",
      ja: "Bangkit Academy 2023 Batch 2・機械学習コース・リモート・2023年8月〜2024年1月",
    },
    points: [
      {
        en: "Graduated as valedictorian with distinction, with an average score of 97.75.",
        ja: "平均スコア97.75で、最優秀者（Distinction）として修了。",
      },
      {
        en: "Completed 4 specialisations and earned 24 certificates.",
        ja: "4つの専門講座を修了し、24件の認定証を取得。",
      },
      {
        en: "Capstone project Financify (inflation forecasting) was selected in the Top 50 projects.",
        ja: "キャップストーンプロジェクト「Financify」（インフレ予測）がTop 50プロジェクトに選出。",
      },
    ],
  },
  { title: { en: "3rd Place — Data Royale 2023", ja: "Data Royale 2023 — 3位" } },
];

export const languages: LanguageItem[] = [
  { name: { en: "Indonesian", ja: "インドネシア語" }, level: { en: "Native", ja: "ネイティブ" } },
  {
    name: { en: "English", ja: "英語" },
    level: { en: "Intermediate", ja: "中級" },
  },
  { name: { en: "Japanese", ja: "日本語" }, level: { en: "JLPT N3 · BJT 324", ja: "JLPT N3・BJT 324点" } },
];

export const leadership: LeadershipItem[] = [
  {
    id: "himakom-medinfo",
    organisation: "HIMAKOM UGM",
    location: { en: "Yogyakarta", ja: "ジョグジャカルタ" },
    period: "August 2022 - December 2023",
    role: { en: "Vice Head of Media & Information", ja: "メディア・情報部 副部長" },
    unit: {
      en: "Computer Science Student Association · External Relations Division",
      ja: "コンピュータサイエンス学生会・渉外局",
    },
    points: [
      {
        en: "Led a team of 6 to plan, schedule and design content for the organisation's social media, mainly Instagram.",
        ja: "6名のチームを率い、Instagramを中心とした公式SNSのコンテンツ企画・投稿スケジュール管理・デザインを担当。",
      },
      {
        en: "Grew the account to 2,816 followers by regularly posting activities, updates and events.",
        ja: "活動報告やお知らせ、イベント情報を継続的に発信し、フォロワー数を2,816名まで拡大。",
      },
    ],
  },
  {
    id: "makomti-recruitment-2022",
    organisation: "MAKOMTI Member Recruitment 2022",
    location: { en: "Yogyakarta", ja: "ジョグジャカルタ" },
    period: "June 2022 - September 2022",
    role: {
      en: "Coordinator of Design Division & Documentation Staff",
      ja: "デザイン部門コーディネーター 兼 記録担当",
    },
    points: [
      {
        en: "Led a 3-person design team: a 21-page recruitment website for desktop and mobile, event banners, 25 committee co-cards and social media posters.",
        ja: "3名のデザインチームを率い、デスクトップ・モバイル対応の全21ページの採用サイト、イベントバナー、運営委員用コーカード25点、SNS用ポスターを制作。",
      },
      {
        en: "Coordinated with other divisions to keep timelines and assets aligned; consolidated all event photos into one shared archive.",
        ja: "他部門と連携してスケジュールと制作物の整合を図り、イベント写真を一つの共有アーカイブに集約。",
      },
    ],
    href: "/work/makomti-recruitment",
  },
];