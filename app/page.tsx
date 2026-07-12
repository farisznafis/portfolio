import { Hero } from "./components/Hero";
import { PageTransition } from "./components/ui/PageTransition";

export default function Home() {
  return (
    <PageTransition>
      <Hero />
    </PageTransition>
  );
}
