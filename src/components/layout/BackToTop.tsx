import { useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { ArrowUp } from 'lucide-react';

/** The button appears once the visitor is past the hero's first screen. */
const SHOW_AFTER = 500;

/**
 * Fixed "back to top" button. Icon only, bottom-right, fades and lifts in after scrolling down and
 * out again near the top. It is a plain `#top` link, so it works without JavaScript and respects
 * `scroll-behavior` (smooth, or instant for reduced motion) from the global CSS.
 */
export function BackToTop() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  // Only re-renders when the threshold is crossed, not on every scroll event.
  useMotionValueEvent(scrollY, 'change', (y) => setVisible(y > SHOW_AFTER));

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#top"
          aria-label="Back to top"
          title="Back to top"
          initial={{ opacity: 0, y: 16, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.85 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          className="group fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex h-11 w-11 items-center justify-center rounded-pill border border-white/15 bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition-[background-color,box-shadow] duration-300 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/40 sm:right-6 sm:bottom-6 min-[1536px]:right-[30px]"
        >
          <ArrowUp
            aria-hidden="true"
            size={18}
            strokeWidth={2.5}
            className="transition-transform duration-300 group-hover:-translate-y-0.5"
          />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
