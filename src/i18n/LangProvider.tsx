import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getContent, type Content } from './content';
import { dictionaries, type Dict, type Lang } from './ui';

const STORAGE_KEY = 'lang';

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
  content: Content;
}

const LangContext = createContext<LangContextValue | null>(null);

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'fr') return saved;
  } catch {
    /* storage can be unavailable (private mode); fall through to the browser language */
  }
  return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

function setMeta(selector: string, value: string) {
  document.head.querySelector(selector)?.setAttribute('content', value);
}

/** Holds the active language. Switching re-renders in place: no reload, scroll position untouched. */
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* the choice just won't be remembered */
    }
  }, []);

  const value = useMemo<LangContextValue>(
    () => ({ lang, setLang, t: dictionaries[lang], content: getContent(lang) }),
    [lang, setLang],
  );

  // Keep the document in step with the language: <html lang>, title and the social/search meta tags.
  useEffect(() => {
    const { meta } = dictionaries[lang];
    document.documentElement.lang = lang;
    document.title = meta.title;
    setMeta('meta[name="description"]', meta.description);
    setMeta('meta[property="og:title"]', meta.ogTitle);
    setMeta('meta[property="og:description"]', meta.ogDescription);
  }, [lang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
}
