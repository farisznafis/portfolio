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
      "Tailwind CSS",
      "REST API",
      "React Router",
      "TanStack Query",
      "React Hook Form",
      "Zod",
      "Zustand",
      "Recharts",
    ],
    summary: t(
      "B2B SaaS for managing J-Credit carbon projects, built in a 5-member team: role-based workflows for Admin, Master, and User, a 4-step onboarding flow, monitoring data and emissions dashboards.",
      "5人のチームで開発した、J-クレジットのカーボンプロジェクトを管理するB2B向けSaaS。Admin・Master・Userのロール別ワークフロー、4ステップのオンボーディング、モニタリングデータと排出量のダッシュボードを担当しました。",
    ),
    featured: true,
    featuredOrder: 1,
    projectOrder: 1,
    hasCaseStudy: true,
    // Professional/company work: the public demo runs on mock data only, no real company data.
    confidentiality: "limited",
    links: [
      {
        type: "demo",
        label: t("Live demo", "ライブデモ"),
        url: "https://carbon.farisznafis.my.id",
      },
    ],
    cover: {
      type: "image",
      src: "/projects/carbon-monitoring/admin-dashboard.png",
      alt: t(
        "Admin home: alert for a pending cancel request, counts for projects, companies, applications and requests, a project list with reduction bars, and notifications",
        "管理者ホーム：未処理の取消依頼のアラート、プロジェクト・企業・申請・依頼の件数、削減量バー付きのプロジェクト一覧、お知らせ",
      ),
    },
    gallery: [
      {
        type: "image",
        src: "/projects/carbon-monitoring/admin-project.png",
        alt: t(
          "Admin project detail: emissions trend chart against the baseline, project summary, and project documents",
          "管理者のプロジェクト詳細：ベースラインと比較した排出量の推移グラフ、プロジェクト概要、書類",
        ),
        caption: t(
          "Admin project detail: emissions against the baseline, membership status and documents in one view.",
          "管理者のプロジェクト詳細：ベースラインとの排出量比較、入会届の状況、書類を一画面に。",
        ),
      },
      {
        type: "image",
        src: "/projects/carbon-monitoring/landing.png",
        alt: t(
          "Landing page: headline about turning carbon data into decisions, with an animated hero",
          "ランディングページ：カーボンデータを意思決定に変えるという見出しとアニメーションのヒーロー",
        ),
        caption: t("Public landing page.", "公開ランディングページ。"),
      },
      {
        type: "image",
        src: "/projects/carbon-monitoring/signup.png",
        alt: t(
          "Signup step 1 of 4: company information form with a progress indicator",
          "サインアップ4ステップ中の1：進捗表示付きの法人情報フォーム",
        ),
        caption: t(
          "4-step signup: company, methodology and equipment, confirmation, completion.",
          "4ステップのサインアップ：法人情報、方法論・設備、確認、完了。",
        ),
      },
      {
        type: "image",
        src: "/projects/carbon-monitoring/site-dashboard.png",
        alt: t(
          "Site dashboard: projects the site has joined, with emission-reduction progress against the target",
          "拠点ダッシュボード：拠点が入会しているプロジェクトと、目標に対する排出削減の進捗",
        ),
        caption: t(
          "Site dashboard: reduction progress for each joined project.",
          "拠点ダッシュボード：入会中のプロジェクトごとの削減進捗。",
        ),
      },
      {
        type: "image",
        src: "/projects/carbon-monitoring/site-project.png",
        alt: t(
          "Site project detail: latest monitoring values for operating hours, generation, self-consumption and accuracy",
          "拠点のプロジェクト詳細：稼働時間・発電量・自家消費量・測定精度の最新モニタリング値",
        ),
        caption: t(
          "Project detail for a site: latest monitoring data and emissions analysis.",
          "拠点のプロジェクト詳細：最新のモニタリングデータと排出量分析。",
        ),
      },
    ],
    initials: "CM",
    tone: "accent",
    caseStudy: {
      overview: t(
        "A B2B SaaS that helps companies run J-Credit carbon projects: register sites and equipment, join projects, submit monitoring data, and track emission reductions. Built in a 5-member team; I worked across UI/UX and frontend engineering, covering the role-based workflows for Admin, Master, and User, the 4-step onboarding flow, and the REST API integrations that power them.",
        "企業がJ-クレジットのカーボンプロジェクトを運用するためのB2B向けSaaS。拠点と設備の登録、プロジェクトへの入会、モニタリングデータの提出、排出削減量の確認ができます。5人のチームで開発し、Admin・Master・Userのロール別ワークフロー、4ステップのオンボーディング、それらを支えるREST API連携を、UI/UXとフロントエンドの両面で担当しました。",
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
      sections: [
        {
          id: "roles",
          kicker: t("Roles", "ロール"),
          heading: t("Who does what", "誰が何をするか"),
          items: [
            {
              title: t("Admin (operator)", "Admin（運営者）"),
              description: t(
                "Registers projects and methodologies, reviews company applications and project memberships, approves or rejects monitoring data, and manages operators and their permissions.",
                "プロジェクトと方法論の登録、企業申請と入会届の審査、モニタリングデータの承認・却下、運営者と権限の管理。",
              ),
            },
            {
              title: t("Master (company owner)", "Master（企業の管理者）"),
              description: t(
                "Manages the company's sites and employees, and applies to join projects for each site.",
                "自社の拠点と社員を管理し、拠点ごとにプロジェクトへの入会を申請します。",
              ),
            },
            {
              title: t("User (site staff)", "User（拠点の担当者）"),
              description: t(
                "Sees the site dashboard and submits monitoring data for the site's equipment.",
                "拠点ダッシュボードを確認し、拠点の設備のモニタリングデータを提出します。",
              ),
            },
          ],
        },
        {
          id: "demo",
          kicker: t("Live demo", "ライブデモ"),
          heading: t("Try it with mock data", "モックデータで試せます"),
          paragraphs: [
            t(
              "The public demo runs the real frontend against a mock API in the browser, so no company data is involved. Log in at /login as master01 or tokyo01, or at /admin/login as admin. Any company ID and password work.",
              "公開デモは本物のフロントエンドを、ブラウザ内のモックAPIで動かしているため、実際の企業データは含まれません。/loginでmaster01またはtokyo01、/admin/loginでadminとしてログインできます。企業IDとパスワードは何でも構いません。",
            ),
          ],
          note: t(
            "Changes made in the demo are kept in memory and reset when the page reloads.",
            "デモでの変更はメモリ上にだけ保持され、ページを再読み込みするとリセットされます。",
          ),
        },
      ],
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
    stack: ["Python", "TensorFlow / Keras", "LSTM", "Librosa", "Pydub", "Streamlit", "Pytest", "GitHub Actions"],
    summary: t(
      "Upload a short speech recording and a stacked LSTM classifies it into one of six emotions. ZCR, RMS and MFCC features from Librosa, served as a Streamlit app.",
      "短い音声をアップロードすると、スタックLSTMが6つの感情のいずれかに分類します。LibrosaでZCR・RMS・MFCCを抽出し、Streamlitアプリとして公開しています。",
    ),
    featured: true,
    featuredOrder: 4,
    projectOrder: 4,
    hasCaseStudy: true,
    confidentiality: "public",
    links: [
      {
        type: "demo",
        label: t("Live demo", "ライブデモ"),
        url: "https://emotion.farisznafis.my.id",
      },
      {
        type: "github",
        label: t("Source", "ソースコード"),
        url: "https://github.com/farisznafis/emotion-sentiment",
      },
    ],
    cover: {
      type: "image",
      src: "/projects/speech-emotion/result.webp",
      alt: t(
        "The Voice Emotion Recognition app after analysing an uploaded recording: detected emotion Happy at 57.2% confidence",
        "アップロードした録音を分析した後のVoice Emotion Recognitionアプリ。検出された感情はHappy、信頼度57.2%",
      ),
      caption: t(
        "Upload, play back, analyse: the detected emotion and the model's confidence.",
        "アップロード、再生、分析。検出された感情とモデルの信頼度。",
      ),
    },
    gallery: [
      {
        type: "image",
        src: "/projects/speech-emotion/upload.webp",
        alt: t(
          "Start screen with an upload box for WAV, MP3, M4A, FLAC, OGG, AAC and AMR files",
          "WAV・MP3・M4A・FLAC・OGG・AAC・AMRに対応したアップロード欄のある開始画面",
        ),
        caption: t("Start screen: seven audio formats, up to 15 MB.", "開始画面。7種類の音声形式、最大15 MB。"),
      },
      {
        type: "image",
        src: "/projects/speech-emotion/scores.webp",
        alt: t(
          "Bar chart and table of confidence for all six emotions: Happy 57%, Angry 38%, the rest under 4%",
          "6つの感情すべての信頼度を示す棒グラフと表。Happy 57%、Angry 38%、その他は4%未満",
        ),
        caption: t(
          "Confidence for every emotion, as a chart and a detailed table.",
          "すべての感情の信頼度をグラフと詳細な表で表示。",
        ),
      },
      {
        type: "image",
        src: "/projects/speech-emotion/mobile-result.webp",
        alt: t(
          "The result on a phone: detected emotion, confidence bar and per-emotion chart",
          "スマートフォンでの結果表示。検出された感情、信頼度バー、感情ごとのグラフ",
        ),
        caption: t("The result screen on mobile.", "モバイルでの結果画面。"),
      },
      {
        type: "image",
        src: "/projects/speech-emotion/mobile-scores.webp",
        alt: t(
          "Detailed score table expanded on a phone, listing all six emotions by confidence",
          "スマートフォンで展開した詳細スコア表。6つの感情を信頼度順に表示",
        ),
        caption: t("Detailed scores on mobile.", "モバイルでの詳細スコア。"),
      },
    ],
    initials: "SE",
    tone: "amber",
    caseStudy: {
      overview: t(
        "Upload a speech recording and the app trims silence, extracts 15 acoustic features per frame, and runs a small stacked LSTM that picks one of six emotions: neutral, happy, sad, angry, fear or disgust. It started as a notebook experiment and was later rebuilt into a tested, deployable app.",
        "音声をアップロードすると、アプリが無音を除去し、フレームごとに15個の音響特徴を抽出して、小さなスタックLSTMが6つの感情（neutral・happy・sad・angry・fear・disgust）から一つを選びます。ノートブックでの実験から始まり、のちにテスト付きのデプロイ可能なアプリへ作り直しました。",
      ),
      atAGlance: t("Project at a glance", "プロジェクト概要"),
      challenge: {
        heading: t("Reading feeling from a waveform", "波形から感情を読む"),
        lead: t(
          "Emotion is in how something is said, not what. The model only sees signal features, and six classes that even people mix up.",
          "感情は「何を」ではなく「どう」話すかに表れます。モデルが見るのは信号の特徴だけで、6つのクラスは人間でも取り違えます。",
        ),
        body: t(
          "The original work lived in notebooks. Turning it into an app meant keeping the exact preprocessing the trained model expects, while separating inference from the notebook so it could be tested and deployed on its own.",
          "元の成果物はノートブックの中にありました。アプリにするには、学習済みモデルが前提とする前処理をそのまま保ちつつ、推論をノートブックから切り離して単独でテスト・デプロイできるようにする必要がありました。",
        ),
      },
      approach: {
        kicker: t("Approach", "アプローチ"),
        heading: t("From audio file to emotion", "音声ファイルから感情へ"),
        steps: [
          {
            tag: t("Audio", "音声"),
            title: t("Trim and fix the length", "トリミングと長さの固定"),
            description: t(
              "Decode the upload, trim silence at both ends, then pad or cut to exactly 180,000 samples.",
              "アップロードをデコードし、前後の無音を除去してから、ちょうど180,000サンプルにパディングまたは切り詰めます。",
            ),
          },
          {
            tag: t("Features", "特徴量"),
            title: t("15 values per frame", "フレームごとに15個の値"),
            description: t(
              "Zero-crossing rate, RMS energy and 13 MFCCs for each of 352 frames: a 352 × 15 input.",
              "352フレームそれぞれについて、ゼロ交差率・RMSエネルギー・13個のMFCC。入力は352 × 15。",
            ),
          },
          {
            tag: t("Model", "モデル"),
            title: t("Two LSTM layers, 53,894 parameters", "2層のLSTM、パラメーター数53,894"),
            description: t(
              "LSTM(64) → LSTM(64) → softmax over six emotions. Trained on RAVDESS, CREMA-D, TESS and SAVEE.",
              "LSTM(64) → LSTM(64) → 6感情のsoftmax。RAVDESS・CREMA-D・TESS・SAVEEで学習。",
            ),
          },
          {
            tag: t("App", "アプリ"),
            title: t("Streamlit, tested in CI", "Streamlit、CIでテスト"),
            description: t(
              "Inference lives in its own modules, separate from the notebook, and GitHub Actions lints, tests, loads the model and runs a test prediction on every push.",
              "推論はノートブックから独立したモジュールにあり、GitHub Actionsがプッシュごとにlint・テスト・モデル読み込み・テスト推論を実行します。",
            ),
          },
        ],
      },
      features: {
        heading: t("What shipped", "実装したもの"),
        items: [
          {
            title: t("Seven audio formats", "7種類の音声形式"),
            description: t(
              "WAV, MP3, M4A, FLAC, OGG, AAC and AMR, decoded with FFmpeg.",
              "WAV・MP3・M4A・FLAC・OGG・AAC・AMRに対応し、FFmpegでデコード。",
            ),
          },
          {
            title: t("Confidence for every emotion", "すべての感情の信頼度"),
            description: t(
              "The top emotion and its confidence, plus a chart and table for all six.",
              "最も可能性の高い感情とその信頼度に加え、6つすべてをグラフと表で表示。",
            ),
          },
          {
            title: t("Model contract checks", "モデルの入出力チェック"),
            description: t(
              "The app checks the model's input (352 × 15) and output (6 classes) and the label order before predicting.",
              "推論の前に、モデルの入力（352 × 15）と出力（6クラス）、ラベルの順序を確認します。",
            ),
          },
          {
            title: t("Tests and CI", "テストとCI"),
            description: t(
              "Pytest covers upload validation, preprocessing, feature shapes, labels and model loading; Ruff and GitHub Actions run on every push.",
              "Pytestでアップロード検証・前処理・特徴量の形・ラベル・モデル読み込みをテストし、プッシュごとにRuffとGitHub Actionsが走ります。",
            ),
          },
        ],
      },
      sections: [
        {
          id: "evaluation",
          kicker: t("Evaluation", "評価"),
          heading: t("What the numbers do and don't say", "数字が示すこと、示さないこと"),
          facts: [
            {
              label: t("Validation accuracy (notebook)", "検証精度（ノートブック）"),
              value: t("0.94 on 263 samples", "263サンプルで0.94"),
            },
            {
              label: t("Macro F1 (notebook)", "マクロF1（ノートブック）"),
              value: t("≈ 0.93", "≈ 0.93"),
            },
            {
              label: t("Model size", "モデルサイズ"),
              value: t("53,894 parameters", "パラメーター数53,894"),
            },
            {
              label: t("Training data", "学習データ"),
              value: t("4 acted-speech datasets", "演技音声のデータセット4種"),
            },
          ],
          paragraphs: [
            t(
              "When rebuilding the project I re-checked the old notebook and found problems: two class names in the old report were swapped, the early-stopping callback watched a metric that didn't exist, and the deployed model is a different checkpoint from the one the notebook evaluated.",
              "プロジェクトを作り直す際に古いノートブックを見直し、問題を見つけました。古いレポートでは2つのクラス名が入れ替わっており、早期終了のコールバックは存在しない指標を監視していて、デプロイされたモデルはノートブックが評価したものとは別のチェックポイントでした。",
            ),
          ],
          note: t(
            "So the 0.94 is a historical result, not a measured score for the live model.",
            "そのため0.94は過去の実験結果であり、公開中のモデルを測った値ではありません。",
          ),
        },
        {
          id: "limitations",
          kicker: t("Limitations", "制約"),
          heading: t("An experiment, not an emotion detector", "感情検出器ではなく、実験"),
          paragraphs: [
            t(
              "The training data is acted speech, and the experiment used only female speakers. Language, microphone and background noise all change the result, and the confidence scores are not calibrated probabilities. It should not be used for medical, hiring or other high-stakes decisions.",
              "学習データは演技による音声で、実験では女性話者のみを使いました。言語・マイク・背景ノイズで結果は変わり、信頼度スコアは校正された確率ではありません。医療・採用などの重要な判断には使うべきではありません。",
            ),
          ],
        },
      ],
      galleryLabel: t("Gallery", "ギャラリー"),
      outcomes: {
        kicker: t("Outcomes", "成果"),
        heading: t("What changed", "変わったこと"),
        items: [
          t(
            "A live web app that classifies speech into six emotions.",
            "音声を6つの感情に分類する、公開中のwebアプリ。",
          ),
          t(
            "Inference separated from the notebook, with tests and CI on every push.",
            "推論をノートブックから分離し、プッシュごとにテストとCIを実行。",
          ),
          t(
            "An honest write-up of what the old evaluation can and cannot claim.",
            "過去の評価で言えること・言えないことを正直にまとめました。",
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
    stack: ["Python", "scikit-learn", "Pandas", "TensorFlow / Keras", "Flask", "Pytest", "Docker"],
    summary: t(
      "Pick an Indonesian city and see next month's inflation forecast, then how rising prices change the cost of a savings goal and the time to reach it. A Bangkit capstone, later rebuilt with real data and honest evaluation.",
      "インドネシアの都市を選ぶと翌月のインフレ予測が表示され、物価上昇が貯蓄目標の金額と達成までの期間をどう変えるかが分かります。Bangkitのキャップストーンを、のちに実データと誠実な評価で作り直しました。",
    ),
    featured: true,
    featuredOrder: 5,
    projectOrder: 5,
    hasCaseStudy: true,
    confidentiality: "public",
    links: [
      {
        type: "demo",
        label: t("Live demo", "ライブデモ"),
        url: "https://financify.farisznafis.my.id",
      },
      {
        type: "github",
        label: t("Source", "ソースコード"),
        url: "https://github.com/farisznafis/bangkit-financify/tree/portfolio",
      },
    ],
    cover: {
      type: "image",
      src: "/projects/financify/cover.webp",
      alt: t(
        "Financify web app showing Yogyakarta's forecast for October 2026: 0.28% month-to-month, flat versus September, with a 24-month chart and a ±0.44 pp error band",
        "Financifyのwebアプリ。ジョグジャカルタの2026年10月の予測は前月比0.28%で9月から横ばい。24か月のグラフと±0.44ppの誤差帯を表示",
      ),
      caption: t(
        "Step 1: next month's inflation for a city, against the last 24 months.",
        "ステップ1：都市の翌月インフレを、直近24か月と並べて表示。",
      ),
    },
    gallery: [
      {
        type: "image",
        src: "/projects/financify/planner.webp",
        alt: t(
          "Savings planner with the Wedding goal selected: 150 million rupiah goal, 3 years 2 months to reach it, costing Rp166.2 million by then",
          "結婚の目標を選んだ貯蓄プランナー。目標1億5千万ルピア、達成まで3年2か月、その時点の費用は1億6,620万ルピア",
        ),
        caption: t(
          "Step 2: inflation adds Rp16.2 million and 4 months to a wedding goal.",
          "ステップ2：インフレで結婚資金の目標に1,620万ルピアと4か月が加わる。",
        ),
      },
      {
        type: "image",
        src: "/projects/financify/mobile-forecast.webp",
        alt: t(
          "The forecast card on a phone: city picker, 0.28% forecast, chart and the model's typical error",
          "スマートフォンでの予測カード。都市の選択、0.28%の予測、グラフとモデルの典型的な誤差",
        ),
        caption: t("The forecast on mobile.", "モバイルでの予測。"),
      },
      {
        type: "image",
        src: "/projects/financify/mobile-plan.webp",
        alt: t(
          "Planner result on a phone for a traveling goal: 4 months to goal, Rp30.3 million when reached",
          "スマートフォンでの旅行目標のプランナー結果。達成まで4か月、その時点で3,030万ルピア",
        ),
        caption: t("A planner estimate on mobile.", "モバイルでのプランナーの試算。"),
      },
      {
        type: "image",
        src: "/projects/financify/actual-vs-predicted.webp",
        alt: t(
          "Line chart of the test period 2025-01 to 2026-09: actual inflation averaged across cities, the model's prediction and the naive baseline",
          "テスト期間2025-01〜2026-09の折れ線グラフ。都市平均の実績インフレ、モデルの予測、ナイーブなベースライン",
        ),
        caption: t(
          "Test period, mean across cities: the model (orange) against actual inflation and last month's value.",
          "テスト期間の都市平均。モデル（オレンジ）と実績値、前月値との比較。",
        ),
      },
      {
        type: "image",
        src: "/projects/financify/app-design-2023.webp",
        alt: t(
          "Eight screens of the 2023 Financify Android app design: home with finance tips, goal categories, prediction form and result, Finbot chat, sign-up and login",
          "2023年のFinancify Androidアプリの8画面。金融ヒント付きのホーム、目標カテゴリ、予測フォームと結果、Finbotチャット、登録とログイン",
        ),
        caption: t(
          "The 2023 Android app design. The web app keeps its palette and goal categories.",
          "2023年のAndroidアプリのデザイン。webアプリは配色と目標カテゴリを引き継いでいます。",
        ),
      },
      {
        type: "image",
        src: "/projects/financify/app-2023-result.webp",
        alt: t(
          "The 2023 Android app's calculation screen for Yogyakarta: 0 years 10 months to the goal, inflation trend up",
          "2023年のAndroidアプリの計算画面（ジョグジャカルタ）。目標まで0年10か月、インフレ傾向は上昇",
        ),
        caption: t(
          "The capstone build in 2023: the Android app calling the LSTM API.",
          "2023年のキャップストーン版。AndroidアプリがLSTMのAPIを呼び出します。",
        ),
      },
      {
        type: "embed",
        src: "https://drive.google.com/file/d/1CxzKiUlE549Lr9h-4eeIpBBiR7OOzwYa/preview",
        aspect: "9 / 16",
        alt: t(
          "Screen recording of the 2023 Financify Android app",
          "2023年のFinancify Androidアプリの画面録画",
        ),
        caption: t(
          "Demo of the 2023 app: finance tips, goal categories and a calculation for Yogyakarta.",
          "2023年のアプリのデモ。金融ヒント、目標カテゴリ、ジョグジャカルタでの計算。",
        ),
      },
      {
        type: "image",
        src: "/projects/financify/finbot.webp",
        alt: t(
          "Finbot mascot in four expressions: joyful, happy, smile and angry",
          "Finbotマスコットの4つの表情：joyful、happy、smile、angry",
        ),
        caption: t(
          "Finbot, the assistant mascot designed for the 2023 app.",
          "2023年のアプリ用にデザインしたアシスタントのマスコット、Finbot。",
        ),
      },
      {
        type: "embed",
        src: "https://drive.google.com/file/d/1Ks1e0Dr_E3ukfYpkDO359aFTF2DATj6l/preview",
        alt: t(
          "Animated Financify title card with the logo and two Finbot mascots",
          "ロゴと2体のFinbotマスコットが動くFinancifyのタイトルカード",
        ),
        caption: t(
          "Animated background made for the capstone presentation.",
          "キャップストーン発表用に作ったアニメーション背景。",
        ),
      },
      {
        type: "embed",
        src: "https://drive.google.com/file/d/1DSNp1x98TO2uNuTh5cQs-uFK1wnHYiAu/preview",
        alt: t(
          "Financify go-to-market presentation, 18 slides",
          "Financifyのゴー・トゥ・マーケット資料（18スライド）",
        ),
        caption: t(
          "The go-to-market deck from the 2023 capstone.",
          "2023年のキャップストーンのゴー・トゥ・マーケット資料。",
        ),
      },
      {
        type: "image",
        src: "/projects/financify/team.webp",
        alt: t(
          "The Bangkit capstone team working together at a café, with one member joining by video call",
          "カフェで作業するBangkitキャップストーンチーム。一人はビデオ通話で参加",
        ),
        caption: t("Team CH2-PS231 during the 2023 capstone.", "2023年のキャップストーン中のチームCH2-PS231。"),
      },
    ],
    initials: "FI",
    tone: "accent",
    caseStudy: {
      overview: t(
        "Financify helps someone saving towards a goal see how rising prices in their city affect it. Step 1 forecasts next month's inflation for one of 82 Indonesian cities. Step 2 estimates what the goal will cost after inflation and how long it takes to save for it. It began as a 2023 Bangkit capstone (an LSTM behind a Flask API for an Android app) and was later rebuilt end to end.",
        "Financifyは、目標に向けて貯蓄する人が、自分の都市の物価上昇がそれにどう影響するかを知るためのアプリです。ステップ1でインドネシア82都市の翌月インフレを予測し、ステップ2でインフレ後の目標金額と貯蓄にかかる期間を試算します。2023年のBangkitキャップストーン（Androidアプリ向けのFlask APIの裏にLSTM）として始まり、のちに全体を作り直しました。",
      ),
      atAGlance: t("Project at a glance", "プロジェクト概要"),
      challenge: {
        heading: t("Forecasting an economy, city by city", "都市ごとに読む経済"),
        lead: t(
          "Inflation moves differently in every Indonesian city, and one month of it is noisy. The forecast had to beat simple guesses on data it had never seen, and say plainly how wrong it can be.",
          "インフレは都市ごとに異なる動きをし、1か月単位では変動が大きい。予測は未知のデータで単純な推測を上回り、どれだけ外れうるかを率直に示す必要がありました。",
        ),
        body: t(
          "The 2023 capstone used a hand-compiled dataset and was never compared against a baseline. Rebuilding it meant real data sources, a strict time-based split, and choosing every feature on validation only.",
          "2023年のキャップストーンは手作業でまとめたデータセットを使い、ベースラインとの比較もしていませんでした。作り直すにあたり、実際のデータソース、厳密な時系列分割、そして検証データだけでの特徴量選択が必要でした。",
        ),
      },
      approach: {
        kicker: t("Approach", "アプローチ"),
        heading: t("From price data to a savings plan", "価格データから貯蓄計画へ"),
        steps: [
          {
            tag: t("Data", "データ"),
            title: t("Official inflation plus market prices", "公式インフレと市場価格"),
            description: t(
              "Month-to-month inflation for 82 cities from BPS (2008 onward) and daily traditional-market prices for 10 foods from Bank Indonesia's PIHPS, with checks for duplicates, gaps and placeholder zeros.",
              "BPSの82都市の前月比インフレ（2008年以降）と、Bank IndonesiaのPIHPSによる10品目の伝統市場の日次価格。重複・欠損・プレースホルダーの0をチェックしています。",
            ),
          },
          {
            tag: t("Features", "特徴量"),
            title: t("Lags, calendar and a food nowcast", "ラグ、カレンダー、食品のナウキャスト"),
            description: t(
              "Twelve months of lags, seasonality, Ramadan and Eid flags, food price changes, and a nowcast from the first 5 trading days of the target month.",
              "12か月分のラグ、季節性、ラマダンとイードのフラグ、食品価格の変化、そして対象月の最初の5営業日からのナウキャスト。",
            ),
          },
          {
            tag: t("Model", "モデル"),
            title: t("Chosen on validation, scored on test once", "検証で選び、テストは一度だけ"),
            description: t(
              "Naive, seasonal naive, Ridge and gradient boosting compared over four rolling yearly folds (2021–2024). Feature groups are kept only if they lower validation error.",
              "ナイーブ、季節ナイーブ、Ridge、勾配ブースティングを4つの年次ローリング分割（2021〜2024年）で比較。検証誤差を下げる特徴量グループだけを残します。",
            ),
          },
          {
            tag: t("App", "アプリ"),
            title: t("A static page with every forecast inside", "全予測を内蔵した静的ページ"),
            description: t(
              "Every city's forecast is embedded in one bilingual page and the planner runs in the browser, so it needs no server. Flask serves the same page plus a JSON API.",
              "全都市の予測を一つのバイリンガルページに埋め込み、プランナーはブラウザで動くためサーバーは不要。Flaskは同じページとJSON APIも提供します。",
            ),
          },
        ],
      },
      features: {
        heading: t("What shipped", "実装したもの"),
        items: [
          {
            title: t("82-city forecast", "82都市の予測"),
            description: t(
              "Next month's inflation, up or down versus last month, a 24-month chart and the model's typical error.",
              "翌月のインフレ、前月比の上昇・下降、24か月のグラフ、モデルの典型的な誤差。",
            ),
          },
          {
            title: t("Savings planner", "貯蓄プランナー"),
            description: t(
              "Goal categories from the 2023 app; shows the goal's cost when reached and how many months inflation adds.",
              "2023年のアプリの目標カテゴリを使い、達成時の目標金額とインフレで何か月延びるかを表示。",
            ),
          },
          {
            title: t("Bilingual, no server", "バイリンガル、サーバー不要"),
            description: t(
              "Indonesian and English, one self-contained page; a link like ?city=yogyakarta opens straight to a city.",
              "インドネシア語と英語、単一の自己完結ページ。?city=yogyakartaのようなリンクで都市を直接開けます。",
            ),
          },
          {
            title: t("Tests", "テスト"),
            description: t(
              "Pytest covers data cleaning, leak-free features and splits, the API, and that the JavaScript and Python planners agree.",
              "Pytestでデータ清掃、リークのない特徴量と分割、API、そしてJavaScriptとPythonのプランナーが一致することをテスト。",
            ),
          },
        ],
      },
      sections: [
        {
          id: "evaluation",
          kicker: t("Evaluation", "評価"),
          heading: t("Test period 2025-01 to 2026-09", "テスト期間 2025-01〜2026-09"),
          facts: [
            {
              label: t("Model MAE", "モデルのMAE"),
              value: t("0.44 pp", "0.44 pp"),
            },
            {
              label: t("Naive MAE (last month)", "ナイーブのMAE（前月値）"),
              value: t("0.69 pp", "0.69 pp"),
            },
            {
              label: t("Error reduction", "誤差の削減"),
              value: t("37% vs naive", "ナイーブ比37%"),
            },
            {
              label: t("Test set", "テストセット"),
              value: t("82 cities, 1,722 city-months", "82都市、1,722都市月"),
            },
          ],
          paragraphs: [
            t(
              "The food-price nowcast gave the largest single gain. Errors are largest in policy-shock months, such as the early-2025 electricity discount (MAE 0.74 vs 0.99 for naive), and in small eastern cities.",
              "最も大きな改善は食品価格のナウキャストによるものでした。誤差が大きいのは、2025年初めの電気料金割引のような政策ショックの月（MAE 0.74、ナイーブは0.99）と、東部の小さな都市です。",
            ),
          ],
          note: t(
            "An earlier version of the pipeline was scored on the same test period, so it is not fully unseen by me, even though selection never looks at it.",
            "パイプラインの以前のバージョンを同じテスト期間で評価したため、選択には一切使っていないものの、私にとって完全に未見のデータではありません。",
          ),
        },
        {
          id: "limitations",
          kicker: t("Limitations", "制約"),
          heading: t("A direction, not a promise", "約束ではなく、方向性"),
          paragraphs: [
            t(
              "The model sees only each city's inflation history, the calendar and food prices: no fuel or electricity prices, exchange or policy rates. The planner assumes constant income, expenses and inflation and no investment return. It is a planning estimate, not financial advice.",
              "モデルが見るのは各都市のインフレ履歴、カレンダー、食品価格だけで、燃料・電気料金、為替、政策金利は含みません。プランナーは収入・支出・インフレが一定で投資収益がないと仮定しています。計画のための試算であり、金融アドバイスではありません。",
            ),
          ],
        },
      ],
      galleryLabel: t("Gallery", "ギャラリー"),
      outcomes: {
        kicker: t("Outcomes", "成果"),
        heading: t("What changed", "変わったこと"),
        items: [
          t(
            "A live, bilingual web app covering 82 Indonesian cities.",
            "インドネシア82都市をカバーする、公開中のバイリンガルwebアプリ。",
          ),
          t(
            "A forecast that beats the naive baseline by 37% on held-out months.",
            "未使用の月で、ナイーブなベースラインより誤差を37%削減した予測。",
          ),
          t(
            "Built first with the Bangkit team CH2-PS231 across machine learning, cloud and mobile.",
            "最初は機械学習・クラウド・モバイルにまたがるBangkitチームCH2-PS231で構築。",
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
    cover: {
      type: "image",
      src: "/projects/blastout/cover.webp",
      alt: t(
        "BLASTOUT 2023 tryout website for Balairung Klass, shown on a laptop, tablet and phone",
        "Balairung KlassのBLASTOUT 2023トライアウトサイト。ノートPC・タブレット・スマートフォンでの表示",
      ),
    },
    gallery: [
      {
        type: "image",
        src: "/projects/blastout/web-design.webp",
        alt: t(
          "BLASTOUT 2023 page sections: about, event lineup, timeline, testimonials, sponsors and media partners",
          "BLASTOUT 2023のページ構成：概要、イベント一覧、タイムライン、体験談、スポンサー、メディアパートナー",
        ),
      },
    ],
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
    year: "2023",
    fields: ["AI / ML"],
    stack: ["Python", "NLP", "NLTK", "scikit-learn", "LightGBM", "Streamlit"],
    summary: t(
      "A text classifier that flags suicide-risk posts with 95% accuracy, built for Data Royale 2023 where our team won 3rd place.",
      "自殺リスクのある投稿を95%の精度で検出するテキスト分類器。Data Royale 2023で作り、チームで3位に入賞しました。",
    ),
    featured: false,
    projectOrder: 8,
    hasCaseStudy: true,
    confidentiality: "public",
    links: [
      {
        type: "figma",
        label: t("Presentation", "プレゼンテーション"),
        url: "https://www.figma.com/proto/UF5TFZscGPrRDzguksTDQL/The-Untouchaballs?page-id=0%3A1&type=design&node-id=5-55&viewport=-154%2C941%2C0.18&t=Zwy7yYTMWd2uwcT1-8&scaling=contain&starting-point-node-id=5%3A55&hide-ui=1",
      },
      {
        type: "demo",
        label: t("Live demo", "ライブデモ"),
        url: "https://suicide-text-detection.streamlit.app/",
      },
      {
        type: "github",
        label: t("Source", "ソースコード"),
        url: "https://github.com/farisznafis/suicide-text-detection",
      },
      {
        type: "other",
        label: t("Winner certificate", "入賞証明書"),
        url: "https://drive.google.com/file/d/1sm8m6O9ZKIeEllFpNGEUyBO3EK_zod-0/view?usp=sharing",
      },
    ],
    cover: {
      type: "image",
      src: "/projects/suicide-risk/cover.webp",
      alt: t(
        "Data Royale competition logo: gold letters on a blue shield above clouds",
        "Data Royaleコンテストのロゴ：雲の上の青い盾に金色の文字",
      ),
    },
    gallery: [
      {
        type: "image",
        src: "/projects/suicide-risk/confusion-matrix-lgbm.webp",
        alt: t(
          "Confusion matrix of the LightGBM model on the test set",
          "テストセットにおけるLightGBMモデルの混同行列",
        ),
        caption: t(
          "LightGBM on 46,415 test posts: 95% accuracy.",
          "46,415件のテスト投稿でのLightGBM：精度95%。",
        ),
      },
    ],
    initials: "SR",
    tone: "amber",
    caseStudy: {
      overview: t(
        "Type a post and the app says whether it shows signs of suicide risk. It is a LightGBM model trained on 232,074 Reddit posts, made by our team The Untouchaballs for Data Royale 2023, where we won 3rd place in the senior division. It is a competition project, not a clinical tool.",
        "投稿を入力すると、自殺リスクの兆候があるかをアプリが判定します。232,074件のReddit投稿で学習したLightGBMモデルで、チームThe UntouchaballsとしてData Royale 2023に出場し、シニア部門で3位に入賞しました。コンテスト用のプロジェクトであり、臨床用のツールではありません。",
      ),
      atAGlance: t("Project at a glance", "プロジェクト概要"),
      challenge: {
        heading: t("Spotting risk in short, informal text", "短くくだけた文章からリスクを見つける"),
        lead: t(
          "Posts are short, messy and full of slang, and a missed risk post costs more than a false alarm.",
          "投稿は短く、表記が乱れ、スラングも多い。そしてリスクのある投稿の見逃しは、誤検知よりも重大です。",
        ),
        body: t(
          "We used the Kaggle Suicide and Depression Detection dataset: 232,074 posts, half labelled suicide and half non-suicide, with no missing or duplicate rows.",
          "KaggleのSuicide and Depression Detectionデータセットを使いました。232,074件の投稿で、半分がsuicide、半分がnon-suicideのラベル付き。欠損や重複はありません。",
        ),
      },
      approach: {
        kicker: t("Approach", "アプローチ"),
        heading: t("From raw posts to a web app", "生の投稿からwebアプリへ"),
        steps: [
          {
            tag: t("Clean", "前処理"),
            title: t("Text preprocessing with NLTK", "NLTKによるテキスト前処理"),
            description: t(
              "Lowercase, remove punctuation and stopwords, tokenize and lemmatize.",
              "小文字化、句読点とストップワードの除去、トークン化、見出し語化。",
            ),
          },
          {
            tag: t("Features", "特徴量"),
            title: t("Character-level TF-IDF", "文字単位のTF-IDF"),
            description: t(
              "1–3 character n-grams, 5,000 features, which copes well with typos and slang.",
              "1〜3文字のn-gramで5,000特徴量。誤字やスラングにも強い表現です。",
            ),
          },
          {
            tag: t("Train", "学習"),
            title: t("Three models compared", "3つのモデルを比較"),
            description: t(
              "Random Forest, LightGBM and Naive Bayes on an 80/20 stratified split.",
              "80/20の層化分割で、Random Forest・LightGBM・Naive Bayesを学習。",
            ),
          },
          {
            tag: t("Deploy", "デプロイ"),
            title: t("Streamlit demo", "Streamlitデモ"),
            description: t(
              "The best model, LightGBM, runs in a Streamlit app on Streamlit Community Cloud.",
              "最も良かったLightGBMを、Streamlit Community Cloud上のStreamlitアプリで動かしています。",
            ),
          },
        ],
      },
      features: {
        heading: t("What shipped", "実装したもの"),
        items: [
          {
            title: t("Live classifier", "ライブ分類器"),
            description: t(
              "Paste any English text and get suicide / non-suicide back.",
              "英語の文章を貼り付けると、suicide / non-suicideを返します。",
            ),
          },
          {
            title: t("Reproducible notebooks", "再現可能なノートブック"),
            description: t(
              "Preprocessing, training and EDA notebooks, run in order.",
              "前処理・学習・EDAのノートブックを順番に実行するだけ。",
            ),
          },
          {
            title: t("Competition report and deck", "レポートと発表資料"),
            description: t(
              "A written report and a Figma presentation for the final.",
              "決勝用のレポートとFigmaのプレゼンテーション。",
            ),
          },
        ],
      },
      sections: [
        {
          id: "evaluation",
          kicker: t("Evaluation", "評価"),
          heading: t("Model comparison", "モデルの比較"),
          paragraphs: [
            t("Scores on the 46,415-post test set.", "46,415件のテストセットでのスコア。"),
          ],
          facts: [
            { label: t("LightGBM", "LightGBM"), value: t("95% accuracy · 0.95 F1", "精度95% · F1 0.95") },
            { label: t("Random Forest", "Random Forest"), value: t("90% accuracy · 0.90 F1", "精度90% · F1 0.90") },
            { label: t("Naive Bayes", "Naive Bayes"), value: t("84% accuracy · 0.83 F1", "精度84% · F1 0.83") },
          ],
          note: t(
            "LightGBM was both the most accurate and small enough to deploy (3.8 MB, against 226 MB for Random Forest).",
            "LightGBMは最も精度が高く、デプロイできるほど軽量でした（Random Forestの226 MBに対して3.8 MB）。",
          ),
        },
        {
          id: "eda",
          kicker: t("EDA", "探索的分析"),
          heading: t("What risk posts sound like", "リスクのある投稿の特徴"),
          paragraphs: [
            t(
              "The most frequent bigrams in suicide-risk posts were “feel like”, “don't know”, “don't want”, “want die”, “I'm tired” and “I'm scared”.",
              "リスクのある投稿で最も多いバイグラムは「feel like」「don't know」「don't want」「want die」「I'm tired」「I'm scared」でした。",
            ),
          ],
        },
      ],
      galleryLabel: t("Gallery", "ギャラリー"),
      outcomes: {
        kicker: t("Outcomes", "成果"),
        heading: t("Result", "結果"),
        items: [
          t(
            "3rd place, Senior Division, Data Royale 2023 (Kotak Riset & DSAI OmahTI, Universitas Gadjah Mada).",
            "Data Royale 2023 シニア部門3位（Kotak Riset & DSAI OmahTI、ガジャマダ大学）。",
          ),
          t(
            "A 95%-accurate classifier anyone can try in the browser.",
            "誰でもブラウザで試せる、精度95%の分類器。",
          ),
        ],
      },
      nextLabel: t("Next project", "次のプロジェクト"),
    },
  },
  {
    id: "face-to-comic",
    slug: "face-to-comic",
    title: "Face-to-Comic Image Generator",
    // TODO_REAL_CONTENT: confirm year.
    fields: ["AI / ML"],
    stack: ["Python", "TensorFlow", "Keras", "CycleGAN", "Streamlit", "VPS"],
    summary: t(
      "A CycleGAN that turns a face photo into a comic-style portrait, or a comic face back into a photo, served as a Streamlit web app.",
      "顔写真をコミック風のポートレートに、またはコミックの顔を写真に変換するCycleGAN。Streamlitのwebアプリとして公開しています。",
    ),
    featured: false,
    projectOrder: 9,
    hasCaseStudy: true,
    confidentiality: "public",
    links: [
      {
        type: "demo",
        label: t("Live demo (VPS)", "ライブデモ（VPS）"),
        url: "https://comic.farisznafis.my.id",
      },
      {
        type: "demo",
        label: t("Live demo (Streamlit Cloud)", "ライブデモ（Streamlit Cloud）"),
        url: "https://real-to-comic-farisznafis.streamlit.app/",
      },
      {
        type: "github",
        label: t("Source", "ソースコード"),
        url: "https://github.com/farisznafis/real-to-comic-photo",
      },
    ],
    cover: {
      type: "image",
      src: "/projects/real-to-comic/cover.webp",
      alt: t(
        "Live demo: the task-assignment model solved, with results per objective and a box plot of skill scores",
        "ライブデモ：タスク割り当てモデルを解いた結果。目的ごとの結果表とスキルスコアの箱ひげ図",
      ),
    },
    initials: "FC",
    tone: "accent",
    caseStudy: {
      overview: t(
        "Upload a face photo, take one with your camera, or pick a dataset example, and the app redraws it as a comic portrait. It also works the other way, from comic to photo. Under the hood is a CycleGAN trained on 10,000 photos and 10,000 comic faces.",
        "顔写真をアップロードするか、カメラで撮るか、データセットの例を選ぶと、アプリがコミック風のポートレートに描き直します。コミックから写真への逆方向にも対応しています。中身は、10,000枚の写真と10,000枚のコミック顔で学習したCycleGANです。",
      ),
      atAGlance: t("Project at a glance", "プロジェクト概要"),
      challenge: {
        heading: t("Translating between two image styles", "2つの画風のあいだを変換する"),
        lead: t(
          "The model has to change the style of a face without losing who it is.",
          "顔が誰なのかを失わずに、画風だけを変える必要があります。",
        ),
        body: t(
          "CycleGAN learns this with two generators that translate in opposite directions. Converting a photo to a comic and back should return the original photo, which keeps the face recognisable.",
          "CycleGANは逆方向に変換する2つの生成器でこれを学習します。写真をコミックに変換して元に戻すと元の写真になるよう学習するため、顔の特徴が保たれます。",
        ),
      },
      approach: {
        kicker: t("Approach", "アプローチ"),
        heading: t("From notebook to web app", "ノートブックからwebアプリへ"),
        steps: [
          {
            tag: t("Data", "データ"),
            title: t("Face2Comics v2 dataset", "Face2Comics v2データセット"),
            description: t(
              "10,000 face photos and 10,000 comic versions, resized and randomly cropped to 128 px.",
              "10,000枚の顔写真と10,000枚のコミック版を、リサイズして128 pxにランダムクロップ。",
            ),
          },
          {
            tag: t("Model", "モデル"),
            title: t("ResNet generators + PatchGAN discriminators", "ResNet生成器 + PatchGAN識別器"),
            description: t(
              "Trained with adversarial, cycle-consistency and identity losses for 50 epochs.",
              "敵対的損失・サイクル一貫性損失・恒等損失で50エポック学習。",
            ),
          },
          {
            tag: t("Refactor", "リファクタリング"),
            title: t("Kaggle notebook to a Python package", "KaggleノートブックからPythonパッケージへ"),
            description: t(
              "Moved to TensorFlow 2.18+ / Keras 3, fixed swapped domains and loss bugs, and added a training CLI and tests.",
              "TensorFlow 2.18+ / Keras 3に移行し、ドメインの取り違えや損失のバグを修正。学習用CLIとテストを追加。",
            ),
          },
          {
            tag: t("Deploy", "デプロイ"),
            title: t("Streamlit, on two hosts", "Streamlitを2つの環境で"),
            description: t(
              "The same Streamlit app runs on Streamlit Community Cloud and on my own VPS.",
              "同じStreamlitアプリをStreamlit Community Cloudと自分のVPSの両方で動かしています。",
            ),
          },
        ],
      },
      features: {
        heading: t("What shipped", "実装したもの"),
        items: [
          {
            title: t("Two directions", "双方向の変換"),
            description: t("Photo → Comic and Comic → Photo.", "写真 → コミック、コミック → 写真。"),
          },
          {
            title: t("Three ways to input", "3つの入力方法"),
            description: t(
              "Upload an image, use the camera, or pick a random dataset example.",
              "画像のアップロード、カメラ撮影、データセットからランダムに選択。",
            ),
          },
          {
            title: t("Download as PNG", "PNGでダウンロード"),
            description: t(
              "Choose the output size and save the result.",
              "出力サイズを選んで結果を保存できます。",
            ),
          },
        ],
      },
      sections: [
        {
          id: "deployment",
          kicker: t("Deployment", "デプロイ"),
          heading: t("Two live versions", "2つの公開版"),
          paragraphs: [
            t(
              "comic.farisznafis.my.id is the same Streamlit app, hosted on my own VPS instead of Streamlit Community Cloud.",
              "comic.farisznafis.my.idは同じStreamlitアプリを、Streamlit Community Cloudではなく自分のVPSでホストしたものです。",
            ),
          ],
        },
      ],
      galleryLabel: t("Gallery", "ギャラリー"),
      outcomes: {
        kicker: t("Outcomes", "成果"),
        heading: t("Result", "結果"),
        items: [
          t(
            "A working photo ↔ comic translator anyone can try in the browser.",
            "誰でもブラウザで試せる、写真 ↔ コミックの変換ツール。",
          ),
          t(
            "A clean, tested codebase that can be retrained with one command.",
            "1つのコマンドで再学習できる、テスト付きの整理されたコードベース。",
          ),
        ],
      },
      nextLabel: t("Next project", "次のプロジェクト"),
    },
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
    id: "fire-segmentation",
    slug: "fire-segmentation",
    title: "Fire Segmentation",
    // TODO_REAL_CONTENT: confirm year (repo created 2024).
    fields: ["AI / ML"],
    stack: ["Python", "PyTorch", "U-Net", "ONNX Runtime", "Streamlit", "VPS"],
    summary: t(
      "A U-Net that marks every pixel of fire in a photo, served as a Streamlit web app with a lightweight ONNX model.",
      "写真の中の炎をピクセル単位で検出するU-Net。軽量なONNXモデルを使ったStreamlitのwebアプリとして公開しています。",
    ),
    featured: false,
    projectOrder: 14,
    hasCaseStudy: true,
    confidentiality: "public",
    links: [
      {
        type: "demo",
        label: t("Live demo (VPS)", "ライブデモ（VPS）"),
        url: "https://fire.farisznafis.my.id",
      },
      {
        type: "demo",
        label: t("Live demo (Streamlit Cloud)", "ライブデモ（Streamlit Cloud）"),
        url: "https://fire-segmentation.streamlit.app/",
      },
      {
        type: "github",
        label: t("Source", "ソースコード"),
        url: "https://github.com/farisznafis/fire-segmentation",
      },
    ],
    cover: {
      type: "image",
      src: "/projects/fire-segmentation/example.jpg",
      alt: t(
        "Three test photos with their predicted fire masks and overlays; the fire-coloured sunset in the last row is correctly left empty",
        "3枚のテスト写真と、予測された炎のマスクとオーバーレイ。最後の行の夕焼けは正しく炎なしと判定されています",
      ),
      caption: t(
        "Input, predicted mask and overlay on photos the model never saw. The sunset is correctly left empty.",
        "学習に使っていない写真での入力・予測マスク・オーバーレイ。夕焼けは正しく炎なしと判定。",
      ),
    },
    initials: "FS",
    tone: "amber",
    caseStudy: {
      overview: t(
        "Upload a photo, or pick one of 50 samples, and the app highlights the regions that contain fire, shows how much of the image is on fire, and lets you download the mask. The model runs on CPU in a 23 MB ONNX file.",
        "写真をアップロードするか50枚のサンプルから選ぶと、アプリが炎の領域をハイライトし、画像のうち炎が占める割合を表示します。マスクはダウンロードできます。モデルは23 MBのONNXファイルで、CPUで動きます。",
      ),
      atAGlance: t("Project at a glance", "プロジェクト概要"),
      challenge: {
        heading: t("Fire is not just a bright blob", "炎は「明るい塊」ではない"),
        lead: t(
          "The first model flagged sunsets, lamps and bright skies as fire.",
          "最初のモデルは夕焼け、照明、明るい空まで炎と判定していました。",
        ),
        body: t(
          "v1 was trained on grayscale video frames with no fire-free examples, so it learned that anything bright is fire. On unseen photos it raised a false alarm on 81% of fire-free images.",
          "v1は炎のない例を含まないグレースケールの動画フレームで学習したため、明るいものはすべて炎だと覚えてしまいました。未知の写真では、炎のない画像の81%で誤検出していました。",
        ),
      },
      approach: {
        kicker: t("Approach", "アプローチ"),
        heading: t("What changed in v2", "v2で変えたこと"),
        steps: [
          {
            tag: t("Data", "データ"),
            title: t("Real photos and hard negatives", "実写真と紛らわしい負例"),
            description: t(
              "2,683 video frames, 226 BoWFire photos including sunsets and lamps, and 320 fire-free photos.",
              "2,683枚の動画フレーム、夕焼けや照明を含むBoWFireの写真226枚、炎のない写真320枚。",
            ),
          },
          {
            tag: t("Model", "モデル"),
            title: t("U-Net with a pretrained encoder", "事前学習済みエンコーダー付きU-Net"),
            description: t(
              "RGB input and an ImageNet-pretrained EfficientNet-B0 encoder, 6.3M parameters.",
              "RGB入力と、ImageNetで事前学習したEfficientNet-B0エンコーダー。パラメーター数は630万。",
            ),
          },
          {
            tag: t("Validate", "検証"),
            title: t("Hold out whole videos", "動画単位でホールドアウト"),
            description: t(
              "Validation keeps entire videos out of training, so near-duplicate frames cannot leak.",
              "動画ごと学習から外して検証するため、ほぼ同じフレームが漏れることはありません。",
            ),
          },
          {
            tag: t("Deploy", "デプロイ"),
            title: t("ONNX + Streamlit, on two hosts", "ONNX + Streamlitを2つの環境で"),
            description: t(
              "Exported to ONNX so the app needs no deep-learning framework. The same app runs on Streamlit Community Cloud and on my own VPS.",
              "ONNXに書き出したため、アプリにディープラーニングのフレームワークは不要です。同じアプリをStreamlit Community Cloudと自分のVPSで動かしています。",
            ),
          },
        ],
      },
      features: {
        heading: t("What shipped", "実装したもの"),
        items: [
          {
            title: t("Upload or sample", "アップロードまたはサンプル"),
            description: t(
              "Use your own JPG, PNG or WEBP, or one of 50 bundled photos.",
              "手持ちのJPG・PNG・WEBP、または同梱の50枚の写真を使えます。",
            ),
          },
          {
            title: t("Adjustable threshold", "しきい値の調整"),
            description: t(
              "Original, mask and overlay side by side, with fire coverage in percent.",
              "元画像・マスク・オーバーレイを並べて表示し、炎の割合も表示。",
            ),
          },
          {
            title: t("Download the mask", "マスクのダウンロード"),
            description: t("Save the predicted mask as a PNG.", "予測マスクをPNGで保存できます。"),
          },
        ],
      },
      sections: [
        {
          id: "results",
          kicker: t("Results", "結果"),
          heading: t("v1 vs v2 on unseen data", "未知のデータでのv1とv2の比較"),
          facts: [
            {
              label: t("Fire IoU (BoWFire)", "炎のIoU（BoWFire）"),
              value: t("0.18 → 0.81", "0.18 → 0.81"),
            },
            {
              label: t("Precision / recall", "適合率 / 再現率"),
              value: t("0.28 / 0.32 → 0.92 / 0.88", "0.28 / 0.32 → 0.92 / 0.88"),
            },
            {
              label: t("False alarms, fire-free photos", "炎のない写真での誤検出"),
              value: t("58% → 0%", "58% → 0%"),
            },
            {
              label: t("Model size", "モデルサイズ"),
              value: t("23 MB ONNX, CPU only", "23 MBのONNX、CPUのみ"),
            },
          ],
          note: t(
            "Small or distant flames can be missed, and vivid sunset clouds are still the most common false alarm.",
            "小さい炎や遠くの炎は見逃すことがあり、鮮やかな夕焼け雲が今も最も多い誤検出です。",
          ),
        },
        {
          id: "deployment",
          kicker: t("Deployment", "デプロイ"),
          heading: t("Two live versions", "2つの公開版"),
          paragraphs: [
            t(
              "fire.farisznafis.my.id is the same Streamlit app, hosted on my own VPS instead of Streamlit Community Cloud.",
              "fire.farisznafis.my.idは同じStreamlitアプリを、Streamlit Community Cloudではなく自分のVPSでホストしたものです。",
            ),
          ],
        },
      ],
      galleryLabel: t("Gallery", "ギャラリー"),
      outcomes: {
        kicker: t("Outcomes", "成果"),
        heading: t("Result", "結果"),
        items: [
          t(
            "Fire IoU on unseen photos went from 0.18 to 0.81.",
            "未知の写真での炎のIoUが0.18から0.81に向上。",
          ),
          t(
            "False alarms on fire-free photos dropped from 58% to 0%.",
            "炎のない写真での誤検出が58%から0%に減少。",
          ),
          t(
            "A lightweight web app anyone can try in the browser.",
            "誰でもブラウザで試せる軽量なwebアプリ。",
          ),
        ],
      },
      nextLabel: t("Next project", "次のプロジェクト"),
    },
  },
];
