import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Light is the default. Only a choice the visitor made earlier turns dark on (the OS setting is not used). */
function initialTheme(): Theme {
  try {
    if (localStorage.getItem(STORAGE_KEY) === 'dark') return 'dark';
  } catch {
    /* storage can be unavailable (private mode) */
  }
  return 'light';
}

/**
 * Holds the active theme and mirrors it on <html>: the `dark` class (which swaps the colour tokens in
 * index.css), `color-scheme` (native controls and scrollbars) and the browser's theme-color. An inline
 * script in index.html applies a saved dark choice before first paint, so there is no flash.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
    document.head.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#070b14' : '#f8fafc');
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* the choice just won't be remembered */
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
