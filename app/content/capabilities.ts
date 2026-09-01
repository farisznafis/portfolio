/**
 * Capabilities domain content — the typographic wall groups (both locales).
 */
import type { CapabilityGroup } from "../types/experience";

export const capabilityGroups: CapabilityGroup[] = [
  {
    title: { en: "Frontend Engineering", ja: "フロントエンドエンジニアリング" },
    skills: [
      { en: "React", ja: "React" },
      { en: "TypeScript", ja: "TypeScript" },
      { en: "Next.js", ja: "Next.js" },
      { en: "Vite", ja: "Vite" },
      { en: "REST APIs", ja: "REST API" },
      { en: "React Router", ja: "React Router" },
      { en: "React Hook Form", ja: "React Hook Form" },
      { en: "Zod", ja: "Zod" },
    ],
  },
  {
    title: { en: "Product & UI/UX", ja: "プロダクト & UI/UX" },
    skills: [
      { en: "Figma", ja: "Figma" },
      { en: "UI/UX Design", ja: "UI/UXデザイン" },
      { en: "User Flows", ja: "ユーザーフロー" },
      { en: "Prototyping", ja: "プロトタイピング" },
      { en: "Responsive Design", ja: "レスポンシブデザイン" },
      { en: "Design Systems", ja: "デザインシステム" },
    ],
  },
  {
    title: { en: "AI & Data", ja: "AI & データ" },
    skills: [
      { en: "Python", ja: "Python" },
      { en: "TensorFlow / Keras", ja: "TensorFlow / Keras" },
      { en: "Machine Learning", ja: "機械学習" },
      { en: "Computer Vision", ja: "コンピュータビジョン" },
      { en: "LLM Data Pipelines", ja: "LLMデータパイプライン" },
      { en: "Librosa", ja: "Librosa" },
      { en: "Gurobi", ja: "Gurobi" },
    ],
  },
  {
    title: { en: "Delivery & Cloud", ja: "デリバリー & クラウド" },
    skills: [
      { en: "Git / GitHub", ja: "Git / GitHub" },
      { en: "Docker", ja: "Docker" },
      { en: "Kubernetes", ja: "Kubernetes" },
      { en: "Google Kubernetes Engine", ja: "Google Kubernetes Engine" },
      { en: "Flask / FastAPI", ja: "Flask / FastAPI" },
    ],
  },
];