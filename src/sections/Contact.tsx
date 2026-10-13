import { useState, type FormEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ArrowUp, ArrowUpRight, CheckCircle2, Globe, Mail, MapPin, Phone, Share2, Terminal } from 'lucide-react';
import { useLang } from '../i18n/LangProvider';
import { Reveal } from '../components/ui/Reveal';
import { cn, PulseDot, Section, SectionHeading, SectionLabel } from '../components/ui/primitives';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-inner transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-600 focus:bg-white focus:ring-3 focus:ring-indigo-600/15 focus:outline-none';
const labelClass = 'block font-mono text-[11px] font-semibold tracking-widest text-slate-500 uppercase';

function ExternalPill({ href, icon, label, hover }: { href: string; icon: ReactNode; label: string; hover: string }) {
  const { t } = useLang();
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
      <span className="sr-only">{t.contact.newTab}</span>
    </a>
  );
}

export function Contact() {
  const { t, lang, content } = useLang();
  const { site } = content;
  const [status, setStatus] = useState<Status>('idle');

  // Sends through the /api/contact function, which emails a branded HTML message (netlify/functions/contact.mjs).
  // If that isn't available (not configured, offline, local dev), it falls back to Netlify Forms (see the
  // static form in index.html) so a message is never lost.
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus('sending');
    try {
      let delivered = false;
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.get('name'),
            email: data.get('email'),
            message: data.get('message'),
            company: data.get('bot-field'),
            lang,
          }),
        });
        delivered = res.ok;
      } catch {
        /* fall through to Netlify Forms */
      }
      if (!delivered) {
        const body = new URLSearchParams(data as unknown as Record<string, string>).toString();
        const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
        if (!res.ok) throw new Error(String(res.status));
      }
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <Section id="contact" labelledBy="contact-title" spacious className="overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 right-1/4 h-[520px] w-[520px] rounded-full bg-indigo-500/10 blur-[140px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/4 h-[350px] w-[600px] rounded-full bg-sky-400/10 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionLabel id="contact" />

        <div className="mt-6 grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-6 lg:col-span-6">
            <SectionHeading
              id="contact-title"
              className="!text-4xl leading-[0.95] sm:!text-6xl lg:!text-7xl"
              lines={[{ text: t.contact.heading[0] }, { text: t.contact.heading[1], gradient: true }]}
            />
            <Reveal as="p" className="max-w-lg pt-2 text-base leading-relaxed text-slate-600 sm:text-lg">
              {t.contact.intro}
            </Reveal>
            <Reveal as="p" delay={0.05} className="flex flex-wrap items-center gap-2 font-mono text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
              <span>{t.contact.openTo}</span>
              {t.contact.openToItems.map((x) => (
                <span key={x} className="rounded-pill border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700">
                  {x}
                </span>
              ))}
            </Reveal>

            <Reveal className="space-y-3 border-t border-slate-200 pt-6 font-mono text-xs text-slate-700">
              {site.email && (
                <a
                  href={`mailto:${site.email}`}
                  className="group flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  <Mail aria-hidden="true" size={16} />
                  <span>{site.email}</span>
                  <ArrowUpRight aria-hidden="true" size={14} className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}
              <a
                href={site.phoneHref}
                className="group flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400"
              >
                <Phone aria-hidden="true" size={14} className="text-indigo-600 transition-transform group-hover:scale-110" />
                <span>{site.phone}</span>
              </a>
              <div className="flex flex-wrap items-center gap-3">
                <ExternalPill
                  href={site.linkedin}
                  hover="hover:border-indigo-400"
                  label={t.contact.linkedin(site.name)}
                  icon={<Share2 aria-hidden="true" size={14} className="text-indigo-600 transition-transform group-hover:scale-110" />}
                />
                <ExternalPill
                  href={site.github}
                  hover="hover:border-sky-400"
                  label={t.contact.github}
                  icon={<Terminal aria-hidden="true" size={14} className="text-sky-600 transition-transform group-hover:scale-110" />}
                />
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <ExternalPill
                  href={site.portfolio}
                  hover="hover:border-emerald-400"
                  label={t.contact.portfolio}
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
                    {t.contact.honeypot}<input name="bot-field" tabIndex={-1} autoComplete="off" />
                  </label>
                </p>
                <div className="space-y-2">
                  <label htmlFor="contact-name" className={labelClass}>
                    {t.contact.name}
                  </label>
                  <input id="contact-name" name="name" type="text" required autoComplete="name" placeholder={t.contact.namePh} className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-email" className={labelClass}>
                    {t.contact.email}
                  </label>
                  <input id="contact-email" name="email" type="email" required autoComplete="email" placeholder={t.contact.emailPh} className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-message" className={labelClass}>
                    {t.contact.message}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    placeholder={t.contact.messagePh}
                    className={cn(inputClass, 'resize-none')}
                  />
                </div>
                <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="group flex w-full items-center justify-center gap-2 rounded-pill bg-indigo-600 px-8 py-3.5 font-mono text-xs font-bold tracking-wider text-white uppercase shadow-lg shadow-indigo-600/25 transition-all duration-300 hover:scale-105 hover:bg-indigo-700 active:scale-95 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
                  >
                    <span>{status === 'sending' ? t.contact.sending : t.contact.send}</span>
                    <ArrowRight aria-hidden="true" size={14} className="transition-transform group-hover:translate-x-1" />
                  </button>
                  <div aria-live="polite" className="text-sm">
                    <AnimatePresence>
                      {status === 'sent' && (
                        <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 text-emerald-700">
                          <CheckCircle2 aria-hidden="true" size={16} /> {t.contact.sent}
                        </motion.p>
                      )}
                      {status === 'error' && (
                        <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-rose-700">
                          {t.contact.error}
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
            <span>{t.contact.returnTop}</span>
            <ArrowUp aria-hidden="true" size={14} />
          </a>
        </div>
      </div>
    </Section>
  );
}
