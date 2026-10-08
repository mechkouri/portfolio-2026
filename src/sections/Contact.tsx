import { useState, type FormEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ArrowUp, ArrowUpRight, CheckCircle2, Globe, MapPin, Share2, Terminal } from 'lucide-react';
import { site } from '../data/content';
import { Reveal } from '../components/ui/Reveal';
import { cn, PulseDot, SectionHeading, SectionLabel } from '../components/ui/primitives';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-inner transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-600 focus:bg-white focus:ring-3 focus:ring-indigo-600/15 focus:outline-none';
const labelClass = 'block font-mono text-[11px] font-semibold tracking-widest text-slate-500 uppercase';

function ExternalPill({ href, icon, label, hover }: { href: string; icon: ReactNode; label: string; hover: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('group flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5', hover)}
    >
      {icon}
      <span>{label}</span>
      <ArrowUpRight aria-hidden="true" size={12} className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

export function Contact() {
  const [status, setStatus] = useState<Status>('idle');

  // Submits to Netlify Forms (see the static form in index.html). Works once deployed on Netlify.
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('sending');
    try {
      const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString();
      const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative w-full overflow-hidden border-t border-slate-200/80 bg-white px-4 py-24 sm:px-8 lg:px-16">
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 right-1/4 h-[520px] w-[520px] rounded-full bg-indigo-500/10 blur-[140px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/4 h-[350px] w-[600px] rounded-full bg-sky-400/10 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionLabel id="contact" />

        <div className="mt-6 grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-6 lg:col-span-6">
            <SectionHeading
              id="contact-title"
              className="!text-4xl leading-[0.95] sm:!text-6xl lg:!text-7xl"
              lines={[{ text: "Let's work" }, { text: 'together!', gradient: true }]}
            />
            <Reveal as="p" className="max-w-lg pt-2 text-base leading-relaxed text-slate-600 sm:text-lg">
              Need a website, a web app, better SEO, or a workflow that stops eating your week? Send me a short message
              about what you're working on. Recruiters are welcome too.
            </Reveal>

            <Reveal className="space-y-3 border-t border-slate-200 pt-6 font-mono text-xs text-slate-700">
              <div className="flex flex-wrap items-center gap-3">
                <ExternalPill
                  href={site.linkedin}
                  hover="hover:border-indigo-400"
                  label={`LinkedIn: ${site.name}`}
                  icon={<Share2 aria-hidden="true" size={14} className="text-indigo-600 transition-transform group-hover:scale-110" />}
                />
                <ExternalPill
                  href={site.github}
                  hover="hover:border-sky-400"
                  label="GitHub: Mechkouri"
                  icon={<Terminal aria-hidden="true" size={14} className="text-sky-600 transition-transform group-hover:scale-110" />}
                />
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <ExternalPill
                  href={site.portfolio}
                  hover="hover:border-emerald-400"
                  label="Portfolio: mechkouri.netlify.app"
                  icon={<Globe aria-hidden="true" size={14} className="text-emerald-600 transition-transform group-hover:scale-110" />}
                />
                <p className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm">
                  <PulseDot size="w-2 h-2" />
                  <MapPin aria-hidden="true" size={12} className="text-indigo-600" />
                  <span>{site.location}, {site.country} ({site.timezone})</span>
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-6 lg:pl-6">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-10">
              <div aria-hidden="true" className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full bg-indigo-50 blur-2xl" />
              <form name="contact" method="POST" data-netlify="true" onSubmit={onSubmit} className="relative z-10 space-y-6">
                <input type="hidden" name="form-name" value="contact" />
                <p hidden>
                  <label>
                    Don't fill this out: <input name="bot-field" tabIndex={-1} autoComplete="off" />
                  </label>
                </p>
                <div className="space-y-2">
                  <label htmlFor="contact-name" className={labelClass}>
                    Your Name
                  </label>
                  <input id="contact-name" name="name" type="text" required autoComplete="name" placeholder="Your name" className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-email" className={labelClass}>
                    Your Email
                  </label>
                  <input id="contact-email" name="email" type="email" required autoComplete="email" placeholder="hello@example.com" className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-message" className={labelClass}>
                    Your Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    placeholder="What are you building, and when do you need it?"
                    className={cn(inputClass, 'resize-none')}
                  />
                </div>
                <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="group flex w-full items-center justify-center gap-2 rounded-pill bg-indigo-600 px-8 py-3.5 font-mono text-xs font-bold tracking-wider text-white uppercase shadow-lg shadow-indigo-600/25 transition-all duration-300 hover:scale-105 hover:bg-indigo-700 active:scale-95 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
                  >
                    <span>{status === 'sending' ? 'Sending…' : 'Send Message'}</span>
                    <ArrowRight aria-hidden="true" size={14} className="transition-transform group-hover:translate-x-1" />
                  </button>
                  <div aria-live="polite" className="text-sm">
                    <AnimatePresence>
                      {status === 'sent' && (
                        <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 text-emerald-700">
                          <CheckCircle2 aria-hidden="true" size={16} /> Thank you! Your message has been sent.
                        </motion.p>
                      )}
                      {status === 'error' && (
                        <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-rose-700">
                          Something went wrong. Please reach out on LinkedIn instead.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </form>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 border-t border-slate-200 pt-16 text-center">
          <a
            href="#top"
            className="inline-flex items-center gap-1 font-mono text-xs font-semibold tracking-widest text-slate-500 uppercase transition-colors hover:text-slate-900"
          >
            <span>[ Return to top ]</span>
            <ArrowUp aria-hidden="true" size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
