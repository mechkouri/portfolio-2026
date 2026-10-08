import { experience } from '../data/content';
import { Timeline } from '../components/ui/Timeline';
import { Section, SectionHeading, SectionLabel } from '../components/ui/primitives';

export function Experience() {
  return (
    <Section id="experience" labelledBy="experience-title">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <SectionLabel id="experience" />
        <SectionHeading id="experience-title" className="mb-16 md:mb-20" lines={[{ text: 'Work experience.' }]} />
        <Timeline entries={experience} />
      </div>
    </Section>
  );
}
