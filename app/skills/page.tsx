import type { Metadata } from "next";
import { Skills } from "../components/Skills";
import { PageTransition } from "../components/ui/PageTransition";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Technical skills of Faris Znafis: React, Next.js, TypeScript, Tailwind CSS, Framer Motion, GSAP, Three.js, and more.",
};

export default function SkillsPage() {
  return (
    <PageTransition>
      <Skills />
    </PageTransition>
  );
}
