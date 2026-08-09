/**
 * Localized site content — English (en) and Japanese (ja).
 *
 * `Content` is an explicit interface, so TypeScript guarantees both languages
 * have exactly the same shape. Add a key to `Content` and typecheck will
 * fail until both `en` and `ja` define it.
 *
 * {name} / {title} / {skill} tokens are interpolated by the component that
 * renders the string (see Hero intro, Contact mail subject, Projects aria).
 */
import type { ProjectCategory, ProjectKey } from "./data";

export type Lang = "en" | "ja";

export type ProjectItem = {
  key: ProjectKey;
  title: string;
  category: Exclude<ProjectCategory, "All">;
  year: string;
  role: string;
  description: string;
  highlights: string[];
};

export interface Content {
  nav: {
    ariaPrimary: string;
    ariaLogo: string;
    ariaGithub: string;
    ariaMenu: string;
    ariaClose: string;
    ariaLang: string;
    links: { work: string; about: string; skills: string; experience: string; contact: string };
  };
  hero: {
    ariaSection: string;
    line1: string;
    line2: string;
    accentWords: string[];
    intro: string;
    hint: string;
    ctaWork: string;
    ctaTouch: string;
  };
  home: {
    intro: { kicker: string; line1: string; line2: string; blurb: string };
    whatIDo: string;
    byTheNumbers: string;
    make1: string;
    make2: string;
    explore: string;
    getInTouch: string;
    scroll: string;
    pillars: { index: string; title: string; description: string }[];
    stats: { value: number; suffix: string; label: string }[];
  };
  projects: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    filterAria: string;
    openDemo: string;
    viewProject: string;
    techAria: string;
    liveDemo: string;
    source: string;
    categories: Record<ProjectCategory, string>;
    items: ProjectItem[];
  };
  projectDetail: {
    back: string;
    overview: string;
    highlights: string;
    techStack: string;
    prev: string;
    next: string;
    open: string;
    navAria: string;
  };
  skills: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    proficiency: string;
    groups: { title: string; blurb: string; skills: { name: string; level: number }[] }[];
  };
  experience: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    now: string;
    techAria: string;
    items: {
      role: string;
      company: string;
      period: string;
      current: boolean;
      summary: string;
      points: string[];
      stack: string[];
    }[];
  };
  about: {
    eyebrow: string;
    heading: string;
    p1a: string;
    p1Strong: string;
    p1b: string;
    p2a: string;
    p2Strong: string;
    p2b: string;
    profileLabel: string;
    factLabels: { name: string; basedIn: string; focus: string; currently: string };
    focusValue: string;
    currentlyValue: string;
    blockquote: string;
    principles: { title: string; description: string }[];
  };
  contact: {
    eyebrow: string;
    heading: string;
    intro: string;
    mailSubject: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    send: string;
    opening: string;
    ready: string;
    readyAria: string;
  };
  footer: { rights: string; backHome: string };
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
      about: "About",
      skills: "Skills",
      experience: "Experience",
      contact: "Contact",
    },
  },
  hero: {
    ariaSection: "Introduction",
    line1: "Building interfaces",
    line2: "that feel alive.",
    accentWords: ["alive."],
    intro:
      "I'm {name} — a frontend engineer blending motion design, 3D, and product thinking to ship web experiences people remember.",
    hint: "Move your cursor across the scene to peel back the surface — the same depth of craft sits beneath every interface I ship.",
    ctaWork: "View my work",
    ctaTouch: "Get in touch",
  },
  home: {
    intro: {
      kicker: "Creative Frontend Engineer",
      line1: "I design and build",
      line2: "interfaces that feel alive",
      blurb:
        "Motion, 3D, and product thinking woven into fast, memorable web experiences. Scroll to see what I mean.",
    },
    whatIDo: "What I do",
    byTheNumbers: "By the numbers",
    make1: "Let's make something",
    make2: "unforgettable.",
    explore: "Explore my work",
    getInTouch: "Get in touch",
    scroll: "Scroll",
    pillars: [
      {
        index: "01",
        title: "Motion Design",
        description:
          "Purposeful animation that explains state, guides attention, and rewards curiosity — never decoration for its own sake.",
      },
      {
        index: "02",
        title: "3D & WebGL",
        description:
          "Shader-driven scenes, particle systems, and real-time 3D that stay smooth at 60fps on real devices.",
      },
      {
        index: "03",
        title: "Product UI",
        description:
          "Design systems, accessible components, and the unglamorous glue that turns a prototype into a shipped product.",
      },
    ],
    stats: [
      { value: 6, suffix: "+", label: "Years crafting UI" },
      { value: 40, suffix: "+", label: "Projects shipped" },
      { value: 15, suffix: "+", label: "Clients & teams" },
    ],
  },
  projects: {
    eyebrow: "Selected work",
    heading: "Projects built with motion and purpose",
    subtitle:
      "A mix of product interfaces, web apps, and interactive experiments. Each one shipped, measured, and polished.",
    filterAria: "Filter projects by category",
    openDemo: "Open live demo of {title}",
    viewProject: "View project",
    techAria: "Technology stack",
    liveDemo: "Live demo",
    source: "Source",
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
          "Real-time analytics platform for marketing teams — 40+ dashboard views, a themeable design system, and virtualized data grids that stay smooth at 10k rows.",
        highlights: [
          "40+ dashboard views in one themeable design system",
          "Virtualized data grids that stay smooth at 10,000 rows",
          "Design tokens piped from Figma to production",
        ],
      },
      {
        key: "orbit",
        title: "Orbit Configurator",
        category: "Interactive",
        year: "2024",
        role: "Creative Developer",
        description:
          "A WebGL product configurator with physically-based materials, camera choreography, and 60fps transitions between build steps.",
        highlights: [
          "Physically-based materials rendered in real time",
          "Camera choreography that guides each build step",
          "60fps transitions between configuration states",
        ],
      },
      {
        key: "pulse",
        title: "Pulse Storefront",
        category: "Web App",
        year: "2024",
        role: "Frontend Engineer",
        description:
          "Headless commerce storefront scoring 98+ on Lighthouse — optimistic cart, edge-rendered product pages, and A/B-tested checkout flows.",
        highlights: [
          "98+ Lighthouse on product pages and checkout",
          "Optimistic cart backed by a headless storefront API",
          "A/B-tested checkout flows shipping every week",
        ],
      },
      {
        key: "kinetic",
        title: "Kinetic Type Lab",
        category: "Interactive",
        year: "2023",
        role: "Designer & Developer",
        description:
          "A playground of kinetic typography experiments — scroll-driven text, variable-font choreography, and shader-based distortion effects.",
        highlights: [
          "Scroll-driven kinetic typography experiments",
          "Variable-font choreography across multiple axes",
          "Shader-based distortion effects on live text",
        ],
      },
      {
        key: "atlas",
        title: "Atlas Design System",
        category: "Product UI",
        year: "2023",
        role: "Design Engineer",
        description:
          "Component library and token pipeline powering three products — 60+ accessible components, Storybook docs, and automated visual regression.",
        highlights: [
          "60+ accessible React components",
          "Token pipeline from Figma to production CSS",
          "Storybook docs with automated visual regression",
        ],
      },
    ],
  },
  projectDetail: {
    back: "Back to work",
    overview: "Overview",
    highlights: "Key highlights",
    techStack: "Tech stack",
    prev: "Previous project",
    next: "Next project",
    open: "Open {title} case study",
    navAria: "Project navigation",
  },
  skills: {
    eyebrow: "Skills",
    heading: "Tools I reach for every day",
    subtitle:
      "Grouped by how I actually use them — foundations, the layer that brings life, and the practices that keep everything shippable.",
    proficiency: "{skill} proficiency",
    groups: [
      {
        title: "Frontend Core",
        blurb: "The foundation every project stands on.",
        skills: [
          { name: "React & Next.js", level: 95 },
          { name: "TypeScript", level: 90 },
          { name: "Tailwind CSS", level: 92 },
          { name: "HTML & Accessibility", level: 88 },
        ],
      },
      {
        title: "Motion & 3D",
        blurb: "Where interfaces come to life.",
        skills: [
          { name: "Framer Motion", level: 92 },
          { name: "GSAP", level: 88 },
          { name: "Three.js / R3F", level: 78 },
          { name: "CSS Animation", level: 90 },
        ],
      },
      {
        title: "Engineering Practice",
        blurb: "Shipping fast without breaking things.",
        skills: [
          { name: "Performance Optimization", level: 85 },
          { name: "Testing (Vitest, Playwright)", level: 80 },
          { name: "Git & CI/CD", level: 86 },
          { name: "Node.js & APIs", level: 75 },
        ],
      },
    ],
  },
  experience: {
    eyebrow: "Experience",
    heading: "The road so far",
    subtitle:
      "From freelance MVPs to leading frontend on products used by hundreds of teams.",
    now: "Now",
    techAria: "Technologies used",
    items: [
      {
        role: "Senior Frontend Engineer",
        company: "Nimbus Labs",
        period: "2023 — Present",
        current: true,
        summary:
          "Leading the frontend guild on a B2B analytics suite used by 200+ teams.",
        points: [
          "Rebuilt the dashboard shell with streaming server components, cutting time-to-interactive by 38%.",
          "Introduced a shared motion system that unified transitions across four product areas.",
          "Mentored four engineers through their first design-system contributions.",
        ],
        stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      },
      {
        role: "Frontend Engineer",
        company: "Arunika Studio",
        period: "2021 — 2023",
        current: false,
        summary:
          "Built award-nominated marketing sites and interactive campaigns for regional brands.",
        points: [
          "Shipped 12 campaign sites with WebGL and scroll-driven storytelling, averaging 95+ Lighthouse scores.",
          "Created the studio's internal starter kit, halving project setup time.",
          "Collaborated daily with designers to prototype motion directly in the browser.",
        ],
        stack: ["React", "GSAP", "Three.js", "Sanity"],
      },
      {
        role: "Freelance UI Engineer",
        company: "Independent",
        period: "2019 — 2021",
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
  about: {
    eyebrow: "About",
    heading: "Engineer by discipline, designer at heart",
    p1a: "I started out cutting PSDs into pixel-perfect pages, and never lost that obsession with detail. Over the last six years it grew into something bigger: ",
    p1Strong: "building product interfaces that move with intent",
    p1b: " — where every transition explains state, and every hover rewards curiosity.",
    p2a:
      "Today I work across the whole frontend surface: design systems, WebGL moments, performance budgets, and the unglamorous glue in between. My favorite projects sit ",
    p2Strong: "right where engineering rigor meets craft",
    p2b: ".",
    profileLabel: "Profile",
    factLabels: {
      name: "Name",
      basedIn: "Based in",
      focus: "Focus",
      currently: "Currently",
    },
    focusValue: "Interactive product UI",
    currentlyValue: "Senior Frontend Engineer",
    blockquote:
      "\u201CThe best interfaces disappear \u2014 what remains is how they made you feel.\u201D",
    principles: [
      {
        title: "Performance first",
        description:
          "Motion means nothing if it stutters. Every animation is budgeted against real devices.",
      },
      {
        title: "Motion with purpose",
        description:
          "Animation should explain, guide, or delight \u2014 never decorate for its own sake.",
      },
      {
        title: "Accessible by default",
        description:
          "Keyboard paths, reduced-motion fallbacks, and honest contrast are non-negotiable.",
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    heading: "Let's build something memorable",
    intro:
      "Have a project in mind, a role to fill, or just want to talk shop about motion on the web? My inbox is open.",
    mailSubject: "Portfolio inquiry from {name}",
    name: "Name",
    namePlaceholder: "Jane Doe",
    email: "Email",
    emailPlaceholder: "jane@company.com",
    message: "Message",
    messagePlaceholder: "Tell me about your project\u2026",
    send: "Send message",
    opening: "Opening mail app\u2026",
    ready: "Message ready",
    readyAria: "Your email draft is ready in your mail app.",
  },
  footer: {
    rights: "All rights reserved.",
    backHome: "Back to home",
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
      about: "概要",
      skills: "スキル",
      experience: "経歴",
      contact: "お問い合わせ",
    },
  },
  hero: {
    ariaSection: "はじめに",
    line1: "インターフェースを創る",
    line2: "そこに命を宿す。",
    accentWords: ["命を宿す。"],
    intro:
      "私は{name}。モーション・デザイン、3D、プロダクト思考を融合させ、記憶に残るWeb体験を届けるフロントエンドエンジニアです。",
    hint: "カーソルを動かすと表面がめくれます。私が届けるインターフェースの奥には、同じ深みのこだわりが隠れています。",
    ctaWork: "作品を見る",
    ctaTouch: "お問い合わせ",
  },
  home: {
    intro: {
      kicker: "クリエイティブ・フロントエンドエンジニア",
      line1: "設計し、創るのは",
      line2: "心が動くインターフェース",
      blurb:
        "モーション、3D、プロダクト思考を、速くて記憶に残るWeb体験に織り込んでいます。スクロールすると、その意味がわかります。",
    },
    whatIDo: "私の仕事",
    byTheNumbers: "数字で見る",
    make1: "忘れられないものを",
    make2: "一緒に創ろう。",
    explore: "作品を見る",
    getInTouch: "お問い合わせ",
    scroll: "スクロール",
    pillars: [
      {
        index: "01",
        title: "モーションデザイン",
        description:
          "状態を説明し、注目を導き、好奇心に応える、意図のあるアニメーション。飾りとしての動きは一切しません。",
      },
      {
        index: "02",
        title: "3D & WebGL",
        description:
          "シェーダー駆動のシーン、パーティクルシステム、実機でも60fpsを保つリアルタイム3D。",
      },
      {
        index: "03",
        title: "プロダクトUI",
        description:
          "デザインシステム、アクセシブルなコンポーネント、そしてプロトタイプを本番製品に変える縁の下の力持ち。",
      },
    ],
    stats: [
      { value: 6, suffix: "+", label: "UI制作の経験年数" },
      { value: 40, suffix: "+", label: "リリースしたプロジェクト" },
      { value: 15, suffix: "+", label: "クライアント・チーム数" },
    ],
  },
  projects: {
    eyebrow: "厳選した作品",
    heading: "動きと意図を込めたプロジェクト",
    subtitle:
      "プロダクトUI、Webアプリ、インタラクティブな実験作品の数々。すべてリリースし、計測し、磨き上げてきました。",
    filterAria: "カテゴリでプロジェクトを絞り込む",
    openDemo: "{title}のライブデモを開く",
    viewProject: "プロジェクトを見る",
    techAria: "技術スタック",
    liveDemo: "ライブデモ",
    source: "ソースコード",
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
          "マーケティングチーム向けのリアルタイム分析プラットフォーム。40以上のダッシュボードビュー、テーマ変更可能なデザインシステム、1万行でも滑らかに動く仮想化データグリッド。",
        highlights: [
          "1つのテーマ変更可能なデザインシステムに40以上のダッシュボードビュー",
          "1万行でも滑らかに動く仮想化データグリッド",
          "Figmaから本番環境まで届くデザイントークンパイプライン",
        ],
      },
      {
        key: "orbit",
        title: "Orbit Configurator",
        category: "Interactive",
        year: "2024",
        role: "クリエイティブデベロッパー",
        description:
          "物理ベースのマテリアル、カメラの演出、ビルドステップ間を60fpsで遷移するWebGLプロダクトコンフィギュレーター。",
        highlights: [
          "リアルタイムでレンダリングされる物理ベースマテリアル",
          "各ビルドステップを導くカメラ・コレオグラフィー",
          "設定状態間を60fpsで遷移",
        ],
      },
      {
        key: "pulse",
        title: "Pulse Storefront",
        category: "Web App",
        year: "2024",
        role: "フロントエンドエンジニア",
        description:
          "Lighthouseで98以上を記録するヘッドレスコマースストアフロント。楽観的カート、エッジレンダリングの商品ページ、A/Bテスト済みのチェックアウトフロー。",
        highlights: [
          "商品ページとチェックアウトでLighthouse 98以上",
          "ヘッドレスストアフロントAPIによる楽観的カート",
          "毎週リリースされるA/Bテスト済みチェックアウトフロー",
        ],
      },
      {
        key: "kinetic",
        title: "Kinetic Type Lab",
        category: "Interactive",
        year: "2023",
        role: "デザイナー & デベロッパー",
        description:
          "キネティックタイポグラフィの実験プレイグラウンド。スクロール駆動のテキスト、可変フォントの演出、シェーダーによる歪みエフェクト。",
        highlights: [
          "スクロール駆動のキネティックタイポグラフィ実験",
          "複数軸にわたる可変フォントの演出",
          "ライブテキストに適用するシェーダー歪みエフェクト",
        ],
      },
      {
        key: "atlas",
        title: "Atlas Design System",
        category: "Product UI",
        year: "2023",
        role: "デザインエンジニア",
        description:
          "3つのプロダクトを支えるコンポーネントライブラリとトークンパイプライン。60以上のアクセシブルなコンポーネント、Storybookドキュメント、自動ビジュアルリグレッション。",
        highlights: [
          "60以上のアクセシブルなReactコンポーネント",
          "Figmaから本番CSSまでのトークンパイプライン",
          "自動ビジュアルリグレッションを備えたStorybookドキュメント",
        ],
      },
    ],
  },
  projectDetail: {
    back: "実績に戻る",
    overview: "概要",
    highlights: "主なポイント",
    techStack: "使用技術",
    prev: "前のプロジェクト",
    next: "次のプロジェクト",
    open: "{title}のケーススタディを開く",
    navAria: "プロジェクトのナビゲーション",
  },
  skills: {
    eyebrow: "スキル",
    heading: "仕事で日々使うツール",
    subtitle:
      "実際の使い方で分類しています。土台となる技術、命を吹き込むレイヤー、そして安定して届けるための実践。",
    proficiency: "{skill}の習熟度",
    groups: [
      {
        title: "フロントエンド基盤",
        blurb: "あらゆるプロジェクトが立つ土台。",
        skills: [
          { name: "React & Next.js", level: 95 },
          { name: "TypeScript", level: 90 },
          { name: "Tailwind CSS", level: 92 },
          { name: "HTMLとアクセシビリティ", level: 88 },
        ],
      },
      {
        title: "モーション & 3D",
        blurb: "インターフェースに命を吹き込む層。",
        skills: [
          { name: "Framer Motion", level: 92 },
          { name: "GSAP", level: 88 },
          { name: "Three.js / R3F", level: 78 },
          { name: "CSSアニメーション", level: 90 },
        ],
      },
      {
        title: "エンジニアリング実務",
        blurb: "壊さず、速く届けるための実践。",
        skills: [
          { name: "パフォーマンス最適化", level: 85 },
          { name: "テスト（Vitest、Playwright）", level: 80 },
          { name: "Git & CI/CD", level: 86 },
          { name: "Node.js & APIs", level: 75 },
        ],
      },
    ],
  },
  experience: {
    eyebrow: "経歴",
    heading: "これまでの道のり",
    subtitle:
      "フリーランスのMVP開発から、何百ものチームに使われるプロダクトのフロントエンドを率いるまで。",
    now: "現在",
    techAria: "使用技術",
    items: [
      {
        role: "シニア・フロントエンドエンジニア",
        company: "Nimbus Labs",
        period: "2023 — 現在",
        current: true,
        summary:
          "200以上のチームが利用するB2B分析スイートで、フロントエンドギルドを率いています。",
        points: [
          "ストリーミングサーバーコンポーネントでダッシュボード基盤を再構築し、操作開始までの時間を38%短縮。",
          "4つのプロダクト領域のトランジションを統一する共通モーションシステムを導入。",
          "4名のエンジニアを、デザインシステムへの初めての貢献まで導きました。",
        ],
        stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      },
      {
        company: "Arunika Studio",
        role: "フロントエンドエンジニア",
        period: "2021 — 2023",
        current: false,
        summary:
          "地域ブランド向けに、アワード候補に選ばれたマーケティングサイトとインタラクティブキャンペーンを制作。",
        points: [
          "WebGLとスクロール駆動の叙事的ストーリーテリングを用いたキャンペーンサイトを12件リリース。Lighthouseスコア平均95以上。",
          "スタジオ内製のスターターキットを開発し、プロジェクト立ち上げ時間を半減。",
          "デザイナーと毎日連携し、ブラウザ上で直接モーションのプロトタイプを制作。",
        ],
        stack: ["React", "GSAP", "Three.js", "Sanity"],
      },
      {
        company: "フリーランス",
        role: "フリーランスUIエンジニア",
        period: "2019 — 2021",
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
  about: {
    eyebrow: "私について",
    heading: "規律はエンジニア、心はデザイナー",
    p1a: "PSDをピクセルパーフェクトなページに切り出すことから始まり、細部へのこだわりは今も変わりません。この6年でそれはもっと大きなものになりました：",
    p1Strong: "意図を持って動くプロダクトインターフェースを創ること",
    p1b: "— すべてのトランジションが状態を説明し、すべてのホバーが好奇心に応えます。",
    p2a:
      "現在はフロントエンド全体に携わっています：デザインシステム、WebGL、パフォーマンス予算、そしてその間にある地味な接着剤。私のお気に入りのプロジェクトは、",
    p2Strong: "エンジニアリングの厳密さと職人技が出会う場所",
    p2b: "にあります。",
    profileLabel: "プロフィール",
    factLabels: {
      name: "名前",
      basedIn: "在住",
      focus: "専門",
      currently: "現在",
    },
    focusValue: "インタラクティブなプロダクトUI",
    currentlyValue: "シニア・フロントエンドエンジニア",
    blockquote:
      "「最高のインターフェースは存在を忘れさせる。残るのは、それがあなたに与えた感覚だけ。」",
    principles: [
      {
        title: "パフォーマンス最優先",
        description:
          "カクつくモーションに意味はありません。すべてのアニメーションは実機の性能に合わせて設計しています。",
      },
      {
        title: "意図のあるモーション",
        description:
          "アニメーションは説明し、導き、喜ばせるものであるべき。飾りのための動きはしません。",
      },
      {
        title: "アクセシビリティを標準に",
        description:
          "キーボード操作、動作抑制への対応、誠実なコントラスト。これらは譲れません。",
      },
    ],
  },
  contact: {
    eyebrow: "お問い合わせ",
    heading: "記憶に残るものを一緒に創りましょう",
    intro:
      "構想中のプロジェクト、募集中のポジション、あるいはWebのモーションについて語りたいだけでも。私の受信トレイはいつでも開いています。",
    mailSubject: "{name}からのポートフォリオお問い合わせ",
    name: "名前",
    namePlaceholder: "山田 太郎",
    email: "メールアドレス",
    emailPlaceholder: "you@example.com",
    message: "メッセージ",
    messagePlaceholder: "プロジェクトについて教えてください…",
    send: "メッセージを送信",
    opening: "メールアプリを起動中…",
    ready: "メッセージ準備完了",
    readyAria: "メールアプリに下書きが準備できました。",
  },
  footer: {
    rights: "無断転載を禁じます。",
    backHome: "トップへ戻る",
  },
};