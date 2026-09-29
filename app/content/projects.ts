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
    stack: [
      "Python",
      "TensorFlow",
      "Keras",
      "Librosa",
      "NumPy",
      "Pandas",
      "Pydub",
      "Streamlit",
      "Pytest",
      "GitHub Actions",
    ],
    summary: t(
      "End-to-end speech emotion recognition project that combines acoustic feature engineering, a two-layer LSTM classifier, model evaluation, and a Streamlit inference app for six emotion classes.",
      "音響特徴量設計、2層LSTM分類器、モデル評価、Streamlit推論アプリを組み合わせ、音声を6つの感情クラスに分類するエンドツーエンドの音声感情認識プロジェクト。",
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
    // TODO_REAL_IMAGE: Streamlit UI screenshot / evaluation plots
    caseStudy: {
      overview: t(
        "An end-to-end Speech Emotion Recognition experiment that turns raw recordings into acoustic feature sequences, classifies them with a two-layer TensorFlow/Keras LSTM, evaluates the model on held-out data, and exposes inference through Streamlit. I later revisited the project as a portfolio remaster, separating research code from production inference and auditing inconsistencies between the historical notebook and deployed pipeline.",
        "生の音声を音響特徴量の系列へ変換し、TensorFlow/Kerasの2層LSTMで分類、ホールドアウトデータで評価し、Streamlitで推論できるようにしたエンドツーエンドの音声感情認識実験です。その後ポートフォリオ向けに再整理し、研究用コードと本番推論コードを分離するとともに、過去のノートブックとデプロイ済みパイプラインの不整合も監査しました。",
      ),
      atAGlance: t("Project at a glance", "プロジェクト概要"),
      challenge: {
        heading: t("Classifying how something is said, not what is said", "「何を」ではなく「どう」話したかを分類する"),
        lead: t(
          "Speech emotion recognition is a signal problem before it is a classification problem. The model does not read words; it must infer patterns from energy, temporal changes, and spectral characteristics that can overlap heavily across speakers and emotions.",
          "音声感情認識は、分類問題である前に信号処理の問題です。モデルは言葉そのものを読むのではなく、話者や感情間で大きく重なり得るエネルギー、時間変化、スペクトル特性からパターンを推定する必要があります。",
        ),
        body: t(
          "The engineering challenge was keeping the whole chain consistent: dataset labels, waveform preprocessing, feature extraction, tensor shape, class order, model checkpoint, and runtime inference all have to agree. During the remaster I found that even a seemingly small change such as the sample-rate value passed to MFCC extraction could change confidence scores without causing any shape or runtime error.",
          "技術的な難しさは、データセットのラベル、波形前処理、特徴量抽出、テンソル形状、クラス順、モデルチェックポイント、実行時推論をすべて一致させることでした。再整理の過程では、MFCC抽出に渡すサンプルレートのような一見小さな変更でも、形状エラーや実行時エラーを出さずに信頼度スコアを変えてしまうことが分かりました。",
        ),
      },
      approach: {
        kicker: t("Approach", "アプローチ"),
        heading: t(
          "From heterogeneous recordings to a fixed sequence the LSTM can learn",
          "異なる音声データをLSTMが学習できる固定系列へ",
        ),
        steps: [
          {
            tag: t("Data", "データ"),
            title: t("Unify four emotional-speech datasets", "4つの感情音声データセットを統合"),
            description: t(
              "The research notebook combines RAVDESS, CREMA-D, TESS, and SAVEE into one label space. The experiment then inspects emotion and gender distribution and narrows the working set to female speech before feature extraction.",
              "研究ノートブックではRAVDESS、CREMA-D、TESS、SAVEEを一つのラベル空間に統合。感情・性別分布を確認した後、特徴抽出前に女性音声へ対象を絞っています。",
            ),
          },
          {
            tag: t("Signal", "信号処理"),
            title: t("Normalize duration without normalizing away the signal", "信号特性を残したまま長さを正規化"),
            description: t(
              "Audio is decoded to PCM samples, silence is trimmed with top_db=25, and each sample is padded or truncated to 180,000 values. This produces a stable temporal length while preserving the raw amplitude scale used by the historical model.",
              "音声をPCMサンプルへ変換し、top_db=25で無音区間を除去。各サンプルを180,000点へパディングまたは切り詰めます。過去モデルが使った生の振幅スケールを維持しながら、時間長を固定します。",
            ),
          },
          {
            tag: t("Features", "特徴量"),
            title: t("Encode energy, transitions, and spectral envelope", "エネルギー・変化・スペクトル包絡を特徴量化"),
            description: t(
              "Every frame contains one Zero Crossing Rate value, one RMS energy value, and 13 MFCC coefficients. With a 2,048-sample frame and 512-sample hop, the deployed model receives a sequence shaped (352, 15).",
              "各フレームはゼロ交差率1値、RMSエネルギー1値、MFCC 13係数で構成。フレーム長2,048、ホップ長512により、デプロイモデルには(352, 15)の系列が入力されます。",
            ),
          },
          {
            tag: t("Sequence model", "系列モデル"),
            title: t("Model the feature sequence with stacked LSTMs", "積層LSTMで特徴系列をモデル化"),
            description: t(
              "A 64-unit LSTM returns the full sequence to a second 64-unit LSTM, followed by a six-unit softmax layer. The reference architecture has 53,894 trainable parameters and maps the sequence to neutral, happy, sad, angry, fear, or disgust.",
              "64ユニットのLSTMが系列全体を第2の64ユニットLSTMへ渡し、最後に6ユニットのsoftmax層で分類します。参照アーキテクチャは53,894個の学習可能パラメータを持ち、neutral・happy・sad・angry・fear・disgustへ分類します。",
            ),
          },
          {
            tag: t("Productization", "プロダクト化"),
            title: t("Separate research, inference, tests, and UI", "研究・推論・テスト・UIを分離"),
            description: t(
              "The portfolio remaster moves runtime logic into src/, keeps the historical notebook as a training reference, validates model input/output contracts with tests, and wraps inference in a Streamlit interface with upload validation and per-class confidence scores.",
              "ポートフォリオ向け再整理では、実行時ロジックをsrc/へ分離し、過去ノートブックは学習リファレンスとして保持。テストでモデルの入出力契約を検証し、アップロード検証とクラス別信頼度を備えたStreamlit UIから推論できるようにしました。",
            ),
          },
        ],
      },
      methodology: {
        kicker: t("Methodology", "手法"),
        heading: t("What the model actually sees", "モデルが実際に見ているもの"),
        body: t(
          "The classifier never receives text or a raw waveform directly. The pipeline converts each recording into a fixed sequence of handcrafted acoustic descriptors, then learns temporal relationships between those descriptors.",
          "分類器にはテキストも生波形も直接入力されません。各録音を固定長の手設計音響特徴系列へ変換し、その特徴量間の時間的関係を学習します。",
        ),
        items: [
          {
            title: t("Dataset construction", "データセット構築"),
            description: t(
              "RAVDESS, CREMA-D, TESS, and SAVEE are mapped into six common classes. The notebook records source-specific label parsing and gender metadata, then filters the experimental dataframe to female speech.",
              "RAVDESS、CREMA-D、TESS、SAVEEを6つの共通クラスへマッピング。データセットごとのラベル解析と性別情報を保持し、実験用データフレームでは女性音声に絞っています。",
            ),
          },
          {
            title: t("Preprocessing contract", "前処理契約"),
            description: t(
              "Silence is trimmed at 25 dB below the reference level and the remaining PCM array is padded or truncated to 180,000 samples. The production remaster deliberately preserves the legacy inference behavior instead of silently introducing a new resampling policy.",
              "基準レベルから25 dB下を閾値として無音を除去し、残ったPCM配列を180,000サンプルへパディングまたは切り詰めます。本番向け再整理では、新しいリサンプリング方針を暗黙に導入せず、従来の推論挙動を意図的に維持しています。",
            ),
          },
          {
            title: t("15 features × 352 frames", "15特徴量 × 352フレーム"),
            description: t(
              "ZCR captures sign changes in the waveform, RMS summarizes frame energy, and 13 MFCCs represent the spectral envelope. Concatenating them produces 15 values per frame and a model tensor of (batch, 352, 15).",
              "ZCRは波形の符号変化、RMSはフレームごとのエネルギー、13個のMFCCはスペクトル包絡を表現します。連結すると1フレーム15値となり、モデル入力は(batch, 352, 15)です。",
            ),
          },
          {
            title: t("Train / validation / test split", "学習・検証・テスト分割"),
            description: t(
              "The notebook first reserves 12% of the processed data, then splits that remainder 70/30 into validation and test sets with random_state=1. This corresponds to approximately 88% training, 8.4% validation, and 3.6% test data.",
              "ノートブックではまず処理済みデータの12%を確保し、その部分をrandom_state=1で70/30に分けて検証・テストセットを作成。概ね学習88%、検証8.4%、テスト3.6%の構成です。",
            ),
          },
          {
            title: t("Optimization setup", "最適化設定"),
            description: t(
              "The reference run compiles the network with categorical cross-entropy, RMSProp, and categorical accuracy. Training is configured for up to 400 epochs with a batch size of 6.",
              "参照実行ではcategorical cross-entropy、RMSProp、categorical accuracyでコンパイル。最大400エポック、バッチサイズ6で学習する設定です。",
            ),
          },
          {
            title: t("Runtime safeguards", "実行時の保護"),
            description: t(
              "The remastered app validates file type and size, checks the expected (352, 15) feature contract and six-class model output, runs automated Pytest checks in CI, and keeps user-facing errors separate from internal exceptions.",
              "再整理版ではファイル形式・サイズを検証し、(352, 15)の特徴量契約と6クラス出力を確認。CIでPytestを実行し、ユーザー向けエラーと内部例外も分離しています。",
            ),
          },
        ],
      },
      features: {
        heading: t("What shipped", "実装したもの"),
        items: [
          {
            title: t("Acoustic feature pipeline", "音響特徴量パイプライン"),
            description: t(
              "A deterministic ZCR + RMS + 13-MFCC feature path converts variable recordings into the sequence shape expected by the trained checkpoint.",
              "ZCR + RMS + 13 MFCCによる決定的な特徴抽出経路で、可変長録音を学習済みチェックポイントが期待する系列形状へ変換します。",
            ),
          },
          {
            title: t("Stacked LSTM classifier", "積層LSTM分類器"),
            description: t(
              "Two 64-unit LSTM layers model temporal structure before a six-way softmax prediction.",
              "64ユニットLSTMを2層重ねて時間構造を学習し、6クラスsoftmaxで予測します。",
            ),
          },
          {
            title: t("Interactive inference app", "対話型推論アプリ"),
            description: t(
              "Streamlit handles supported audio uploads, playback, inference, the detected class, overall confidence, and a per-emotion score visualization.",
              "Streamlitで対応音声のアップロード、再生、推論、検出クラス、信頼度、感情別スコア可視化まで提供します。",
            ),
          },
          {
            title: t("Production-oriented project structure", "本番を意識したプロジェクト構成"),
            description: t(
              "Inference code is separated from the training notebook, the Keras checkpoint is loaded without recompilation, and CI covers linting, feature contracts, model loading, and synthetic inference.",
              "推論コードを学習ノートブックから分離し、Kerasチェックポイントは再コンパイルせずロード。CIでLint、特徴量契約、モデルロード、合成入力推論を検証します。",
            ),
          },
        ],
      },
      analysis: {
        kicker: t("Model analysis", "モデル分析"),
        heading: t("The metric is useful only when its provenance is clear", "指標は由来が明確であって初めて意味を持つ"),
        body: t(
          "The historical notebook contains a validation run with strong numbers, but the remaster uncovered enough provenance issues that I treat those numbers as experimental evidence rather than as a production accuracy claim.",
          "過去ノートブックには高い検証結果が残っていますが、再整理時に複数の由来・整合性問題が見つかったため、その数値は本番精度の断定ではなく、実験結果として扱っています。",
        ),
        items: [
          {
            title: t("Historical validation: ~94%", "過去の検証結果：約94%"),
            description: t(
              "One recorded validation report contains 263 samples and reports 0.94 accuracy, with macro F1 around 0.93 and weighted F1 around 0.94. This belongs to the notebook experiment, not a newly reproduced benchmark of the current deployed checkpoint.",
              "記録された検証レポートの一つでは263サンプルに対してaccuracy 0.94、macro F1約0.93、weighted F1約0.94を記録しています。ただしこれはノートブック実験の結果であり、現在デプロイ中のチェックポイントを再現評価した最新ベンチマークではありません。",
            ),
          },
          {
            title: t("Evaluation label audit", "評価ラベルの監査"),
            description: t(
              "The training mapping is neutral, happy, sad, angry, fear, disgust, but the historical confusion-matrix/report display labels were written as neutral, calm, sad, happy, fear, disgust. The numeric class indices remain evaluable, but the class names shown for indices 1 and 3 are not trustworthy and should be corrected before presenting per-class conclusions.",
              "学習時のマッピングはneutral・happy・sad・angry・fear・disgustですが、過去の混同行列／レポート表示はneutral・calm・sad・happy・fear・disgustとなっていました。数値インデックス自体は評価できますが、インデックス1と3の表示名は信頼できず、クラス別結論を示す前に修正が必要です。",
            ),
          },
          {
            title: t("Checkpoint callback audit", "チェックポイント設定の監査"),
            description: t(
              "The model is compiled with categorical_accuracy, while EarlyStopping and ModelCheckpoint monitor val_accuracy. Keras logs explicitly warn that val_accuracy is unavailable, so those callbacks did not operate as intended in the recorded run.",
              "モデルはcategorical_accuracyでコンパイルされていますが、EarlyStoppingとModelCheckpointはval_accuracyを監視しています。Kerasログにはval_accuracyが存在しないという警告が残っており、記録された実行ではこれらのコールバックが意図通り動作していません。",
            ),
          },
          {
            title: t("Notebook model ≠ deployed checkpoint", "ノートブックモデル ≠ デプロイ済みチェックポイント"),
            description: t(
              "The current app deploys the checkpoint historically named best_model_22112024_400.keras, while the reference notebook later trains/saves a 03122024 model. Because those artifacts are not the same checkpoint, notebook metrics should not be attributed directly to the deployed model.",
              "現在のアプリは旧称best_model_22112024_400.kerasのチェックポイントをデプロイしていますが、参照ノートブックは後の03122024モデルを学習・保存しています。同一チェックポイントではないため、ノートブックの評価値をデプロイモデルへ直接帰属させるべきではありません。",
            ),
          },
          {
            title: t("Inference parity matters", "推論パリティの重要性"),
            description: t(
              "During the remaster, changing MFCC sample-rate handling altered confidence scores even though tensor shapes stayed valid. I restored the legacy inference behavior and added contract tests, reinforcing that ML refactors must preserve numerical preprocessing, not only interfaces.",
              "再整理中、MFCCのサンプルレート処理を変更したところ、テンソル形状は正常なまま信頼度が変化しました。従来の推論挙動へ戻し契約テストを追加したことで、MLのリファクタリングではインターフェースだけでなく数値的前処理も維持する必要があると確認できました。",
            ),
          },
        ],
      },
      limitations: {
        kicker: t("Limitations & next steps", "制約と次の改善"),
        heading: t("A useful experiment, not a universal emotion detector", "有用な実験だが、万能な感情検出器ではない"),
        body: t(
          "The model estimates patterns associated with acted emotional-speech datasets. It should not be interpreted as an objective reading of a person's internal emotional state.",
          "このモデルは演技された感情音声データセットに関連する音響パターンを推定するものです。人の内面的な感情状態を客観的に読み取るものとして解釈すべきではありません。",
        ),
        items: [
          {
            title: t("Dataset bias", "データセットバイアス"),
            description: t(
              "The notebook intentionally narrows the experiment to female speech, and the source datasets differ in speakers, recording conditions, and acting style. Generalization to everyday speech, other demographics, languages, or microphones is therefore not established.",
              "ノートブックでは意図的に女性音声へ対象を絞っており、元データセットも話者・録音条件・演技スタイルが異なります。日常会話、他の属性、言語、マイクへの一般化は確認されていません。",
            ),
          },
          {
            title: t("Confidence is not calibration", "信頼度は校正精度ではない"),
            description: t(
              "The softmax score is exposed as model confidence for usability, but the project does not contain a calibration study. A high score should not be read as a guaranteed probability of correctness.",
              "使いやすさのためsoftmax値をモデル信頼度として表示していますが、校正評価は行っていません。高いスコアを正解確率の保証として読むべきではありません。",
            ),
          },
          {
            title: t("Rebuild the evaluation protocol", "評価プロトコルの再構築"),
            description: t(
              "The next rigorous step is to correct display labels and callback monitors, pin preprocessing dependencies, bind evaluation to the exact deployed checkpoint, and report a reproducible test-set confusion matrix and per-class metrics.",
              "次の厳密な改善は、表示ラベルとコールバック監視指標を修正し、前処理依存関係を固定し、評価を実際のデプロイ済みチェックポイントへ結び付け、再現可能なテストセット混同行列とクラス別指標を報告することです。",
            ),
          },
          {
            title: t("Standardize future preprocessing by retraining", "再学習で将来の前処理を標準化"),
            description: t(
              "The deployed model currently preserves legacy preprocessing for compatibility. A future model should explicitly resample audio to a documented rate, retrain on that contract, and test parity across WAV and compressed formats.",
              "現デプロイモデルは互換性のため従来前処理を維持しています。将来モデルでは明示したサンプルレートへリサンプリングし、その契約で再学習し、WAVと圧縮形式間のパリティも検証するべきです。",
            ),
          },
        ],
      },
      galleryLabel: t("Gallery", "ギャラリー"),
      outcomes: {
        kicker: t("Outcomes", "成果"),
        heading: t("What the project demonstrates", "このプロジェクトで示せたこと"),
        items: [
          t(
            "Built a complete speech-emotion pipeline from multi-dataset label parsing through acoustic features, sequence modeling, evaluation, and interactive inference.",
            "複数データセットのラベル統合から音響特徴量、系列モデル、評価、対話型推論まで、音声感情認識の一連のパイプラインを構築。",
          ),
          t(
            "Converted each recording into a stable (352, 15) temporal feature representation consumed by a 53,894-parameter stacked LSTM.",
            "各録音を安定した(352, 15)の時間特徴表現へ変換し、53,894パラメータの積層LSTMで処理。",
          ),
          t(
            "Turned a notebook experiment into a cleaner application structure with separated inference modules, automated tests, CI, and Streamlit deployment.",
            "ノートブック実験を、推論モジュール分離・自動テスト・CI・Streamlitデプロイを備えた整理されたアプリ構成へ発展。",
          ),
          t(
            "Audited the historical experiment and documented evaluation-label, callback-monitor, checkpoint-provenance, and preprocessing-parity issues instead of presenting an unsupported production accuracy claim.",
            "裏付けのない本番精度を主張するのではなく、過去実験の評価ラベル、コールバック監視、チェックポイント由来、前処理パリティの問題を監査・文書化。",
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