import { PageTransition } from "./components/ui/PageTransition";
import { Hero } from "./components/sections/Hero";
import { Manifesto } from "./components/sections/Manifesto";
import { WorkReel } from "./components/sections/WorkReel";
import { ExperienceChapters } from "./components/sections/ExperienceChapters";
import { Capabilities } from "./components/sections/Capabilities";
import { EducationSection } from "./components/sections/EducationSection";
import { AboutSection } from "./components/sections/AboutSection";
import { LabStrip } from "./components/sections/LabStrip";
import { ContactFinale } from "./components/sections/ContactFinale";

/**
 * The homepage is one continuous act-based journey:
 * hero → manifesto → selected work (horizontal reel) → experience chapters
 * → capabilities wall → education/recognition → about/interests
 * → lab ticker → contact finale.
 */
export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <Manifesto />
      <WorkReel />
      <ExperienceChapters />
      <Capabilities />
      <EducationSection />
      <AboutSection />
      <LabStrip />
      <ContactFinale />
    </PageTransition>
  );
}