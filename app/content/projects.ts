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
      "B2B SaaS for managing J-Credit carbon projects. In a 5-member team, I was the sole UI/UX designer and frontend engineer: role-based workflows for Admin, Master, and User, a 4-step onboarding flow, and monitoring and emissions dashboards.",
      "J-クレジットのカーボンプロジェクトを管理するB2B向けSaaS。5人のチームで、UI/UXデザインとフロントエンド開発を一人で担当し、Admin・Master・Userのロール別ワークフロー、4ステップのオンボーディング、モニタリングデータと排出量のダッシュボードを設計・実装しました。",
    ),
    featured: true,
    featuredOrder: 1,
    projectOrder: 1,
    hasCaseStudy: true,
    // Professional/company work: no public demo link; the demo is shown live in interviews only.
    confidentiality: "limited",
    links: [],
    cover: {
      type: "image",
      src: "/projects/carbon-monitoring/site-dashboard.png",
      alt: t(
        "Site dashboard: projects the site has joined, with emission-reduction progress against the target",
        "拠点ダッシュボード：拠点が入会しているプロジェクトと、目標に対する排出削減の進捗",
      ),
    },
    // Admin screens are an internal tool, so they stay out of the public gallery.
    gallery: [
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
        src: "/projects/carbon-monitoring/lofi.png",
        alt: t(
          "Lofi wireframe: a basic layout of the site dashboard with placeholder content",
          "ローファイのワイヤーフレーム：基本的な拠点ダッシュボードのレイアウトとプレースホルダー内容",
        ),
        caption: t(
          "Low-fidelity wireframe and web flow of the website.",
          "ウェブサイトのローファイ・ワイヤーフレームとウェブフロー。",
        ),
      }
    ],
    initials: "CM",
    tone: "accent",
    caseStudy: {
      overview: t(
        "A B2B SaaS for running J-Credit carbon projects: companies register sites and equipment, join projects, submit monitoring data and track emission reductions. In a 5-member team, I was the only designer and frontend engineer and built every screen.",
        "J-クレジットのカーボンプロジェクトを運用するB2B向けSaaS。企業は拠点と設備の登録、プロジェクトへの入会、モニタリングデータの提出、排出削減量の確認を行えます。5人のチームで、デザインとフロントエンドを担当したのは私一人で、すべての画面を設計・実装しました。",
      ),
      problem: t(
        "Three roles (Admin, Master, User) use one product with different permissions and tasks, and every onboarding field feeds the emission calculations, so bad input breaks the data downstream.",
        "Admin・Master・Userの3ロールが、権限も作業も異なる状態で一つのプロダクトを使います。また、オンボーディングの入力項目はすべて排出量の計算に使われるため、不正な入力は下流のデータを壊します。",
      ),
      decisions: [
        {
          title: t("React Router + protected routes", "React Router + 保護されたルート"),
          description: t(
            "Each role lands in its own workspace inside one app and one design system, instead of three separate apps.",
            "1つのアプリと1つのデザインシステムの中で、ロールごとに専用のワークスペースへ振り分けます。3つの別アプリにはしません。",
          ),
        },
        {
          title: t("React Hook Form + Zod", "React Hook Form + Zod"),
          description: t(
            "Business rules are checked in the form, so bad data never reaches the API.",
            "業務ルールをフォーム上で検証し、不正なデータをAPIに送りません。",
          ),
        },
        {
          title: t("Zustand", "Zustand"),
          description: t(
            "Holds state across the 4 onboarding steps: company, methodology and equipment, confirmation, completion.",
            "オンボーディング4ステップ（法人情報、方法論・設備、確認、完了）をまたぐ状態を保持します。",
          ),
        },
        {
          title: t("Recharts", "Recharts"),
          description: t(
            "Emissions against the baseline and reduction progress on the dashboards.",
            "ダッシュボードで、ベースラインと比較した排出量と削減の進捗を表示します。",
          ),
        },
      ],
      sections: [
        {
          id: "roles",
          kicker: t("Roles", "ロール"),
          heading: t("Who does what", "誰が何をするか"),
          items: [
            {
              title: t("Admin (operator)", "Admin（運営者）"),
              description: t(
                "Registers projects and methodologies, reviews applications and memberships, approves or rejects monitoring data, manages operators.",
                "プロジェクトと方法論の登録、申請と入会届の審査、モニタリングデータの承認・却下、運営者の管理。",
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
          kicker: t("Demo", "デモ"),
          heading: t("Available on request", "面談時にご覧いただけます"),
          paragraphs: [
            t(
              "This is company work, so there is no public link. I can walk through a working demo on mock data in an interview, covering all three roles and the full onboarding.",
              "業務プロジェクトのため、公開リンクは掲載していません。面談の際に、モックデータで動くデモを画面共有でご案内します（3つのロールとオンボーディングの全工程）。",
            ),
          ],
          note: t(
            "All screenshots use mock data. No real company data is shown.",
            "スクリーンショットはすべてモックデータです。実際の企業データは含まれていません。",
          ),
        },
      ],
      results: [
        t(
          "Shipped workspaces for 3 roles and the 4-step onboarding with a 5-member team.",
          "3ロールのワークスペースと4ステップのオンボーディングを、5人のチームでリリースしました。",
        ),
      ],
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
        "An interactive AI conversation bot for Kumamoto EXPO 2025, built in a 3-person team. I designed and built the frontend: the booth interface, face-detection reactions and the microphone flow.",
        "熊本EXPO 2025向けに3人のチームで開発した対話型AI会話ボット。ブース画面、顔検出に反応するインタラクション、マイクのフローなど、フロントエンドを設計・実装しました。",
      ),
      problem: t(
        "Expo visitors walk up with no instructions, so the bot has to invite a conversation and show its state (listening, thinking, speaking) at a glance, all running in the browser on event hardware.",
        "EXPOの来場者は説明なしで近づいてくるため、ボットは会話を促し、状態（聴いている・考えている・話している）を一目で示す必要があります。しかも、すべて会場のハードウェア上のブラウザで動かす必要がありました。",
      ),
      howItWorks: [
        t("While nobody is there, the screen rotates standby greetings.", "誰もいない間は、待機中のあいさつを順番に表示します。"),
        t("The camera detects a visitor's face in the browser, and the bot asks them to speak.", "ブラウザ内でカメラが来場者の顔を検出すると、ボットが話しかけるよう促します。"),
        t("The bot records a few seconds of speech automatically, no button needed.", "ボタンを押さなくても、数秒間の発話を自動で録音します。"),
        t("The recording and the chosen language go to the team's conversation API while the screen shows \"thinking\".", "録音と選択した言語をチームの会話APIに送り、その間は画面に「考え中」と表示します。"),
        t("The reply appears line by line, then the bot returns to standby.", "返答を一行ずつ表示し、終わると待機状態に戻ります。"),
      ],
      decisions: [
        {
          title: t("face-api.js + TensorFlow.js", "face-api.js + TensorFlow.js"),
          description: t(
            "Face detection runs in the browser on the event hardware, so the bot reacts to the visitor in front of it.",
            "顔検出を会場のハードウェア上のブラウザで動かし、ボットが目の前の来場者に反応できるようにしました。",
          ),
        },
        {
          title: t("react-mic", "react-mic"),
          description: t(
            "Drives the recording states with visible status (permission, listening, processing), so a visitor never gets stuck.",
            "録音状態（権限の要求・聴き取り・処理）を画面に明示し、来場者が操作に迷わないようにしました。",
          ),
        },
        {
          title: t("Figma (booth UI)", "Figma（ブース画面）"),
          description: t(
            "Designed for walk-up use: large state indicators and a dialogue layout readable from a distance.",
            "立ち寄り利用を前提に、大きな状態表示と離れた場所からも読める対話レイアウトをデザインしました。",
          ),
        },
      ],
      results: [
        t(
          "Used by 80+ visitors at Kumamoto EXPO 2025.",
          "熊本EXPO 2025で来場者80名以上に利用されました。",
        ),
      ],
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
      caption: t(
        "The website shown here is no longer accessible.",
        "ここに掲載しているWebサイトは現在アクセスできません。",
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
        "A recruitment website of about 21 pages, designed for desktop and mobile in a 3-person team, plus visuals for the recruitment campaign.",
        "約21ページの採用サイトを、3人のチームでデスクトップとモバイル向けにデザイン。採用キャンペーンのビジュアルも制作しました。",
      ),
      problem: t(
        "About 21 connected pages (company story, roles, process, FAQ) had to read as one product, and most candidates would see them first on a phone.",
        "会社のストーリー・職種・プロセス・FAQなど、約21ページを一つのプロダクトとして見せる必要があり、候補者の多くは最初にスマートフォンで閲覧します。",
      ),
      decisions: [
        {
          title: t("Page templates in Figma", "Figmaのページテンプレート"),
          description: t(
            "Hero, content, listing and detail layouts, so ~21 pages come from a few templates instead of 21 one-off designs.",
            "ヒーロー・コンテンツ・一覧・詳細のレイアウトを定義し、約21ページを21個の個別デザインではなく少数のテンプレートから構成しました。",
          ),
        },
        {
          title: t("Desktop and mobile together", "デスクトップとモバイルを同時に"),
          description: t(
            "Every layout was designed at both breakpoints from the start, not ported to mobile later.",
            "すべてのレイアウトを最初から両方のブレークポイントで設計し、後からモバイルに移植していません。",
          ),
        },
        {
          title: t("Campaign visuals", "キャンペーンビジュアル"),
          description: t(
            "Reused the site's visual style, so the site and the campaign posts read as one campaign.",
            "サイトのビジュアルスタイルを流用し、サイトとキャンペーン投稿を一つのキャンペーンとして統一しました。",
          ),
        },
      ],
      results: [
        t(
          "Delivered the ~21-page design for desktop and mobile, plus campaign visuals, with a 3-person team.",
          "約21ページのデスクトップ・モバイルデザインとキャンペーンビジュアルを、3人のチームで納品しました。",
        ),
      ],
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
        "Upload a speech recording and a small stacked LSTM classifies it into one of six emotions: neutral, happy, sad, angry, fear or disgust. It started as a notebook experiment and was rebuilt into a tested, deployed Streamlit app.",
        "音声をアップロードすると、小さなスタックLSTMが6つの感情（neutral・happy・sad・angry・fear・disgust）のいずれかに分類します。ノートブックでの実験から始まり、テスト付きのStreamlitアプリとして作り直して公開しました。",
      ),
      problem: t(
        "The original work lived in notebooks. Turning it into an app meant keeping the exact preprocessing the trained model expects, while splitting inference out so it can be tested and deployed on its own.",
        "元の成果物はノートブックの中にありました。アプリにするには、学習済みモデルが前提とする前処理をそのまま保ちつつ、推論を切り出して単独でテスト・デプロイできるようにする必要がありました。",
      ),
      howItWorks: [
        t("Upload a voice recording.", "音声をアップロードします。"),
        t("Silence is trimmed and the clip is cut to a fixed length.", "無音を除去し、長さを揃えます。"),
        t("Each short frame becomes numbers that describe the voice's energy and tone.", "短いフレームごとに、声のエネルギーと音色を表す数値に変換します。"),
        t("An LSTM reads the frames in order and scores six emotions.", "LSTMがフレームを順に読み、6つの感情をスコア化します。"),
        t("The app shows the top emotion and the confidence for each.", "最も可能性の高い感情と、それぞれの信頼度を表示します。"),
      ],
      decisions: [
        {
          title: t("Pydub + FFmpeg", "Pydub + FFmpeg"),
          description: t(
            "Decodes 7 formats (WAV, MP3, M4A, FLAC, OGG, AAC, AMR), trims silence and fixes the length at 180,000 samples, as the model expects.",
            "7形式（WAV・MP3・M4A・FLAC・OGG・AAC・AMR）をデコードし、無音を除去して、モデルが前提とする180,000サンプルに長さを揃えます。",
          ),
        },
        {
          title: t("Librosa", "Librosa"),
          description: t(
            "ZCR, RMS energy and 13 MFCCs for each of 352 frames: a 352 × 15 input that captures how something is said, not what.",
            "352フレームそれぞれのZCR・RMSエネルギー・13個のMFCC。「何を」ではなく「どう」話したかを捉える352 × 15の入力です。",
          ),
        },
        {
          title: t("TensorFlow / Keras LSTM", "TensorFlow / Keras LSTM"),
          description: t(
            "LSTM(64) → LSTM(64) → softmax over 6 emotions, 53,894 parameters, trained on RAVDESS, CREMA-D, TESS and SAVEE.",
            "LSTM(64) → LSTM(64) → 6感情のsoftmax。パラメーター数53,894、RAVDESS・CREMA-D・TESS・SAVEEで学習。",
          ),
        },
        {
          title: t("Model contract checks", "モデルの入出力チェック"),
          description: t(
            "Before predicting, the app checks input shape (352 × 15), output (6 classes) and label order, so a wrong checkpoint fails loudly.",
            "推論の前に入力（352 × 15）・出力（6クラス）・ラベルの順序を確認し、誤ったチェックポイントを確実に検出します。",
          ),
        },
        {
          title: t("Pytest + Ruff + GitHub Actions", "Pytest + Ruff + GitHub Actions"),
          description: t(
            "Every push lints, tests upload validation, preprocessing, feature shapes and labels, loads the model and runs a test prediction.",
            "プッシュごとにlint、アップロード検証・前処理・特徴量の形・ラベルのテスト、モデル読み込み、テスト推論を実行します。",
          ),
        },
      ],
      sections: [
        {
          id: "evaluation",
          kicker: t("Evaluation", "評価"),
          heading: t("0.94 is a historical score, not the live model's", "0.94は過去の値で、公開中のモデルの値ではない"),
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
              "Re-checking the old notebook, I found two class names swapped in the report, an early-stopping callback watching a metric that didn't exist, and a deployed checkpoint different from the one evaluated.",
              "古いノートブックを見直したところ、レポートで2つのクラス名が入れ替わっていたこと、早期終了のコールバックが存在しない指標を監視していたこと、評価したものとは別のチェックポイントがデプロイされていたことが分かりました。",
            ),
          ],
        },
        {
          id: "limitations",
          kicker: t("Limitations", "制約"),
          heading: t("An experiment, not an emotion detector", "感情検出器ではなく、実験"),
          paragraphs: [
            t(
              "Trained on acted speech from female speakers only. Language, microphone and noise all change the result, and confidence scores are not calibrated. Not for medical, hiring or other high-stakes decisions.",
              "学習データは女性話者のみの演技音声です。言語・マイク・ノイズで結果は変わり、信頼度スコアは校正されていません。医療・採用などの重要な判断には使えません。",
            ),
          ],
        },
      ],
      results: [
        t(
          "Live web app that classifies speech into six emotions.",
          "音声を6つの感情に分類する、公開中のwebアプリ。",
        ),
        t(
          "Inference separated from the notebook, with tests and CI on every push.",
          "推論をノートブックから分離し、プッシュごとにテストとCIを実行。",
        ),
      ],
    },
  },
  {
    id: "financify",
    slug: "financify",
    title: "Financify — Inflation Forecasting",
    year: "2023",
    role: t("Machine Learning Engineer / Designer", "機械学習エンジニア / デザイナー"),
    fields: ["AI / ML", "Data / Optimization", "UI / UX", "Visual Design"],
    stack: ["Python", "scikit-learn", "Pandas", "TensorFlow / Keras", "Flask", "Pytest", "Docker", "Figma", "Adobe Premiere Pro"],
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
      src: "/projects/financify/cover-financify.png",
      alt: t(
        "Financify logo: a stylised F made of three leaf shapes in shades of green, outlined in white on a green background",
        "Financifyのロゴ：緑の背景に、白い輪郭の3枚の葉の形で描いたF",
      ),
      caption: t(
        "The Financify logo I designed for the 2023 app.",
        "2023年のアプリ用にデザインしたFinancifyのロゴ。",
      ),
    },
    gallery: [
      {
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
        type: "embed",
        src: "https://www.youtube-nocookie.com/embed/6Z98TiDy4YE?rel=0",
        alt: t(
          "Financify final presentation video",
          "Financifyの最終発表動画",
        ),
        caption: t(
          "The final presentation from the 2023 capstone.",
          "2023年のキャップストーンの最終発表。",
        ),
      },
      {
        type: "embed",
        src: "https://drive.google.com/file/d/12bsS0cYtBnKGENVcYxTu0VgqmIUFC3tD/preview",
        alt: t(
          "Financify pitch deck",
          "Financifyのピッチデック",
        ),
        caption: t(
          "The pitch deck from the 2023 capstone.",
          "2023年のキャップストーンのピッチデック。",
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
        "Pick one of 82 Indonesian cities to see next month's inflation forecast, then what a savings goal will cost after inflation and how long it takes to reach. It began as a 2023 Bangkit capstone (an LSTM behind a Flask API for an Android app) and was later rebuilt end to end.",
        "インドネシア82都市から一つを選ぶと翌月のインフレ予測が表示され、インフレ後の貯蓄目標の金額と達成までの期間が分かります。2023年のBangkitキャップストーン（Androidアプリ向けのFlask APIの裏にLSTM）として始まり、のちに全体を作り直しました。",
      ),
      problem: t(
        "Inflation differs by city and is noisy month to month. The 2023 version used a hand-compiled dataset and was never compared with a baseline, so the rebuild had to beat simple guesses on unseen months and show how wrong it can be.",
        "インフレは都市ごとに異なり、月単位では変動が大きい。2023年版は手作業でまとめたデータを使い、ベースラインとの比較もしていなかったため、作り直しでは未知の月で単純な推測を上回り、誤差の大きさも示す必要がありました。",
      ),
      howItWorks: [
        t("Official inflation and food market prices are collected for each city.", "都市ごとに公式のインフレ率と食品の市場価格を集めます。"),
        t("Recent months, the calendar and early-month food prices become features.", "直近の数か月、カレンダー、月初の食品価格を特徴量にします。"),
        t("A model forecasts next month's inflation for every city.", "モデルが各都市の翌月のインフレを予測します。"),
        t("The planner applies inflation to your savings goal.", "プランナーが貯蓄目標にインフレを反映します。"),
        t("You see what the goal will cost and how long it takes to reach.", "目標の将来の金額と、達成までの期間を表示します。"),
      ],
      decisions: [
        {
          title: t("BPS + Bank Indonesia PIHPS data", "BPS + Bank Indonesia PIHPSのデータ"),
          description: t(
            "Official month-to-month inflation for 82 cities (2008 onward) and daily prices for 10 foods, checked for duplicates, gaps and placeholder zeros.",
            "82都市の公式な前月比インフレ（2008年以降）と10品目の日次価格。重複・欠損・プレースホルダーの0をチェックしています。",
          ),
        },
        {
          title: t("Lags, calendar and a food nowcast", "ラグ、カレンダー、食品のナウキャスト"),
          description: t(
            "12 months of lags, seasonality, Ramadan and Eid flags, and food price changes from the first 5 trading days of the target month.",
            "12か月分のラグ、季節性、ラマダンとイードのフラグ、対象月の最初の5営業日の食品価格の変化。",
          ),
        },
        {
          title: t("scikit-learn (Ridge, gradient boosting)", "scikit-learn（Ridge、勾配ブースティング）"),
          description: t(
            "Compared with naive and seasonal-naive baselines over 4 rolling yearly folds; a feature group stays only if it lowers validation error.",
            "ナイーブと季節ナイーブのベースラインと、4つの年次ローリング分割で比較。検証誤差を下げる特徴量グループだけを残します。",
          ),
        },
        {
          title: t("Static page + Flask", "静的ページ + Flask"),
          description: t(
            "Every forecast is embedded in one bilingual page and the planner runs in the browser, so it needs no server. Flask serves the same page plus a JSON API.",
            "全都市の予測を一つのバイリンガルページに埋め込み、プランナーはブラウザで動くためサーバーは不要。Flaskは同じページとJSON APIも提供します。",
          ),
        },
        {
          title: t("Pytest", "Pytest"),
          description: t(
            "Tests data cleaning, leak-free features and splits, the API, and that the JavaScript and Python planners agree.",
            "データ清掃、リークのない特徴量と分割、API、そしてJavaScriptとPythonのプランナーが一致することをテストします。",
          ),
        },
        {
          title: t("Figma + Premiere Pro", "Figma + Premiere Pro"),
          description: t(
            "Designed the logo, the Finbot mascot and the 2023 app UI, and edited the capstone videos.",
            "ロゴ、Finbotマスコット、2023年のアプリUIをデザインし、キャップストーンの動画を編集しました。",
          ),
        },
      ],
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
          heading: t("A planning estimate, not financial advice", "計画のための試算であり、金融アドバイスではない"),
          paragraphs: [
            t(
              "The model sees only each city's inflation history, the calendar and food prices: no fuel or electricity prices, exchange or policy rates. The planner assumes constant income, expenses and inflation, and no investment return.",
              "モデルが見るのは各都市のインフレ履歴、カレンダー、食品価格だけで、燃料・電気料金、為替、政策金利は含みません。プランナーは収入・支出・インフレが一定で、投資収益がないと仮定しています。",
            ),
          ],
        },
      ],
      results: [
        t(
          "37% lower error than the naive baseline on held-out months.",
          "未使用の月で、ナイーブなベースラインより誤差を37%削減。",
        ),
        t(
          "Live bilingual web app covering 82 Indonesian cities.",
          "インドネシア82都市をカバーする、公開中のバイリンガルwebアプリ。",
        ),
        // TODO_REAL_CONTENT: "Top 50 Product-based Capstone Projects" —
        // display only if verified against existing CV/portfolio data.
      ],
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
      caption: t(
        "The website shown here is no longer accessible.",
        "ここに掲載しているWebサイトは現在アクセスできません。",
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
        "Type a post and the app says whether it shows signs of suicide risk. A LightGBM model trained on 232,074 Reddit posts, built by our team The Untouchaballs for Data Royale 2023. It is a competition project, not a clinical tool.",
        "投稿を入力すると、自殺リスクの兆候があるかをアプリが判定します。232,074件のReddit投稿で学習したLightGBMモデルで、チームThe UntouchaballsとしてData Royale 2023向けに作りました。コンテスト用のプロジェクトであり、臨床用のツールではありません。",
      ),
      problem: t(
        "Posts are short, messy and full of slang, and missing a risk post costs more than a false alarm.",
        "投稿は短く、表記が乱れ、スラングも多い。そしてリスクのある投稿の見逃しは、誤検知よりも重大です。",
      ),
      howItWorks: [
        t("Type or paste a post.", "投稿を入力または貼り付けます。"),
        t("The text is cleaned: lowercased, stopwords removed, words reduced to their base form.", "テキストを整えます（小文字化、ストップワード除去、見出し語化）。"),
        t("It becomes character-pattern features (TF-IDF).", "文字パターンの特徴量（TF-IDF）に変換します。"),
        t("LightGBM classifies it as risk or no risk.", "LightGBMがリスクあり・なしを判定します。"),
      ],
      decisions: [
        {
          title: t("NLTK", "NLTK"),
          description: t(
            "Lowercase, remove punctuation and stopwords, tokenize and lemmatize before featurising.",
            "特徴量化の前に、小文字化、句読点とストップワードの除去、トークン化、見出し語化を行います。",
          ),
        },
        {
          title: t("Character-level TF-IDF", "文字単位のTF-IDF"),
          description: t(
            "1–3 character n-grams, 5,000 features, chosen because it copes with typos and slang.",
            "1〜3文字のn-gramで5,000特徴量。誤字やスラングに強いため採用しました。",
          ),
        },
        {
          title: t("LightGBM (vs Random Forest, Naive Bayes)", "LightGBM（Random Forest、Naive Bayesと比較）"),
          description: t(
            "The most accurate of the three on an 80/20 stratified split, and small enough to deploy: 3.8 MB against 226 MB for Random Forest.",
            "80/20の層化分割で3つの中で最も精度が高く、デプロイできるほど軽量でした（Random Forestの226 MBに対して3.8 MB）。",
          ),
        },
        {
          title: t("Streamlit Community Cloud", "Streamlit Community Cloud"),
          description: t(
            "Free hosting for a demo anyone can try in the browser.",
            "誰でもブラウザで試せるデモを無料でホストできます。",
          ),
        },
      ],
      sections: [
        {
          id: "evaluation",
          kicker: t("Evaluation", "評価"),
          heading: t("Model comparison, 46,415 test posts", "モデルの比較（テスト投稿46,415件）"),
          facts: [
            { label: t("LightGBM", "LightGBM"), value: t("95% accuracy · 0.95 F1", "精度95% · F1 0.95") },
            { label: t("Random Forest", "Random Forest"), value: t("90% accuracy · 0.90 F1", "精度90% · F1 0.90") },
            { label: t("Naive Bayes", "Naive Bayes"), value: t("84% accuracy · 0.83 F1", "精度84% · F1 0.83") },
          ],
          paragraphs: [
            t(
              "Data: Kaggle Suicide and Depression Detection, 232,074 posts, half suicide and half non-suicide, no missing or duplicate rows. The most frequent bigrams in risk posts were “feel like”, “don't want”, “want die”, “I'm tired” and “I'm scared”.",
              "データはKaggleのSuicide and Depression Detection。232,074件で、半分がsuicide、半分がnon-suicide、欠損や重複はありません。リスクのある投稿で最も多いバイグラムは「feel like」「don't want」「want die」「I'm tired」「I'm scared」でした。",
            ),
          ],
        },
      ],
      results: [
        t(
          "3rd place, Senior Division, Data Royale 2023 (Kotak Riset & DSAI OmahTI, Universitas Gadjah Mada).",
          "Data Royale 2023 シニア部門3位（Kotak Riset & DSAI OmahTI、ガジャマダ大学）。",
        ),
        t(
          "95% accuracy on 46,415 held-out posts.",
          "テスト投稿46,415件で精度95%。",
        ),
      ],
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
        "Upload a face photo, take one with the camera, or pick a dataset example, and the app redraws it as a comic portrait, or turns a comic face back into a photo. A CycleGAN trained on 10,000 photos and 10,000 comic faces.",
        "顔写真をアップロード、カメラで撮影、またはデータセットの例を選ぶと、アプリがコミック風のポートレートに描き直します。コミックから写真への逆変換にも対応。10,000枚の写真と10,000枚のコミック顔で学習したCycleGANです。",
      ),
      problem: t(
        "The model has to change a face's style without losing who it is.",
        "顔が誰なのかを失わずに、画風だけを変える必要があります。",
      ),
      howItWorks: [
        t("Upload, snap or pick a face photo.", "顔写真をアップロード・撮影・選択します。"),
        t("It is cropped to a square and resized for the model.", "正方形に切り抜き、モデル用にリサイズします。"),
        t("A generator redraws it in the other style: photo to comic, or comic to photo.", "生成器がもう一方の画風（写真 → コミック、またはその逆）で描き直します。"),
        t("Download the result as a PNG.", "結果をPNGでダウンロードします。"),
      ],
      decisions: [
        {
          title: t("CycleGAN", "CycleGAN"),
          description: t(
            "Two generators translate in opposite directions; photo → comic → photo must return the original, which keeps the face recognisable.",
            "逆方向に変換する2つの生成器を使い、写真 → コミック → 写真で元に戻るよう学習するため、顔の特徴が保たれます。",
          ),
        },
        {
          title: t("ResNet generators + PatchGAN discriminators", "ResNet生成器 + PatchGAN識別器"),
          description: t(
            "Adversarial, cycle-consistency and identity losses, 50 epochs on Face2Comics v2 at 128 px.",
            "敵対的損失・サイクル一貫性損失・恒等損失で、Face2Comics v2を128 pxで50エポック学習。",
          ),
        },
        {
          title: t("TensorFlow 2.18+ / Keras 3 package", "TensorFlow 2.18+ / Keras 3のパッケージ"),
          description: t(
            "Refactored the Kaggle notebook into a package: fixed swapped domains and loss bugs, added a training CLI and tests.",
            "Kaggleノートブックをパッケージに再構成。ドメインの取り違えや損失のバグを修正し、学習用CLIとテストを追加しました。",
          ),
        },
        {
          title: t("Streamlit on Community Cloud + own VPS", "Streamlit（Community Cloud + 自前のVPS）"),
          description: t(
            "The same app on two hosts; comic.farisznafis.my.id is the VPS version.",
            "同じアプリを2つの環境で公開。comic.farisznafis.my.idはVPS版です。",
          ),
        },
      ],
      results: [
        t(
          "Live photo ↔ comic translator with upload, camera and PNG download.",
          "アップロード・カメラ・PNGダウンロードに対応した、公開中の写真 ↔ コミック変換ツール。",
        ),
        t(
          "Tested codebase that retrains with one command.",
          "1つのコマンドで再学習できる、テスト付きのコードベース。",
        ),
      ],
    },
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
        "Four optimization models built during my data science internship in a 5-member team. The main one assigns 300 sprint tasks to 109 people; three smaller ones cover course selection, stock selection and facility location. All four run from one CLI, in Docker, and in a web demo that re-solves them live.",
        "データサイエンスのインターンで、5人のチームで構築した4つの最適化モデル。メインは300件のスプリントタスクを109人に割り当てるモデルで、ほかに科目選択・銘柄選択・施設配置の3つがあります。4つとも1つのCLI、Docker、そしてその場で再計算するWebデモから実行できます。",
      ),
      problem: t(
        "Assigning 300 tasks to 109 people has far more possible plans than anyone can check, each plan must respect skills, workload limits and project boundaries, and the goals (nobody idle, good skill fit, even workload) pull against each other.",
        "300件のタスクを109人に割り当てる案は人が確認できる数をはるかに超え、各案はスキル・作業量の上限・プロジェクトの境界を守る必要があります。さらに、待機者ゼロ・スキル適合・作業量の均等という目標同士がぶつかります。",
      ),
      howItWorks: [
        t("Load the talents, tasks and the skill levels each task needs.", "人材、タスク、各タスクに必要なスキルレベルを読み込みます。"),
        t("Score how well each person fits each task.", "各人と各タスクの適合度をスコア化します。"),
        t("Write the decision as rules (one person per task, a workload limit) and goals.", "判断をルール（1タスクに1人、作業量の上限）と目標として書き表します。"),
        t("The solver searches the valid plans and returns the best one.", "ソルバーが条件を満たす計画を探索し、最良のものを返します。"),
        t("The web demo shows the plan; change an input and it solves again on the spot.", "Webデモで計画を表示し、入力を変えるとその場で解き直します。"),
      ],
      decisions: [
        {
          title: t("Gurobi (mixed-integer programming)", "Gurobi（混合整数計画）"),
          description: t(
            "Returns a provably optimal plan, or the best found within a time limit on the full dataset.",
            "最適であることが保証された解を返し、フルデータセットでは制限時間内の最良解を使います。",
          ),
        },
        {
          title: t("Goal programming", "目標計画法"),
          description: t(
            "Each goal is solved alone first, then one plan is found that stays closest to all three best values, weighted by priority.",
            "まず各目標を単独で解き、その後3つの最良値すべてにできるだけ近い1つの計画を、優先度の重み付きで求めます。",
          ),
        },
        {
          title: t("OR-Tools CP-SAT", "OR-Tools CP-SAT"),
          description: t(
            "Solves the binary warm-up problems: course selection and the burrito game.",
            "0-1のウォームアップ課題（科目選択、ブリトーゲーム）を解きます。",
          ),
        },
        {
          title: t("Python package + `optim` CLI + Docker", "Pythonパッケージ + `optim` CLI + Docker"),
          description: t(
            "Refactored from Colab notebooks so every model runs the same way locally or in a container; limits, solver settings and weights live in one YAML config.",
            "Colabノートブックから再構成し、ローカルでもコンテナでも同じように動くようにしました。上限・ソルバー設定・重みは1つのYAML設定にまとめています。",
          ),
        },
        {
          title: t("Gradio on Hugging Face Spaces", "Gradio（Hugging Face Spaces）"),
          description: t(
            "Calls the same package, so results are solved live, not cached; CI runs tests and redeploys on every push to main.",
            "CLIと同じパッケージを呼ぶため、結果はキャッシュではなくその場で解かれます。CIはmainへのpushごとにテストと再デプロイを実行します。",
          ),
        },
      ],
      sections: [
        {
          id: "task-assignment",
          kicker: t("Main model", "メインモデル"),
          heading: t("Assigning Scrum tasks with goal programming", "目標計画法によるスクラムタスクの割り当て"),
          paragraphs: [
            t(
              "Every talent gets a skill-matching score for every task. The default, Competency Assessment, weights each competency by how much the task needs it and averages the level gap into a Mean Skill Gap; Weighted Euclidean Distance is an alternative. The model then gives each task to exactly one person, keeps each person on at most one project and within a story-point limit, and minimises idle talents, maximises total skill score and minimises the maximum workload.",
              "すべての人材とタスクの組み合わせにスキル適合スコアを付けます。標準のCompetency Assessmentは、タスクが必要とする度合いで各能力を重み付けし、レベル差を平均してMean Skill Gapを求めます（代替として重み付きユークリッド距離）。その上で、各タスクをちょうど1人に割り当て、各人を最大1プロジェクトかつストーリーポイント上限内に収めながら、待機人材の最小化・スキルスコア合計の最大化・最大作業量の最小化を行います。",
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
          note: t(
            "The public demo uses Gurobi's free size-limited license: task assignment is capped at 2,000 variables (the 5 × 10 mini dataset or small uploads) and 30 seconds per solve. The full 109 × 300 dataset needs a full license.",
            "公開デモはGurobiの無料のサイズ制限付きライセンスで動くため、タスク割り当ては2,000変数（5 × 10のミニデータセットや小さなアップロード）と1回30秒までです。109 × 300のフルデータセットにはフルライセンスが必要です。",
          ),
        },
        {
          id: "challenges",
          kicker: t("Warm-up models", "ウォームアップ課題"),
          heading: t("Three smaller models, three techniques", "3つの小さなモデル、3つの手法"),
          items: [
            {
              title: t("Course selection · binary IP", "科目選択・0-1整数計画"),
              description: t(
                "Exactly 180 credits, at least 120 from computer science, at minimum cost; a weighted variant also penalises exam courses. Both reach a cost of 12,356. OR-Tools CP-SAT.",
                "情報科学120単位以上を含め、ちょうど180単位を最小費用で選択。試験科目にペナルティを課す重み付き版もあり、どちらも費用12,356に到達。OR-Tools CP-SAT。",
              ),
            },
            {
              title: t("Stock selection · MIQCP", "銘柄選択・MIQCP"),
              description: t(
                "Maximise annualised return on USD 10,000 across seven stocks, with at least three stocks, a minimum share each and a 15% quadratic risk cap. Gurobi.",
                "1万ドルを7銘柄に配分し、3銘柄以上・銘柄ごとの最低比率・二次形式のリスク上限15%のもとで年率リターンを最大化。Gurobi。",
              ),
            },
            {
              title: t("Burrito game · facility location", "ブリトーゲーム・施設配置"),
              description: t(
                "Gurobi's Burrito Optimization Game: place trucks so revenue from nearby buildings beats the daily truck cost. Three trucks serve all 14 buildings for a profit of 970. OR-Tools CP-SAT.",
                "GurobiのBurrito Optimization Game。近くの建物からの売上がトラックの日額費用を上回るよう配置。3台で14棟すべてをカバーし、利益は970。OR-Tools CP-SAT。",
              ),
            },
          ],
        },
      ],
      results: [
        t(
          "All four models solved to optimality on their sample data.",
          "4つのモデルすべてを、サンプルデータで最適解まで求解。",
        ),
        t(
          "One task plan that balances idle time, skill fit and workload, instead of three competing plans.",
          "待機・スキル適合・作業量を、競合する3つの案ではなく1つの計画でバランス。",
        ),
      ],
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
    cover: {
      type: "image",
      src: "/projects/himakom-visual/instagram.webp",
      alt: t(
        "Two phones showing the @himakomugm Instagram grid: a feed of cabinet member profiles and a feed of event posts in orange, pink and blue",
        "@himakomugmのInstagramグリッドを表示した2台のスマートフォン：役員紹介のフィードと、オレンジ・ピンク・青のイベント投稿のフィード",
      ),
    },
    gallery: [
      {
        type: "image",
        src: "/projects/himakom-visual/among-tamu.webp",
        alt: t(
          "Among Tamu event kit for the HIMAKOM UGM × HMIF UNDIP visit on 20 November 2022: committee ID card, souvenir plaque and poster",
          "2022年11月20日のHIMAKOM UGM × HMIF UNDIP交流イベント「Among Tamu」のキット：委員のIDカード、記念盾、ポスター",
        ),
        caption: t(
          "Among Tamu, HIMAKOM UGM × HMIF UNDIP (2022): ID card, plaque and poster.",
          "Among Tamu、HIMAKOM UGM × HMIF UNDIP（2022年）：IDカード、記念盾、ポスター。",
        ),
      },
    ],
    initials: "HV",
    tone: "accent",
  },
  {
    id: "rpld-recruitment",
    slug: "rpld-recruitment",
    title: "RPLD Lab Recruitment & Merch",
    year: "2023",
    fields: ["Visual Design"],
    stack: ["Visual Design", "Illustration", "Print Design"],
    summary: t(
      "Open-recruitment guidebook and 2023 crew jacket for the Software Engineering and Data Laboratory (RPLD), with a VR illustration that ties them together.",
      "ソフトウェア工学・データ研究室（RPLD）の募集ガイドブックと2023年のクルージャケット。両方をつなぐVRイラストも制作しました。",
    ),
    featured: false,
    projectOrder: 15,
    hasCaseStudy: false,
    confidentiality: "public",
    links: [],
    cover: {
      type: "image",
      src: "/projects/rpld-recruitment/guidebook.webp",
      alt: t(
        "Pages of the RPLD open-recruitment guidebook in dark navy and neon blue: cover with a VR headset illustration, division pages and contact list",
        "濃紺とネオンブルーのRPLD募集ガイドブックのページ：VRヘッドセットのイラストの表紙、各部門のページ、連絡先",
      ),
      caption: t(
        "The open-recruitment guidebook: one page per division, from web development to VR/AR.",
        "募集ガイドブック。Web開発からVR/ARまで、部門ごとに1ページ。",
      ),
    },
    gallery: [
      {
        type: "image",
        src: "/projects/rpld-recruitment/jacket.webp",
        alt: t(
          "Navy RPLD 2023 jacket, front and back: the back shows a wireframe VR headset and hand with the words Crew, Software Engineering and Data Laboratory",
          "紺色のRPLD 2023ジャケットの前面と背面：背面にはワイヤーフレームのVRヘッドセットと手、Crew、Software Engineering and Data Laboratoryの文字",
        ),
        caption: t(
          "The 2023 crew jacket: VR illustration and layout.",
          "2023年のクルージャケット：VRイラストとレイアウト。",
        ),
      },
    ],
    initials: "RL",
    tone: "amber",
  },
  {
    id: "early-visual-work",
    slug: "early-visual-work",
    title: "Early Visual Work",
    fields: ["Visual Design"],
    stack: ["Visual Design", "Social Media", "Logo Design"],
    summary: t(
      "Earlier design work: the Instagram feed and club logos for Student Club SMAN 1 Depok, plus posters from competitions and school assignments.",
      "初期のデザイン作品：SMAN 1 DepokのStudent ClubのInstagramフィードと部活動ロゴ、コンテストや学校の課題で作ったポスター。",
    ),
    featured: false,
    projectOrder: 16,
    hasCaseStudy: false,
    confidentiality: "public",
    links: [],
    cover: {
      type: "image",
      src: "/projects/early-visual-work/student-club-instagram.webp",
      alt: t(
        "Two phones showing the Student Club SMAN 1 Depok Instagram grid: an illustrated landscape panorama for the 2020/2021 regeneration and an H-3 to H-day countdown",
        "SMAN 1 DepokのStudent ClubのInstagramグリッドを表示した2台のスマートフォン：2020/2021年の代替わりのイラストのパノラマと、当日までのカウントダウン",
      ),
      caption: t(
        "Student Club SMAN 1 Depok on Instagram (2020/2021).",
        "SMAN 1 DepokのStudent ClubのInstagram（2020/2021年）。",
      ),
    },
    gallery: [
      {
        type: "image",
        src: "/projects/early-visual-work/student-club-logos.webp",
        alt: t(
          "Remade round logos for the Student Club subject clubs: geoscience, chemistry, computer, astronomy, biology, economy, mathematics, physics and geography",
          "Student Clubの各部のロゴを作り直した丸いロゴ：地学、化学、コンピューター、天文、生物、経済、数学、物理、地理",
        ),
        caption: t("Student Club logos, remade.", "作り直したStudent Clubのロゴ。"),
      },
      {
        type: "image",
        src: "/projects/early-visual-work/posters.webp",
        alt: t(
          "A collage of posters: an invitation, a historical illustration, an inflation-prediction research poster, a theatre poster and an actuarial science infographic",
          "ポスターのコラージュ：招待状、歴史のイラスト、インフレ予測の研究ポスター、演劇のポスター、アクチュアリー学のインフォグラフィック",
        ),
        caption: t(
          "Posters from competitions and school assignments.",
          "コンテストや学校の課題で作ったポスター。",
        ),
      },
    ],
    initials: "EV",
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
        "Upload a photo, or pick one of 50 samples, and the app highlights the fire, shows how much of the image is on fire, and lets you download the mask. A U-Net running on CPU from a 23 MB ONNX file.",
        "写真をアップロードするか50枚のサンプルから選ぶと、アプリが炎の領域をハイライトし、炎が占める割合を表示します。マスクはダウンロード可能。23 MBのONNXファイルからCPUで動くU-Netです。",
      ),
      problem: t(
        "The first model (v1) was trained on grayscale video frames with no fire-free examples, so it learned that anything bright is fire and flagged sunsets, lamps and bright skies.",
        "最初のモデル（v1）は炎のない例を含まないグレースケールの動画フレームで学習したため、明るいものはすべて炎だと覚え、夕焼け・照明・明るい空まで炎と判定していました。",
      ),
      howItWorks: [
        t("Upload or pick a photo.", "写真をアップロードまたは選択します。"),
        t("The image is resized and normalised.", "画像をリサイズし、正規化します。"),
        t("The U-Net gives every pixel a fire probability.", "U-Netが各ピクセルに炎の確率を付けます。"),
        t("Pixels above the threshold become the fire mask.", "しきい値を超えたピクセルが炎のマスクになります。"),
        t("The app shows the overlay and how much of the image is on fire.", "オーバーレイと、画像のうち炎が占める割合を表示します。"),
      ],
      decisions: [
        {
          title: t("Hard negatives in the data", "紛らわしい負例をデータに追加"),
          description: t(
            "2,683 video frames plus 226 BoWFire photos (sunsets, lamps) and 320 fire-free photos, so the model learns what is not fire.",
            "2,683枚の動画フレームに、夕焼けや照明を含むBoWFireの写真226枚と炎のない写真320枚を加え、炎でないものを学習させました。",
          ),
        },
        {
          title: t("PyTorch U-Net + EfficientNet-B0 encoder", "PyTorch U-Net + EfficientNet-B0エンコーダー"),
          description: t(
            "RGB input and an ImageNet-pretrained encoder (6.3M parameters) instead of grayscale, so colour helps tell fire from bright light.",
            "グレースケールではなくRGB入力と、ImageNetで事前学習したエンコーダー（パラメーター数630万）を使い、色で炎と明るい光を見分けられるようにしました。",
          ),
        },
        {
          title: t("Whole-video holdout", "動画単位のホールドアウト"),
          description: t(
            "Entire videos stay out of training, so near-duplicate frames cannot leak into validation.",
            "動画ごと学習から外し、ほぼ同じフレームが検証に漏れないようにしました。",
          ),
        },
        {
          title: t("ONNX Runtime + Streamlit", "ONNX Runtime + Streamlit"),
          description: t(
            "The app needs no deep-learning framework and runs on CPU; the same app is on Streamlit Community Cloud and on my VPS (fire.farisznafis.my.id).",
            "アプリにディープラーニングのフレームワークは不要で、CPUで動きます。同じアプリをStreamlit Community Cloudと自前のVPS（fire.farisznafis.my.id）で公開しています。",
          ),
        },
      ],
      sections: [
        {
          id: "evaluation",
          kicker: t("Evaluation", "評価"),
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
      ],
      results: [
        t(
          "Fire IoU on unseen photos: 0.18 → 0.81.",
          "未知の写真での炎のIoU：0.18 → 0.81。",
        ),
        t(
          "False alarms on fire-free photos: 58% → 0%.",
          "炎のない写真での誤検出：58% → 0%。",
        ),
      ],
    },
  },
];
