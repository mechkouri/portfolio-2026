import { useRef } from 'react';
import { motion, type Variants } from 'motion/react';
import { CalendarClock, Play, Terminal } from 'lucide-react';
import { heroHighlights, heroStack, heroTags, site } from '../../data/content';
import { useScrollTimeline } from '../../hooks/useScrollTimeline';
import { HeroBackdrop } from '../three/HeroBackdrop';
import { SplitHeading } from '../ui/Reveal';
import { PulseDot } from '../ui/primitives';
import { PortraitCard } from './PortraitCard';

const EASE = [0.16, 1, 0.3, 1] as const;
const container: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE } },
};

export function Hero() {
  const root = useRef<HTMLElement>(null);

  // Cinematic scroll-out: watermark drifts, content lifts and the card trails behind.
  useScrollTimeline(root, (gsap, _ST, el) => {
    const scrub = { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.6 };
    gsap.to('[data-hero-watermark]', { xPercent: -12, ease: 'none', scrollTrigger: scrub });
    gsap.to('[data-hero-copy]', { y: -80, opacity: 0.2, ease: 'none', scrollTrigger: scrub });
    gsap.to('[data-hero-card]', { y: -30, ease: 'none', scrollTrigger: scrub });
    gsap.to('[data-hero-panel]', { y: -120, opacity: 0, ease: 'none', scrollTrigger: scrub });
  });

  return (
    <section
      ref={root}
      id="top"
      aria-labelledby="hero-title"
      className="relative flex min-h-[92vh] w-full flex-col justify-between overflow-hidden px-4 pt-10 pb-8 sm:px-8 lg:px-16 min-[1536px]:pr-24"
    >
      {/* Ambient light glows */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/4 h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[140px]" />
      <div aria-hidden="true" className="pointer-events-none absolute top-1/3 -right-24 h-[500px] w-[500px] rounded-full bg-sky-400/10 blur-[140px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-10 left-10 h-96 w-96 rounded-full bg-indigo-300/10 blur-[130px]" />

      <HeroBackdrop eventSource={root} />

      {/* Monumental watermark */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden opacity-[0.03] select-none">
        <span data-hero-watermark className="font-display text-[16vw] font-black tracking-tighter whitespace-nowrap text-slate-900 uppercase">
          DEVELOPER // AUTOMATION
        </span>
      </div>

      <motion.div variants={container} initial="hidden" animate="visible" className="relative z-10 flex flex-1 flex-col justify-between">
        {/* Telemetry row */}
        <motion.div variants={item} className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pt-2 pb-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 whitespace-nowrap rounded-pill border border-indigo-200 bg-white px-3 py-1 shadow-sm">
              <span aria-hidden="true" className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-600 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600" />
              </span>
              <span className="font-mono text-xs font-semibold tracking-widest text-indigo-700 uppercase">SAID MECHKOURI // DEV.ENGINE</span>
            </div>
            <span className="hidden font-mono text-xs tracking-widest text-slate-400 uppercase sm:inline">• BUILDING FOR THE WEB SINCE 2021</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="whitespace-nowrap rounded-pill border border-slate-200 bg-white px-2.5 py-1 font-mono text-[11px] tracking-wider text-slate-600 uppercase shadow-sm">
              WORDPRESS · SEO · AUTOMATION
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap rounded-pill border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wider text-emerald-700 uppercase shadow-sm">
              <PulseDot className="bg-emerald-600" />
              OPEN TO NEW PROJECTS
            </span>
          </div>
        </motion.div>

        {/* Main layout: copy · portrait card · expertise panel */}
        <div className="my-auto grid grid-cols-1 items-center gap-10 py-8 lg:grid-cols-12 lg:gap-6">
          <div data-hero-copy className="space-y-6 lg:col-span-6">
            <motion.div variants={item} className="inline-flex items-center gap-2.5">
              <span className="whitespace-nowrap rounded-pill border border-indigo-200 bg-indigo-100 px-2.5 py-0.5 font-mono text-xs font-bold tracking-wider text-indigo-700 uppercase shadow-sm">
                {site.role}
              </span>
              <span className="font-mono text-xs tracking-widest text-slate-500 uppercase">Based in {site.location}, {site.country}</span>
            </motion.div>

            <SplitHeading
              as="h1"
              id="hero-title"
              immediate
              delay={0.3}
              lines={[{ text: 'SAID' }, { text: 'MECHKOURI', gradient: true }]}
              className="font-display text-5xl leading-[0.92] font-black tracking-tighter text-slate-900 uppercase sm:text-6xl lg:text-7xl xl:text-8xl"
            />
            <span className="sr-only">
              {site.name}: {site.positioning}
            </span>

            <motion.div variants={item} className="flex flex-wrap items-center gap-2.5 pt-1 font-mono text-xs">
              <span className="flex items-center gap-1.5 whitespace-nowrap rounded-pill border border-indigo-200 bg-white px-2.5 py-1 font-bold text-indigo-700 shadow-sm">
                <PulseDot className="bg-indigo-600" />
                Vibe coder
              </span>
              {heroStack.map((tech) => (
                <span key={tech} className="contents">
                  <span aria-hidden="true" className="text-slate-300">•</span>
                  <span className="font-medium text-slate-700">{tech}</span>
                </span>
              ))}
              <span aria-hidden="true" className="text-slate-300">•</span>
              <span className="font-semibold text-indigo-600">n8n &amp; Make.com</span>
            </motion.div>

            <motion.p variants={item} className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              I build websites, web apps, and the automations behind them. React and Next.js for products, WordPress
              when you need to own your content, and n8n or Make.com for anything that shouldn't be done by hand.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#work"
                className="group/btn flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-3.5 font-mono text-xs font-bold tracking-wider text-white uppercase shadow-lg shadow-slate-900/15 transition-all duration-300 hover:scale-105 hover:bg-slate-800 active:scale-95"
              >
                <Play aria-hidden="true" size={14} strokeWidth={2.5} className="transition-transform group-hover/btn:translate-x-1" />
                <span>View Projects</span>
              </a>
              <a
                href="#contact"
                className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-3.5 font-mono text-xs font-semibold tracking-wider text-slate-800 uppercase shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-slate-50 active:scale-95"
              >
                <CalendarClock aria-hidden="true" size={14} className="text-indigo-600" />
                <span>Contact Me</span>
              </a>
            </motion.div>
          </div>

          <div data-hero-card className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.45, ease: EASE }}
          >
            <PortraitCard />
          </motion.div>
          </div>

          <motion.aside variants={item} aria-label="What I work on" className="flex flex-col justify-center space-y-4 lg:col-span-2">
            <div data-hero-panel className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-lg transition-all hover:border-indigo-400">
              <div aria-hidden="true" className="pointer-events-none absolute top-0 right-0 h-24 w-24 rounded-full bg-indigo-50 blur-xl" />
              <h2 className="mb-3 flex items-center gap-1.5 font-mono text-[11px] font-bold tracking-wider text-indigo-600 uppercase">
                <Terminal aria-hidden="true" size={14} />
                <span>WHAT I WORK ON</span>
              </h2>
              <ul className="space-y-2.5 text-xs text-slate-600">
                {heroHighlights.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 font-mono text-[10px] tracking-widest text-slate-500 uppercase">
                <span>{site.timezone}</span>
                <span className="font-bold text-emerald-600">AVAILABLE</span>
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Bottom ribbon */}
        <motion.div variants={item} className="flex flex-col items-start justify-between gap-4 border-t border-slate-200/80 pt-4 lg:flex-row lg:items-center">
          <p className="flex items-center gap-2 font-mono text-xs text-slate-500">
            <PulseDot />
            <span>{site.location}, {site.country} · Open to freelance projects and collaborations</span>
          </p>
          <ul className="flex flex-wrap items-center gap-2" aria-label="Key technologies">
            {heroTags.map((tag) => (
              <li
                key={tag}
                className="whitespace-nowrap rounded-pill border border-slate-200 bg-white px-2.5 py-1 font-mono text-[11px] text-slate-700 shadow-sm transition-colors hover:border-indigo-400"
              >
                {tag}
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
}
