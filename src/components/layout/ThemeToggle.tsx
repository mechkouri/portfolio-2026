import { AnimatePresence, motion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { useLang } from '../../i18n/LangProvider';
import { useTheme } from '../../theme/ThemeProvider';
import { cn } from '../ui/primitives';

/**
 * Light / dark switch: a single icon button. It shows the moon in light mode (go dark) and the sun in
 * dark mode (go light). `aria-pressed` says whether dark mode is on; the label says what a click does.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const { t } = useLang();
  const dark = theme === 'dark';
  const label = dark ? t.header.themeToLight : t.header.themeToDark;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label={label}
      title={label}
      className={cn(
        'relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-pill border border-slate-200 bg-slate-100/80 text-slate-700 transition-colors hover:border-indigo-400 hover:text-indigo-600',
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          aria-hidden="true"
          initial={{ opacity: 0, rotate: -70, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 70, scale: 0.6 }}
          transition={{ duration: 0.2 }}
          className="flex"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
