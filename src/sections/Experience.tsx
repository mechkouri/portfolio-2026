import { useLang } from '../i18n/LangProvider';
import { Timeline } from '../components/ui/Timeline';
import { Reveal } from '../components/ui/Reveal';
import { Section, SectionHeading, SectionLabel } from '../components/ui/primitives';

export function Experience() {
  const { t, content } = useLang();
  return (
    <Section id="experience" labelledBy="experience-title">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <SectionLabel id="experience" />
        <SectionHeading id="experience-title" className="mb-4" lines={[{ text: t.experience.heading }]} />
        <Reveal as="p" className="mb-14 max-w-xl text-slate-600 md:mb-20">
          {t.experience.intro}
        </Reveal>
        <Timeline entries={content.experience} />
      </div>
    </Section>
  );
}
