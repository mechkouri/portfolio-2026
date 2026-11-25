import { useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';

/** The assistant's mascot: original inline SVG, so it stays sharp at any size and costs no extra request. */
export function Robot({ className }: { className?: string }) {
  const shell = useId();
  const screen = useId();
  const still = useReducedMotion();

  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className={className}
      animate={still ? undefined : { y: [0, -1.5, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <defs>
        <radialGradient id={shell} cx="0.38" cy="0.28" r="0.85">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.7" stopColor="#dfe5ee" />
          <stop offset="1" stopColor="#aab5c6" />
        </radialGradient>
        <linearGradient id={screen} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6fffa" />
          <stop offset="1" stopColor="#99f0e0" />
        </linearGradient>
      </defs>

      {/* Antennae and top light */}
      <path d="M15 22 12.5 8M49 22 51.5 8" stroke="#9aa8bd" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12.3" cy="7" r="2.8" fill={`url(#${shell})`} />
      <circle cx="51.7" cy="7" r="2.8" fill={`url(#${shell})`} />
      <circle className="robot-light" cx="32" cy="11" r="3.4" fill="#ef4444" />

      {/* Body and hands */}
      <path d="M22 48h20c0 8-4 13-10 13s-10-5-10-13Z" fill={`url(#${shell})`} />
      <circle cx="17" cy="52" r="3.6" fill={`url(#${shell})`} />
      <circle cx="32" cy="54" r="2" fill="#ef4444" />

      {/* Head, headphones and face screen */}
      <rect x="11" y="13" width="42" height="37" rx="18" fill={`url(#${shell})`} />
      <rect x="6" y="24" width="8" height="17" rx="4" fill="#c3cddb" />
      <rect x="50" y="24" width="8" height="17" rx="4" fill="#c3cddb" />
      <rect x="16" y="23" width="32" height="20" rx="9.5" fill={`url(#${screen})`} stroke="#8e9bb0" strokeWidth="1.2" />

      {/* Eyes blink now and then */}
      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        animate={still ? undefined : { scaleY: [1, 1, 0.1, 1] }}
        transition={{ duration: 4, times: [0, 0.92, 0.96, 1], repeat: Infinity }}
      >
        <rect x="23" y="28" width="5" height="10" rx="2" fill="#0f172a" />
        <rect x="36" y="28" width="5" height="10" rx="2" fill="#0f172a" />
        <rect x="24" y="29.2" width="2" height="3.4" rx="1" fill="#99f0e0" />
        <rect x="37" y="29.2" width="2" height="3.4" rx="1" fill="#99f0e0" />
      </motion.g>

      {/* Waving arm: drawn last so it passes in front of the head */}
      <g className="robot-wave">
        <path d="M43 51 54 54" stroke="#c3cddb" strokeWidth="3.4" strokeLinecap="round" />
        <circle cx="55" cy="54" r="4.2" fill={`url(#${shell})`} stroke="#8e9bb0" strokeWidth="0.8" />
      </g>
    </motion.svg>
  );
}
