import { useLang } from '../i18n/LangProvider';
import { ProjectSlider } from '../components/work/ProjectSlider';
import { Reveal } from '../components/ui/Reveal';
import { Section, SectionHeading, SectionLabel } from '../components/ui/primitives';

export function Work() {
  const { t } = useLang();
  return (
    <Section id="work" labelledBy="work-title">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <ProjectSlider
            header={
              <>
                <SectionLabel id="work" />
                <SectionHeading id="work-title" lines={[{ text: t.work.heading }]} />
                <p className="mt-2 max-w-2xl text-slate-600">
                  {t.work.intro}
                </p>
              </>
            }
          />
        </Reveal>
      </div>
    </Section>
  );
}
