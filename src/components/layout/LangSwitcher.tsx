import { LANGS } from '../../i18n/ui';
import { useLang } from '../../i18n/LangProvider';
import { cn } from '../ui/primitives';

/**
 * EN / FR toggle. Two real buttons in a group (aria-pressed), so it works with keyboard and screen
 * readers; each carries its own `lang` so "Français" is pronounced correctly.
 */
export function LangSwitcher({ className }: { className?: string }) {
  const { lang, setLang, t } = useLang();
  return (
    <div role="group" aria-label={t.header.language} className={cn('inline-flex items-center rounded-pill border border-slate-200 bg-slate-100/80 p-0.5', className)}>
      {LANGS.map((l) => {
        const active = l.code === lang;
        return (
          <button
            key={l.code}
            type="button"
            lang={l.code}
            aria-pressed={active}
            aria-label={l.name}
            title={l.name}
            onClick={() => setLang(l.code)}
            className={cn(
              'rounded-pill px-2.5 py-1 font-mono text-[11px] font-bold tracking-wider transition-colors',
              active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-950',
            )}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
