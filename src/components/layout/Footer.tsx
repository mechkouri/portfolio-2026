import { site } from '../../data/content';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-slate-100 px-4 py-10 sm:px-8 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center gap-2 md:justify-start">
            <span className="flex items-center justify-center rounded-xs bg-slate-900 p-1">
              <img src="/images/logo.png" alt="" width={200} height={142} loading="lazy" className="h-4 w-auto brightness-0 invert" />
            </span>
            <span className="font-display text-sm font-bold tracking-wider text-slate-900 uppercase">{site.name}</span>
          </div>
          <p className="font-mono text-xs text-slate-600">Software Engineer · Frontend Developer · Automation Specialist</p>
          <p className="text-xs text-slate-500">Building digital experiences and intelligent workflows.</p>
        </div>
        <div className="space-y-1 text-center font-mono text-xs text-slate-500 md:text-right">
          <p className="flex items-center justify-center gap-2 md:justify-end">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Morocco · {site.timezone}</span>
          </p>
          <p>© 2026 {site.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
