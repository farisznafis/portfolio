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

import { getStoredProjects } from "./lib/data/projects";

export default async function Home() {
  const projects = await getStoredProjects();

  return (
    <PageTransition>
      <Hero />
      <Manifesto />

      <WorkReel projects={projects} />

      <ExperienceChapters />
      <Capabilities />
      <EducationSection />
      <AboutSection />
      <LabStrip />
      <ContactFinale />
    </PageTransition>
  );
}