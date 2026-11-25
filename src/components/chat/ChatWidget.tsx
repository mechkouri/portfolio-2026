import { Component, Suspense, lazy, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useLang } from '../../i18n/LangProvider';
import { Robot } from './Robot';
import { chatStrings, type ChatLang } from './strings';

// Only the button ships with the page; the chat itself downloads when someone first opens it.
const loadPanel = () => import('./ChatPanel');
const ChatPanel = lazy(loadPanel);

const LANG_KEY = 'chat:lang';

function savedLang(): ChatLang | null {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'en' || saved === 'fr' || saved === 'ar') return saved;
  } catch {
    /* storage can be unavailable */
  }
  return null;
}

/** If the chat code fails to download (offline, or an old page after a deploy) the portfolio keeps working. */
class ChatBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function ChatWidget() {
  const { lang: siteLang } = useLang();
  const [choice, setChoice] = useState<ChatLang | null>(savedLang);
  const [open, setOpen] = useState(false);
  const launcher = useRef<HTMLButtonElement>(null);

  // The visitor's own choice wins; otherwise Arabic browsers get Arabic and everyone else follows the site.
  const lang: ChatLang = choice ?? (navigator.language?.toLowerCase().startsWith('ar') ? 'ar' : siteLang);
  const s = chatStrings[lang];

  const changeLang = (next: ChatLang) => {
    setChoice(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {
      /* the choice just won't be remembered */
    }
  };

  const close = () => {
    setOpen(false);
    launcher.current?.focus();
  };

  return (
    <>
      <ChatBoundary onError={() => setOpen(false)}>
        <Suspense fallback={null}>
          <AnimatePresence>{open && <ChatPanel lang={lang} onLangChange={changeLang} onClose={close} />}</AnimatePresence>
        </Suspense>
      </ChatBoundary>

      <motion.button
        ref={launcher}
        type="button"
        onClick={() => setOpen((v) => !v)}
        onPointerEnter={() => void loadPanel().catch(() => {})}
        onFocus={() => void loadPanel().catch(() => {})}
        aria-label={open ? s.close : s.open}
        title={open ? s.close : s.open}
        aria-expanded={open}
        aria-controls={open ? 'chat-panel' : undefined}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 380, damping: 24 }}
        className={`dark fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/40 bg-slate-50 text-slate-900 shadow-xl shadow-black/30 transition-[border-color,box-shadow] duration-300 hover:border-red-500 hover:shadow-red-600/25 sm:right-6 sm:bottom-6 ${open ? 'max-sm:hidden' : ''}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? 'close' : 'chat'}
            initial={{ rotate: -60, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 60, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {open ? <X aria-hidden="true" size={22} /> : <Robot className="h-11 w-11" />}
          </motion.span>
        </AnimatePresence>
        {!open && <span aria-hidden="true" className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full border-2 border-slate-50 bg-red-500" />}
      </motion.button>
    </>
  );
}
