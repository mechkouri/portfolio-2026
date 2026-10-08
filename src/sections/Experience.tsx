import { experience } from '../data/content';
import { Timeline } from '../components/ui/Timeline';
import { Reveal } from '../components/ui/Reveal';
import { Section, SectionHeading, SectionLabel } from '../components/ui/primitives';

export function Experience() {
  return (
    <Section id="experience" labelledBy="experience-title">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <SectionLabel id="experience" />
        <SectionHeading id="experience-title" className="mb-4" lines={[{ text: 'Work experience.' }]} />
        <Reveal as="p" className="mb-14 max-w-xl text-slate-600 md:mb-20">
          Internships, agencies, and now a full-stack role at Open Systèmes.
        </Reveal>
        <Timeline entries={experience} />
      </div>
    </Section>
  );
}
