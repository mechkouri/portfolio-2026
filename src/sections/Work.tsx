import { ProjectSlider } from '../components/work/ProjectSlider';
import { Reveal } from '../components/ui/Reveal';
import { Section, SectionHeading, SectionLabel } from '../components/ui/primitives';

export function Work() {
  return (
    <Section id="work" labelledBy="work-title">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <ProjectSlider
            header={
              <>
                <SectionLabel id="work" />
                <SectionHeading id="work-title" lines={[{ text: "A selection of things I've built." }]} />
                <p className="mt-2 max-w-2xl text-slate-600">
                  Websites, stores, and apps I've worked on. Slide through them, and hover a card to scroll the full page.
                </p>
              </>
            }
          />
        </Reveal>
      </div>
    </Section>
  );
}
