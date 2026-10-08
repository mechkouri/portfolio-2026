import { ProjectSlider } from '../components/work/ProjectSlider';
import { Reveal } from '../components/ui/Reveal';
import { Section, SectionHeading, SectionLabel } from '../components/ui/primitives';

export function Work() {
  return (
    <Section id="work" labelledBy="work-title" className="overflow-x-clip">
      <div className="mx-auto max-w-7xl">
        <SectionLabel id="work" />
        <SectionHeading id="work-title" className="mb-3" lines={[{ text: "A selection of things I've built." }]} />
        <Reveal as="p" className="mb-10 max-w-2xl text-slate-600">
          Websites, stores, and apps I've worked on. Swipe, use the arrows, or pick a project below.
        </Reveal>
        <Reveal>
          <ProjectSlider />
        </Reveal>
      </div>
    </Section>
  );
}
