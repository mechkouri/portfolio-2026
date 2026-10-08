import type { ComponentType } from 'react';
import { MotionConfig } from 'motion/react';
import { sections, type SectionId } from './data/content';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Telemetry } from './components/layout/Telemetry';
import { Hero } from './components/hero/Hero';
import { Experience } from './sections/Experience';
import { Work } from './sections/Work';
import { Services } from './sections/Services';
import { Automation } from './sections/Automation';
import { About } from './sections/About';
import { Skills } from './sections/Skills';
import { Education } from './sections/Education';
import { Contact } from './sections/Contact';

// Rendered in the order defined by `sections`, so numbering, nav and backgrounds always match the page.
const sectionComponents: Record<SectionId, ComponentType> = {
  experience: Experience,
  work: Work,
  services: Services,
  automation: Automation,
  about: About,
  skills: Skills,
  education: Education,
  contact: Contact,
};

export default function App() {
  return (
    // "user" honours prefers-reduced-motion: transforms are skipped, opacity fades remain.
    <MotionConfig reducedMotion="user">
      <Header />
      <Telemetry />
      <main id="main" tabIndex={-1} className="flex min-h-screen w-full flex-col pt-16 outline-none">
        <Hero />
        {sections.map(({ id }) => {
          const SectionComponent = sectionComponents[id];
          return <SectionComponent key={id} />;
        })}
      </main>
      <Footer />
    </MotionConfig>
  );
}
