import { ArrowUpRight } from 'lucide-react';
import { navLinks, site } from '../../data/content';

const profiles = [
  { label: 'GitHub', href: site.github },
  { label: 'LinkedIn', href: site.linkedin },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-slate-100 px-4 py-10 sm:px-8 lg:px-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 text-center md:grid-cols-[1.5fr_1fr_1fr] md:text-left">
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2 md:justify-start">
            <span className="flex items-center justify-center rounded-xs bg-slate-900 p-1">
              <img src="/images/logo.png" alt="" width={200} height={142} loading="lazy" className="h-4 w-auto brightness-0 invert" />
            </span>
            <span className="font-display text-sm font-bold tracking-wider text-slate-900 uppercase">{site.name}</span>
          </div>
          <p className="font-mono text-xs text-slate-600">{site.positioning}</p>
          <p className="text-xs text-slate-500">Websites, web apps, and automations, built in {site.location}.</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="mb-2 font-mono text-[10px] font-semibold tracking-widest text-slate-400 uppercase">Sections</h2>
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs md:flex-col md:justify-start">
            {[...navLinks, { id: 'contact', label: 'Contact' }].map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} className="text-slate-600 transition-colors hover:text-indigo-600">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3">
          <div>
            <h2 className="mb-2 font-mono text-[10px] font-semibold tracking-widest text-slate-400 uppercase">Elsewhere</h2>
            <ul className="flex justify-center gap-4 text-xs md:flex-col md:gap-1">
              {profiles.map((p) => (
                <li key={p.label}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-slate-600 transition-colors hover:text-indigo-600"
                  >
                    {p.label}
                    <ArrowUpRight aria-hidden="true" size={12} />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-1 font-mono text-xs text-slate-500">
            <p className="flex items-center justify-center gap-2 md:justify-start">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>
                {site.location}, {site.country} · {site.timezone}
              </span>
            </p>
            <p>© 2026 {site.name}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
