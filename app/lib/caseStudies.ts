/**
 * Per-project case study copy - English (en) and Japanese (ja).
 * Split from content.ts to keep each dictionary manageable.
 *
 * Accuracy rules: no invented metrics, employers, or links. Outcomes state
 * only what is known to be true. Confidential projects describe contribution
 * at a high level without internal implementation details.
 */
import type { CaseStudy } from "./content";
import type { CaseStudyKey } from "./data";

export const caseStudiesEn: Record<CaseStudyKey, CaseStudy> = {
  "carbon-monitoring": {
    overview:
      "A B2B carbon monitoring SaaS built in a 5-member team. I worked across UI/UX and frontend engineering: role-based workflows for Admin, Master, and User, a 4-step onboarding flow, and the REST API integrations that power them.",
    atAGlance: "Project at a glance",
    challenge: {
      heading: "One product, three kinds of user",
      lead: "Admins, Masters, and Users each see the same product differently — different dashboards, different permissions, different next steps. The interface had to keep all three coherent without becoming three separate apps.",
      body: "The deeper difficulty sat in the business forms. Companies onboard through a 4-step flow — company and personal information, methodology and equipment, confirmation, completion — where every field feeds downstream calculations. Weak validation here would poison the data the whole product depends on.",
    },
    approach: {
      kicker: "Approach",
      heading: "Roles, a guided onboarding, and forms that refuse bad data",
      steps: [
        {
          tag: "Workflows",
          title: "Role-based routing and protected views",
          description:
            "Each role lands in its own workspace. Protected routes and role-aware navigation keep the Admin, Master, and User flows separate while sharing one design system.",
        },
        {
          tag: "Onboarding",
          title: "A 4-step path from signup to first use",
          description:
            "Company and personal information, methodology and equipment, confirmation, completion. Each step explains what it needs and why, so a complex registration never feels like a wall of forms.",
        },
        {
          tag: "Engineering",
          title: "Validation and state that survive complexity",
          description:
            "React Hook Form paired with Zod schemas validates business rules before anything reaches the API, while Zustand keeps cross-step state predictable.",
        },
      ],
    },
    features: {
      heading: "What shipped",
      items: [
        {
          title: "Role-based dashboards",
          description:
            "Admin, Master, and User each get workflows shaped to their responsibilities, behind protected routes.",
        },
        {
          title: "4-step onboarding",
          description:
            "Company & personal information, methodology & equipment, confirmation, completion — a guided path instead of one intimidating form.",
        },
        {
          title: "Validated business forms",
          description:
            "Complex fields are checked against Zod schemas at the edge of the UI, so bad data never reaches the API.",
        },
        {
          title: "REST API integration",
          description:
            "Dashboards and workflows are wired to the API layer with typed request handling.",
        },
      ],
    },
    galleryLabel: "Gallery",
    outcomes: {
      kicker: "Outcomes",
      heading: "What changed",
      items: [
        "Role-based workflows shipped for Admin, Master, and User.",
        "The 4-step onboarding flow takes a company from registration to first use.",
        "Complex methodology and equipment forms validate before submission.",
        "Delivered as a 5-member engineering team.",
      ],
    },
    nextLabel: "Next project",
  },
  kumamotalk: {
    overview:
      "An interactive AI conversation bot built for Kumamoto EXPO 2025 in a 3-person team. I designed and implemented the frontend — face-detection-driven reactions and microphone-aware interactions — and the bot was used by 80+ visitors at the event.",
    atAGlance: "Project at a glance",
    challenge: {
      heading: "A bot that has to work in a noisy hall",
      lead: "Expo visitors walk up cold: no manual, no patience, one chance to understand what this thing does. The interface had to invite a conversation and show its state at a glance — listening, thinking, speaking.",
      body: "Everything had to run in the browser on event hardware. Face detection had to feel responsive rather than eerie, and the microphone flow had to handle permission and recording states without ever stranding a visitor.",
    },
    approach: {
      kicker: "Approach",
      heading: "Design the conversation, then engineer the senses",
      steps: [
        {
          tag: "Interface",
          title: "A conversation UI built for a booth",
          description:
            "I designed the interaction flow for walk-up visitors: large states, obvious affordances, and a dialogue layout that reads from a distance.",
        },
        {
          tag: "Perception",
          title: "Face detection as feedback, not surveillance",
          description:
            "face-api.js and TensorFlow.js run in the browser so the bot can react to the visitor in front of it — attention drives the conversation's rhythm.",
        },
        {
          tag: "Voice",
          title: "A microphone flow with no dead ends",
          description:
            "react-mic drives the recording states with explicit status feedback: requesting permission, listening, processing — every state visible.",
        },
      ],
    },
    features: {
      heading: "What shipped",
      items: [
        {
          title: "Face-aware interactions",
          description:
            "Browser-based face detection lets the bot respond to the visitor standing in front of it.",
        },
        {
          title: "Microphone-aware flow",
          description:
            "Recording and permission states are explicit, so visitors always know what the bot is doing.",
        },
        {
          title: "Expo-ready interface",
          description:
            "Designed for walk-up use: legible at distance, forgiving of first-time users.",
        },
        {
          title: "3-person delivery",
          description:
            "Designed and implemented the frontend within a 3-person team.",
        },
      ],
    },
    galleryLabel: "Gallery",
    outcomes: {
      kicker: "Outcomes",
      heading: "What changed",
      items: [
        "Used by 80+ visitors at Kumamoto EXPO 2025.",
        "Face detection and microphone handling run entirely in the browser.",
        "The frontend — UI/UX design and implementation — was my contribution within the 3-person team.",
      ],
    },
    nextLabel: "Next project",
  },
  "makomti-recruitment": {
    overview:
      "A recruitment website of roughly 21 pages, designed for desktop and mobile in a 3-person team, with supporting visual assets extending it into a recruitment campaign.",
    atAGlance: "Project at a glance",
    challenge: {
      heading: "Twenty-one pages, one voice",
      lead: "A recruitment site has to carry company story, roles, process, and FAQ without losing a consistent voice — and every page has to work on a phone, where most candidates will first meet it.",
      body: "The scale was the challenge: roughly 21 interconnected pages that had to feel like one product. Layout decisions had to repeat cheaply, and the visual language had to stretch from the site itself into campaign materials.",
    },
    approach: {
      kicker: "Approach",
      heading: "A page system first, campaign assets second",
      steps: [
        {
          tag: "System",
          title: "Templates before pages",
          description:
            "Defined repeating page patterns — hero, content, listing, detail — so ~21 pages compose from a small set of layouts instead of 21 bespoke designs.",
        },
        {
          tag: "Responsive",
          title: "Desktop and mobile as equals",
          description:
            "Every layout was designed for both breakpoints from the start, keeping hierarchy and readability intact on small screens.",
        },
        {
          tag: "Campaign",
          title: "Visuals that outlive the viewport",
          description:
            "Supporting recruitment visuals extended the site's identity into campaign materials, keeping one visual voice across touchpoints.",
        },
      ],
    },
    features: {
      heading: "What shipped",
      items: [
        {
          title: "~21-page architecture",
          description:
            "A complete recruitment journey — story, roles, process — organized as a coherent page system.",
        },
        {
          title: "Desktop & mobile design",
          description:
            "Both breakpoints designed together, not ported after the fact.",
        },
        {
          title: "Campaign visual assets",
          description:
            "Recruitment visuals that carry the same identity beyond the website.",
        },
        {
          title: "3-person team",
          description:
            "Designed within a 3-person team, with shared ownership of the system.",
        },
      ],
    },
    galleryLabel: "Gallery",
    outcomes: {
      kicker: "Outcomes",
      heading: "What changed",
      items: [
        "A complete recruitment flow across roughly 21 pages.",
        "Consistent desktop and mobile layouts across the site.",
        "Visual assets extended the recruitment site into campaign materials.",
      ],
    },
    nextLabel: "Next project",
  },
  "speech-emotion": {
    overview:
      "An audio emotion recognition system: ZCR, RMS, and MFCC features extracted with Librosa, classified by a TensorFlow/Keras model into six emotions, and served through a Streamlit interface.",
    atAGlance: "Project at a glance",
    challenge: {
      heading: "Reading feeling from a waveform",
      lead: "Emotion hides in signal shape, not words. The model had to learn from raw audio features — zero-crossing rate, RMS energy, MFCCs — and separate six classes that overlap even for human listeners.",
      body: "The pipeline had to stay honest end to end: consistent feature extraction, a model that generalizes beyond its training recordings, and an interface that lets anyone test it without touching Python.",
    },
    approach: {
      kicker: "Approach",
      heading: "Features first, then a classifier, then a face for it",
      steps: [
        {
          tag: "Features",
          title: "ZCR, RMS, and MFCC extraction",
          description:
            "Librosa extracts the signal features that carry prosody — energy, rhythm, spectral shape — into a representation a model can learn from.",
        },
        {
          tag: "Model",
          title: "A TensorFlow/Keras classifier for six emotions",
          description:
            "A Keras network maps extracted features to six classes: neutral, happy, sad, angry, fear, and disgust.",
        },
        {
          tag: "Interface",
          title: "Streamlit as the product surface",
          description:
            "A Streamlit app wraps the pipeline so recordings can be classified interactively — no code required.",
        },
      ],
    },
    features: {
      heading: "What shipped",
      items: [
        {
          title: "Signal-level features",
          description:
            "ZCR, RMS, and MFCC extraction with Librosa captures how something is said, not what.",
        },
        {
          title: "Six-class classifier",
          description:
            "A TensorFlow/Keras model separates neutral, happy, sad, angry, fear, and disgust.",
        },
        {
          title: "Streamlit interface",
          description:
            "The full pipeline is usable through a simple app, from audio in to emotion out.",
        },
        {
          title: "Reproducible data handling",
          description:
            "NumPy and Pandas keep feature and dataset handling consistent end to end.",
        },
      ],
    },
    galleryLabel: "Gallery",
    outcomes: {
      kicker: "Outcomes",
      heading: "What changed",
      items: [
        "Classifies speech into six emotion categories.",
        "Feature extraction, training, and inference share one Python stack.",
        "The Streamlit interface makes the model usable without any code.",
      ],
    },
    nextLabel: "Next project",
  },
  financify: {
    overview:
      "A Bangkit capstone project: an LSTM model forecasting inflation across Indonesian cities and periods, served through a Flask application layer that the team's mobile app consumes.",
    atAGlance: "Project at a glance",
    challenge: {
      heading: "Forecasting an economy, city by city",
      lead: "Inflation moves differently in every Indonesian city and every period. A single global curve would be useless — the model had to learn temporal patterns per city and serve them through an interface other teams could build on.",
      body: "As the machine-learning engineer, my work sat between data and product: prepare the series, design an LSTM that respects their sequence structure, and expose forecasts through a Flask layer the mobile team could integrate.",
    },
    approach: {
      kicker: "Approach",
      heading: "Series in, forecasts out, API in between",
      steps: [
        {
          tag: "Data",
          title: "Indonesian inflation series, prepared",
          description:
            "City-level inflation data cleaned and shaped with Pandas into sequences the model can learn from.",
        },
        {
          tag: "Model",
          title: "An LSTM for temporal patterns",
          description:
            "A TensorFlow/Keras LSTM learns the sequence structure of inflation across cities and forecast periods.",
        },
        {
          tag: "Delivery",
          title: "Flask and Docker as the handoff",
          description:
            "A Flask application layer exposes predictions, packaged with Docker so the team's mobile app integrates against a stable interface.",
        },
      ],
    },
    features: {
      heading: "What shipped",
      items: [
        {
          title: "LSTM forecasting",
          description: "Sequence modeling tuned to inflation's temporal structure.",
        },
        {
          title: "Multi-city coverage",
          description:
            "Forecasts across Indonesian cities and periods, not one aggregate curve.",
        },
        {
          title: "Flask application layer",
          description:
            "Predictions served through an API the rest of the team builds on.",
        },
        {
          title: "Docker packaging",
          description: "The service ships in a container, ready for deployment.",
        },
      ],
    },
    galleryLabel: "Gallery",
    outcomes: {
      kicker: "Outcomes",
      heading: "What changed",
      items: [
        "Forecasts inflation across Indonesian cities and periods.",
        "Built within the Bangkit Machine Learning learning-path team.",
        "The Flask layer lets the team's mobile application consume the model.",
      ],
      // TODO_REAL_CONTENT: "Top 50 Product-based Capstone Projects" —
      // display only if verified against existing CV/portfolio data.
    },
    nextLabel: "Next project",
  },
};

export const caseStudiesJa: Record<CaseStudyKey, CaseStudy> = {
  "carbon-monitoring": {
    overview:
      "5人のチームで開発したB2B向けカーボンモニタリングSaaS。Admin・Master・Userのロール別ワークフロー、4ステップのオンボーディングフロー、そしてそれらを支えるREST API連携を、UI/UXとフロントエンドの両面で担当しました。",
    atAGlance: "プロジェクト概要",
    challenge: {
      heading: "一つのプロダクト、三種類のユーザー",
      lead: "Admin・Master・Userは、同じプロダクトをそれぞれ違う目線で使います。ダッシュボードも権限も次のアクションも異なる三つの役割を、別々のアプリに分けることなく一つの体験として保つ必要がありました。",
      body: "より難しいのは業務フォームでした。企業は4ステップのオンボーディング — 会社・個人情報、手法と機材情報、確認、完了 — を通じて登録され、入力された項目は下流の計算すべてを支えます。ここでバリデーションが甘ければ、プロダクト全体のデータが汚れてしまいます。",
    },
    approach: {
      kicker: "アプローチ",
      heading: "ロール設計、ガイド付きオンボーディング、不正データを拒むフォーム",
      steps: [
        {
          tag: "ワークフロー",
          title: "ロール別ルーティングと保護されたビュー",
          description:
            "各ロールは専用のワークスペースに着地します。保護されたルートとロールを意識したナビゲーションで、Admin・Master・Userのフローを分離しつつ、一つのデザインシステムを共有します。",
        },
        {
          tag: "オンボーディング",
          title: "登録から初回利用までの4ステップ",
          description:
            "会社・個人情報、手法と機材情報、確認、完了。各ステップが何を・なぜ必要とするかを説明し、複雑な登録をフォームの壁に感じさせません。",
        },
        {
          tag: "エンジニアリング",
          title: "複雑さに耐えるバリデーションと状態管理",
          description:
            "React Hook FormとZodスキーマの組み合わせで、APIに届く前に業務ルールを検証。Zustandでステップをまたぐ状態を予測可能に保ちます。",
        },
      ],
    },
    features: {
      heading: "実装したもの",
      items: [
        {
          title: "ロール別ダッシュボード",
          description:
            "Admin・Master・Userそれぞれの責務に合わせたワークフローを、保護されたルートの背後に提供します。",
        },
        {
          title: "4ステップのオンボーディング",
          description:
            "会社・個人情報、手法と機材情報、確認、完了。一枚の巨大なフォームではなく、ガイドされた経路として設計。",
        },
        {
          title: "検証済みの業務フォーム",
          description:
            "複雑な入力はUIの入り口でZodスキーマにより検証され、不正なデータはAPIに届きません。",
        },
        {
          title: "REST API連携",
          description:
            "ダッシュボードとワークフローを、型付きのリクエスト処理でAPI層に接続しました。",
        },
      ],
    },
    galleryLabel: "ギャラリー",
    outcomes: {
      kicker: "成果",
      heading: "変わったこと",
      items: [
        "Admin・Master・User向けのロール別ワークフローをリリース。",
        "4ステップのオンボーディングが、企業を登録から初回利用まで導きます。",
        "複雑な手法・機材フォームは送信前に検証されます。",
        "5人のエンジニアリングチームとして納品しました。",
      ],
    },
    nextLabel: "次のプロジェクト",
  },
  kumamotalk: {
    overview:
      "熊本EXPO 2025向けに3人のチームで開発した対話型AI会話ボット。顔検出に反応するインタラクションとマイクの状態を反映したUIを設計・実装し、来場者80名以上に利用されました。",
    atAGlance: "プロジェクト概要",
    challenge: {
      heading: "賑やかな会場で動くボット",
      lead: "EXPOの来場者は何の予備知識もなく、待つ気力もなく、一度きりの機会で近づいてきます。インターフェースは会話への招待であり、状態 — 聴いている・考えている・話している — が一目で分かる必要がありました。",
      body: "すべては会場のハードウェア上のブラウザで動く必要がありました。顔検出は不気味ではなく反応良く感じられること、マイクのフローは権限や録音状態を扱いながら、来場者を迷子にしないことが求められました。",
    },
    approach: {
      kicker: "アプローチ",
      heading: "会話をデザインし、そのあとに感覚を実装する",
      steps: [
        {
          tag: "インターフェース",
          title: "ブースのために設計した会話UI",
          description:
            "立ち寄った来場者を想定したインタラクションフローをデザインしました。大きな状態表示、分かりやすい操作、離れた場所からも読める対話レイアウトです。",
        },
        {
          tag: "認識",
          title: "監視ではなく、フィードバックとしての顔検出",
          description:
            "face-api.jsとTensorFlow.jsをブラウザ内で動かし、ボットが目の前の来場者の存在に反応できるように。視線が会話のリズムを駆動します。",
        },
        {
          tag: "音声",
          title: "行き止まりのないマイクフロー",
          description:
            "react-micで録音状態を駆動し、権限の要求・聴き取り・処理のすべての状態を明示的に表示します。",
        },
      ],
    },
    features: {
      heading: "実装したもの",
      items: [
        {
          title: "顔を意識したインタラクション",
          description:
            "ブラウザ内の顔検出により、ボットが目の前の来場者に反応します。",
        },
        {
          title: "マイクを意識したフロー",
          description:
            "録音と権限の状態が明示され、来場者は常にボットの状態を把握できます。",
        },
        {
          title: "EXPOで使えるインターフェース",
          description:
            "立ち寄り利用を想定した設計。距離からでも読め、初見のユーザーにも寛容です。",
        },
        {
          title: "3人での納品",
          description: "3人のチーム内でフロントエンドの設計と実装を担当しました。",
        },
      ],
    },
    galleryLabel: "ギャラリー",
    outcomes: {
      kicker: "成果",
      heading: "変わったこと",
      items: [
        "熊本EXPO 2025で来場者80名以上に利用されました。",
        "顔検出とマイク処理はすべてブラウザ内で完結します。",
        "フロントエンド — UI/UXデザインと実装 — は3人チームの中で私の担当でした。",
      ],
    },
    nextLabel: "次のプロジェクト",
  },
  "makomti-recruitment": {
    overview:
      "約21ページで構成される採用サイトを、3人のチームでデスクトップとモバイル向けにデザイン。サイトのビジュアルを引き継ぐ採用キャンペーン素材も制作しました。",
    atAGlance: "プロジェクト概要",
    challenge: {
      heading: "21ページ、一つの声",
      lead: "採用サイトは会社のストーリー・職種・プロセス・FAQを、一貫した声を失わずに運ばなければなりません。しかも候補者が最初に触れるのは、ほとんどの場合スマートフォンの画面です。",
      body: "難しさは規模にありました。約21ページが相互に接続され、一つのプロダクトとして感じられる必要があります。レイアウトの判断は安価に繰り返せ、ビジュアル言語はサイトからキャンペーン素材まで伸びる必要がありました。",
    },
    approach: {
      kicker: "アプローチ",
      heading: "まずページシステム、そのあとにキャンペーン素材",
      steps: [
        {
          tag: "システム",
          title: "ページの前にテンプレート",
          description:
            "ヒーロー・コンテンツ・一覧・詳細といった繰り返しのページパターンを定義し、約21ページを少数のレイアウトの組み合わせとして構成。21個の個別デザインにはしません。",
        },
        {
          tag: "レスポンシブ",
          title: "デスクトップとモバイルは対等",
          description:
            "すべてのレイアウトを最初から両ブレークポイントで設計し、小さな画面でも階層と可読性を保ちます。",
        },
        {
          tag: "キャンペーン",
          title: "ビューポートの外まで生きるビジュアル",
          description:
            "採用ビジュアルがサイトのアイデンティティをキャンペーン素材へ引き継ぎ、接点を越えて一つのビジュアルの声を保ちます。",
        },
      ],
    },
    features: {
      heading: "実装したもの",
      items: [
        {
          title: "約21ページの情報設計",
          description:
            "ストーリー・職種・プロセスを一貫したページシステムとして編成した、完全な採用ジャーニー。",
        },
        {
          title: "デスクトップ & モバイルデザイン",
          description: "両ブレークポイントを同時に設計。後付けの移植ではありません。",
        },
        {
          title: "キャンペーンビジュアル素材",
          description: "ウェブサイトと同じアイデンティティを運ぶ採用ビジュアル。",
        },
        {
          title: "3人のチーム",
          description: "3人のチーム内でデザインを担当し、システムの所有権を共有しました。",
        },
      ],
    },
    galleryLabel: "ギャラリー",
    outcomes: {
      kicker: "成果",
      heading: "変わったこと",
      items: [
        "約21ページにわたる完全な採用フロー。",
        "サイト全体で一貫したデスクトップ・モバイルレイアウト。",
        "ビジュアル素材が採用サイトをキャンペーン素材へ拡張しました。",
      ],
    },
    nextLabel: "次のプロジェクト",
  },
  "speech-emotion": {
    overview:
      "音声の感情認識システム。LibrosaでZCR・RMS・MFCCの特徴量を抽出し、TensorFlow/Kerasモデルが6つの感情に分類、Streamlitのインターフェースから利用できます。",
    atAGlance: "プロジェクト概要",
    challenge: {
      heading: "波形から感情を読む",
      lead: "感情は言葉ではなく信号の形に宿ります。モデルはゼロ交差率・RMSエネルギー・MFCCといった生の音声特徴から学び、人間の聴き手ですら重なり合う6つのクラスを分離しなければなりませんでした。",
      body: "パイプラインは終端まで誠実である必要がありました。一貫した特徴抽出、学習録音を超えて一般化するモデル、そして誰もがPythonに触れずに試せるインターフェースです。",
    },
    approach: {
      kicker: "アプローチ",
      heading: "まず特徴量、次に分類器、そして顔となるUI",
      steps: [
        {
          tag: "特徴量",
          title: "ZCR・RMS・MFCCの抽出",
          description:
            "Librosaが韻律を運ぶ信号特徴 — エネルギー・リズム・スペクトルの形 — を、モデルが学べる表現へ抽出します。",
        },
        {
          tag: "モデル",
          title: "6感情を分けるTensorFlow/Keras分類器",
          description:
            "Kerasネットワークが抽出された特徴を6クラス — neutral・happy・sad・angry・fear・disgust — へマッピングします。",
        },
        {
          tag: "インターフェース",
          title: "プロダクトの表面としてのStreamlit",
          description:
            "Streamlitアプリがパイプラインを包み込み、録音を対話的に分類できます。コードは不要です。",
        },
      ],
    },
    features: {
      heading: "実装したもの",
      items: [
        {
          title: "信号レベルの特徴量",
          description:
            "LibrosaによるZCR・RMS・MFCC抽出が、何が言われたかではなくどう言われたかを捉えます。",
        },
        {
          title: "6クラス分類器",
          description:
            "TensorFlow/Kerasモデルがneutral・happy・sad・angry・fear・disgustを分離します。",
        },
        {
          title: "Streamlitインターフェース",
          description:
            "音声入力から感情出力まで、パイプライン全体をシンプルなアプリから利用できます。",
        },
        {
          title: "再現可能なデータ処理",
          description:
            "NumPyとPandasが特徴量とデータセットの処理を終端まで一貫させます。",
        },
      ],
    },
    galleryLabel: "ギャラリー",
    outcomes: {
      kicker: "成果",
      heading: "変わったこと",
      items: [
        "音声を6つの感情カテゴリに分類します。",
        "特徴抽出・学習・推論が一つのPythonスタックを共有します。",
        "Streamlitインターフェースにより、コードなしでモデルを利用できます。",
      ],
    },
    nextLabel: "次のプロジェクト",
  },
  financify: {
    overview:
      "Bangkitのキャップストーンプロジェクト。LSTMモデルがインドネシア各都市・各期間のインフレを予測し、Flaskのアプリケーション層を通じてチームのモバイルアプリが消費します。",
    atAGlance: "プロジェクト概要",
    challenge: {
      heading: "都市ごとに読む経済",
      lead: "インフレは都市ごと、期間ごとに異なる動きをします。一本の全体曲線では役に立ちません。モデルは都市ごとの時系列パターンを学び、他のチームがその上に構築できる形で予測を提供する必要がありました。",
      body: "機械学習エンジニアとして、私の仕事はデータとプロダクトの間にありました。時系列を整え、その系列構造を尊重するLSTMを設計し、Flask層を通じてモバイルチームが統合できる予測を公開することです。",
    },
    approach: {
      kicker: "アプローチ",
      heading: "系列を入れ、予測を出し、間にAPIを置く",
      steps: [
        {
          tag: "データ",
          title: "整えられたインドネシアのインフレ系列",
          description:
            "Pandasで都市レベルのインフレデータを清掃・整形し、モデルが学べる系列へ変換します。",
        },
        {
          tag: "モデル",
          title: "時系列パターンを学ぶLSTM",
          description:
            "TensorFlow/KerasのLSTMが、都市と予測期間をまたぐインフレの系列構造を学習します。",
        },
        {
          tag: "デリバリー",
          title: "引き継ぎとしてのFlaskとDocker",
          description:
            "Flaskのアプリケーション層が予測を公開し、Dockerでパッケージ化。モバイルチームは安定したインターフェースに対して統合できます。",
        },
      ],
    },
    features: {
      heading: "実装したもの",
      items: [
        {
          title: "LSTMによる予測",
          description: "インフレの時系列構造に合わせた系列モデリング。",
        },
        {
          title: "複数都市のカバー",
          description:
            "一本の集計曲線ではなく、インドネシアの都市と期間をまたぐ予測。",
        },
        {
          title: "Flaskアプリケーション層",
          description:
            "チームの他のメンバーがその上に構築できるAPIを通じて予測を提供。",
        },
        {
          title: "Dockerパッケージング",
          description: "サービスはコンテナに梱包され、デプロイの準備ができています。",
        },
      ],
    },
    galleryLabel: "ギャラリー",
    outcomes: {
      kicker: "成果",
      heading: "変わったこと",
      items: [
        "インドネシアの都市と期間をまたぐインフレ予測。",
        "Bangkitの機械学習ラーニングパスチーム内で構築。",
        "Flask層により、チームのモバイルアプリケーションがモデルを利用できます。",
      ],
      // TODO_REAL_CONTENT: "Top 50 Product-based Capstone Projects" —
      // display only if verified against existing CV/portfolio data.
    },
    nextLabel: "次のプロジェクト",
  },
};