import { Hero } from "./components/Hero";
import { ScrollScene } from "./components/home/ScrollScene";
import { PageTransition } from "./components/ui/PageTransition";

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <ScrollScene />
    </PageTransition>
  );
}
