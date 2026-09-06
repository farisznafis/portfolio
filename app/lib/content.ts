/**
 * Localized UI copy — English (en) and Japanese (ja).
 *
 * `Content` is an explicit interface, so TypeScript guarantees both languages
 * have exactly the same shape. Add a key to `Content` and typecheck will
 * fail until both `en` and `ja` define it.
 *
 * This file holds only RENDERING strings (navigation, hero, sections, CTAs,
 * aria labels). Domain content — projects, experience, education,
 * recognitions, capabilities and profile — lives in app/content/* and is
 * read exclusively through the data-access layer in app/lib/content/*.
 *
 * {name} / {count} / {title} tokens are interpolated by the component that
 * renders the string.
 *
 * Accuracy rules: no invented employers, metrics, links, or dates. Anything
 * unverified is left out and marked TODO_REAL_CONTENT in a comment.
 */
import type { InterestKey } from "../types/common";
import type { ProjectField } from "../types/project";

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
  caseStudy: {
    role: string;
    year: string;
    fields: string;
    stack: string;
    processDetails: string;
    openImage: string;
  };
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
  };
  experience: {
    ariaSection: string;
    heading: string;
    now: string;
    techAria: string;
  };
  education: {
    ariaSection: string;
    heading: string;
    recognitionHeading: string;
  };
  capabilities: {
    ariaSection: string;
    heading: string;
    blurb: string;
  };
  about: {
    ariaSection: string;
    heading: string;
    paragraphs: string[];
    quote: string;
    interestsIntro: string;
    interests: Record<InterestKey, { label: string }>;
  };
  lab: { ariaSection: string; heading: string };
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
  caseStudy: {
    role: "Role",
    year: "Year",
    fields: "Fields",
    stack: "Stack",
    processDetails: "Process details",
    openImage: "Open original image",
  },
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
  },
  experience: {
    ariaSection: "Career history",
    heading: "Experience",
    now: "Present",
    techAria: "Technologies used",
  },
  education: {
    ariaSection: "Education and recognition",
    heading: "Education & recognition",
    recognitionHeading: "Recognition",
  },
  capabilities: {
    ariaSection: "Capabilities",
    heading: "Capabilities",
    blurb:
      "Four layers of one practice: the interfaces I build, the product thinking behind them, the intelligence underneath, and the delivery path to production.",
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
  caseStudy: {
    role: "担当",
    year: "年",
    fields: "分野",
    stack: "技術スタック",
    processDetails: "制作プロセスの詳細",
    openImage: "元の画像を開く",
  },
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
  },
  experience: {
    ariaSection: "職歴",
    heading: "経歴",
    now: "現在",
    techAria: "使用技術",
  },
  education: {
    ariaSection: "学歴と実績",
    heading: "学歴と実績",
    recognitionHeading: "受賞・認定",
  },
  capabilities: {
    ariaSection: "スキル",
    heading: "スキル",
    blurb:
      "一つの実践を四つの層で。作るインターフェース、その背後のプロダクト思考、土台のインテリジェンス、そして本番までのデリバリー。",
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
