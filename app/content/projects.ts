/**
 * Project content — the domain store, completely independent from UI.
 *
 * Mirrors the future Supabase schema (see app/types/project.ts). Each
 * project maps to a `projects` row plus its `project_translations`,
 * `project_fields`, `project_technologies`, `project_links`, and
 * `project_media` rows. Today the data is static TypeScript; the data-access
 * layer (app/lib/content/projects.ts) is the only import boundary the UI
 * uses, so swapping the store for Supabase later never touches components.
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
    ],
    initials: "KM",
    tone: "amber",
    // TODO_REAL_IMAGE: expo photo / UI screenshot
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
    // Professional work: no public links.
    confidentiality: "limited",
    links: [],
    initials: "MK",
    tone: "accent",
    // TODO_REAL_IMAGE: public-safe UI shots (if approved)
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
    stack: ["Gurobi", "Docker", "Google Kubernetes Engine"],
    summary: t(
      "Four optimization models built with Gurobi in a 5-member team, with deployment work using Docker and Google Kubernetes Engine.",
      "5人のチームでGurobiを用いて構築した4つの最適化モデルと、Docker・Google Kubernetes Engineを使ったデプロイ関連の作業。",
    ),
    featured: false,
    projectOrder: 12,
    hasCaseStudy: false,
    // Telkom internship work: no company-private material.
    confidentiality: "limited",
    links: [],
    initials: "OW",
    tone: "amber",
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