import { ArrowRight, Check, Minus, ShieldCheck } from 'lucide-react';
import { useLang } from '../i18n/LangProvider';
import { Reveal, Stagger, StaggerItem } from '../components/ui/Reveal';
import { Section, SectionHeading, SectionLabel } from '../components/ui/primitives';

/**
 * The positioning section: AI can draft anything, but someone who understands how it works decides
 * whether it's right. Compares a typical AI-only build with AI directed by an engineer, then shows
 * the workflow and offers a project review.
 */
export function AiEngineering() {
  const { t } = useLang();
  const ai = t.ai;

  return (
    <Section id="ai" labelledBy="ai-title">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <SectionLabel id="ai" />
          <SectionHeading
            id="ai-title"
            className="leading-tight"
            lines={[{ text: ai.heading[0] }, { text: ai.heading[1], gradient: true }]}
          />
          <Reveal as="p" className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            {ai.intro}
          </Reveal>
        </div>

        {/* Comparison: same topics, two outcomes */}
        <Reveal className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="hidden grid-cols-[10rem_1fr_1fr] border-b border-slate-200 bg-slate-50 font-mono text-[11px] font-bold tracking-wider uppercase md:grid">
            <span aria-hidden="true" />
            <span className="px-6 py-3.5 text-slate-500">{ai.aiAlone}</span>
            <span className="flex items-center gap-2 border-l border-indigo-100 bg-indigo-50/70 px-6 py-3.5 text-indigo-700">
              <ShieldCheck aria-hidden="true" size={14} />
              {ai.withMe}
            </span>
          </div>
          <ul className="divide-y divide-slate-100">
            {ai.rows.map((row) => (
              <li key={row.topic} className="grid grid-cols-1 md:grid-cols-[10rem_1fr_1fr]">
                <h3 className="px-6 pt-5 font-display text-base font-bold text-slate-900 md:py-5">{row.topic}</h3>
                <p className="flex items-start gap-2.5 px-6 pt-2 text-sm leading-relaxed text-slate-500 md:py-5">
                  <Minus aria-hidden="true" size={16} className="mt-0.5 shrink-0 text-slate-400" />
                  <span>
                    <span className="mb-0.5 block font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase md:hidden">{ai.aiAlone}</span>
                    {row.ai}
                  </span>
                </p>
                <p className="flex items-start gap-2.5 bg-indigo-50/40 px-6 py-4 text-sm leading-relaxed text-slate-800 md:border-l md:border-indigo-100 md:py-5">
                  <Check aria-hidden="true" size={16} strokeWidth={3} className="mt-0.5 shrink-0 text-indigo-600" />
                  <span>
                    <span className="mb-0.5 block font-mono text-[10px] font-bold tracking-wider text-indigo-600 uppercase md:hidden">{ai.withMe}</span>
                    {row.me}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Workflow */}
        <div className="mt-14">
          <Reveal as="div" className="mb-6">
            <h3 className="font-mono text-xs font-bold tracking-wider text-slate-900 uppercase">{ai.stepsTitle}</h3>
          </Reveal>
          <Stagger as="ul" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
            {ai.steps.map((step, i) => (
              <StaggerItem
                as="li"
                key={i}
                className="group rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/10"
              >
                <span className="font-mono text-[11px] font-bold tracking-wider text-indigo-600">{String(i + 1).padStart(2, '0')}</span>
                <h4 className="mt-2 mb-2 font-display text-lg font-bold text-slate-900">{step.title}</h4>
                <p className="text-sm leading-relaxed text-slate-600">{step.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <Reveal className="mt-14 flex flex-col items-center justify-between gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-sky-50 to-indigo-50 p-6 text-center shadow-sm sm:flex-row sm:text-left">
          <p className="max-w-3xl font-display text-lg font-bold text-slate-900 sm:text-xl">{ai.cta}</p>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-pill bg-indigo-600 px-5 py-2.5 font-mono text-xs font-bold tracking-wider whitespace-nowrap text-white uppercase shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700"
          >
            {ai.ctaButton}
            <ArrowRight aria-hidden="true" size={14} className="transition-transform group-hover:translate-x-1" />
          </a>
        </Reveal>
      </div>
    </Section>
  );
}
