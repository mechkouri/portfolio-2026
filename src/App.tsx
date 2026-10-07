import type { ComponentType } from 'react';
import { MotionConfig } from 'motion/react';
import { sections, type SectionId } from './data/content';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/hero/Hero';
import { Services } from './sections/Services';
import { Automation } from './sections/Automation';
import { Work } from './sections/Work';
import { Process } from './sections/Process';
import { Tech } from './sections/Tech';
import { Experience } from './sections/Experience';
import { About } from './sections/About';
import { Contact } from './sections/Contact';

// Rendered in the order defined by `sections`, so numbering and nav always match the page.
const sectionComponents: Record<SectionId, ComponentType> = {
  work: Work,
  services: Services,
  automation: Automation,
  process: Process,
  experience: Experience,
  tech: Tech,
  about: About,
  contact: Contact,
};

export default function App() {
  return (
    // "user" honours prefers-reduced-motion: transforms are skipped, opacity fades remain.
    <MotionConfig reducedMotion="user">
      <Header />
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
