import type { Metadata } from "next";
import { Experience } from "../components/Experience";
import { PageTransition } from "../components/ui/PageTransition";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "The professional journey of Faris Znafis — from freelance MVPs to leading frontend on products used by hundreds of teams.",
};

export default function ExperiencePage() {
  return (
    <PageTransition>
      <Experience />
    </PageTransition>
  );
}
