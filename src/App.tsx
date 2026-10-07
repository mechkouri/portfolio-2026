import { MotionConfig } from 'motion/react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/hero/Hero';
import { Intro } from './sections/Intro';
import { Services } from './sections/Services';
import { Automation } from './sections/Automation';
import { Work } from './sections/Work';
import { Process } from './sections/Process';
import { Tech } from './sections/Tech';
import { Experience } from './sections/Experience';
import { About } from './sections/About';
import { Contact } from './sections/Contact';

export default function App() {
  return (
    // "user" honours prefers-reduced-motion: transforms are skipped, opacity fades remain.
    <MotionConfig reducedMotion="user">
      <Header />
      <main id="main" tabIndex={-1} className="flex min-h-screen w-full flex-col pt-16 outline-none">
        <Hero />
        <Intro />
        <Services />
        <Automation />
        <Work />
        <Process />
        <Tech />
        <Experience />
        <About />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
