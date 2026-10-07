// Full class strings per accent so Tailwind can statically detect them.
export type Accent = 'indigo' | 'sky' | 'emerald' | 'amber';

export const accents: Record<
  Accent,
  {
    text: string;
    hoverText: string;
    groupHoverText: string;
    hoverBorder: string;
    hoverShadow: string;
    iconBox: string;
    dot: string;
    pill: string;
    strongChip: string;
    numberFaded: string;
    nodeRing: string;
    rgb: string;
  }
> = {
  indigo: {
    text: 'text-indigo-600',
    hoverText: 'hover:text-indigo-800',
    groupHoverText: 'group-hover:text-indigo-600',
    hoverBorder: 'hover:border-indigo-400',
    hoverShadow: 'hover:shadow-indigo-500/10',
    iconBox: 'bg-indigo-50 border-indigo-200 text-indigo-600',
    dot: 'bg-indigo-500',
    pill: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    strongChip: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    numberFaded: 'text-indigo-600/40 group-hover:text-indigo-600',
    nodeRing: 'border-indigo-600 text-indigo-700',
    rgb: '79, 70, 229',
  },
  sky: {
    text: 'text-sky-600',
    hoverText: 'hover:text-sky-800',
    groupHoverText: 'group-hover:text-sky-600',
    hoverBorder: 'hover:border-sky-400',
    hoverShadow: 'hover:shadow-sky-500/10',
    iconBox: 'bg-sky-50 border-sky-200 text-sky-600',
    dot: 'bg-sky-500',
    pill: 'bg-sky-50 text-sky-700 border-sky-200',
    strongChip: 'bg-sky-100 text-sky-800 border-sky-200',
    numberFaded: 'text-sky-600/40 group-hover:text-sky-600',
    nodeRing: 'border-sky-600 text-sky-700',
    rgb: '2, 132, 199',
  },
  emerald: {
    text: 'text-emerald-600',
    hoverText: 'hover:text-emerald-800',
    groupHoverText: 'group-hover:text-emerald-600',
    hoverBorder: 'hover:border-emerald-400',
    hoverShadow: 'hover:shadow-emerald-500/10',
    iconBox: 'bg-emerald-50 border-emerald-200 text-emerald-600',
    dot: 'bg-emerald-500',
    pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    strongChip: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    numberFaded: 'text-emerald-600/40 group-hover:text-emerald-600',
    nodeRing: 'border-emerald-600 text-emerald-700',
    rgb: '5, 150, 105',
  },
  amber: {
    text: 'text-amber-600',
    hoverText: 'hover:text-amber-800',
    groupHoverText: 'group-hover:text-amber-600',
    hoverBorder: 'hover:border-amber-400',
    hoverShadow: 'hover:shadow-amber-500/10',
    iconBox: 'bg-amber-50 border-amber-200 text-amber-600',
    dot: 'bg-amber-500',
    pill: 'bg-amber-50 text-amber-700 border-amber-200',
    strongChip: 'bg-amber-100 text-amber-800 border-amber-200',
    numberFaded: 'text-amber-600/40 group-hover:text-amber-600',
    nodeRing: 'border-amber-600 text-amber-700',
    rgb: '217, 119, 6',
  },
};
