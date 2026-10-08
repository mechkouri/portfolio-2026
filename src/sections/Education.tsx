import { education } from '../data/content';
import { Timeline } from '../components/ui/Timeline';
import { Section, SectionHeading, SectionLabel } from '../components/ui/primitives';

export function Education() {
  return (
    <Section id="education" tone="muted" labelledBy="education-title">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <SectionLabel id="education" />
        <SectionHeading id="education-title" className="mb-16 md:mb-20" lines={[{ text: 'Where I studied.' }]} />
        <Timeline entries={education} />
      </div>
    </Section>
  );
}
