import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';

const SEEN_KEY = 'chat:greeted';
const SHOW_AFTER = 2_000;
const HIDE_AFTER = 9_000;

interface Props {
  text: string;
  dismissLabel: string;
  rtl: boolean;
  chatOpen: boolean;
  onOpen: () => void;
}

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    /* it will just greet again next time */
  }
}

/** The robot's "Hey!" speech bubble: appears once per visit, then gets out of the way. */
export function Greeting({ text, dismissLabel, rtl, chatOpen, onOpen }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {
      /* storage can be unavailable */
    }
    const show = setTimeout(() => setVisible(true), SHOW_AFTER);
    const hide = setTimeout(() => {
      setVisible(false);
      markSeen();
    }, SHOW_AFTER + HIDE_AFTER);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    markSeen();
  };

  // Opening the chat any other way also counts as having been greeted.
  useEffect(() => {
    if (chatOpen) dismiss();
  }, [chatOpen]);

  return (
    <AnimatePresence>
      {visible && !chatOpen && (
        <motion.div
          initial={{ opacity: 0, x: 12, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 8, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 360, damping: 22 }}
          className="dark fixed right-20 bottom-[calc(max(1rem,env(safe-area-inset-bottom))+0.375rem)] z-50 flex max-w-[calc(100vw-6rem)] origin-right items-center gap-1 rounded-2xl rounded-ee-md border border-red-500/40 bg-slate-50 py-1.5 ps-3.5 pe-1.5 text-slate-900 shadow-xl shadow-black/25 sm:right-[5.75rem] sm:bottom-[1.875rem]"
        >
          <button
            type="button"
            dir={rtl ? 'rtl' : 'ltr'}
            onClick={() => {
              dismiss();
              onOpen();
            }}
            className="text-start text-sm font-medium"
          >
            {text}
          </button>
          <button
            type="button"
            onClick={dismiss}
            aria-label={dismissLabel}
            title={dismissLabel}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-pill text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X aria-hidden="true" size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
