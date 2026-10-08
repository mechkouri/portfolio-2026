// All portfolio copy lives here so content edits never require touching components.
import type { LucideIcon } from 'lucide-react';
import {
  AppWindow,
  ArrowLeftRight,
  BadgeCheck,
  Bot,
  BrainCircuit,
  ChartColumn,
  CodeXml,
  Database,
  LogIn,
  MonitorSmartphone,
  Palette,
  PenTool,
  SlidersHorizontal,
  TrendingUp,
} from 'lucide-react';
import type { Accent } from '../lib/accents';

export const site = {
  name: 'Said Mechkouri',
  role: 'Full-Stack Developer',
  positioning: 'Full-Stack Developer · WordPress · SEO & Automation · AI-assisted Development',
  tagline: 'Full-Stack · WordPress · SEO',
  location: 'Marrakech',
  country: 'Morocco',
  timezone: 'UTC+1',
  github: 'https://github.com/Mechkouri',
  linkedin: 'https://linkedin.com',
  portfolio: 'https://mechkouri.netlify.app',
  /** Public contact email. Left empty on purpose: the Contact section only shows it once it is set. */
  email: '',
};

/**
 * Page outline. The order here is the order on the page, and it drives the
 * section numbers ("01 — Experience"), the navigation, the alternating section
 * backgrounds and the telemetry panel. Credibility first (experience), then
 * proof (work), then what I offer, who I am, my stack, and how to reach me.
 * The hero ("top") comes before all of these and is numbered 00.
 */
export const sections = [
  { id: 'experience', eyebrow: 'Experience', nav: 'Experience' },
  { id: 'work', eyebrow: 'Selected Work', nav: 'Work' },
  { id: 'services', eyebrow: 'What I Do', nav: 'Services' },
  { id: 'automation', eyebrow: 'Automation', nav: 'Automation' },
  { id: 'about', eyebrow: 'About', nav: 'About' },
  { id: 'skills', eyebrow: 'Skills' },
  { id: 'education', eyebrow: 'Education' },
  { id: 'contact', eyebrow: 'Get in Touch', nav: 'Contact' },
] as const;

export type SectionId = (typeof sections)[number]['id'];

export const navLinks = [
  { id: 'top', label: 'Home' },
  ...sections.flatMap((s) => ('nav' in s ? [{ id: s.id, label: s.nav }] : [])),
];

export function sectionNumber(id: string): string {
  return String(sections.findIndex((s) => s.id === id) + 1).padStart(2, '0');
}

export const heroStack = ['React', 'Next.js', 'WordPress'];
export const heroHighlights = [
  'React & Next.js web apps',
  'WordPress sites & landing pages',
  'Technical SEO & Search Console',
  'n8n & Make.com workflows',
];
export const heroTags = ['React', 'Next.js', 'WordPress', 'SEO', 'n8n', 'Make.com'];

export const introFacts: { title: string; label: string; color: string }[] = [
  { title: 'Since 2021', label: 'Building for the web', color: 'text-indigo-600' },
  { title: '5 roles', label: 'Agencies & product teams', color: 'text-sky-600' },
  { title: 'UTC+1', label: 'Marrakech, Morocco', color: 'text-emerald-600' },
];

export interface Service {
  icon: LucideIcon;
  accent: Accent;
  kicker: string;
  title: string;
  description: string;
  tech: string[];
}

export const services: Service[] = [
  {
    icon: CodeXml,
    accent: 'indigo',
    kicker: '01 // Web Apps',
    title: 'Full-Stack Development',
    description: 'Responsive web applications built with React, Next.js, and TypeScript, from the interface to the API.',
    tech: ['React', 'Next.js', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Node.js'],
  },
  {
    icon: AppWindow,
    accent: 'sky',
    kicker: '02 // CMS & Websites',
    title: 'WordPress Development',
    description: 'Business websites, landing pages, and multilingual sites you can update yourself after launch.',
    tech: ['WordPress', 'Elementor', 'WooCommerce', 'Multilingual sites', 'Custom integrations'],
  },
  {
    icon: TrendingUp,
    accent: 'emerald',
    kicker: '03 // Search',
    title: 'SEO',
    description: 'Technical SEO, site structure, indexing, content, and performance, tracked in Search Console and Analytics.',
    tech: ['Technical SEO', 'Site structure', 'Content optimization', 'Search Console', 'Google Analytics'],
  },
  {
    icon: MonitorSmartphone,
    accent: 'amber',
    kicker: '04 // Websites & Funnels',
    title: 'Web Development',
    description: 'Business websites, landing pages, and sales funnels that work on every screen and are built to convert.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'ClickFunnels', 'System.io', 'Responsive design'],
  },
];

export const pipelineNodes: { icon: LucideIcon; accent: Accent; title: string; detail: string }[] = [
  { icon: LogIn, accent: 'indigo', title: 'Trigger', detail: 'Webhook, Form, Sheet, or Cron Event' },
  { icon: SlidersHorizontal, accent: 'sky', title: 'Process', detail: 'Validation, Cleanse, Format, Filter' },
  { icon: BrainCircuit, accent: 'amber', title: 'AI', detail: 'LLM Reasoning, Generation, Metadata' },
  { icon: ArrowLeftRight, accent: 'emerald', title: 'Integration', detail: 'REST APIs, DB, WordPress, CRM' },
  { icon: BadgeCheck, accent: 'indigo', title: 'Action', detail: 'Publish, Dispatch Alert, Save Outcome' },
];

export const workflows: { title: string; badge: string; accent: Accent; steps: string[]; note: string }[] = [
  {
    title: 'SEO Content Automation',
    badge: 'n8n + AI',
    accent: 'indigo',
    steps: ['Idea', 'Keyword', 'AI-assisted article', 'Metadata', 'Image', 'WordPress', 'Publishing'],
    note: 'Starts with a topic, ends with an SEO-ready post on WordPress.',
  },
  {
    title: 'Lead Automation',
    badge: 'Make.com',
    accent: 'sky',
    steps: ['Form submission', 'Data processing', 'CRM / Sheet', 'Notification', 'Follow-up'],
    note: 'Every form submission gets stored, routed, and followed up. No copy-pasting.',
  },
  {
    title: 'Content Distribution',
    badge: 'Multi-Channel',
    accent: 'emerald',
    steps: ['Content creation', 'Formatting', 'Multiple platforms', 'Scheduled publishing'],
    note: 'Write it once, then format and schedule it for each platform.',
  },
  {
    title: 'Business Automation',
    badge: 'Custom APIs',
    accent: 'amber',
    steps: ['Trigger', 'Logic', 'API integrations', 'Database / update', 'Notification'],
    note: 'Connects the tools a business already uses so the data stays in sync.',
  },
];

export interface Project {
  /** Text shown in the browser-bar pill: the real domain once known, otherwise the project name. */
  label: string;
  url?: string;
  image: string;
  imageAlt: string;
  accent: Accent;
  category: string;
  title: string;
  description: string;
  /** Technologies; leave empty when the stack isn't listed. */
  tags: string[];
  siteIcon: 'globe' | 'shield' | 'code' | 'cart';
}

/** The first three slides: the projects with the most to say. */
export const featuredProjects: Project[] = [
  {
    label: 'SWSM 2026',
    image: '/images/projects/swsm.webp',
    imageAlt: 'Full-page screenshot of the SWSM 2026 international conference website',
    accent: 'indigo',
    category: 'Event Website // Conference',
    title: 'SWSM 2026 — International Conference Website',
    description:
      'The website for an international scientific conference. I organized and built everything attendees need in one place: program, committees, registration, paper submissions, venue, and practical info.',
    tags: ['WordPress', 'UI/UX', 'Responsive Dev', 'Info Architecture'],
    siteIcon: 'globe',
  },
  {
    label: 'normes-haccp.com',
    url: 'https://normes-haccp.com',
    image: '/images/projects/normes-haccp.webp',
    imageAlt: 'Full-page screenshot of the Normes HACCP website for food-service businesses',
    accent: 'sky',
    category: 'Food Safety // WordPress Platform',
    title: 'Normes HACCP — Platform for Food-Service Businesses',
    description:
      'Helps restaurants, bakeries, and butcher shops handle HACCP compliance. I built the site, set up the SEO and content structure, and automated parts of the workflow.',
    tags: ['WordPress', 'SEO', 'Automation', 'Business Systems'],
    siteIcon: 'shield',
  },
];

/** The rest of the slides. Descriptions only state what the site shows. */
export const moreProjects: Project[] = [
  {
    label: 'Equipements Cuisine',
    image: '/images/projects/equipements-cuisine.webp',
    imageAlt: 'Full-page screenshot of the Equipements Cuisine online store',
    accent: 'amber',
    category: 'E-commerce // Catering equipment',
    title: 'Equipements Cuisine',
    description: 'Online store for professional kitchen equipment, with product categories, weekly offers, and a blog.',
    tags: [],
    siteIcon: 'cart',
  },
  {
    label: 'Jungle Papper',
    image: '/images/projects/jungle-papper.webp',
    imageAlt: 'Full-page screenshot of the Jungle Papper label shop',
    accent: 'emerald',
    category: 'E-commerce // Labels',
    title: 'Jungle Papper',
    description: 'Shop for compatible thermal and adhesive labels, organised by printer brand: Dymo, Zebra, Brother.',
    tags: [],
    siteIcon: 'cart',
  },
  {
    label: 'varimart.ma',
    url: 'https://varimart.ma',
    image: '/images/projects/varimart.webp',
    imageAlt: 'Full-page screenshot of the Varimart online marketplace',
    accent: 'amber',
    category: 'E-commerce // Marketplace',
    title: 'Varimart',
    description: 'Online marketplace for home, kitchen, and lifestyle products, with best sellers, promo packs, and a blog.',
    tags: [],
    siteIcon: 'cart',
  },
  {
    label: 'Cavelle',
    image: '/images/projects/cavelle.webp',
    imageAlt: 'Full-page screenshot of the Cavelle leather backpack landing page',
    accent: 'indigo',
    category: 'Landing Page // Single product',
    title: 'Cavelle — Selim Bag',
    description: 'Single-product page for a leather backpack brand: product story, comparison, reviews, FAQ, and order form.',
    tags: [],
    siteIcon: 'cart',
  },
  {
    label: 'Easy Take Travel',
    image: '/images/projects/easy-take-travel.webp',
    imageAlt: 'Full-page screenshot of the Easy Take Travel tours website',
    accent: 'amber',
    category: 'Travel // Tours',
    title: 'Easy Take Travel',
    description: 'Website for a Moroccan travel agency, with desert tours and excursions, destinations, and a trip search.',
    tags: [],
    siteIcon: 'globe',
  },
  {
    label: 'Tickets De Caisse',
    image: '/images/projects/tickets-de-caisse.webp',
    imageAlt: 'Full-page screenshot of the Tickets De Caisse receipt paper website',
    accent: 'emerald',
    category: 'Landing Page // Receipt paper',
    title: 'Tickets De Caisse',
    description: 'Product site for thermal receipt rolls, with use cases, technical specs, FAQ, and a newsletter offer.',
    tags: [],
    siteIcon: 'globe',
  },
  {
    label: 'mayabeautyhouse.com',
    url: 'https://mayabeautyhouse.com',
    image: '/images/projects/maya-beauty-house.webp',
    imageAlt: 'Full-page screenshot of the Maya Beauty House salon website',
    accent: 'amber',
    category: 'Business Website // Beauty salon',
    title: 'Maya Beauty House',
    description: 'Website for a beauty salon in Montpellier, with services, online booking, a special offer, and a blog.',
    tags: [],
    siteIcon: 'globe',
  },
  {
    label: 'TechDigi IPTV',
    image: '/images/projects/techdigi-iptv.webp',
    imageAlt: 'Full-page screenshot of the TechDigi IPTV landing page',
    accent: 'amber',
    category: 'Landing Page // Subscription',
    title: 'TechDigi IPTV',
    description: 'Conversion-focused landing page for a streaming subscription, with plans, testimonials, FAQ, and WhatsApp contact.',
    tags: [],
    siteIcon: 'globe',
  },
];

/** Everything in the Selected Work slider, in slide order. */
export const projects: Project[] = [...featuredProjects, ...moreProjects];

export const techCategories: { icon: LucideIcon; accent: Accent; title: string; items: string[] }[] = [
  { icon: Palette, accent: 'indigo', title: 'Frontend', items: ['React', 'Next.js', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS'] },
  { icon: Database, accent: 'amber', title: 'Backend & Data', items: ['Node.js', 'MySQL', 'MongoDB', 'APIs'] },
  { icon: AppWindow, accent: 'sky', title: 'WordPress & Funnels', items: ['WordPress', 'WooCommerce', 'Elementor', 'ClickFunnels', 'System.io'] },
  { icon: Bot, accent: 'emerald', title: 'Automation & AI', items: ['n8n', 'Make.com', 'Webhooks', 'AI-assisted development'] },
  { icon: ChartColumn, accent: 'indigo', title: 'SEO & Ads', items: ['Google Search Console', 'Google Analytics', 'Google Ads'] },
  { icon: PenTool, accent: 'sky', title: 'Design & Workflow', items: ['Figma', 'Git', 'GitHub'] },
];

export interface TimelineEntry {
  role: string;
  org: string;
  badge: string;
  period: string;
  place?: string;
  accent: Accent;
  current?: boolean;
  /** Short line under the organisation, e.g. field of study and honours. */
  note?: string;
  /** Logo shown in the timeline node (public path); falls back to `badge`. */
  logo?: string;
  /** Logo artwork sits on a dark background. */
  logoDark?: boolean;
  points?: string[];
}

export const experience: TimelineEntry[] = [
  {
    role: 'Full-Stack Developer',
    org: 'Open Systèmes',
    badge: 'OS',
    logo: '/images/logos/opensystemes.webp',
    period: 'June 2024 — Present',
    place: 'Morocco · Hybrid',
    accent: 'indigo',
    current: true,
    points: [
      'Build and maintain web applications and new product features.',
      'Ship responsive interfaces with React, Next.js, and Tailwind CSS.',
      'Turn business requirements into technical solutions with designers, developers, and product.',
      'Keep the code fast, usable, and easy to maintain.',
    ],
  },
  {
    role: 'WordPress Developer & SEO Manager',
    org: 'Easy Take Travel',
    badge: 'ETT',
    logo: '/images/logos/easytaketravel.webp',
    period: 'Sep 2023 — Mar 2024',
    place: 'Marrakech',
    accent: 'sky',
    points: [
      "Built two WordPress sites for a travel agency: the agency's main website and a transportation site.",
      'Owned the SEO: site structure, content, and organic visibility.',
      'Ran Google Ads campaigns to bring in targeted traffic and online bookings.',
    ],
  },
  {
    role: 'Full-Stack Developer',
    org: 'Digital Speak Group',
    badge: 'DS',
    logo: '/images/logos/digitalspeak.webp',
    period: 'Nov 2022 — Mar 2023',
    place: 'Marrakech',
    accent: 'emerald',
    points: [
      'Built business websites and sales funnels focused on conversion.',
      'Worked with JavaScript, CSS, jQuery, WordPress, ClickFunnels, and System.io.',
      'Made sure every page held up on mobile and across browsers.',
    ],
  },
  {
    role: 'Front-End Developer Intern',
    org: 'Comabout Agency',
    badge: 'CA',
    logo: '/images/logos/comabout.webp',
    logoDark: true,
    period: 'Apr 2022 — Jun 2022',
    place: 'Marrakech',
    accent: 'amber',
    points: [
      'Built and maintained React.js applications with responsive UIs.',
      'Took part in code reviews with the dev team.',
      'Fixed bugs and polished the front-end experience.',
    ],
  },
  {
    role: 'Full-Stack Developer Intern',
    org: 'Comabout Agency',
    badge: 'CA',
    logo: '/images/logos/comabout.webp',
    logoDark: true,
    period: 'Mar 2021 — Jun 2021',
    place: 'Morocco · Hybrid',
    accent: 'amber',
    points: [
      'Built user-friendly interfaces alongside the design team.',
      'Tracked down and fixed application bugs.',
      'Helped plan features and improve stability.',
    ],
  },
];

export const education: TimelineEntry[] = [
  {
    role: 'ALX Software Engineering Program',
    org: 'ALX Africa / Holberton School',
    badge: 'ALX',
    logo: '/images/logos/alx.webp',
    period: '2023 — 2024',
    accent: 'indigo',
  },
  {
    role: 'Professional Licence',
    org: 'Higher School of Technology — Essaouira',
    badge: 'EST',
    logo: '/images/logos/est-essaouira.webp',
    period: '2021 — 2022',
    place: 'Essaouira',
    accent: 'sky',
    note: 'Computer Systems & Software Engineering · Mention Bien',
  },
  {
    role: 'University Diploma of Technology',
    org: 'ENS Marrakech — Université Cadi Ayyad',
    badge: 'ENS',
    logo: '/images/logos/ens-marrakech.webp',
    period: '2019 — 2021',
    place: 'Marrakech',
    accent: 'emerald',
    note: 'Software Engineering · Mention Bien',
  },
  {
    role: 'Baccalaureate',
    org: 'Lycée Technique Mohamed VI — Azilal',
    badge: 'BAC',
    logo: '/images/logos/bac-ministry.webp',
    period: '2018',
    place: 'Azilal',
    accent: 'amber',
    note: 'Physics & Chemistry',
  },
];
