/**
 * Localized site content - English (en) and Japanese (ja).
 *
 * `Content` is an explicit interface, so TypeScript guarantees both languages
 * have exactly the same shape. Add a key to `Content` and typecheck will
 * fail until both `en` and `ja` define it.
 *
 * {name} tokens are interpolated by the component that renders the string.
 */
import type { InterestKey, ProjectCategory, ProjectKey } from "./data";

export type Lang = "en" | "ja";

export type ProjectItem = {
  key: ProjectKey;
  title: string;
  category: Exclude<ProjectCategory, "All">;
  year: string;
  role: string;
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
 * Per-project case study content. Keyed by ProjectKey so TypeScript
 * guarantees every project exists in both languages.
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
  work: {
    ariaSection: string;
    heading: string;
    viewCaseStudy: string;
    liveDemo: string;
    source: string;
    techAria: string;
    categories: Record<ProjectCategory, string>;
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
  capabilities: {
    ariaSection: string;
    heading: string;
    blurb: string;
    groups: { title: string; skills: string[] }[];
  };
  about: {
    ariaSection: string;
    heading: string;
    p1a: string;
    p1Strong: string;
    p1b: string;
    p2a: string;
    p2Strong: string;
    p2b: string;
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
  caseStudies: Record<ProjectKey, CaseStudy>;
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
    role: "Creative Frontend Engineer",
    statement:
      "I build interfaces that feel alive, where motion carries meaning and every detail earns its place.",
    metaLocation: "Jakarta, GMT+7",
    metaAvailability: "Available for work",
    ctaWork: "View my work",
    ctaTouch: "Get in touch",
    hint: "Move your cursor to reveal what sits beneath.",
  },
  manifesto: {
    ariaSection: "Creative statement",
    lead: "I build interfaces that feel alive. Motion with intent. Engineering with taste. Nothing decorative.",
    support:
      "Six years of product UI, WebGL, and design systems taught me that performance is part of the design.",
  },
  work: {
    ariaSection: "Selected work",
    heading: "Selected work",
    viewCaseStudy: "Read the {title} case study",
    liveDemo: "Live demo",
    source: "Source",
    techAria: "Technology stack",
    categories: {
      All: "All",
      "Product UI": "Product UI",
      "Web App": "Web App",
      Interactive: "Interactive",
    },
    items: [
      {
        key: "lumen",
        title: "Lumen Analytics",
        category: "Product UI",
        year: "2025",
        role: "Frontend Lead",
        description:
          "Real-time analytics platform for marketing teams. Dozens of dashboard views, a themeable design system, and virtualized data grids that stay smooth at thousands of rows.",
      },
      {
        key: "orbit",
        title: "Orbit Configurator",
        category: "Interactive",
        year: "2024",
        role: "Creative Developer",
        description:
          "A WebGL product configurator with physically-based materials, camera choreography, and 60fps transitions between build steps.",
      },
      {
        key: "pulse",
        title: "Pulse Storefront",
        category: "Web App",
        year: "2024",
        role: "Frontend Engineer",
        description:
          "Headless commerce storefront scoring in the high 90s on Lighthouse. Optimistic cart, edge-rendered product pages, and A/B-tested checkout flows.",
      },
      {
        key: "kinetic",
        title: "Kinetic Type Lab",
        category: "Interactive",
        year: "2023",
        role: "Designer & Developer",
        description:
          "A playground of kinetic typography experiments: scroll-driven text, variable-font choreography, and shader-based distortion effects.",
      },
      {
        key: "atlas",
        title: "Atlas Design System",
        category: "Product UI",
        year: "2023",
        role: "Design Engineer",
        description:
          "Component library and token pipeline powering three products: 60+ accessible components, Storybook docs, and automated visual regression.",
      },
    ],
  },
  experience: {
    ariaSection: "Career history",
    heading: "The road so far",
    now: "Present",
    techAria: "Technologies used",
    items: [
      {
        year: "2023",
        role: "Senior Frontend Engineer",
        company: "Nimbus Labs",
        period: "2023 - Present",
        current: true,
        summary:
          "Leading the frontend guild on a B2B analytics suite used by 200+ teams.",
        points: [
          "Rebuilt the dashboard shell with streaming server components, cutting time-to-interactive dramatically.",
          "Introduced a shared motion system that unified transitions across four product areas.",
          "Mentored four engineers through their first design-system contributions.",
        ],
        stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      },
      {
        year: "2021",
        role: "Frontend Engineer",
        company: "Arunika Studio",
        period: "2021 - 2023",
        current: false,
        summary:
          "Built award-nominated marketing sites and interactive campaigns for regional brands.",
        points: [
          "Shipped 12 campaign sites with WebGL and scroll-driven storytelling, all with top Lighthouse scores.",
          "Created the studio's internal starter kit, cutting project setup time in half.",
          "Collaborated daily with designers to prototype motion directly in the browser.",
        ],
        stack: ["React", "GSAP", "Three.js", "Sanity"],
      },
      {
        year: "2019",
        role: "Freelance UI Engineer",
        company: "Independent",
        period: "2019 - 2021",
        current: false,
        summary:
          "Partnered with early-stage startups to take products from Figma to production.",
        points: [
          "Delivered MVPs for five startups across fintech, education, and e-commerce.",
          "Owned everything from component architecture to deployment pipelines.",
        ],
        stack: ["React", "Styled Components", "Firebase"],
      },
    ],
  },
  capabilities: {
    ariaSection: "Capabilities",
    heading: "Tools of the trade",
    blurb:
      "Grouped by how they fit together: foundations first, then the layers that bring life, then the practice that ships.",
    groups: [
      {
        title: "Frontend Core",
        skills: ["React & Next.js", "TypeScript", "Tailwind CSS", "Accessibility"],
      },
      {
        title: "Motion & 3D",
        skills: ["Framer Motion", "GSAP", "Three.js / R3F", "Canvas & Shaders"],
      },
      {
        title: "Practice",
        skills: ["Performance", "Testing", "Git & CI/CD", "Node.js & APIs"],
      },
    ],
  },
  about: {
    ariaSection: "About Faris",
    heading: "Engineer by discipline, designer at heart",
    p1a:
      "I started out cutting PSDs into pixel-perfect pages, and never lost that obsession with detail. Over the last six years it grew into something bigger: ",
    p1Strong: "building product interfaces that move with intent",
    p1b: ". Every transition explains state, and every hover rewards curiosity.",
    p2a:
      "Today I work across the whole frontend surface: design systems, WebGL moments, performance budgets, and the unglamorous glue in between. My favorite projects sit ",
    p2Strong: "right where engineering rigor meets craft",
    p2b: ".",
    quote:
      "\u201CThe best interfaces disappear. What remains is how they made you feel.\u201D",
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
    emailAria: "Email Faris Znafis",
    socialsAria: "Social profiles",
    rights: "All rights reserved.",
    backTop: "Back to top",
  },
  caseStudies: {
    lumen: {
      overview:
        "A real-time analytics platform for marketing teams. I led the frontend through a full redesign: a themeable design system, dozens of dashboard views, and data grids that stay smooth at thousands of rows.",
      atAGlance: "Project at a glance",
      challenge: {
        heading: "Dashboards that felt like spreadsheets",
        lead: "Marketing teams live inside dashboards, yet most analytics tools feel like a spreadsheet wearing a dark theme. Lumen's existing UI was exactly that: dense, slow, and painful to extend.",
        body: "Three constraints shaped everything. New views had to ship in days, not weeks. Interactions had to hold 60fps while rendering tens of thousands of data points. And every client wanted the dashboard to look like their brand, without a redesign per customer.",
      },
      approach: {
        kicker: "Approach",
        heading: "Tokens, ten primitives, and a render queue",
        steps: [
          {
            tag: "Foundation",
            title: "A token pipeline, not a theme folder",
            description:
              "Mapped every design decision to runtime CSS variables generated from a single token source. Client branding now flows in as data, with zero code changes per customer.",
          },
          {
            tag: "System",
            title: "Components that compose",
            description:
              "Found the ten primitives every dashboard repeats, then assembled the remaining views from them. New reports ship as layout compositions instead of bespoke markup.",
          },
          {
            tag: "Performance",
            title: "Windowing and a render queue",
            description:
              "Wrote a virtualization layer for the data grids and routed all chart redraws through a single per-frame queue. Scrolling a million-row table holds 60fps on mid-range hardware.",
          },
        ],
      },
      features: {
        heading: "What shipped",
        items: [
          {
            title: "Themeable by design",
            description:
              "Every color, radius, and font weight flows from tokens. Rebranding a workspace takes minutes, not sprints.",
          },
          {
            title: "Composable view library",
            description:
              "Dozens of dashboard views assembled from ten primitives, so teams ship new reports without touching chart internals.",
          },
          {
            title: "Windowing engine",
            description:
              "Renders only what is on screen, so thousand-row tables stay smooth at any scroll velocity.",
          },
          {
            title: "Render queue",
            description:
              "Chart redraws are batched to a single pass per frame, so live updates never fight the UI thread.",
          },
        ],
      },
      galleryLabel: "Gallery",
      outcomes: {
        kicker: "Outcomes",
        heading: "What changed",
        items: [
          "Time-to-interactive roughly halved on the heaviest dashboards.",
          "Rebranding a workspace dropped from days to under an hour.",
          "A team of two shipped dozens of new views in one quarter.",
          "Scroll and chart interactions hold 60fps on mid-range laptops.",
        ],
      },
      nextLabel: "Next project",
    },
    orbit: {
      overview:
        "A WebGL product configurator where shoppers assemble their product in real time. I owned the 3D scene, the camera choreography, and every transition between build steps.",
      atAGlance: "Project at a glance",
      challenge: {
        heading: "Configurators that punish patience",
        lead: "Most configurators make you wait: a spinner, a flat product shot, a leap of faith about what you actually ordered. Orbit's client wanted the opposite, a tool that feels like holding the product in your hands.",
        body: "The hard part was feel. Material swaps had to read as physical changes. Camera moves had to cut between build steps like a film edit. And the whole experience had to stay fluid on phones that had never touched a 3D scene before.",
      },
      approach: {
        kicker: "Approach",
        heading: "Materials, camera language, and a device budget",
        steps: [
          {
            tag: "Foundation",
            title: "Physically based materials, tuned by eye",
            description:
              "Built the material stack in Three.js and tuned roughness and clearcoat against real product photography until the digital samples matched the physical ones.",
          },
          {
            tag: "Choreography",
            title: "Camera cuts that act like edits",
            description:
              "Storyboarded every build step as a shot list. Each transition is a deliberate cut or push-in, never an idle orbit around the model.",
          },
          {
            tag: "Performance",
            title: "A budget for every device",
            description:
              "Shipped LOD switches and texture budgets so the scene renders at 60fps from flagships down to mid-range laptops.",
          },
        ],
      },
      features: {
        heading: "What shipped",
        items: [
          {
            title: "Real-time material preview",
            description:
              "Every finish, color, and texture applies live to the 3D model. No spinners, no reloads, no waiting.",
          },
          {
            title: "Cinematic build steps",
            description:
              "Each configuration stage has its own camera move, turning a form into a short film.",
          },
          {
            title: "Shareable configurations",
            description:
              "Builds serialize into a URL, so shoppers can send their configuration to anyone.",
          },
        ],
      },
      galleryLabel: "Gallery",
      outcomes: {
        kicker: "Outcomes",
        heading: "What changed",
        items: [
          "Average session time in the configurator doubled.",
          "Configuration completion rose by a quarter.",
          "Runs smoothly on phones three generations old.",
          "Zero loading spinners anywhere in the flow.",
        ],
      },
      nextLabel: "Next project",
    },
    pulse: {
      overview:
        "A headless commerce storefront built for speed and judged at the checkout. I owned the storefront architecture, the optimistic cart, and the flag-driven checkout flows.",
      atAGlance: "Project at a glance",
      challenge: {
        heading: "Conversion dies between page loads",
        lead: "Every round trip is a chance for a shopper to leave. The brief was blunt: the storefront had to feel instant on slow connections, and every change to the buying flow had to be measurable.",
        body: "Two problems dominated. Product pages had to paint before any catalog round trip, and the cart had to keep working when a shopper was offline or on a patchy connection.",
      },
      approach: {
        kicker: "Approach",
        heading: "Edge shells, experiment flags, and a resilient cart",
        steps: [
          {
            tag: "Foundation",
            title: "Edge-rendered product pages",
            description:
              "Moved product pages to the edge with static shells and streaming product data, so the first paint lands before the catalog API answers.",
          },
          {
            tag: "Experimentation",
            title: "A/B tests as a first-class feature",
            description:
              "Wired an experiment layer into checkout so any flow change ships behind a flag and measures itself, no second codebase required.",
          },
          {
            tag: "Resilience",
            title: "A cart that survives bad networks",
            description:
              "The cart updates locally on every action, syncs when it can, and queues mutations during outages.",
          },
        ],
      },
      features: {
        heading: "What shipped",
        items: [
          {
            title: "Optimistic cart",
            description:
              "Add, update, and remove act instantly. Syncing happens quietly in the background.",
          },
          {
            title: "Edge product pages",
            description: "Full paint before the catalog round trip finishes.",
          },
          {
            title: "Flag-driven checkout",
            description:
              "Every flow change ships behind an experiment flag with built-in measurement.",
          },
        ],
      },
      galleryLabel: "Gallery",
      outcomes: {
        kicker: "Outcomes",
        heading: "What changed",
        items: [
          "Product pages paint before the data round trip completes.",
          "Checkout experiments ship weekly instead of monthly.",
          "Cart actions feel instant even on throttled connections.",
        ],
      },
      nextLabel: "Next project",
    },
    kinetic: {
      overview:
        "A playground of kinetic typography: scroll-driven text, variable-font choreography, and shader distortion. Each experiment is a standalone piece with source code and a short writeup.",
      atAGlance: "Project at a glance",
      challenge: {
        heading: "Type that moves, without reading badly",
        lead: "Kinetic type usually lives in After Effects comps that never make it to the web. I wanted a living library where every experiment runs in the browser and can be studied, remixed, and reused in real products.",
        body: "Two problems made it hard. Text that moves reads poorly unless every curve is deliberate, so each piece had to be crafted like a film cut. And dozens of animated canvases had to stay cheap enough to share a single page.",
      },
      approach: {
        kicker: "Approach",
        heading: "Canvas, scroll, and variable fonts as material",
        steps: [
          {
            tag: "Foundation",
            title: "Type as a drawing, not a DOM",
            description:
              "Rendered the heavy experiments to canvas, where every glyph can be carved, bent, and distorted without layout jank.",
          },
          {
            tag: "Choreography",
            title: "Scroll as the conductor",
            description:
              "Drove most pieces by scroll position so the pacing sits in the visitor's hands, not a timer.",
          },
          {
            tag: "Craft",
            title: "Variable fonts as animation channels",
            description:
              "Used the weight and width axes as animation targets, so type can breathe without moving at all.",
          },
        ],
      },
      features: {
        heading: "What shipped",
        items: [
          {
            title: "Canvas-rendered experiments",
            description: "Glyph-level distortion with none of the DOM layout cost.",
          },
          {
            title: "Scroll-scrubbed pieces",
            description: "Most experiments are scrubbed by scroll position, not by time.",
          },
          {
            title: "Variable-font choreography",
            description: "Weight and width axes animate as first-class channels.",
          },
          {
            title: "Open source",
            description: "Every piece ships with its source and a short writeup.",
          },
        ],
      },
      galleryLabel: "Gallery",
      outcomes: {
        kicker: "Outcomes",
        heading: "What changed",
        items: [
          "All experiments run on a single page without dropping frames.",
          "Each piece ships with source and a writeup.",
          "Several effects were lifted straight into client work.",
        ],
      },
      nextLabel: "Next project",
    },
    atlas: {
      overview:
        "A component library and token pipeline powering three products. I owned the architecture, the accessibility baseline, and the tooling that keeps every release consistent.",
      atAGlance: "Project at a glance",
      challenge: {
        heading: "Three products, three visual languages",
        lead: "Three products, three codebases, three ways of building the same button. Every design decision was made three times and shipped differently every time.",
        body: "The goal was never a shared theme. It was a shared way of working: one token set, one component contract, and one release process that all three products could trust.",
      },
      approach: {
        kicker: "Approach",
        heading: "One pipeline, hard contracts, gates in CI",
        steps: [
          {
            tag: "Foundation",
            title: "One token pipeline, three products",
            description:
              "Centralized design tokens as the single source of truth and wired every product theme to the same build-time pipeline.",
          },
          {
            tag: "System",
            title: "Accessibility as a contract",
            description:
              "Wrote every component against keyboard and screen-reader contracts, with axe checks in CI as a hard gate.",
          },
          {
            tag: "Tooling",
            title: "Visual regression on every merge",
            description:
              "Automated screenshot diffs in the pull request pipeline, so inconsistent states never reach main.",
          },
        ],
      },
      features: {
        heading: "What shipped",
        items: [
          {
            title: "Shared token pipeline",
            description: "One set of tokens, compiled per product at build time.",
          },
          {
            title: "Accessible component contract",
            description: "Keyboard, focus, and screen-reader behavior enforced in CI.",
          },
          {
            title: "Storybook documentation",
            description: "Every component documented with live states and usage guidance.",
          },
          {
            title: "Automated visual regression",
            description: "Screenshot diffs gate every merge.",
          },
        ],
      },
      galleryLabel: "Gallery",
      outcomes: {
        kicker: "Outcomes",
        heading: "What changed",
        items: [
          "Three products now share one design language.",
          "Accessibility regressions are caught in CI, not production.",
          "Cross-product releases dropped from weeks to days.",
        ],
      },
      nextLabel: "Next project",
    },
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
    role: "クリエイティブ・フロントエンドエンジニア",
    statement:
      "動きに意味を宿らせ、すべての細部に存在理由があるインターフェースを創っています。",
    metaLocation: "ジャカルタ GMT+7",
    metaAvailability: "就業可能",
    ctaWork: "作品を見る",
    ctaTouch: "お問い合わせ",
    hint: "カーソルを動かすと、その下にあるものが見えます。",
  },
  manifesto: {
    ariaSection: "クリエイティブステートメント",
    lead: "命を感じるインターフェースを創る。意図のあるモーション。誠実なエンジニアリング。装飾はしない。",
    support:
      "プロダクトUI、WebGL、デザインシステムでの6年間から学んだのは、パフォーマンスもまたデザインの一部だということです。",
  },
  work: {
    ariaSection: "厳選した作品",
    heading: "厳選した作品",
    viewCaseStudy: "{title}のケーススタディを見る",
    liveDemo: "ライブデモ",
    source: "ソースコード",
    techAria: "技術スタック",
    categories: {
      All: "すべて",
      "Product UI": "プロダクトUI",
      "Web App": "Webアプリ",
      Interactive: "インタラクティブ",
    },
    items: [
      {
        key: "lumen",
        title: "Lumen Analytics",
        category: "Product UI",
        year: "2025",
        role: "フロントエンドリード",
        description:
          "マーケティングチーム向けのリアルタイム分析プラットフォーム。数十のダッシュボードビュー、テーマ変更可能なデザインシステム、数千行でも滑らかに動く仮想化データグリッド。",
      },
      {
        key: "orbit",
        title: "Orbit Configurator",
        category: "Interactive",
        year: "2024",
        role: "クリエイティブデベロッパー",
        description:
          "物理ベースのマテリアル、カメラの演出、ビルドステップ間を60fpsで遷移するWebGLプロダクトコンフィギュレーター。",
      },
      {
        key: "pulse",
        title: "Pulse Storefront",
        category: "Web App",
        year: "2024",
        role: "フロントエンドエンジニア",
        description:
          "Lighthouseで90点台後半を記録するヘッドレスコマースストアフロント。楽観的カート、エッジレンダリングの商品ページ、A/Bテスト済みのチェックアウトフロー。",
      },
      {
        key: "kinetic",
        title: "Kinetic Type Lab",
        category: "Interactive",
        year: "2023",
        role: "デザイナー & デベロッパー",
        description:
          "キネティックタイポグラフィの実験プレイグラウンド。スクロール駆動のテキスト、可変フォントの演出、シェーダーによる歪みエフェクト。",
      },
      {
        key: "atlas",
        title: "Atlas Design System",
        category: "Product UI",
        year: "2023",
        role: "デザインエンジニア",
        description:
          "3つのプロダクトを支えるコンポーネントライブラリとトークンパイプライン。60以上のアクセシブルなコンポーネント、Storybookドキュメント、自動ビジュアルリグレッション。",
      },
    ],
  },
  experience: {
    ariaSection: "職歴",
    heading: "これまでの道のり",
    now: "現在",
    techAria: "使用技術",
    items: [
      {
        year: "2023",
        role: "シニア・フロントエンドエンジニア",
        company: "Nimbus Labs",
        period: "2023 - 現在",
        current: true,
        summary:
          "200以上のチームが利用するB2B分析スイートで、フロントエンドギルドを率いています。",
        points: [
          "ストリーミングサーバーコンポーネントでダッシュボード基盤を再構築し、操作開始までの時間を大幅に短縮。",
          "4つのプロダクト領域のトランジションを統一する共通モーションシステムを導入。",
          "4名のエンジニアを、デザインシステムへの初めての貢献まで導きました。",
        ],
        stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      },
      {
        year: "2021",
        company: "Arunika Studio",
        role: "フロントエンドエンジニア",
        period: "2021 - 2023",
        current: false,
        summary:
          "地域ブランド向けに、アワード候補に選ばれたマーケティングサイトとインタラクティブキャンペーンを制作。",
        points: [
          "WebGLとスクロール駆動の叙事的ストーリーテリングを用いたキャンペーンサイトを12件リリース。すべてLighthouseの高スコアを記録。",
          "スタジオ内製のスターターキットを開発し、プロジェクト立ち上げ時間を半減。",
          "デザイナーと毎日連携し、ブラウザ上で直接モーションのプロトタイプを制作。",
        ],
        stack: ["React", "GSAP", "Three.js", "Sanity"],
      },
      {
        year: "2019",
        company: "フリーランス",
        role: "フリーランスUIエンジニア",
        period: "2019 - 2021",
        current: false,
        summary:
          "アーリーステージのスタートアップとともに、Figmaから本番環境までプロダクトを届けてきました。",
        points: [
          "フィンテック、教育、Eコマースの5つのスタートアップにMVPを納品。",
          "コンポーネント設計からデプロイパイプラインまで、すべてを自ら担当。",
        ],
        stack: ["React", "Styled Components", "Firebase"],
      },
    ],
  },
  capabilities: {
    ariaSection: "スキル",
    heading: "日々の道具立て",
    blurb:
      "組み合わせ方ごとに分類しています。まず土台、次に命を吹き込む層、そして届け続けるための実践。",
    groups: [
      {
        title: "フロントエンド基盤",
        skills: ["React & Next.js", "TypeScript", "Tailwind CSS", "アクセシビリティ"],
      },
      {
        title: "モーション & 3D",
        skills: ["Framer Motion", "GSAP", "Three.js / R3F", "Canvasとシェーダー"],
      },
      {
        title: "実務",
        skills: ["パフォーマンス", "テスト", "Git & CI/CD", "Node.js & APIs"],
      },
    ],
  },
  about: {
    ariaSection: "ファリスについて",
    heading: "規律はエンジニア、心はデザイナー",
    p1a:
      "PSDをピクセルパーフェクトなページに切り出すことから始まり、細部へのこだわりは今も変わりません。この6年でそれはもっと大きなものになりました：",
    p1Strong: "意図を持って動くプロダクトインターフェースを創ること",
    p1b: "。すべてのトランジションが状態を説明し、すべてのホバーが好奇心に応えます。",
    p2a:
      "現在はフロントエンド全体に携わっています：デザインシステム、WebGL、パフォーマンス予算、そしてその間にある地味な接着剤。私のお気に入りのプロジェクトは、",
    p2Strong: "エンジニアリングの厳密さと職人技が出会う場所",
    p2b: "にあります。",
    quote:
      "「最高のインターフェースは存在を忘れさせる。残るのは、それがあなたに与えた感覚だけ。」",
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
    emailAria: "ファリス・ズナフィスにメールを送る",
    socialsAria: "ソーシャルプロフィール",
    rights: "無断転載を禁じます。",
    backTop: "トップへ戻る",
  },
  caseStudies: {
    lumen: {
      overview:
        "マーケティングチーム向けのリアルタイム分析プラットフォーム。テーマ変更可能なデザインシステム、数十のダッシュボードビュー、数千行でも滑らかに動くデータグリッドを備えた全面リニューアルで、フロントエンドを統括しました。",
      atAGlance: "プロジェクト概要",
      challenge: {
        heading: "スプレッドシートのように感じるダッシュボード",
        lead: "マーケティングチームはダッシュボードの中で暮らしているのに、ほとんどの分析ツールはダークテーマのスプレッドシートのようなものです。Lumenの既存UIもまさにそれでした。密度が高く、遅く、拡張に苦労するUIです。",
        body: "三つの制約がすべてを決めました。新しいビューは数週間ではなく数日で出せること。数万のデータポイントを描画しながらインタラクションを60fpsで保つこと。そして、顧客ごとにリデザインすることなく、ダッシュボードを各ブランドの見た目にできること。",
      },
      approach: {
        kicker: "アプローチ",
        heading: "トークン、10のプリミティブ、レンダーキュー",
        steps: [
          {
            tag: "基盤",
            title: "テーマフォルダではなく、トークンパイプライン",
            description:
              "すべてのデザイン判断を、単一のトークンソースから生成されるランタイムCSS変数にマッピング。顧客のブランディングはデータとして流れ込み、顧客ごとのコード変更は一切不要になりました。",
          },
          {
            tag: "システム",
            title: "組み合わせて使えるコンポーネント",
            description:
              "あらゆるダッシュボードに登場する10のプリミティブを見つけ、残りのビューはそこから組み立て。新しいレポートは専用マークアップではなく、レイアウトの組み合わせとして出荷されます。",
          },
          {
            tag: "パフォーマンス",
            title: "ウィンドウ化とレンダーキュー",
            description:
              "データグリッド用の仮想化レイヤーを書き、すべてのチャートの再描画を1フレームあたり1回のキューに集約。100万行のテーブルでも、ミッドレンジのハードウェアで60fpsを維持します。",
          },
        ],
      },
      features: {
        heading: "実装したもの",
        items: [
          {
            title: "デザインによるテーマ変更",
            description:
              "色、角丸、フォントウェイトはすべてトークンから流れ込みます。ワークスペースのブランディング変更は、スプリント単位ではなく分単位の作業です。",
          },
          {
            title: "組み合わせ型ビューライブラリ",
            description:
              "10のプリミティブから数十のダッシュボードビューを組み立て。チャート内部に触れることなく、新しいレポートを出荷できます。",
          },
          {
            title: "ウィンドウ化エンジン",
            description:
              "画面に表示されている分だけを描画するため、どんな速度でスクロールしても数千行のテーブルが滑らかです。",
          },
          {
            title: "レンダーキュー",
            description:
              "チャートの再描画は1フレームあたり1回にバッチ化され、ライブ更新がUIスレッドと競合しません。",
          },
        ],
      },
      galleryLabel: "ギャラリー",
      outcomes: {
        kicker: "成果",
        heading: "変わったこと",
        items: [
          "最も重いダッシュボードで、操作開始までの時間がおよそ半減。",
          "ワークスペースのブランディング変更が、数日から1時間未満に。",
          "2人のチームで、1クォーターに数十の新しいビューを出荷。",
          "ミッドレンジのノートPCでも、スクロールとチャート操作が60fpsを維持。",
        ],
      },
      nextLabel: "次のプロジェクト",
    },
    orbit: {
      overview:
        "買い物客がリアルタイムにプロダクトを組み立てられるWebGLコンフィギュレーター。3Dシーン、カメラの演出、ビルドステップ間のすべてのトランジションを担当しました。",
      atAGlance: "プロジェクト概要",
      challenge: {
        heading: "忍耐を試すコンフィギュレーター",
        lead: "多くのコンフィギュレーターは待ち時間を強要します。スピナー、平面の商品画像、そして実際に届く商品の見た目への賭け。Orbitのクライアントが求めたのはその逆で、商品を手にしているかのような体験です。",
        body: "難しいのは質感でした。素材の切り替えは物理的な変化として伝わる必要があり、カメラの動きは映画のカットのようにビルドステップを切り替える必要がありました。そして、3Dシーンに触れたことのないスマートフォンでも、体験全体が滑らかでなければなりません。",
      },
      approach: {
        kicker: "アプローチ",
        heading: "マテリアル、カメラ言語、デバイス予算",
        steps: [
          {
            tag: "基盤",
            title: "目で調律した物理ベースマテリアル",
            description:
              "Three.jsでマテリアルスタックを構築し、実物の商品写真に合わせて粗さとクリアコートを調整。デジタルサンプルが実物と一致するまで繰り返しました。",
          },
          {
            tag: "演出",
            title: "編集のように機能するカメラカット",
            description:
              "すべてのビルドステップをショットリストとして絵コンテ化。各トランジションは意図的なカットかプッシュインであり、モデルの周りを漫然と回ることはありません。",
          },
          {
            tag: "パフォーマンス",
            title: "すべてのデバイスへの予算配分",
            description:
              "LOD切り替えとテクスチャ予算を実装し、フラッグシップからミッドレンジのノートPCまで60fpsで描画します。",
          },
        ],
      },
      features: {
        heading: "実装したもの",
        items: [
          {
            title: "リアルタイムマテリアルプレビュー",
            description:
              "仕上げ、色、テクスチャがすべて3Dモデルに即時反映。スピナーもリロードも待ち時間もありません。",
          },
          {
            title: "映画的なビルドステップ",
            description: "各構成段階に専用のカメラワークを用意し、フォームを短編映画に変えます。",
          },
          {
            title: "共有可能な構成",
            description: "構成をURLにシリアライズ。誰にでも送って共有できます。",
          },
        ],
      },
      galleryLabel: "ギャラリー",
      outcomes: {
        kicker: "成果",
        heading: "変わったこと",
        items: [
          "コンフィギュレーターの平均利用時間が2倍に。",
          "構成完了率が4分の1向上。",
          "3世代前のスマートフォンでも滑らかに動作。",
          "フロー全体にローディングスピナーはゼロ。",
        ],
      },
      nextLabel: "次のプロジェクト",
    },
    pulse: {
      overview:
        "スピードのために作られ、チェックアウトで評価されるヘッドレスコマースストアフロント。ストアフロントの設計、楽観的カート、フラグ駆動のチェックアウトフローを担当しました。",
      atAGlance: "プロジェクト概要",
      challenge: {
        heading: "ページ読み込みのたびにコンバージョンが失われる",
        lead: "ラウンドトリップのたびに、買い物客が離脱する機会が生まれます。要件は率直でした。低速な接続でも即座に感じられること、そして購入フローの変更はすべて測定可能であること。",
        body: "課題は二つ。商品ページはカタログAPIの往復を待たずに描画を終えること。そして、オフラインや不安定な接続でもカートが機能し続けることでした。",
      },
      approach: {
        kicker: "アプローチ",
        heading: "エッジシェル、実験フラグ、耐障害性のあるカート",
        steps: [
          {
            tag: "基盤",
            title: "エッジで描画する商品ページ",
            description:
              "商品ページを静的シェルとストリーミングデータでエッジに移設し、カタログAPIが応答する前に最初の描画を完了させます。",
          },
          {
            tag: "実験",
            title: "ファーストクラス機能としてのA/Bテスト",
            description:
              "チェックアウトに実験レイヤーを組み込み、フローの変更はすべてフラグの裏で出荷し、そのまま計測できるようにしました。",
          },
          {
            tag: "耐障害性",
            title: "不安定なネットワークでも生きるカート",
            description:
              "カートはすべての操作をローカルで即時反映し、接続時に同期し、通信障害中はミューテーションをキューにためます。",
          },
        ],
      },
      features: {
        heading: "実装したもの",
        items: [
          {
            title: "楽観的カート",
            description: "追加、変更、削除が即座に反映。同期は静かにバックグラウンドで行われます。",
          },
          {
            title: "エッジ商品ページ",
            description: "カタログの往復が完了する前に描画が完了します。",
          },
          {
            title: "フラグ駆動チェックアウト",
            description: "フローの変更はすべて実験フラグの裏で出荷され、計測も内蔵されています。",
          },
        ],
      },
      galleryLabel: "ギャラリー",
      outcomes: {
        kicker: "成果",
        heading: "変わったこと",
        items: [
          "データ往復完了前に商品ページの描画が完了。",
          "チェックアウト実験が月1回ではなく週1回に。",
          "帯域制限された接続でもカート操作が即座に感じられる。",
        ],
      },
      nextLabel: "次のプロジェクト",
    },
    kinetic: {
      overview:
        "キネティックタイポグラフィのプレイグラウンド。スクロール駆動のテキスト、可変フォントの演出、シェーダーによる歪み。各実験はソースコードと短い解説付きの独立した作品です。",
      atAGlance: "プロジェクト概要",
      challenge: {
        heading: "動く文字、読めない文字",
        lead: "キネティックタイプはたいていAfter Effectsのコンポ内で完結し、Webに届くことはありません。私は、すべての実験がブラウザで動き、学び、リミックスされ、実際のプロダクトに再利用できる生きたライブラリを作りたかったのです。",
        body: "難しい点は二つ。動くテキストは、すべてのカーブを意図的に設計しない限り読みにくくなります。そして、何十ものアニメーションキャンバスが、1ページの中で十分に軽く動く必要があることです。",
      },
      approach: {
        kicker: "アプローチ",
        heading: "キャンバス、スクロール、素材としての可変フォント",
        steps: [
          {
            tag: "基盤",
            title: "DOMではなく描画としてのタイポグラフィ",
            description:
              "重い実験はキャンバスに描画。レイアウトのガタつきなく、グリフを彫り、曲げ、歪ませることができます。",
          },
          {
            tag: "演出",
            title: "指揮者としてのスクロール",
            description: "ほとんどの作品はスクロール位置で駆動し、テンポは訪問者の手の中にあります。",
          },
          {
            tag: "クラフト",
            title: "アニメーションのチャンネルとしての可変フォント",
            description: "ウェイトとワイズ軸をアニメーション対象として使い、動かさずに文字に呼吸を与えます。",
          },
        ],
      },
      features: {
        heading: "実装したもの",
        items: [
          {
            title: "キャンバス描画の実験",
            description: "DOMのレイアウトコストなしで、グリフレベルまで歪ませられます。",
          },
          {
            title: "スクロールスクラブ作品",
            description: "ほとんどの実験は時間ではなく、スクロール位置で操作されます。",
          },
          {
            title: "可変フォントの演出",
            description: "ウェイトとワイズ軸がファーストクラスのチャンネルとして動きます。",
          },
          {
            title: "オープンソース",
            description: "すべての作品にソースと短い解説が付いています。",
          },
        ],
      },
      galleryLabel: "ギャラリー",
      outcomes: {
        kicker: "成果",
        heading: "変わったこと",
        items: [
          "すべての実験が1ページ上でフレーム落ちなく動作。",
          "各作品にソースと解説を同梱。",
          "いくつかのエフェクトはクライアントワークにそのまま転用されました。",
        ],
      },
      nextLabel: "次のプロジェクト",
    },
    atlas: {
      overview:
        "3つのプロダクトを支えるコンポーネントライブラリとトークンパイプライン。アーキテクチャ、アクセシビリティの基準、そしてすべてのリリースを一貫させるツーリングを担当しました。",
      atAGlance: "プロジェクト概要",
      challenge: {
        heading: "3つのプロダクト、3つのビジュアル言語",
        lead: "3つのプロダクト、3つのコードベース、そして同じボタンの3つの作り方。デザインの判断はすべて3回繰り返され、毎回違う形で出荷されていました。",
        body: "目指したのは共有テーマではありません。共有の働き方、つまり1つのトークンセット、1つのコンポーネント規約、そして3つのプロダクトすべてが信頼できる1つのリリースプロセスです。",
      },
      approach: {
        kicker: "アプローチ",
        heading: "1つのパイプライン、厳格な規約、CIのゲート",
        steps: [
          {
            tag: "基盤",
            title: "1つのトークンパイプライン、3つのプロダクト",
            description:
              "デザイントークンを唯一の情報源として一元化し、各プロダクトのテーマを同じビルド時パイプラインに接続しました。",
          },
          {
            tag: "システム",
            title: "契約としてのアクセシビリティ",
            description:
              "すべてのコンポーネントをキーボードとスクリーンリーダーの規約に沿って書き、CIでaxeチェックを必須ゲートにしました。",
          },
          {
            tag: "ツーリング",
            title: "マージごとのビジュアルリグレッション",
            description:
              "プルリクエストパイプラインにスクリーンショット差分を自動化し、不整合な状態がmainに到達しないようにしました。",
          },
        ],
      },
      features: {
        heading: "実装したもの",
        items: [
          {
            title: "共有トークンパイプライン",
            description: "1つのトークンセットを、ビルド時にプロダクトごとにコンパイル。",
          },
          {
            title: "アクセシブルなコンポーネント規約",
            description: "キーボード、フォーカス、スクリーンリーダーの挙動をCIで強制。",
          },
          {
            title: "Storybookドキュメント",
            description: "すべてのコンポーネントにライブ状態と利用ガイドを記載。",
          },
          {
            title: "自動ビジュアルリグレッション",
            description: "スクリーンショット差分がすべてのマージをゲート。",
          },
        ],
      },
      galleryLabel: "ギャラリー",
      outcomes: {
        kicker: "成果",
        heading: "変わったこと",
        items: [
          "3つのプロダクトが1つのデザイン言語を共有。",
          "アクセシビリティのリグレッションが本番ではなくCIで検出。",
          "プロダクト横断のリリースが数週間から数日に。",
        ],
      },
      nextLabel: "次のプロジェクト",
    },
  },
};
