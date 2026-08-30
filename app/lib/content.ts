/**
 * Localized site content - English (en) and Japanese (ja).
 *
 * `Content` is an explicit interface, so TypeScript guarantees both languages
 * have exactly the same shape. Add a key to `Content` and typecheck will
 * fail until both `en` and `ja` define it.
 *
 * Case study copy lives in app/lib/caseStudies.ts.
 *
 * {name} / {count} / {title} tokens are interpolated by the component that
 * renders the string.
 *
 * Accuracy rules: no invented employers, metrics, links, or dates. Anything
 * unverified is left out and marked TODO_REAL_CONTENT in a comment.
 */
import type { InterestKey, ProjectField, ProjectKey } from "./data";

export type Lang = "en" | "ja";

export type ProjectItem = {
  key: ProjectKey;
  title: string;
  /** Omitted when the real year is not verified. */
  year?: string;
  /** Omitted when the real role title is not verified. */
  role?: string;
  description: string;
};

export type CaseStudyStep = {
  tag: string;
  title: string;
  description: string;
};

export type CaseStudyFeature = {
  title: string;
  description: string;
};

/**
 * Per-project case study content. Keyed by CaseStudyKey so TypeScript
 * guarantees every case study exists in both languages.
 */
export type CaseStudy = {
  overview: string;
  /** sr-only label for the meta panel under the hero. */
  atAGlance: string;
  challenge: { heading: string; lead: string; body: string };
  approach: { kicker: string; heading: string; steps: CaseStudyStep[] };
  features: { heading: string; items: CaseStudyFeature[] };
  /** sr-only label for the gallery section. */
  galleryLabel: string;
  outcomes: { kicker: string; heading: string; items: string[] };
  /** sr-only label for the next-project section. */
  nextLabel: string;
};

export interface Content {
  nav: {
    ariaPrimary: string;
    ariaLogo: string;
    ariaGithub: string;
    ariaMenu: string;
    ariaClose: string;
    ariaLang: string;
    links: {
      work: string;
      projects: string;
      experience: string;
      capabilities: string;
      about: string;
      contact: string;
    };
  };
  loader: { ariaLabel: string; wordmark: string };
  hero: {
    ariaSection: string;
    role: string;
    statement: string;
    metaLocation: string;
    metaAvailability: string;
    ctaWork: string;
    ctaTouch: string;
    hint: string;
  };
  manifesto: {
    ariaSection: string;
    lead: string;
    support: string;
  };
  /** Field labels shared by the Home reel and the /projects filters. */
  fields: Record<ProjectField, string>;
  fieldsAll: string;
  work: {
    ariaSection: string;
    heading: string;
    countLabel: string;
    viewAll: string;
    viewCaseStudy: string;
    liveDemo: string;
    source: string;
    figma: string;
    techAria: string;
    confidentialNote: string;
    items: ProjectItem[];
  };
  projects: {
    ariaSection: string;
    heading: string;
    blurb: string;
    countLabel: string;
    filterAria: string;
    empty: string;
    caseStudyCta: string;
    repoCta: string;
    demoCta: string;
    figmaCta: string;
    linkCta: string;
    confidentialNote: string;
    items: ProjectItem[];
  };
  experience: {
    ariaSection: string;
    heading: string;
    now: string;
    techAria: string;
    items: {
      year: string;
      role: string;
      company: string;
      period: string;
      current: boolean;
      summary: string;
      points: string[];
      stack: string[];
    }[];
  };
  education: {
    ariaSection: string;
    heading: string;
    items: { school: string; program: string; meta: string }[];
    recognitionHeading: string;
    recognition: string[];
  };
  capabilities: {
    ariaSection: string;
    heading: string;
    blurb: string;
    groups: { title: string; skills: string[] }[];
  };
  about: {
    ariaSection: string;
    heading: string;
    paragraphs: string[];
    quote: string;
    interestsIntro: string;
    interests: Record<InterestKey, { label: string }>;
  };
  lab: {
    ariaSection: string;
    heading: string;
  };
  contact: {
    ariaSection: string;
    line1: string;
    line2: string;
    emailAria: string;
    socialsAria: string;
    rights: string;
    backTop: string;
  };
}

export const en: Content = {
  nav: {
    ariaPrimary: "Primary",
    ariaLogo: "home",
    ariaGithub: "GitHub profile",
    ariaMenu: "Open menu",
    ariaClose: "Close menu",
    ariaLang: "Change language",
    links: {
      work: "Work",
      projects: "Projects",
      experience: "Experience",
      capabilities: "Capabilities",
      about: "About",
      contact: "Contact",
    },
  },
  loader: {
    ariaLabel: "Loading portfolio",
    wordmark: "Faris Znafis",
  },
  hero: {
    ariaSection: "Introduction",
    role: "Software Engineer — Frontend, UI/UX & AI",
    statement:
      "I build products where interface and intelligence meet — from user flows to shipped frontend.",
    metaLocation: "Kumamoto, Japan",
    metaAvailability: "Open to opportunities in Japan",
    ctaWork: "View my work",
    ctaTouch: "Get in touch",
    hint: "Move your cursor to reveal what sits beneath.",
  },
  manifesto: {
    ariaSection: "Statement",
    lead: "Frontend engineering with product thinking.",
    support:
      "I work from requirements and user flows through UI/UX design, frontend implementation, and API integration. My background in machine learning and data helps me build products where interface and intelligence meet.",
  },
  fields: {
    Frontend: "Frontend",
    "AI / ML": "AI / ML",
    "Data / Optimization": "Data / Optimization",
    "UI / UX": "UI / UX",
    "Visual Design": "Visual Design",
  },
  fieldsAll: "All",
  work: {
    ariaSection: "Selected work",
    heading: "Selected work",
    countLabel: "FEATURED PROJECTS",
    viewAll: "View all projects",
    viewCaseStudy: "Read the {title} case study",
    liveDemo: "Live demo",
    source: "Source",
    figma: "Figma",
    techAria: "Technology stack",
    confidentialNote: "Professional work — details kept general.",
    items: [
      {
        key: "carbon-monitoring",
        title: "Carbon Monitoring SaaS",
        year: "2026",
        role: "Software Engineer / Frontend Engineer",
        description:
          "B2B carbon monitoring SaaS developed in a 5-member team, featuring role-based workflows for Admin, Master, and User, a 4-step onboarding flow, and REST API integrations.",
      },
      {
        key: "kumamotalk",
        title: "Kumamotalk — Interactive AI Conversation Bot",
        year: "2025",
        role: "Frontend Engineer & UI/UX Designer",
        description:
          "Interactive AI conversation bot developed for Kumamoto EXPO 2025. I designed and implemented the frontend with face-detection and microphone-aware interactions, used by 80+ visitors.",
      },
      {
        key: "makomti-recruitment",
        title: "MAKOMTI Recruitment — Web & Visual Campaign",
        year: "2023",
        role: "UI/UX Designer / Visual Designer",
        description:
          "Recruitment website of roughly 21 pages designed for desktop and mobile in a 3-person team, supported by recruitment campaign visuals.",
      },
      {
        key: "speech-emotion",
        title: "Speech Emotion Recognition",
        year: "2024",
        role: "Machine Learning Developer",
        description:
          "Audio emotion recognition system that extracts ZCR, RMS, and MFCC features and uses a TensorFlow/Keras model to classify speech into six emotion categories through a Streamlit interface.",
      },
      {
        key: "financify",
        title: "Financify — Inflation Forecasting",
        year: "2023",
        role: "Machine Learning Engineer",
        description:
          "Machine-learning application for forecasting inflation across Indonesian cities and periods using an LSTM model, developed as a Bangkit capstone project.",
      },
    ],
  },
  projects: {
    ariaSection: "All projects",
    heading: "Projects",
    blurb:
      "Every project across frontend, AI/ML, data, and design — full case studies and shorter records alike. Filter by field.",
    countLabel: "{count} projects",
    filterAria: "Filter projects by field",
    empty: "No projects in this field yet.",
    caseStudyCta: "Case study",
    repoCta: "Source",
    demoCta: "Live",
    figmaCta: "Figma",
    linkCta: "Link",
    confidentialNote: "Professional work — details kept general.",
    items: [
      {
        key: "carbon-monitoring",
        title: "Carbon Monitoring SaaS",
        year: "2026",
        role: "Software Engineer / Frontend Engineer",
        description:
          "B2B carbon monitoring SaaS developed in a 5-member team, featuring role-based workflows for Admin, Master, and User, a 4-step onboarding flow, and REST API integrations.",
      },
      {
        key: "kumamotalk",
        title: "Kumamotalk — Interactive AI Conversation Bot",
        year: "2025",
        role: "Frontend Engineer & UI/UX Designer",
        description:
          "Interactive AI conversation bot developed for Kumamoto EXPO 2025. I designed and implemented the frontend with face-detection and microphone-aware interactions, used by 80+ visitors.",
      },
      {
        key: "makomti-recruitment",
        title: "MAKOMTI Recruitment — Web & Visual Campaign",
        year: "2023",
        role: "UI/UX Designer / Visual Designer",
        description:
          "Recruitment website of roughly 21 pages designed for desktop and mobile in a 3-person team, supported by recruitment campaign visuals.",
      },
      {
        key: "speech-emotion",
        title: "Speech Emotion Recognition",
        year: "2024",
        role: "Machine Learning Developer",
        description:
          "Audio emotion recognition system that extracts ZCR, RMS, and MFCC features and uses a TensorFlow/Keras model to classify speech into six emotion categories through a Streamlit interface.",
      },
      {
        key: "financify",
        title: "Financify — Inflation Forecasting",
        year: "2023",
        role: "Machine Learning Engineer",
        description:
          "Machine-learning application for forecasting inflation across Indonesian cities and periods using an LSTM model, developed as a Bangkit capstone project.",
      },
      {
        key: "blastout",
        title: "BLASTOUT 2023 Website",
        description: "Event website design for BLASTOUT 2023.",
      },
      {
        key: "co2-emission",
        title: "CO2 Emission Prediction for Four-Wheeled Vehicles",
        description:
          "Machine-learning model predicting CO2 emissions for four-wheeled vehicles.",
      },
      {
        key: "suicide-risk",
        title: "Suicide Risk Detection from Text",
        description: "NLP model detecting suicide-risk signals from text.",
      },
      {
        key: "face-to-comic",
        title: "Face-to-Comic Image Generator",
        description:
          "Image generation pipeline that turns face photos into comic-style portraits.",
      },
      {
        key: "building-damage",
        title: "Building Damage Grade Prediction",
        description:
          "Model predicting building damage grades from survey data.",
      },
      {
        key: "llm-pipeline",
        title: "LLM Customer Service Data Pipeline",
        role: "Data Scientist Intern",
        description:
          "LLM-related data scraping and pipeline work, built with a Singapore-based teammate during a data science internship.",
      },
      {
        key: "optimization-web",
        title: "Optimization Models & Web Applications",
        role: "Data Scientist Intern",
        description:
          "Four optimization models built with Gurobi in a 5-member team, with deployment work using Docker and Google Kubernetes Engine.",
      },
      {
        key: "himakom-visual",
        title: "HIMAKOM Social Media & Visual Identity",
        description:
          "Social media and visual identity work for HIMAKOM, leading and coordinating a 6-member team.",
      },
      {
        key: "portfolio-v3",
        title: "Portfolio v3",
        year: "2026",
        role: "Design & Development",
        description:
          "This site — an editorial, motion-heavy portfolio built with Next.js, GSAP, Framer Motion, and Three.js.",
      },
    ],
  },
  experience: {
    ariaSection: "Career history",
    heading: "Experience",
    now: "Present",
    techAria: "Technologies used",
    items: [
      {
        year: "2026",
        role: "System Engineer",
        company: "Knowledge Creation Technology Co., Ltd.",
        period: "2026 - Present",
        current: true,
        summary:
          "Developing web applications by understanding requirements, system design documents, and business flows; working on UI/UX, frontend implementation, and API integration.",
        points: [
          "Translate requirements and system design documents into working web applications.",
          "Own UI/UX decisions and frontend implementation feature by feature.",
          "Integrate REST APIs along defined business flows.",
        ],
        stack: ["Web Applications", "UI/UX", "Frontend", "API Integration"],
      },
      {
        year: "2025",
        role: "Frontend Developer Intern",
        company: "Knowledge Creation Technology Co., Ltd.",
        period: "2025",
        current: false,
        summary:
          "Frontend internship centered on an interactive AI conversation bot for Kumamoto EXPO 2025.",
        points: [
          "Designed and implemented the frontend of an interactive AI conversation bot.",
          "Built face-detection and microphone-aware interactions.",
          "Shipped with a 3-person team; used by 80+ visitors at the expo.",
        ],
        stack: ["Next.js", "React", "TypeScript", "face-api.js", "TensorFlow.js"],
      },
      {
        year: "2024",
        role: "Data Scientist Intern",
        company: "GoTo",
        period: "2024 - 2025",
        current: false,
        summary: "Data science internship on an LLM-related data project.",
        points: [
          "Built a data scraping and pipeline project for LLM-related data in a 2-person team.",
          "Coordinated the work with a Singapore-based teammate.",
        ],
        stack: ["Data Pipeline", "LLM", "Web Scraping"],
      },
      {
        year: "2024",
        role: "Data Scientist Intern",
        company: "Telkom Indonesia",
        period: "2024",
        current: false,
        summary:
          "Data science internship focused on optimization models and deployment.",
        points: [
          "Built 4 optimization models using Gurobi.",
          "Worked on deployment with Docker and Google Kubernetes Engine.",
        ],
        stack: ["Gurobi", "Docker", "Google Kubernetes Engine"],
      },
    ],
  },
  education: {
    ariaSection: "Education and recognition",
    heading: "Education & recognition",
    items: [
      {
        school: "Universitas Gadjah Mada",
        program: "Computer Science",
        meta: "GPA 3.83 / 4.00",
      },
    ],
    recognitionHeading: "Recognition",
    recognition: [
      "Bangkit Distinction Graduate — Top 10%",
      "3rd Place — Data Royale 2023",
    ],
  },
  capabilities: {
    ariaSection: "Capabilities",
    heading: "Capabilities",
    blurb:
      "Four layers of one practice: the interfaces I build, the product thinking behind them, the intelligence underneath, and the delivery path to production.",
    groups: [
      {
        title: "Frontend Engineering",
        skills: [
          "React",
          "TypeScript",
          "Next.js",
          "Vite",
          "REST APIs",
          "React Router",
          "React Hook Form",
          "Zod",
        ],
      },
      {
        title: "Product & UI/UX",
        skills: [
          "Figma",
          "UI/UX Design",
          "User Flows",
          "Prototyping",
          "Responsive Design",
          "Design Systems",
        ],
      },
      {
        title: "AI & Data",
        skills: [
          "Python",
          "TensorFlow / Keras",
          "Machine Learning",
          "Computer Vision",
          "LLM Data Pipelines",
          "Librosa",
          "Gurobi",
        ],
      },
      {
        title: "Delivery & Cloud",
        skills: [
          "Git / GitHub",
          "Docker",
          "Kubernetes",
          "Google Kubernetes Engine",
          "Flask / FastAPI",
        ],
      },
    ],
  },
  about: {
    ariaSection: "About Faris",
    heading: "Where interface meets intelligence",
    paragraphs: [
      "I'm a software engineer based in Kumamoto, Japan. I enjoy taking products from requirements and user flows to Figma, frontend implementation, and API integration.",
      "Before focusing on frontend, I worked on machine learning, optimization, and data projects. That background shaped how I think about software.",
      "Outside of work, I enjoy experimenting with AI, photography, videography, and editing.",
    ],
    quote:
      "\u201CUseful products need both clear interfaces and solid technical reasoning.\u201D",
    interestsIntro: "Hover each interest for a glimpse of what feeds it.",
    interests: {
      engineering: { label: "Engineering" },
      ai: { label: "AI" },
      design: { label: "Design" },
      photography: { label: "Photography" },
      videography: { label: "Videography" },
      experimentation: { label: "Experimentation" },
    },
  },
  lab: {
    ariaSection: "Experiments",
    heading: "Currently experimenting",
  },
  contact: {
    ariaSection: "Contact",
    line1: "LET'S BUILD SOMETHING",
    line2: "PEOPLE REMEMBER.",
    emailAria: "Email Faris Zaidan Nafis",
    socialsAria: "Social profiles",
    rights: "All rights reserved.",
    backTop: "Back to top",
  },
};

export const ja: Content = {
  nav: {
    ariaPrimary: "メイン",
    ariaLogo: "ホーム",
    ariaGithub: "GitHubプロフィール",
    ariaMenu: "メニューを開く",
    ariaClose: "メニューを閉じる",
    ariaLang: "言語を切り替える",
    links: {
      work: "実績",
      projects: "プロジェクト",
      experience: "経歴",
      capabilities: "スキル",
      about: "概要",
      contact: "お問い合わせ",
    },
  },
  loader: {
    ariaLabel: "ポートフォリオを読み込み中",
    wordmark: "Faris Znafis",
  },
  hero: {
    ariaSection: "はじめに",
    role: "ソフトウェアエンジニア — フロントエンド・UI/UX・AI",
    statement:
      "インターフェースと知性が出会うプロダクトを。ユーザーフローから、届くフロントエンドまで。",
    metaLocation: "日本・熊本",
    metaAvailability: "日本での機会を歓迎します",
    ctaWork: "作品を見る",
    ctaTouch: "お問い合わせ",
    hint: "カーソルを動かすと、その下にあるものが見えます。",
  },
  manifesto: {
    ariaSection: "ステートメント",
    lead: "プロダクト思考のフロントエンドエンジニアリング。",
    support:
      "要件とユーザーフローから出発し、UI/UXデザイン、フロントエンド実装、API連携までを一気通貫で担います。機械学習とデータのバックグラウンドがあるからこそ、インターフェースと知性が出会うプロダクトを作れます。",
  },
  fields: {
    Frontend: "フロントエンド",
    "AI / ML": "AI / ML",
    "Data / Optimization": "データ / 最適化",
    "UI / UX": "UI / UX",
    "Visual Design": "ビジュアルデザイン",
  },
  fieldsAll: "すべて",
  work: {
    ariaSection: "厳選した作品",
    heading: "厳選した作品",
    countLabel: "注目プロジェクト",
    viewAll: "すべてのプロジェクトを見る",
    viewCaseStudy: "{title}のケーススタディを見る",
    liveDemo: "ライブデモ",
    source: "ソースコード",
    figma: "Figma",
    techAria: "技術スタック",
    confidentialNote: "業務プロジェクトのため、詳細は概要レベルで記載。",
    items: [
      {
        key: "carbon-monitoring",
        title: "Carbon Monitoring SaaS",
        year: "2026",
        role: "ソフトウェアエンジニア / フロントエンドエンジニア",
        description:
          "5人のチームで開発したB2B向けカーボンモニタリングSaaS。Admin・Master・Userのロール別ワークフロー、4ステップのオンボーディングフロー、REST API連携を担当しました。",
      },
      {
        key: "kumamotalk",
        title: "Kumamotalk — Interactive AI Conversation Bot",
        year: "2025",
        role: "フロントエンドエンジニア & UI/UXデザイナー",
        description:
          "熊本EXPO 2025向けに開発した対話型AI会話ボット。顔検出とマイクの状態を反映したインタラクションを備えたフロントエンドを設計・実装し、来場者80名以上に利用されました。",
      },
      {
        key: "makomti-recruitment",
        title: "MAKOMTI Recruitment — Web & Visual Campaign",
        year: "2023",
        role: "UI/UXデザイナー / ビジュアルデザイナー",
        description:
          "約21ページで構成される採用サイトを、3人のチームでデスクトップとモバイル向けにデザイン。採用キャンペーンのビジュアル素材も制作しました。",
      },
      {
        key: "speech-emotion",
        title: "Speech Emotion Recognition",
        year: "2024",
        role: "機械学習デベロッパー",
        description:
          "ZCR・RMS・MFCCの特徴量を抽出し、TensorFlow/Kerasモデルで音声を6つの感情カテゴリに分類するシステム。Streamlitのインターフェースから利用できます。",
      },
      {
        key: "financify",
        title: "Financify — Inflation Forecasting",
        year: "2023",
        role: "機械学習エンジニア",
        description:
          "Bangkitのキャップストーンプロジェクトとして開発した、LSTMモデルによるインドネシア各都市・各期間のインフレ予測アプリケーション。",
      },
    ],
  },
  projects: {
    ariaSection: "すべてのプロジェクト",
    heading: "プロジェクト",
    blurb:
      "フロントエンド、AI/ML、データ、デザインを横断するすべてのプロジェクト。完全なケーススタディと短い記録の両方を収録し、分野で絞り込めます。",
    countLabel: "{count}件のプロジェクト",
    filterAria: "分野でプロジェクトを絞り込む",
    empty: "この分野のプロジェクトはまだありません。",
    caseStudyCta: "ケーススタディ",
    repoCta: "ソース",
    demoCta: "ライブ",
    figmaCta: "Figma",
    linkCta: "リンク",
    confidentialNote: "業務プロジェクトのため、詳細は概要レベルで記載。",
    items: [
      {
        key: "carbon-monitoring",
        title: "Carbon Monitoring SaaS",
        year: "2026",
        role: "ソフトウェアエンジニア / フロントエンドエンジニア",
        description:
          "5人のチームで開発したB2B向けカーボンモニタリングSaaS。Admin・Master・Userのロール別ワークフロー、4ステップのオンボーディングフロー、REST API連携を担当しました。",
      },
      {
        key: "kumamotalk",
        title: "Kumamotalk — Interactive AI Conversation Bot",
        year: "2025",
        role: "フロントエンドエンジニア & UI/UXデザイナー",
        description:
          "熊本EXPO 2025向けに開発した対話型AI会話ボット。顔検出とマイクの状態を反映したインタラクションを備えたフロントエンドを設計・実装し、来場者80名以上に利用されました。",
      },
      {
        key: "makomti-recruitment",
        title: "MAKOMTI Recruitment — Web & Visual Campaign",
        year: "2023",
        role: "UI/UXデザイナー / ビジュアルデザイナー",
        description:
          "約21ページで構成される採用サイトを、3人のチームでデスクトップとモバイル向けにデザイン。採用キャンペーンのビジュアル素材も制作しました。",
      },
      {
        key: "speech-emotion",
        title: "Speech Emotion Recognition",
        year: "2024",
        role: "機械学習デベロッパー",
        description:
          "ZCR・RMS・MFCCの特徴量を抽出し、TensorFlow/Kerasモデルで音声を6つの感情カテゴリに分類するシステム。Streamlitのインターフェースから利用できます。",
      },
      {
        key: "financify",
        title: "Financify — Inflation Forecasting",
        year: "2023",
        role: "機械学習エンジニア",
        description:
          "Bangkitのキャップストーンプロジェクトとして開発した、LSTMモデルによるインドネシア各都市・各期間のインフレ予測アプリケーション。",
      },
      {
        key: "blastout",
        title: "BLASTOUT 2023 Website",
        description: "BLASTOUT 2023のイベントサイトのWebデザイン。",
      },
      {
        key: "co2-emission",
        title: "CO2 Emission Prediction for Four-Wheeled Vehicles",
        description: "四輪車のCO2排出量を予測する機械学習モデル。",
      },
      {
        key: "suicide-risk",
        title: "Suicide Risk Detection from Text",
        description: "テキストから自殺リスクの兆候を検出するNLPモデル。",
      },
      {
        key: "face-to-comic",
        title: "Face-to-Comic Image Generator",
        description: "顔写真をコミック風のポートレートに変換する画像生成パイプライン。",
      },
      {
        key: "building-damage",
        title: "Building Damage Grade Prediction",
        description: "調査データから建物の損傷グレードを予測するモデル。",
      },
      {
        key: "llm-pipeline",
        title: "LLM Customer Service Data Pipeline",
        role: "データサイエンティストインターン",
        description:
          "データサイエンスインターン期間中、シンガポール拠点のチームメイトとともに進めたLLM関連データのスクレイピングとパイプライン構築。",
      },
      {
        key: "optimization-web",
        title: "Optimization Models & Web Applications",
        role: "データサイエンティストインターン",
        description:
          "5人のチームでGurobiを用いて構築した4つの最適化モデルと、Docker・Google Kubernetes Engineを使ったデプロイ関連の作業。",
      },
      {
        key: "himakom-visual",
        title: "HIMAKOM Social Media & Visual Identity",
        description:
          "HIMAKOMのソーシャルメディアとビジュアルアイデンティティの仕事。6人のチームメンバーをまとめました。",
      },
      {
        key: "portfolio-v3",
        title: "Portfolio v3",
        year: "2026",
        role: "デザイン & 開発",
        description:
          "このサイト。Next.js・GSAP・Framer Motion・Three.jsで構築した、エディトリアルでモーション中心のポートフォリオ。",
      },
    ],
  },
  experience: {
    ariaSection: "職歴",
    heading: "経歴",
    now: "現在",
    techAria: "使用技術",
    items: [
      {
        year: "2026",
        role: "システムエンジニア",
        company: "Knowledge Creation Technology Co., Ltd.",
        period: "2026 - 現在",
        current: true,
        summary:
          "要件定義とシステム設計書、業務フローを理解した上でWebアプリケーションの開発を担当。UI/UX、フロントエンド実装、API連携を担っています。",
        points: [
          "要件とシステム設計書を、動くWebアプリケーションに落とし込みます。",
          "UI/UXの判断とフロントエンド実装を機能単位で担当。",
          "業務フローに沿ったREST API連携を実装。",
        ],
        stack: ["Web Applications", "UI/UX", "Frontend", "API Integration"],
      },
      {
        year: "2025",
        role: "フロントエンド開発インターン",
        company: "Knowledge Creation Technology Co., Ltd.",
        period: "2025",
        current: false,
        summary:
          "熊本EXPO 2025向けの対話型AI会話ボットのフロントエンドを中心に担当したインターン。",
        points: [
          "対話型AIボットのフロントエンド設計とUI/UXデザインを担当。",
          "顔検出とマイク状態を反映したインタラクションを設計・実装。",
          "3人のチームで開発し、来場者80名以上に利用されました。",
        ],
        stack: ["Next.js", "React", "TypeScript", "face-api.js", "TensorFlow.js"],
      },
      {
        year: "2024",
        role: "データサイエンティストインターン",
        company: "GoTo",
        period: "2024 - 2025",
        current: false,
        summary: "LLM関連のデータプロジェクトに取り組んだインターン。",
        points: [
          "LLM関連データのスクレイピングとパイプライン構築を2人チームで担当。",
          "シンガポール拠点のチームメイトと連携しながら進行。",
        ],
        stack: ["Data Pipeline", "LLM", "Web Scraping"],
      },
      {
        year: "2024",
        role: "データサイエンティストインターン",
        company: "Telkom Indonesia",
        period: "2024",
        current: false,
        summary: "最適化モデルの構築とデプロイを中心に担当したインターン。",
        points: [
          "Gurobiを用いた最適化モデルを4本構築。",
          "DockerとGoogle Kubernetes Engineを用いたデプロイ関連の作業を担当。",
        ],
        stack: ["Gurobi", "Docker", "Google Kubernetes Engine"],
      },
    ],
  },
  education: {
    ariaSection: "学歴と実績",
    heading: "学歴と実績",
    items: [
      {
        school: "Universitas Gadjah Mada",
        program: "コンピュータサイエンス",
        meta: "GPA 3.83 / 4.00",
      },
    ],
    recognitionHeading: "受賞・認定",
    recognition: [
      "Bangkit Distinction Graduate — 上位10%",
      "Data Royale 2023 — 3位",
    ],
  },
  capabilities: {
    ariaSection: "スキル",
    heading: "スキル",
    blurb:
      "一つの実践を四つの層で。作るインターフェース、その背後のプロダクト思考、土台のインテリジェンス、そして本番までのデリバリー。",
    groups: [
      {
        title: "フロントエンドエンジニアリング",
        skills: [
          "React",
          "TypeScript",
          "Next.js",
          "Vite",
          "REST API",
          "React Router",
          "React Hook Form",
          "Zod",
        ],
      },
      {
        title: "プロダクト & UI/UX",
        skills: [
          "Figma",
          "UI/UXデザイン",
          "ユーザーフロー",
          "プロトタイピング",
          "レスポンシブデザイン",
          "デザインシステム",
        ],
      },
      {
        title: "AI & データ",
        skills: [
          "Python",
          "TensorFlow / Keras",
          "機械学習",
          "コンピュータビジョン",
          "LLMデータパイプライン",
          "Librosa",
          "Gurobi",
        ],
      },
      {
        title: "デリバリー & クラウド",
        skills: [
          "Git / GitHub",
          "Docker",
          "Kubernetes",
          "Google Kubernetes Engine",
          "Flask / FastAPI",
        ],
      },
    ],
  },
  about: {
    ariaSection: "ファリスについて",
    heading: "インターフェースと知性が出会う場所",
    paragraphs: [
      "私は日本・熊本を拠点にするソフトウェアエンジニアです。要件とユーザーフローから出発して、Figmaでのデザイン、フロントエンド実装、API連携までプロダクトを形にするのが好きです。",
      "フロントエンドに軸を移す前は、機械学習・最適化・データのプロジェクトに携わっていました。その経験が、ソフトウェアへの向き合い方を形作りました。",
      "仕事の外では、AI、写真、映像制作、編集を楽しんでいます。",
    ],
    quote:
      "「役に立つプロダクトには、明快なインターフェースと確かな技術的思考の両方が必要です。」",
    interestsIntro: "気になる分野にカーソルを合わせると、その世界を覗けます。",
    interests: {
      engineering: { label: "エンジニアリング" },
      ai: { label: "AI" },
      design: { label: "デザイン" },
      photography: { label: "写真" },
      videography: { label: "映像制作" },
      experimentation: { label: "実験" },
    },
  },
  lab: {
    ariaSection: "実験",
    heading: "いま実験していること",
  },
  contact: {
    ariaSection: "お問い合わせ",
    line1: "記憶に残るものを",
    line2: "一緒に創ろう。",
    emailAria: "ファリス・ザイダン・ナフィスにメールを送る",
    socialsAria: "ソーシャルプロフィール",
    rights: "無断転載を禁じます。",
    backTop: "トップへ戻る",
  },
};