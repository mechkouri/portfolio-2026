import { motion, type Variants } from 'motion/react';
import { Fragment, type ReactNode } from 'react';

const EASE = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'li' | 'article' | 'p';
}

/** Fades and lifts its content in once, when it scrolls into view. */
export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      transition={{ delay }}
    >
      {children}
    </Tag>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: 'div' | 'ul';
}

/** Parent that staggers any `StaggerItem` children as the group enters the viewport. */
export function Stagger({ children, className, stagger = 0.08, as = 'div' }: StaggerProps) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article';
}) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={fadeUp}>
      {children}
    </Tag>
  );
}

export interface TextLine {
  text: string;
  gradient?: boolean;
}

interface SplitHeadingProps {
  as?: 'h1' | 'h2' | 'h3';
  lines: TextLine[];
  className?: string;
  /** Animate on mount (hero) instead of when scrolled into view. */
  immediate?: boolean;
  delay?: number;
  id?: string;
}

const wordVariants: Variants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.9, ease: EASE } },
};

/**
 * Heading whose words slide up from behind a mask in sequence. Gradient lines
 * animate as one unit so the gradient spans the whole line.
 */
export function SplitHeading({ as: Tag = 'h2', lines, className, immediate, delay = 0, id }: SplitHeadingProps) {
  const trigger = immediate
    ? { animate: 'visible' as const }
    : { whileInView: 'visible' as const, viewport: { once: true, amount: 0.4 } };

  return (
    <Tag id={id} className={className}>
      <motion.span
        className="block"
        initial="hidden"
        {...trigger}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: delay } } }}
      >
        {lines.map((line, i) => (
          <Fragment key={i}>
          {/* Space keeps the accessible name readable ("…repetitive. Keep…"). */}
          {i > 0 && ' '}
          <span className="block">
            {line.gradient ? (
              <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-top">
                <motion.span className="text-gradient inline-block" variants={wordVariants}>
                  {line.text}
                </motion.span>
              </span>
            ) : (
              line.text.split(' ').map((word, w) => (
                <Fragment key={w}>
                  {w > 0 && ' '}
                  <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-top">
                    <motion.span className="inline-block" variants={wordVariants}>
                      {word}
                    </motion.span>
                  </span>
                </Fragment>
              ))
            )}
          </span>
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}
