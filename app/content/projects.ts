/**
 * Project content — the domain store, completely independent from UI.
 *
 * This file is the canonical source for the Home reel, project index, and
 * case studies. The website reads it directly and does not require a database
 * connection. `npm run seed:projects` is an optional one-way export to
 * Supabase; Supabase is not a runtime content source.
 *
 * Accuracy rules:
 * - Optional information stays optional (no `"#"` placeholders, no invented
 *   metrics, employers, or dates). Anything unverified is omitted or flagged
 *   TODO_REAL_CONTENT.
 * - Confidential work keeps `links` empty and `confidentiality !== "public"`.
 * - Media `src` values point at `/public/projects/<slug>/...` today; they can
 *   later point at Supabase Storage URLs without changing the UI contract.
 */
import type { LocalizedText } from "../types/common";
import type { StoredProject } from "../types/project";

/** Build a bilingual value from the two locale strings. */
const t = (en: string, ja: string): LocalizedText => ({ en, ja });

export const projects: StoredProject[] = [
  // ── Featured (Home reel, in featuredOrder) ────────────────────────────────
  {
    id: "carbon-monitoring",
    slug: "carbon-monitoring",
    title: "Carbon Monitoring SaaS",
    year: "2026",
    role: t("Software Engineer / Frontend Engineer", "ソフトウェアエンジニア / フロントエンドエンジニア"),
    fields: ["Frontend", "UI / UX"],
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "REST API",
      "React Router",
      "React Hook Form",
      "Zod",
      "Zustand",
    ],
    summary: t(
      "B2B carbon monitoring SaaS developed in a 5-member team, featuring role-based workflows for Admin, Master, and User, a 4-step onboarding flow, and REST API integrations.",
      "5人のチームで開発したB2B向けカーボンモニタリングSaaS。Admin・Master・Userのロール別ワークフロー、4ステップのオンボーディングフロー、REST API連携を担当しました。",
    ),
    featured: true,
    featuredOrder: 1,
    projectOrder: 1,
    hasCaseStudy: true,
    // Professional/company work: no repo, no demo, no internal screenshots.
    confidentiality: "limited",
    links: [],
    initials: "CM",
    tone: "accent",
    // TODO_REAL_IMAGE: public-safe screenshot (if any is approved)
    caseStudy: {
      overview: t(
        "A B2B carbon monitoring SaaS built in a 5-member team. I worked across UI/UX and frontend engineering: role-based workflows for Admin, Master, and User, a 4-step onboarding flow, and the REST API integrations that power them.",
        "5人のチームで開発したB2B向けカーボンモニタリングSaaS。Admin・Master・Userのロール別ワークフロー、4ステップのオンボーディングフロー、そしてそれらを支えるREST API連携を、UI/UXとフロントエンドの両面で担当しました。",
      ),
      atAGlance: t("Project at a glance", "プロジェクト概要"),
      challenge: {
        heading: t("One product, three kinds of user", "一つのプロダクト、三種類のユーザー"),
        lead: t(
          "Admins, Masters, and Users each see the same product differently — different dashboards, different permissions, different next steps. The interface had to keep all three coherent without becoming three separate apps.",
          "Admin・Master・Userは、同じプロダクトをそれぞれ違う目線で使います。ダッシュボードも権限も次のアクションも異なる三つの役割を、別々のアプリに分けることなく一つの体験として保つ必要がありました。",
        ),
        body: t(
          "The deeper difficulty sat in the business forms. Companies onboard through a 4-step flow — company and personal information, methodology and equipment, confirmation, completion — where every field feeds downstream calculations. Weak validation here would poison the data the whole product depends on.",
          "より難しいのは業務フォームでした。企業は4ステップのオンボーディング — 会社・個人情報、手法と機材情報、確認、完了 — を通じて登録され、入力された項目は下流の計算すべてを支えます。ここでバリデーションが甘ければ、プロダクト全体のデータが汚れてしまいます。",
        ),
      },
approach: {
        kicker: t("Approach", "アプローチ"),
        heading: t(
          "Roles, a guided onboarding, and forms that refuse bad data",
          "ロール設計、ガイド付きオンボーディング、不正データを拒むフォーム",
        ),
        steps: [
          {
            tag: t("Workflows", "ワークフロー"),
            title: t("Role-based routing and protected views", "ロール別ルーティングと保護されたビュー"),
            description: t(
              "Each role lands in its own workspace. Protected routes and role-aware navigation keep the Admin, Master, and User flows separate while sharing one design system.",
              "各ロールは専用のワークスペースに着地します。保護されたルートとロールを意識したナビゲーションで、Admin・Master・Userのフローを分離しつつ、一つのデザインシステムを共有します。",
            ),
          },
          {
            tag: t("Onboarding", "オンボーディング"),
            title: t("A 4-step path from signup to first use", "登録から初回利用までの4ステップ"),
            description: t(
              "Company and personal information, methodology and equipment, confirmation, completion. Each step explains what it needs and why, so a complex registration never feels like a wall of forms.",
              "会社・個人情報、手法と機材情報、確認、完了。各ステップが何を・なぜ必要とするかを説明し、複雑な登録をフォームの壁に感じさせません。",
            ),
          },
          {
            tag: t("Engineering", "エンジニアリング"),
            title: t("Validation and state that survive complexity", "複雑さに耐えるバリデーションと状態管理"),
            description: t(
              "React Hook Form paired with Zod schemas validates business rules before anything reaches the API, while Zustand keeps cross-step state predictable.",
              "React Hook FormとZodスキーマの組み合わせで、APIに届く前に業務ルールを検証。Zustandでステップをまたぐ状態を予測可能に保ちます。",
            ),
          },
        ],
      },
      features: {
        heading: t("What shipped", "実装したもの"),
        items: [
          {
            title: t("Role-based dashboards", "ロール別ダッシュボード"),
            description: t(
              "Admin, Master, and User each get workflows shaped to their responsibilities, behind protected routes.",
              "Admin・Master・Userそれぞれの責務に合わせたワークフローを、保護されたルートの背後に提供します。",
            ),
          },
          {
            title: t("4-step onboarding", "4ステップのオンボーディング"),
            description: t(
              "Company & personal information, methodology & equipment, confirmation, completion — a guided path instead of one intimidating form.",
              "会社・個人情報、手法と機材情報、確認、完了。一枚の巨大なフォームではなく、ガイドされた経路として設計。",
            ),
          },
          {
            title: t("Validated business forms", "検証済みの業務フォーム"),
            description: t(
              "Complex fields are checked against Zod schemas at the edge of the UI, so bad data never reaches the API.",
              "複雑な入力はUIの入り口でZodスキーマにより検証され、不正なデータはAPIに届きません。",
            ),
          },
          {
            title: t("REST API integration", "REST API連携"),
            description: t(
              "Dashboards and workflows are wired to the API layer with typed request handling.",
              "ダッシュボードとワークフローを、型付きのリクエスト処理でAPI層に接続しました。",
            ),
          },
        ],
      },
      galleryLabel: t("Gallery", "ギャラリー"),
      outcomes: {
        kicker: t("Outcomes", "成果"),
        heading: t("What changed", "変わったこと"),
        items: [
          t(
            "Role-based workflows shipped for Admin, Master, and User.",
            "Admin・Master・User向けのロール別ワークフローをリリース。",
          ),
          t(
            "The 4-step onboarding flow takes a company from registration to first use.",
            "4ステップのオンボーディングが、企業を登録から初回利用まで導きます。",
          ),
          t(
            "Complex methodology and equipment forms validate before submission.",
            "複雑な手法・機材フォームは送信前に検証されます。",
          ),
          t("Delivered as a 5-member engineering team.", "5人のエンジニアリングチームとして納品しました。"),
        ],
      },
      nextLabel: t("Next project", "次のプロジェクト"),
    },
  },
{
    id: "kumamotalk",
    slug: "kumamotalk",
    title: "Kumamotalk — Interactive AI Conversation Bot",
    year: "2025",
    role: t(
      "Frontend Engineer & UI/UX Designer",
      "フロントエンドエンジニア & UI/UXデザイナー",
    ),
    fields: ["Frontend", "AI / ML", "UI / UX"],
    stack: ["Next.js", "React", "TypeScript", "face-api.js", "TensorFlow.js", "react-mic"],
    summary: t(
      "Interactive AI conversation bot developed for Kumamoto EXPO 2025. I designed and implemented the frontend with face-detection and microphone-aware interactions, used by 80+ visitors.",
      "熊本EXPO 2025向けに開発した対話型AI会話ボット。顔検出とマイクの状態を反映したインタラクションを備えたフロントエンドを設計・実装し、来場者80名以上に利用されました。",
    ),
    featured: true,
    featuredOrder: 2,
    projectOrder: 2,
    hasCaseStudy: true,
    confidentiality: "public",
    links: [
      {
        type: "github",
        label: t("Source", "ソースコード"),
        url: "https://github.com/farisznafis/kumamotalk",
      },
      {
        type: "figma",
        label: t("Figma", "Figma"),
        url: "https://www.figma.com/design/s2BfSvK4Fy0Fe1PRPkLhsV/Kumamon?node-id=0-1",
      },
    ],
    cover: {
      type: "image",
      src: "/projects/kumamotalk/cover.png",
      alt: t(
        "Kumamotalk booth interface: a red-framed screen greeting the visitor in Japanese, with language buttons for Japanese, Taiwanese, and English",
        "Kumamotalkのブース画面：赤い枠の画面に日本語の挨拶が表示され、日本語・台湾語・英語の言語ボタンが並ぶ",
      ),
    },
    figmaEmbed: {
      url: "https://www.figma.com/design/s2BfSvK4Fy0Fe1PRPkLhsV/Kumamon?node-id=0-1",
      title: t(
        "Kumamotalk design file in Figma",
        "FigmaのKumamotalkデザインファイル",
      ),
      caption: t(
        "The full UI design file — screens, states, and components for the booth interface.",
        "ブース画面の画面・状態・コンポーネントをまとめたUIデザインファイル全体。",
      ),
    },
    // TODO_REAL_IMAGE: replace placeholders with Figma frame exports (PNG 2x)
    gallery: [
      {
        type: "image",
        src: "/projects/kumamotalk/figma-01.svg",
        alt: t("Figma frame 01 (placeholder)", "Figmaフレーム01（仮画像）"),
        caption: t("Placeholder — Figma frame 01", "仮画像 — Figmaフレーム01"),
      },
      {
        type: "image",
        src: "/projects/kumamotalk/figma-02.svg",
        alt: t("Figma frame 02 (placeholder)", "Figmaフレーム02（仮画像）"),
        caption: t("Placeholder — Figma frame 02", "仮画像 — Figmaフレーム02"),
      },
      {
        type: "image",
        src: "/projects/kumamotalk/figma-03.svg",
        alt: t("Figma frame 03 (placeholder)", "Figmaフレーム03（仮画像）"),
        caption: t("Placeholder — Figma frame 03", "仮画像 — Figmaフレーム03"),
      },
      {
        type: "image",
        src: "/projects/kumamotalk/figma-04.svg",
        alt: t("Figma frame 04 (placeholder)", "Figmaフレーム04（仮画像）"),
        caption: t("Placeholder — Figma frame 04", "仮画像 — Figmaフレーム04"),
      },
    ],
    initials: "KM",
    tone: "amber",
    caseStudy: {
      overview: t(
        "An interactive AI conversation bot built for Kumamoto EXPO 2025 in a 3-person team. I designed and implemented the frontend — face-detection-driven reactions and microphone-aware interactions — and the bot was used by 80+ visitors at the event.",
        "熊本EXPO 2025向けに3人のチームで開発した対話型AI会話ボット。顔検出に反応するインタラクションとマイクの状態を反映したUIを設計・実装し、来場者80名以上に利用されました。",
      ),
      atAGlance: t("Project at a glance", "プロジェクト概要"),
      challenge: {
        heading: t("A bot that has to work in a noisy hall", "賑やかな会場で動くボット"),
        lead: t(
          "Expo visitors walk up cold: no manual, no patience, one chance to understand what this thing does. The interface had to invite a conversation and show its state at a glance — listening, thinking, speaking.",
          "EXPOの来場者は何の予備知識もなく、待つ気力もなく、一度きりの機会で近づいてきます。インターフェースは会話への招待であり、状態 — 聴いている・考えている・話している — が一目で分かる必要がありました。",
        ),
        body: t(
          "Everything had to run in the browser on event hardware. Face detection had to feel responsive rather than eerie, and the microphone flow had to handle permission and recording states without ever stranding a visitor.",
          "すべては会場のハードウェア上のブラウザで動く必要がありました。顔検出は不気味ではなく反応良く感じられること、マイクのフローは権限や録音状態を扱いながら、来場者を迷子にしないことが求められました。",
        ),
      },
      approach: {
        kicker: t("Approach", "アプローチ"),
        heading: t("Design the conversation, then engineer the senses", "会話をデザインし、そのあとに感覚を実装する"),
        steps: [
          {
            tag: t("Interface", "インターフェース"),
            title: t("A conversation UI built for a booth", "ブースのために設計した会話UI"),
            description: t(
              "I designed the interaction flow for walk-up visitors: large states, obvious affordances, and a dialogue layout that reads from a distance.",
              "立ち寄った来場者を想定したインタラクションフローをデザインしました。大きな状態表示、分かりやすい操作、離れた場所からも読める対話レイアウトです。",
            ),
          },
          {
            tag: t("Perception", "認識"),
            title: t("Face detection as feedback, not surveillance", "監視ではなく、フィードバックとしての顔検出"),
            description: t(
              "face-api.js and TensorFlow.js run in the browser so the bot can react to the visitor in front of it — attention drives the conversation's rhythm.",
              "face-api.jsとTensorFlow.jsをブラウザ内で動かし、ボットが目の前の来場者の存在に反応できるように。視線が会話のリズムを駆動します。",
            ),
          },
          {
            tag: t("Voice", "音声"),
            title: t("A microphone flow with no dead ends", "行き止まりのないマイクフロー"),
            description: t(
              "react-mic drives the recording states with explicit status feedback: requesting permission, listening, processing — every state visible.",
              "react-micで録音状態を駆動し、権限の要求・聴き取り・処理のすべての状態を明示的に表示します。",
            ),
          },
        ],
      },
features: {
        heading: t("What shipped", "実装したもの"),
        items: [
          {
            title: t("Face-aware interactions", "顔を意識したインタラクション"),
            description: t(
              "Browser-based face detection lets the bot respond to the visitor standing in front of it.",
              "ブラウザ内の顔検出により、ボットが目の前の来場者に反応します。",
            ),
          },
          {
            title: t("Microphone-aware flow", "マイクを意識したフロー"),
            description: t(
              "Recording and permission states are explicit, so visitors always know what the bot is doing.",
              "録音と権限の状態が明示され、来場者は常にボットの状態を把握できます。",
            ),
          },
          {
            title: t("Expo-ready interface", "EXPOで使えるインターフェース"),
            description: t(
              "Designed for walk-up use: legible at distance, forgiving of first-time users.",
              "立ち寄り利用を想定した設計。距離からでも読め、初見のユーザーにも寛容です。",
            ),
          },
          {
            title: t("3-person delivery", "3人での納品"),
            description: t(
              "Designed and implemented the frontend within a 3-person team.",
              "3人のチーム内でフロントエンドの設計と実装を担当しました。",
            ),
          },
        ],
      },
      galleryLabel: t("Gallery", "ギャラリー"),
      outcomes: {
        kicker: t("Outcomes", "成果"),
        heading: t("What changed", "変わったこと"),
        items: [
          t(
            "Used by 80+ visitors at Kumamoto EXPO 2025.",
            "熊本EXPO 2025で来場者80名以上に利用されました。",
          ),
          t(
            "Face detection and microphone handling run entirely in the browser.",
            "顔検出とマイク処理はすべてブラウザ内で完結します。",
          ),
          t(
            "The frontend — UI/UX design and implementation — was my contribution within the 3-person team.",
            "フロントエンド — UI/UXデザインと実装 — は3人チームの中で私の担当でした。",
          ),
        ],
      },
      nextLabel: t("Next project", "次のプロジェクト"),
    },
  },
  {
    id: "makomti-recruitment",
    slug: "makomti-recruitment",
    title: "MAKOMTI Recruitment — Web & Visual Campaign",
    year: "2023",
    role: t("UI/UX Designer / Visual Designer", "UI/UXデザイナー / ビジュアルデザイナー"),
    fields: ["UI / UX", "Visual Design"],
    stack: ["Figma", "UI/UX Design", "Responsive Design", "Visual Assets"],
    summary: t(
      "Recruitment website of roughly 21 pages designed for desktop and mobile in a 3-person team, supported by recruitment campaign visuals.",
      "約21ページで構成される採用サイトを、3人のチームでデスクトップとモバイル向けにデザイン。採用キャンペーンのビジュアル素材も制作しました。",
    ),
    featured: true,
    featuredOrder: 3,
    projectOrder: 3,
    hasCaseStudy: true,
    confidentiality: "public",
    links: [
      {
        type: "figma",
        label: t("Figma", "Figma"),
        url: "https://www.figma.com/design/m3mmdDxMVsRAPqMjVYvkb6/-CV--Seleksi-Makomti?node-id=0-1",
      },
    ],
    cover: {
      type: "image",
      src: "/projects/makomti-recruitment/cover-makomti.png",
      alt: t(
        "MAKOMTI recruitment website cover: a desktop and mobile screen showing the hero section with a photo of a smiling person and a headline in Indonesian",
        "MAKOMTI採用サイトのカバー：デスクトップとモバイルの画面に、笑顔の人物写真とインドネシア語の見出しが表示されたヒーローセクション",
      ),
    },
    figmaEmbed: {
      url: "https://www.figma.com/design/m3mmdDxMVsRAPqMjVYvkb6/-CV--Seleksi-Makomti?node-id=0-1",
      title: t(
        "MAKOMTI recruitment design file in Figma",
        "FigmaのMAKOMTI採用サイトデザインファイル",
      ),
      caption: t(
        "The full design file — desktop and mobile pages plus campaign visuals.",
        "デスクトップ・モバイルのページとキャンペーンビジュアルをまとめたデザインファイル全体。",
      ),
    },
    // TODO_REAL_IMAGE: replace placeholders with Figma frame exports (PNG 2x)
    gallery: [
      {
        type: "image",
        src: "/projects/makomti-recruitment/figma-01.svg",
        alt: t("Figma frame 01 (placeholder)", "Figmaフレーム01（仮画像）"),
        caption: t("Placeholder — Figma frame 01", "仮画像 — Figmaフレーム01"),
      },
      {
        type: "image",
        src: "/projects/makomti-recruitment/figma-02.svg",
        alt: t("Figma frame 02 (placeholder)", "Figmaフレーム02（仮画像）"),
        caption: t("Placeholder — Figma frame 02", "仮画像 — Figmaフレーム02"),
      },
      {
        type: "image",
        src: "/projects/makomti-recruitment/figma-03.svg",
        alt: t("Figma frame 03 (placeholder)", "Figmaフレーム03（仮画像）"),
        caption: t("Placeholder — Figma frame 03", "仮画像 — Figmaフレーム03"),
      },
      {
        type: "image",
        src: "/projects/makomti-recruitment/figma-04.svg",
        alt: t("Figma frame 04 (placeholder)", "Figmaフレーム04（仮画像）"),
        caption: t("Placeholder — Figma frame 04", "仮画像 — Figmaフレーム04"),
      },
    ],
    initials: "MK",
    tone: "accent",
    caseStudy: {
      overview: t(
        "A recruitment website of roughly 21 pages, designed for desktop and mobile in a 3-person team, with supporting visual assets extending it into a recruitment campaign.",
        "約21ページで構成される採用サイトを、3人のチームでデスクトップとモバイル向けにデザイン。サイトのビジュアルを引き継ぐ採用キャンペーン素材も制作しました。",
      ),
      atAGlance: t("Project at a glance", "プロジェクト概要"),
      challenge: {
        heading: t("Twenty-one pages, one voice", "21ページ、一つの声"),
        lead: t(
          "A recruitment site has to carry company story, roles, process, and FAQ without losing a consistent voice — and every page has to work on a phone, where most candidates will first meet it.",
          "採用サイトは会社のストーリー・職種・プロセス・FAQを、一貫した声を失わずに運ばなければなりません。しかも候補者が最初に触れるのは、ほとんどの場合スマートフォンの画面です。",
        ),
        body: t(
          "The scale was the challenge: roughly 21 interconnected pages that had to feel like one product. Layout decisions had to repeat cheaply, and the visual language had to stretch from the site itself into campaign materials.",
          "難しさは規模にありました。約21ページが相互に接続され、一つのプロダクトとして感じられる必要があります。レイアウトの判断は安価に繰り返せ、ビジュアル言語はサイトからキャンペーン素材まで伸びる必要がありました。",
        ),
      },
approach: {
        kicker: t("Approach", "アプローチ"),
        heading: t("A page system first, campaign assets second", "まずページシステム、そのあとにキャンペーン素材"),
        steps: [
          {
            tag: t("System", "システム"),
            title: t("Templates before pages", "ページの前にテンプレート"),
            description: t(
              "Defined repeating page patterns — hero, content, listing, detail — so ~21 pages compose from a small set of layouts instead of 21 bespoke designs.",
              "ヒーロー・コンテンツ・一覧・詳細といった繰り返しのページパターンを定義し、約21ページを少数のレイアウトの組み合わせとして構成。21個の個別デザインにはしません。",
            ),
          },
          {
            tag: t("Responsive", "レスポンシブ"),
            title: t("Desktop and mobile as equals", "デスクトップとモバイルは対等"),
            description: t(
              "Every layout was designed for both breakpoints from the start, keeping hierarchy and readability intact on small screens.",
              "すべてのレイアウトを最初から両ブレークポイントで設計し、小さな画面でも階層と可読性を保ちます。",
            ),
          },
          {
            tag: t("Campaign", "キャンペーン"),
            title: t("Visuals that outlive the viewport", "ビューポートの外まで生きるビジュアル"),
            description: t(
              "Supporting recruitment visuals extended the site's identity into campaign materials, keeping one visual voice across touchpoints.",
              "採用ビジュアルがサイトのアイデンティティをキャンペーン素材へ引き継ぎ、接点を越えて一つのビジュアルの声を保ちます。",
            ),
          },
        ],
      },
      features: {
        heading: t("What shipped", "実装したもの"),
        items: [
          {
            title: t("~21-page architecture", "約21ページの情報設計"),
            description: t(
              "A complete recruitment journey — story, roles, process — organized as a coherent page system.",
              "ストーリー・職種・プロセスを一貫したページシステムとして編成した、完全な採用ジャーニー。",
            ),
          },
          {
            title: t("Desktop & mobile design", "デスクトップ & モバイルデザイン"),
            description: t(
              "Both breakpoints designed together, not ported after the fact.",
              "両ブレークポイントを同時に設計。後付けの移植ではありません。",
            ),
          },
          {
            title: t("Campaign visual assets", "キャンペーンビジュアル素材"),
            description: t(
              "Recruitment visuals that carry the same identity beyond the website.",
              "ウェブサイトと同じアイデンティティを運ぶ採用ビジュアル。",
            ),
          },
          {
            title: t("3-person team", "3人のチーム"),
            description: t(
              "Designed within a 3-person team, with shared ownership of the system.",
              "3人のチーム内でデザインを担当し、システムの所有権を共有しました。",
            ),
          },
        ],
      },
      galleryLabel: t("Gallery", "ギャラリー"),
      outcomes: {
        kicker: t("Outcomes", "成果"),
        heading: t("What changed", "変わったこと"),
        items: [
          t(
            "A complete recruitment flow across roughly 21 pages.",
            "約21ページにわたる完全な採用フロー。",
          ),
          t(
            "Consistent desktop and mobile layouts across the site.",
            "サイト全体で一貫したデスクトップ・モバイルレイアウト。",
          ),
          t(
            "Visual assets extended the recruitment site into campaign materials.",
            "ビジュアル素材が採用サイトをキャンペーン素材へ拡張しました。",
          ),
        ],
      },
      nextLabel: t("Next project", "次のプロジェクト"),
    },
  },
{
    id: "speech-emotion",
    slug: "speech-emotion",
    title: "Speech Emotion Recognition",
    year: "2024",
    role: t("Machine Learning Developer", "機械学習デベロッパー"),
    fields: ["AI / ML", "Data / Optimization"],
    stack: ["Python", "TensorFlow", "Keras", "Librosa", "NumPy", "Pandas", "Streamlit"],
    summary: t(
      "Audio emotion recognition system that extracts ZCR, RMS, and MFCC features and uses a TensorFlow/Keras model to classify speech into six emotion categories through a Streamlit interface.",
      "ZCR・RMS・MFCCの特徴量を抽出し、TensorFlow/Kerasモデルで音声を6つの感情カテゴリに分類するシステム。Streamlitのインターフェースから利用できます。",
    ),
    featured: true,
    featuredOrder: 4,
    projectOrder: 4,
    hasCaseStudy: true,
    confidentiality: "public",
    links: [
      {
        type: "github",
        label: t("Source", "ソースコード"),
        url: "https://github.com/farisznafis/emotion-sentiment",
      },
    ],
    initials: "SE",
    tone: "amber",
    // TODO_REAL_IMAGE: Streamlit UI screenshot
    caseStudy: {
      overview: t(
        "An audio emotion recognition system: ZCR, RMS, and MFCC features extracted with Librosa, classified by a TensorFlow/Keras model into six emotions, and served through a Streamlit interface.",
        "音声の感情認識システム。LibrosaでZCR・RMS・MFCCの特徴量を抽出し、TensorFlow/Kerasモデルが6つの感情に分類、Streamlitのインターフェースから利用できます。",
      ),
      atAGlance: t("Project at a glance", "プロジェクト概要"),
      challenge: {
        heading: t("Reading feeling from a waveform", "波形から感情を読む"),
        lead: t(
          "Emotion hides in signal shape, not words. The model had to learn from raw audio features — zero-crossing rate, RMS energy, MFCCs — and separate six classes that overlap even for human listeners.",
          "感情は言葉ではなく信号の形に宿ります。モデルはゼロ交差率・RMSエネルギー・MFCCといった生の音声特徴から学び、人間の聴き手ですら重なり合う6つのクラスを分離しなければなりませんでした。",
        ),
        body: t(
          "The pipeline had to stay honest end to end: consistent feature extraction, a model that generalizes beyond its training recordings, and an interface that lets anyone test it without touching Python.",
          "パイプラインは終端まで誠実である必要がありました。一貫した特徴抽出、学習録音を超えて一般化するモデル、そして誰もがPythonに触れずに試せるインターフェースです。",
        ),
      },
      approach: {
        kicker: t("Approach", "アプローチ"),
        heading: t("Features first, then a classifier, then a face for it", "まず特徴量、次に分類器、そして顔となるUI"),
        steps: [
          {
            tag: t("Features", "特徴量"),
            title: t("ZCR, RMS, and MFCC extraction", "ZCR・RMS・MFCCの抽出"),
            description: t(
              "Librosa extracts the signal features that carry prosody — energy, rhythm, spectral shape — into a representation a model can learn from.",
              "Librosaが韻律を運ぶ信号特徴 — エネルギー・リズム・スペクトルの形 — を、モデルが学べる表現へ抽出します。",
            ),
          },
          {
            tag: t("Model", "モデル"),
            title: t("A TensorFlow/Keras classifier for six emotions", "6感情を分けるTensorFlow/Keras分類器"),
            description: t(
              "A Keras network maps extracted features to six classes: neutral, happy, sad, angry, fear, and disgust.",
              "Kerasネットワークが抽出された特徴を6クラス — neutral・happy・sad・angry・fear・disgust — へマッピングします。",
            ),
          },
          {
            tag: t("Interface", "インターフェース"),
            title: t("Streamlit as the product surface", "プロダクトの表面としてのStreamlit"),
            description: t(
              "A Streamlit app wraps the pipeline so recordings can be classified interactively — no code required.",
              "Streamlitアプリがパイプラインを包み込み、録音を対話的に分類できます。コードは不要です。",
            ),
          },
        ],
      },
features: {
        heading: t("What shipped", "実装したもの"),
        items: [
          {
            title: t("Signal-level features", "信号レベルの特徴量"),
            description: t(
              "ZCR, RMS, and MFCC extraction with Librosa captures how something is said, not what.",
              "LibrosaによるZCR・RMS・MFCC抽出が、何が言われたかではなくどう言われたかを捉えます。",
            ),
          },
          {
            title: t("Six-class classifier", "6クラス分類器"),
            description: t(
              "A TensorFlow/Keras model separates neutral, happy, sad, angry, fear, and disgust.",
              "TensorFlow/Kerasモデルがneutral・happy・sad・angry・fear・disgustを分離します。",
            ),
          },
          {
            title: t("Streamlit interface", "Streamlitインターフェース"),
            description: t(
              "The full pipeline is usable through a simple app, from audio in to emotion out.",
              "音声入力から感情出力まで、パイプライン全体をシンプルなアプリから利用できます。",
            ),
          },
          {
            title: t("Reproducible data handling", "再現可能なデータ処理"),
            description: t(
              "NumPy and Pandas keep feature and dataset handling consistent end to end.",
              "NumPyとPandasが特徴量とデータセットの処理を終端まで一貫させます。",
            ),
          },
        ],
      },
      galleryLabel: t("Gallery", "ギャラリー"),
      outcomes: {
        kicker: t("Outcomes", "成果"),
        heading: t("What changed", "変わったこと"),
        items: [
          t("Classifies speech into six emotion categories.", "音声を6つの感情カテゴリに分類します。"),
          t(
            "Feature extraction, training, and inference share one Python stack.",
            "特徴抽出・学習・推論が一つのPythonスタックを共有します。",
          ),
          t(
            "The Streamlit interface makes the model usable without any code.",
            "Streamlitインターフェースにより、コードなしでモデルを利用できます。",
          ),
        ],
      },
      nextLabel: t("Next project", "次のプロジェクト"),
    },
  },
  {
    id: "financify",
    slug: "financify",
    title: "Financify — Inflation Forecasting",
    year: "2023",
    role: t("Machine Learning Engineer", "機械学習エンジニア"),
    fields: ["AI / ML", "Data / Optimization"],
    stack: ["Python", "TensorFlow / Keras", "LSTM", "Pandas", "Flask", "Docker"],
    summary: t(
      "Machine-learning application for forecasting inflation across Indonesian cities and periods using an LSTM model, developed as a Bangkit capstone project.",
      "Bangkitのキャップストーンプロジェクトとして開発した、LSTMモデルによるインドネシア各都市・各期間のインフレ予測アプリケーション。",
    ),
    featured: true,
    featuredOrder: 5,
    projectOrder: 5,
    hasCaseStudy: true,
    confidentiality: "public",
    links: [
      {
        type: "github",
        label: t("Source", "ソースコード"),
        url: "https://github.com/farisznafis/bangkit-financify",
      },
    ],
    initials: "FI",
    tone: "accent",
    // TODO_REAL_IMAGE: app/model screenshot
    caseStudy: {
      overview: t(
        "A Bangkit capstone project: an LSTM model forecasting inflation across Indonesian cities and periods, served through a Flask application layer that the team's mobile app consumes.",
        "Bangkitのキャップストーンプロジェクト。LSTMモデルがインドネシア各都市・各期間のインフレを予測し、Flaskのアプリケーション層を通じてチームのモバイルアプリが消費します。",
      ),
      atAGlance: t("Project at a glance", "プロジェクト概要"),
      challenge: {
        heading: t("Forecasting an economy, city by city", "都市ごとに読む経済"),
        lead: t(
          "Inflation moves differently in every Indonesian city and every period. A single global curve would be useless — the model had to learn temporal patterns per city and serve them through an interface other teams could build on.",
          "インフレは都市ごと、期間ごとに異なる動きをします。一本の全体曲線では役に立ちません。モデルは都市ごとの時系列パターンを学び、他のチームがその上に構築できる形で予測を提供する必要がありました。",
        ),
        body: t(
          "As the machine-learning engineer, my work sat between data and product: prepare the series, design an LSTM that respects their sequence structure, and expose forecasts through a Flask layer the mobile team could integrate.",
          "機械学習エンジニアとして、私の仕事はデータとプロダクトの間にありました。時系列を整え、その系列構造を尊重するLSTMを設計し、Flask層を通じてモバイルチームが統合できる予測を公開することです。",
        ),
      },
approach: {
        kicker: t("Approach", "アプローチ"),
        heading: t("Series in, forecasts out, API in between", "系列を入れ、予測を出し、間にAPIを置く"),
        steps: [
          {
            tag: t("Data", "データ"),
            title: t("Indonesian inflation series, prepared", "整えられたインドネシアのインフレ系列"),
            description: t(
              "City-level inflation data cleaned and shaped with Pandas into sequences the model can learn from.",
              "Pandasで都市レベルのインフレデータを清掃・整形し、モデルが学べる系列へ変換します。",
            ),
          },
          {
            tag: t("Model", "モデル"),
            title: t("An LSTM for temporal patterns", "時系列パターンを学ぶLSTM"),
            description: t(
              "A TensorFlow/Keras LSTM learns the sequence structure of inflation across cities and forecast periods.",
              "TensorFlow/KerasのLSTMが、都市と予測期間をまたぐインフレの系列構造を学習します。",
            ),
          },
          {
            tag: t("Delivery", "デリバリー"),
            title: t("Flask and Docker as the handoff", "引き継ぎとしてのFlaskとDocker"),
            description: t(
              "A Flask application layer exposes predictions, packaged with Docker so the team's mobile app integrates against a stable interface.",
              "Flaskのアプリケーション層が予測を公開し、Dockerでパッケージ化。モバイルチームは安定したインターフェースに対して統合できます。",
            ),
          },
        ],
      },
      features: {
        heading: t("What shipped", "実装したもの"),
        items: [
          {
            title: t("LSTM forecasting", "LSTMによる予測"),
            description: t(
              "Sequence modeling tuned to inflation's temporal structure.",
              "インフレの時系列構造に合わせた系列モデリング。",
            ),
          },
          {
            title: t("Multi-city coverage", "複数都市のカバー"),
            description: t(
              "Forecasts across Indonesian cities and periods, not one aggregate curve.",
              "一本の集計曲線ではなく、インドネシアの都市と期間をまたぐ予測。",
            ),
          },
          {
            title: t("Flask application layer", "Flaskアプリケーション層"),
            description: t(
              "Predictions served through an API the rest of the team builds on.",
              "チームの他のメンバーがその上に構築できるAPIを通じて予測を提供。",
            ),
          },
          {
            title: t("Docker packaging", "Dockerパッケージング"),
            description: t(
              "The service ships in a container, ready for deployment.",
              "サービスはコンテナに梱包され、デプロイの準備ができています。",
            ),
          },
        ],
      },
      galleryLabel: t("Gallery", "ギャラリー"),
      outcomes: {
        kicker: t("Outcomes", "成果"),
        heading: t("What changed", "変わったこと"),
        items: [
          t(
            "Forecasts inflation across Indonesian cities and periods.",
            "インドネシアの都市と期間をまたぐインフレ予測。",
          ),
          t(
            "Built within the Bangkit Machine Learning learning-path team.",
            "Bangkitの機械学習ラーニングパスチーム内で構築。",
          ),
          t(
            "The Flask layer lets the team's mobile application consume the model.",
            "Flask層により、チームのモバイルアプリケーションがモデルを利用できます。",
          ),
        ],
        // TODO_REAL_CONTENT: "Top 50 Product-based Capstone Projects" —
        // display only if verified against existing CV/portfolio data.
      },
      nextLabel: t("Next project", "次のプロジェクト"),
    },
  },
{
    id: "blastout",
    slug: "blastout",
    title: "BLASTOUT 2023 Website",
    // TODO_REAL_CONTENT: confirm year, team size, and any public link.
    fields: ["UI / UX"],
    stack: ["Figma", "Web Design"],
    summary: t(
      "Event website design for BLASTOUT 2023.",
      "BLASTOUT 2023のイベントサイトのWebデザイン。",
    ),
    featured: false,
    projectOrder: 6,
    hasCaseStudy: false,
    confidentiality: "limited",
    links: [],
    initials: "BO",
    tone: "amber",
  },
  {
    id: "co2-emission",
    slug: "co2-emission",
    title: "CO2 Emission Prediction for Four-Wheeled Vehicles",
    // TODO_REAL_CONTENT: confirm year + whether a public repo exists.
    fields: ["AI / ML", "Data / Optimization"],
    stack: ["Python", "Machine Learning"],
    summary: t(
      "Machine-learning model predicting CO2 emissions for four-wheeled vehicles.",
      "四輪車のCO2排出量を予測する機械学習モデル。",
    ),
    featured: false,
    projectOrder: 7,
    hasCaseStudy: false,
    confidentiality: "public",
    links: [],
    initials: "C2",
    tone: "accent",
  },
  {
    id: "suicide-risk",
    slug: "suicide-risk",
    title: "Suicide Risk Detection from Text",
    // TODO_REAL_CONTENT: confirm year + whether a public repo exists.
    fields: ["AI / ML"],
    stack: ["Python", "NLP"],
    summary: t(
      "NLP model detecting suicide-risk signals from text.",
      "テキストから自殺リスクの兆候を検出するNLPモデル。",
    ),
    featured: false,
    projectOrder: 8,
    hasCaseStudy: false,
    confidentiality: "public",
    links: [],
    initials: "SR",
    tone: "amber",
  },
  {
    id: "face-to-comic",
    slug: "face-to-comic",
    title: "Face-to-Comic Image Generator",
    // TODO_REAL_CONTENT: confirm year.
    fields: ["AI / ML"],
    stack: ["Python", "Computer Vision"],
    summary: t(
      "Image generation pipeline that turns face photos into comic-style portraits.",
      "顔写真をコミック風のポートレートに変換する画像生成パイプライン。",
    ),
    featured: false,
    projectOrder: 9,
    hasCaseStudy: false,
    confidentiality: "public",
    links: [
      {
        type: "github",
        label: t("Source", "ソースコード"),
        url: "https://github.com/farisznafis/real-to-comic-photo",
      },
    ],
    initials: "FC",
    tone: "accent",
  },
  {
    id: "building-damage",
    slug: "building-damage",
    title: "Building Damage Grade Prediction",
    // TODO_REAL_CONTENT: confirm year + whether a public repo exists.
    fields: ["AI / ML", "Data / Optimization"],
    stack: ["Python", "Machine Learning"],
    summary: t(
      "Model predicting building damage grades from survey data.",
      "調査データから建物の損傷グレードを予測するモデル。",
    ),
    featured: false,
    projectOrder: 10,
    hasCaseStudy: false,
    confidentiality: "public",
    links: [],
    initials: "BD",
    tone: "amber",
  },
{
    id: "llm-pipeline",
    slug: "llm-pipeline",
    title: "LLM Customer Service Data Pipeline",
    role: t("Data Scientist Intern", "データサイエンティストインターン"),
    fields: ["AI / ML", "Data / Optimization"],
    stack: ["Data Pipeline", "LLM", "Web Scraping"],
    summary: t(
      "LLM-related data scraping and pipeline work, built with a Singapore-based teammate during a data science internship.",
      "データサイエンスインターン期間中、シンガポール拠点のチームメイトとともに進めたLLM関連データのスクレイピングとパイプライン構築。",
    ),
    featured: false,
    projectOrder: 11,
    hasCaseStudy: false,
    // GoTo internship work: no company code or internal names may be shown.
    confidentiality: "private",
    links: [],
    initials: "LP",
    tone: "accent",
  },
  {
    id: "optimization-web",
    slug: "optimization-web",
    title: "Optimization Models & Web Applications",
    role: t("Data Scientist Intern", "データサイエンティストインターン"),
    fields: ["Data / Optimization"],
    stack: ["Python", "Gurobi", "OR-Tools", "Gradio", "Docker", "Google Kubernetes Engine"],
    summary: t(
      "Four optimization models built with Gurobi and OR-Tools in a 5-member team, with deployment work using Docker and Google Kubernetes Engine. The live demo re-solves every model in the browser.",
      "5人のチームでGurobiとOR-Toolsを用いて構築した4つの最適化モデルと、Docker・Google Kubernetes Engineを使ったデプロイ関連の作業。ライブデモではブラウザ上で各モデルを再計算できます。",
    ),
    featured: false,
    projectOrder: 12,
    hasCaseStudy: true,
    // Telkom internship work: only the published repo and demo, no company-private material.
    confidentiality: "public",
    links: [
      {
        type: "demo",
        label: t("Live demo", "ライブデモ"),
        url: "https://huggingface.co/spaces/farisznafis/optimization-internship",
      },
      {
        type: "github",
        label: t("Source", "ソースコード"),
        url: "https://github.com/farisznafis/optimization-internship",
      },
    ],
    cover: {
      type: "image",
      src: "/projects/optimization-web/demo-task-assignment.png",
      alt: t(
        "Live demo: the task-assignment model solved, with results per objective and a box plot of skill scores",
        "ライブデモ：タスク割り当てモデルを解いた結果。目的ごとの結果表とスキルスコアの箱ひげ図",
      ),
    },
    gallery: [
      {
        type: "image",
        src: "/projects/optimization-web/demo-burrito-game.png",
        alt: t(
          "Burrito game tab: a map of Burritoville with three placed trucks and the buildings they serve",
          "ブリトーゲームタブ：3台のトラックの配置と、それぞれが担当する建物を示したマップ",
        ),
        caption: t(
          "Burrito game: three trucks serve all 14 buildings for a profit of 970.",
          "ブリトーゲーム：3台のトラックで14棟すべてをカバーし、利益は970。",
        ),
      },
      {
        type: "image",
        src: "/projects/optimization-web/demo-stock-selection.png",
        alt: t(
          "Stock selection tab: allocation bar chart and a risk-versus-return scatter plot",
          "銘柄選択タブ：配分の棒グラフとリスク対リターンの散布図",
        ),
        caption: t(
          "Stock selection: the best split of USD 10,000 within a 15% risk limit.",
          "銘柄選択：リスク上限15%の範囲で1万ドルを最適に配分。",
        ),
      },
      {
        type: "image",
        src: "/projects/optimization-web/demo-course-selection.png",
        alt: t(
          "Course selection tab: two tables listing the chosen courses with credits and cost",
          "科目選択タブ：選ばれた科目と単位・費用を示す2つの表",
        ),
        caption: t(
          "Course selection: the cheapest set of courses that still completes the degree.",
          "科目選択：学位要件を満たしつつ最も安く済む科目の組み合わせ。",
        ),
      },
      {
        type: "image",
        src: "/projects/optimization-web/score-comparison.png",
        alt: t(
          "Chart comparing goal programming with the three single-objective task-assignment models",
          "目標計画法と3つの単一目的タスク割り当てモデルを比較したグラフ",
        ),
        caption: t(
          "Full dataset: goal programming compared with each goal optimised on its own.",
          "フルデータセット：目標計画法と、各目標を単独で最適化した場合の比較。",
        ),
      },
    ],
    initials: "OW",
    tone: "amber",
    caseStudy: {
      overview: t(
        "Every organisation makes the same kind of decision again and again: who does which job, where to put limited resources, how to spend a fixed budget. Optimization turns such a decision into a precise set of rules and goals, and a solver then searches every possible combination for the best one. During our internship we built four of these models, from a burrito-truck game to a tool that assigns sprint tasks to 109 people, and put them in a web app where anyone can change the inputs and watch the answer change.",
        "どの組織も同じ種類の判断を繰り返しています。誰がどの仕事をするか、限られた資源をどこに置くか、決まった予算をどう使うか。最適化は、こうした判断を厳密なルールと目標に置き換え、ソルバーがあらゆる組み合わせの中から最良のものを探します。インターンでは、ブリトー屋台のゲームから109人にスプリントのタスクを割り当てるツールまで、4つのモデルを構築し、誰でも入力を変えて答えの変化を確かめられるWebアプリにまとめました。",
      ),
      atAGlance: t("Project at a glance", "プロジェクト概要"),
      challenge: {
        heading: t("Too many combinations to try by hand", "手作業では試しきれない組み合わせ"),
        lead: t(
          "Assigning 300 tasks to 109 people already has more possible plans than anyone could ever check, and every plan has to respect skills, workload limits and project boundaries at the same time.",
          "300件のタスクを109人に割り当てるだけでも、人が確認できる数をはるかに超える割り当て案があります。しかも各案は、スキル、作業量の上限、プロジェクトの境界を同時に守らなければなりません。",
        ),
        body: t(
          "The goals also pull against each other: keeping everyone busy, matching skills well and spreading work evenly cannot all be maximised at once. The work was to state each problem exactly, decide how to trade the goals off, and make the results easy to run and inspect.",
          "さらに目標同士がぶつかります。全員に仕事を持たせること、スキルをよく合わせること、作業を均等に配ることを同時に最大化することはできません。各問題を厳密に定式化し、目標間のバランスを決め、結果を簡単に実行・確認できる形にすることが課題でした。",
        ),
      },
      approach: {
        kicker: t("Approach", "アプローチ"),
        heading: t("From a business question to a solved model", "業務上の問いから解かれたモデルへ"),
        steps: [
          {
            tag: t("Formulate", "定式化"),
            title: t("Write the decision as variables, rules and goals", "判断を変数・ルール・目標として書く"),
            description: t(
              "Each yes/no choice becomes a binary variable, each business rule a constraint, and each goal an objective function.",
              "それぞれのyes/noの選択を0-1変数に、業務ルールを制約に、目標を目的関数に置き換えます。",
            ),
          },
          {
            tag: t("Score", "スコア"),
            title: t("Measure how well a person fits a task", "人とタスクの適合度を測る"),
            description: t(
              "For task assignment, a skill-matching score compares each talent's competency levels with what each task requires.",
              "タスク割り当てでは、各人材の能力レベルと各タスクの要求レベルを比べるスキル適合スコアを計算します。",
            ),
          },
          {
            tag: t("Solve", "求解"),
            title: t("Let Gurobi and OR-Tools search", "GurobiとOR-Toolsで探索する"),
            description: t(
              "Mixed-integer solvers find the provably best plan, or the best one found within a time limit for the largest dataset.",
              "混合整数ソルバーが最適であることが保証された解を見つけます。最大のデータセットでは制限時間内の最良解を使います。",
            ),
          },
          {
            tag: t("Ship", "公開"),
            title: t("One CLI, one container, one web demo", "1つのCLI、1つのコンテナ、1つのWebデモ"),
            description: t(
              "All four models run from the same `optim` command, in Docker, and from a Gradio demo that re-solves them live.",
              "4つのモデルはすべて同じ`optim`コマンド、Docker、そしてライブで再計算するGradioデモから実行できます。",
            ),
          },
        ],
      },
      features: {
        heading: t("What shipped", "実装したもの"),
        items: [
          {
            title: t("Scrum task-assignment model", "スクラム向けタスク割り当てモデル"),
            description: t(
              "Assigns 300 tasks across 5 projects to 109 talents, balancing three goals with goal programming.",
              "5つのプロジェクトにまたがる300件のタスクを109人に割り当て、目標計画法で3つの目標のバランスを取ります。",
            ),
          },
          {
            title: t("Three warm-up challenges", "3つのウォームアップ課題"),
            description: t(
              "Course selection, stock portfolio selection and Gurobi's Burrito Optimization Game.",
              "科目選択、株式ポートフォリオ選択、そしてGurobiのBurrito Optimization Game。",
            ),
          },
          {
            title: t("Interactive web demo", "インタラクティブなWebデモ"),
            description: t(
              "A Gradio app on Hugging Face Spaces with one tab per model; every Solve runs the real model.",
              "Hugging Face Spaces上のGradioアプリ。モデルごとにタブがあり、「Solve」を押すたびに実際のモデルが動きます。",
            ),
          },
          {
            title: t("Reproducible packaging", "再現可能なパッケージング"),
            description: t(
              "An installable Python package and CLI, a Docker image, tests and CI that redeploys the demo on every push.",
              "インストール可能なPythonパッケージとCLI、Dockerイメージ、テスト、そしてpushごとにデモを再デプロイするCI。",
            ),
          },
        ],
      },
      sections: [
        {
          id: "plain-words",
          kicker: t("In plain words", "かんたんに言うと"),
          heading: t("What is an optimization model?", "最適化モデルとは？"),
          paragraphs: [
            t(
              "Think of planning a road trip with a fixed budget: you want to see as many places as possible, but you cannot drive more than eight hours a day and the money has to last. You naturally juggle a goal (see more) against rules (time, money). An optimization model writes exactly that down in maths, so a computer can do the juggling for thousands of choices at once.",
              "決まった予算で旅行を計画する場面を想像してください。できるだけ多くの場所を見たいけれど、1日に運転できるのは8時間まで、お金も足りなければなりません。私たちは自然と、目標（たくさん見る）とルール（時間とお金）を天秤にかけています。最適化モデルはそれを数式で書き表し、何千もの選択の調整をコンピューターに任せます。",
            ),
            t(
              "A solver then does not guess or learn from examples, as machine learning does. It searches the space of valid plans systematically and can prove that the plan it returns is the best possible one under the rules given.",
              "ソルバーは機械学習のように例から学んだり推測したりするのではありません。有効な計画の空間を体系的に探索し、与えられたルールのもとで返した計画が最良であることを証明できます。",
            ),
          ],
          items: [
            {
              title: t("Who does which task?", "誰がどのタスクを担当する？"),
              description: t(
                "Like a team lead planning a sprint: give work to people whose skills fit, keep nobody idle, and keep nobody overloaded.",
                "スプリントを計画するチームリーダーのように、スキルの合う人に仕事を渡し、手持ち無沙汰な人も、抱えすぎる人も出さないようにします。",
              ),
            },
            {
              title: t("Where do the food trucks park?", "屋台をどこに停める？"),
              description: t(
                "Each truck costs money, but customers only walk so far. Pick the spots that earn the most after costs.",
                "トラックを出すたびにお金がかかり、お客さんは遠くまでは歩きません。費用を差し引いて最も稼げる場所を選びます。",
              ),
            },
            {
              title: t("How do I split my savings?", "貯金をどう分ける？"),
              description: t(
                "Spread USD 10,000 over seven stocks for the highest expected return without taking on too much risk.",
                "1万ドルを7銘柄に分け、リスクを取りすぎずに期待リターンを最大にします。",
              ),
            },
            {
              title: t("Which courses should I take?", "どの科目を取る？"),
              description: t(
                "Finish a degree's 180 credits at the lowest possible cost, with enough computer-science credits.",
                "情報科学の単位を十分に含めつつ、180単位の学位を最も安く修了します。",
              ),
            },
          ],
          note: t(
            "You can try every one of these in the live demo: change a number, press Solve, and the model recalculates on the spot.",
            "ライブデモですべて試せます。数値を変えて「Solve」を押すと、その場でモデルが再計算されます。",
          ),
        },
        {
          id: "task-assignment",
          kicker: t("Main project", "メインプロジェクト"),
          heading: t("Assigning Scrum tasks with goal programming", "目標計画法によるスクラムタスクの割り当て"),
          paragraphs: [
            t(
              "The main project assigns sprint tasks from several client projects to a pool of data talents. First, every talent gets a skill-matching score for every task. The default method, Competency Assessment, weights each competency by how much the task needs it and averages the gap between the talent's level and the required level into a Mean Skill Gap. A Weighted Euclidean Distance score is available as an alternative.",
              "メインプロジェクトでは、複数のクライアントプロジェクトのスプリントタスクをデータ人材のプールに割り当てます。まず、すべての人材とタスクの組み合わせにスキル適合スコアを付けます。標準のCompetency Assessmentは、タスクがどれだけその能力を必要とするかで各能力を重み付けし、人材のレベルと要求レベルの差を平均してMean Skill Gapを求めます。代替として重み付きユークリッド距離も選べます。",
            ),
            t(
              "The model then assigns each task to exactly one person, keeps each person on at most one project and within a story-point limit, and pursues three goals: fewest idle talents, highest total skill score, and the lowest maximum workload. Each goal is solved on its own first; goal programming then finds one assignment that stays as close as possible to all three best values, weighted by priority.",
              "次にモデルは、各タスクをちょうど1人に割り当て、各人を最大1つのプロジェクトとストーリーポイント上限内に収めながら、3つの目標を追います。待機人材の最小化、スキルスコア合計の最大化、最大作業量の最小化です。まず各目標を単独で解き、その後、目標計画法で3つの最良値すべてにできるだけ近い割り当てを優先度の重み付きで求めます。",
            ),
          ],
          facts: [
            {
              label: t("Full dataset", "フルデータセット"),
              value: t("109 talents × 300 tasks, 5 projects", "109人 × 300タスク、5プロジェクト"),
            },
            {
              label: t("Model type", "モデルの種類"),
              value: t("Mixed-integer program (MIP)", "混合整数計画（MIP）"),
            },
            {
              label: t("Solver", "ソルバー"),
              value: t("Gurobi", "Gurobi"),
            },
            {
              label: t("Objectives", "目的"),
              value: t("Idle talents · skill score · max workload", "待機人材・スキルスコア・最大作業量"),
            },
            {
              label: t("Default weights", "標準の重み"),
              value: t("0.03 · 0.90 · 0.07", "0.03 · 0.90 · 0.07"),
            },
            {
              label: t("Workload limit", "作業量の上限"),
              value: t("10 story points per talent (configurable)", "1人あたり10ストーリーポイント（変更可）"),
            },
          ],
        },
        {
          id: "challenges",
          kicker: t("Warm-up challenges", "ウォームアップ課題"),
          heading: t("Three smaller models, three techniques", "3つの小さなモデル、3つの手法"),
          items: [
            {
              title: t("Course selection · binary IP", "科目選択・0-1整数計画"),
              description: t(
                "Choose courses for exactly 180 credits with at least 120 from computer science, at minimum cost. A weighted multi-objective variant also penalises exam courses. Both reach a cost of 12,356. Solved with OR-Tools CP-SAT.",
                "情報科学から120単位以上を含め、ちょうど180単位を最小費用で選びます。試験科目にペナルティを課す重み付き多目的版もあり、どちらも費用12,356に到達します。OR-Tools CP-SATで求解。",
              ),
            },
            {
              title: t("Stock selection · MIQCP", "銘柄選択・MIQCP"),
              description: t(
                "Maximise the annualised return of a seven-stock portfolio with at least three stocks, a minimum share per selected stock and a quadratic risk cap of 15%. Solved with Gurobi.",
                "3銘柄以上、選んだ銘柄ごとの最低比率、二次形式のリスク上限15%のもとで、7銘柄ポートフォリオの年率リターンを最大化します。Gurobiで求解。",
              ),
            },
            {
              title: t("Burrito game · facility location", "ブリトーゲーム・施設配置"),
              description: t(
                "Gurobi's Burrito Optimization Game: decide where to park trucks so that revenue from nearby buildings outweighs the daily truck cost. Solved with OR-Tools CP-SAT.",
                "GurobiのBurrito Optimization Game。近くの建物からの売上がトラックの日額費用を上回るよう、トラックの配置を決めます。OR-Tools CP-SATで求解。",
              ),
            },
          ],
        },
        {
          id: "engineering",
          kicker: t("Engineering", "エンジニアリング"),
          heading: t("From notebooks to a runnable product", "ノートブックから動くプロダクトへ"),
          paragraphs: [
            t(
              "The models started as Colab notebooks. They were refactored into one installable Python package with an `optim` command-line tool, so every model runs the same way locally, in Docker, or on any container job runner. A YAML config holds the workload limit, solver parameters, time limit and goal-programming weights.",
              "モデルはColabノートブックから始まりました。それらを`optim`コマンドを持つ1つのインストール可能なPythonパッケージに再構成し、ローカル、Docker、任意のコンテナジョブ実行環境で同じように動くようにしました。作業量の上限、ソルバーのパラメーター、制限時間、目標計画法の重みはYAML設定にまとめています。",
            ),
            t(
              "The Gradio demo calls the same package, so its results are solved live rather than cached. CI runs the tests on the mini dataset and redeploys the demo to Hugging Face Spaces on every push to main.",
              "GradioデモはCLIと同じパッケージを呼び出すため、結果はキャッシュではなくその場で解かれます。CIはミニデータセットでテストを実行し、mainへのpushごとにHugging Face Spacesへデモを再デプロイします。",
            ),
          ],
          note: t(
            "The public demo runs on Gurobi's free size-limited license, so task assignment is capped at 2,000 variables (the 5 × 10 mini dataset or small uploads) and 30 seconds per solve. The full 109 × 300 dataset needs a full license.",
            "公開デモはGurobiの無料のサイズ制限付きライセンスで動いているため、タスク割り当ては2,000変数（5 × 10のミニデータセットや小さなアップロード）と1回30秒までに制限されています。109 × 300のフルデータセットにはフルライセンスが必要です。",
          ),
        },
      ],
      galleryLabel: t("Live demo", "ライブデモ"),
      outcomes: {
        kicker: t("Outcomes", "成果"),
        heading: t("What changed", "変わったこと"),
        items: [
          t(
            "Four optimization problems modelled and solved to optimality on their sample data.",
            "4つの最適化問題をモデル化し、サンプルデータで最適解まで求解。",
          ),
          t(
            "Task assignment balances idle time, skill fit and workload in a single plan instead of three competing ones.",
            "タスク割り当てでは、待機・スキル適合・作業量を、競合する3つの案ではなく1つの計画でバランス。",
          ),
          t(
            "Anyone can run the models without installing anything, through the public web demo.",
            "公開Webデモにより、誰でも何もインストールせずにモデルを実行可能。",
          ),
        ],
      },
      nextLabel: t("Next project", "次のプロジェクト"),
    },
  },
  {
    id: "himakom-visual",
    slug: "himakom-visual",
    title: "HIMAKOM Social Media & Visual Identity",
    // TODO_REAL_CONTENT: verified audience number (only if already published).
    fields: ["Visual Design"],
    stack: ["Visual Design", "Social Media"],
    summary: t(
      "Social media and visual identity work for HIMAKOM, leading and coordinating a 6-member team.",
      "HIMAKOMのソーシャルメディアとビジュアルアイデンティティの仕事。6人のチームメンバーをまとめました。",
    ),
    featured: false,
    projectOrder: 13,
    hasCaseStudy: false,
    confidentiality: "public",
    links: [],
    initials: "HV",
    tone: "accent",
  },
  {
    id: "portfolio-v3",
    slug: "portfolio-v3",
    title: "Portfolio v3",
    year: "2026",
    role: t("Design & Development", "デザイン & 開発"),
    fields: ["Frontend"],
    stack: ["Next.js", "TypeScript", "GSAP", "Framer Motion", "Three.js", "React Three Fiber"],
    summary: t(
      "This site — an editorial, motion-heavy portfolio built with Next.js, GSAP, Framer Motion, and Three.js.",
      "このサイト。Next.js・GSAP・Framer Motion・Three.jsで構築した、エディトリアルでモーション中心のポートフォリオ。",
    ),
    featured: false,
    projectOrder: 14,
    hasCaseStudy: false,
    confidentiality: "public",
    links: [
      {
        type: "github",
        label: t("Source", "ソースコード"),
        url: "https://github.com/farisznafis/portfolio",
      },
    ],
    initials: "V3",
    tone: "amber",
    // TODO_REAL_IMAGE: a real screenshot of this site works here
  },
];
