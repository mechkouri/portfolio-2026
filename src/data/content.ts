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
  GitBranch,
  LayoutDashboard,
  LogIn,
  Network,
  Palette,
  SlidersHorizontal,
  TrendingUp,
} from 'lucide-react';
import type { Accent } from '../lib/accents';

export const site = {
  name: 'Said Mechkouri',
  tagline: 'Engineer & Automations',
  location: 'Casablanca',
  timezone: 'UTC+1',
  github: 'https://github.com/Mechkouri',
  linkedin: 'https://linkedin.com',
  portfolio: 'https://mechkouri.netlify.app',
};

export const navLinks = [
  { id: 'services', label: 'Services' },
  { id: 'automation', label: 'Automation' },
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
];

export const heroStack = ['React', 'Next.js', 'WordPress'];
export const heroHighlights = [
  'Production React & Next.js interfaces',
  'Autonomous n8n & Make.com pipelines',
  'Enterprise WordPress & Technical SEO',
  'REST APIs, Postgres & AI Integrations',
];
export const heroTags = ['React.js', 'WordPress', 'n8n', 'Make.com', 'AI Workflows', 'Technical SEO'];

export const introAttributes: { title: string; label: string; color: string }[] = [
  { title: 'Clean', label: 'Architecture', color: 'text-indigo-600' },
  { title: 'Adaptive', label: 'Automations', color: 'text-sky-600' },
  { title: 'Measurable', label: 'Business ROI', color: 'text-emerald-600' },
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
    kicker: '01 // Web Interfaces',
    title: 'Frontend Development',
    description:
      'I build responsive and interactive web interfaces with a strong focus on usability, performance, and clean implementation.',
    tech: ['React.js', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'HTML', 'CSS', 'APIs'],
  },
  {
    icon: AppWindow,
    accent: 'sky',
    kicker: '02 // CMS & E-Commerce',
    title: 'WordPress & Web Development',
    description:
      'I create professional websites and landing pages designed around business goals, content, conversion, and maintainability.',
    tech: ['WordPress', 'Elementor', 'WooCommerce', 'Custom integrations', 'Multilingual websites'],
  },
  {
    icon: TrendingUp,
    accent: 'emerald',
    kicker: '03 // Search & Generative Discovery',
    title: 'SEO & GEO',
    description:
      'I optimize websites and content to improve visibility across search engines and emerging AI-driven discovery experiences.',
    tech: ['Technical SEO', 'On-page SEO', 'Rank Math', 'Google Search Console', 'Content optimization', 'GEO'],
  },
  {
    icon: Network,
    accent: 'amber',
    kicker: '04 // Autonomous Systems',
    title: 'AI & Workflow Automation',
    description:
      'I design automated workflows that connect tools, move data, publish content, and eliminate repetitive manual work.',
    tech: ['n8n', 'Make.com', 'Webhooks', 'APIs', 'AI models', 'WordPress', 'Google Sheets', 'Google Drive'],
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
    note: 'Eliminates editorial friction while strictly respecting schema & search requirements.',
  },
  {
    title: 'Lead Automation',
    badge: 'Make.com',
    accent: 'sky',
    steps: ['Form submission', 'Data processing', 'CRM / Sheet', 'Notification', 'Follow-up'],
    note: 'Zero dropped inquiries. Real-time Slack/WhatsApp pings and automated CRM ingestion.',
  },
  {
    title: 'Content Distribution',
    badge: 'Multi-Channel',
    accent: 'emerald',
    steps: ['Content creation', 'Formatting', 'Multiple platforms', 'Scheduled publishing'],
    note: 'Single source of truth adapted into tailored formats across modern channels.',
  },
  {
    title: 'Business Automation',
    badge: 'Custom APIs',
    accent: 'amber',
    steps: ['Trigger', 'Logic', 'API integrations', 'Database / update', 'Notification'],
    note: 'Connects ERPs, inventory backends, and billing tools into seamless synchronization.',
  },
];

export interface Project {
  domain: string;
  url?: string;
  image: string;
  imageAlt: string;
  accent: Accent;
  category: string;
  title: string;
  description: string;
  tags: string[];
  siteIcon: 'globe' | 'shield' | 'code';
}

export const projects: Project[] = [
  {
    domain: 'swsm-conference.org',
    image: '/images/project-swsm.webp',
    imageAlt: 'Full-page screenshot of the SWSM 2026 international conference website',
    accent: 'indigo',
    category: 'International Event // Conferences',
    title: 'SWSM 2026 — International Conference Website',
    description:
      'A professional conference platform built to organize and communicate a complete international event experience, including scientific content, committees, registration, submissions, venue information, and participant resources.',
    tags: ['WordPress', 'UI/UX', 'Responsive Dev', 'Info Architecture'],
    siteIcon: 'globe',
  },
  {
    domain: 'normes-haccp.cloud',
    image: '/images/project-haccp.webp',
    imageAlt: 'Full-page screenshot of the Normes HACCP digital platform for food-service businesses',
    accent: 'sky',
    category: 'Compliance // SaaS Portal',
    title: 'Normes HACCP — Digital Platform for Food-Service Professionals',
    description:
      'A specialized website focused on HACCP compliance and digital management for restaurants, bakeries, butcher shops, and other food-service businesses. The project combines website development, SEO, content strategy, and automated workflows.',
    tags: ['WordPress', 'SEO', 'Automation', 'Business Systems'],
    siteIcon: 'shield',
  },
  {
    domain: 'budgeviser.app',
    image: '/images/project-budgeviser.webp',
    imageAlt: 'Full-page screenshot of the Budgeviser financial planning web application',
    accent: 'indigo',
    category: 'Fintech SaaS // System Architecture',
    title: 'Budgeviser — Financial Planning & Wealth Analytics',
    description:
      'A high-converting web and mobile experience designed for personal money management, cross-device synchronization, and biometric-secured finance workflows.',
    tags: ['React', 'Tailwind CSS', 'Strapi', 'PostgreSQL', 'API Integration'],
    siteIcon: 'code',
  },
];

export const processSteps: { accent: Accent; title: string; description: string; label: string }[] = [
  { accent: 'indigo', title: 'Discover', description: 'Understand the business, users, goals, and technical requirements.', label: 'Input & Scope' },
  { accent: 'sky', title: 'Design', description: 'Create a clear structure and experience before writing the solution.', label: 'Architecture & UX' },
  { accent: 'amber', title: 'Build', description: 'Develop, integrate, and connect the necessary technologies.', label: 'Code & Pipelines' },
  { accent: 'emerald', title: 'Optimize', description: 'Improve performance, SEO, usability, and automation.', label: 'Speed & Search' },
  { accent: 'indigo', title: 'Launch', description: 'Deliver a reliable solution ready for real-world use and future growth.', label: 'Deployment & Handover' },
];

export const techCategories: { icon: LucideIcon; accent: Accent; title: string; items: string[] }[] = [
  { icon: Palette, accent: 'indigo', title: 'Frontend', items: ['React.js', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Bootstrap', 'HTML5', 'CSS3', 'jQuery'] },
  { icon: LayoutDashboard, accent: 'sky', title: 'Web & CMS', items: ['WordPress', 'Elementor', 'WooCommerce', 'Strapi'] },
  { icon: Database, accent: 'amber', title: 'Backend & Data', items: ['Django', 'PHP', 'MySQL', 'PostgreSQL', 'REST APIs'] },
  { icon: Bot, accent: 'emerald', title: 'Automation & AI', items: ['n8n', 'Make.com', 'AI APIs', 'Webhooks', 'Workflow Automation'] },
  { icon: ChartColumn, accent: 'indigo', title: 'SEO & Analytics', items: ['Rank Math', 'Google Search Console', 'Google Analytics', 'Technical SEO'] },
  { icon: GitBranch, accent: 'sky', title: 'Workflow', items: ['Git', 'GitHub', 'Figma', 'Agile', 'Scrum'] },
];

export interface TimelineEntry {
  role: string;
  org: string;
  badge: string;
  period: string;
  accent: Accent;
  current?: boolean;
  points: string[];
}

export const experience: TimelineEntry[] = [
  {
    role: 'Full-stack Developer',
    org: 'Open Systèmes',
    badge: 'OS',
    period: 'June 2024 - Present',
    accent: 'indigo',
    current: true,
    points: [
      'Collaborate with the design team to create a user-friendly and visually appealing interface for a new web application.',
      'Developing and maintaining web applications using React.js, TypeScript, and high-performance serverless backends.',
      'Architect detailed technical roadmaps outlining milestones, test suites, and scaling strategies for client products.',
    ],
  },
  {
    role: 'WordPress Developer & SEO Manager',
    org: 'Easy Take Travel',
    badge: 'ETT',
    period: 'Jun. 2023 - Mars 2024',
    accent: 'sky',
    points: [
      'Developed two high-traffic responsive websites for a premium travel agency, driving seamless booking logistics.',
      'Implemented advanced technical SEO strategies that increased organic SERP rankings by +180% within 6 months.',
      'Executed convention-optimized Google Ads funnels, significantly increasing qualified inbound reservation queries.',
    ],
  },
  {
    role: 'Front-end Developer',
    org: 'Digital Speak Group',
    badge: 'DS',
    period: 'Nov. 2022 - Mars 2023',
    accent: 'indigo',
    points: [
      'Engineered highly interactive landing pages and multi-step sales funnels using JavaScript, modern CSS, and CMS integrations.',
      'Collaborated closely with cross-functional design and product leads to achieve pixel-perfect fidelity and smooth 60fps animations.',
      'Enforced cross-browser compatibility standards and streamlined mobile-first layout responsiveness across devices.',
    ],
  },
];

// TODO(Said): the Stitch design has an EDUCATION tab but no education content.
// Replace this placeholder with your real degrees/certifications.
export const education: TimelineEntry[] = [
  {
    role: 'Your degree or certification',
    org: 'School / Institution',
    badge: 'ED',
    period: 'Year - Year',
    accent: 'indigo',
    points: ['Add a short description of what you studied and key achievements.'],
  },
];

export const aboutValues = [
  { title: 'Human-centric Technology', text: 'Software designed around actual user behaviors rather than abstract complexity.' },
  { title: 'Continuous Evolution', text: 'Regular experimentation with modern generative APIs and autonomous agents.' },
];
