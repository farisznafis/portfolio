import type { Metadata } from "next";
import { About } from "../components/About";
import { PageTransition } from "../components/ui/PageTransition";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Faris Znafis — a creative frontend engineer obsessed with motion, 3D, and product UI that moves with intent.",
};

export default function AboutPage() {
  return (
    <PageTransition>
      <About />
    </PageTransition>
  );
}
