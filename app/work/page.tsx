import type { Metadata } from "next";
import { Projects } from "../components/Projects";
import { PageTransition } from "../components/ui/PageTransition";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects by Faris Znafis: product interfaces, web apps, and interactive experiments built with Next.js, motion design, and 3D.",
};

export default function WorkPage() {
  return (
    <PageTransition>
      <Projects />
    </PageTransition>
  );
}
