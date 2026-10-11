// Localised portfolio content. English lives in data/content.ts; French is an overlay of text-only
// fields merged by position onto the English entries, so icons, images, URLs and accents are
// defined once and the two languages can never drift apart structurally.
import * as base from '../data/content';
import type { Lang } from './ui';

type Overlay<T> = Partial<T>[];

function merge<T extends object>(source: T[], overlay: Overlay<T>): T[] {
  return source.map((item, i) => ({ ...item, ...overlay[i] }));
}

const frSite: Partial<typeof base.site> = {
  role: 'Développeur Full-Stack',
  positioning: 'Développeur Full-Stack · WordPress · SEO & Automatisation · Développement assisté par IA',
  tagline: 'Full-Stack · WordPress · SEO',
  country: 'Maroc',
};

const frSections: Record<string, { eyebrow: string; nav?: string }> = {
  experience: { eyebrow: 'Expérience', nav: 'Expérience' },
  work: { eyebrow: 'Projets sélectionnés', nav: 'Projets' },
  ai: { eyebrow: 'IA + Ingénierie' },
  services: { eyebrow: 'Ce que je fais', nav: 'Services' },
  automation: { eyebrow: 'Automatisation', nav: 'Automatisation' },
  about: { eyebrow: 'À propos', nav: 'À propos' },
  skills: { eyebrow: 'Compétences' },
  education: { eyebrow: 'Formation' },
  contact: { eyebrow: 'Me contacter', nav: 'Contact' },
};

const frHeroHighlights = [
  'Applications React & Next.js',
  'Sites WordPress & landing pages',
  'SEO technique & Search Console',
  'Workflows n8n & Make.com',
];

const frIntroFacts: Overlay<(typeof base.introFacts)[number]> = [
  { title: 'Depuis 2021', label: 'Je construis pour le web' },
  { title: '5 postes', label: 'Agences & équipes produit' },
  { title: 'UTC+1', label: 'Marrakech, Maroc' },
];

const frServices: Overlay<base.Service> = [
  {
    kicker: '01 // Applications web',
    title: 'Développement Full-Stack',
    description: 'Des applications web responsives en React, Next.js et TypeScript, de l’interface jusqu’à l’API.',
    tech: ['React', 'Next.js', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Node.js'],
  },
  {
    kicker: '02 // CMS & sites web',
    title: 'Développement WordPress',
    description: 'Sites vitrines, landing pages et sites multilingues que vous pouvez mettre à jour vous-même après la mise en ligne.',
    tech: ['WordPress', 'Elementor', 'WooCommerce', 'Sites multilingues', 'Intégrations sur mesure'],
  },
  {
    kicker: '03 // Recherche',
    title: 'SEO',
    description: 'SEO technique, structure du site, indexation, contenu et performance, suivis dans Search Console et Analytics.',
    tech: ['SEO technique', 'Structure du site', 'Optimisation de contenu', 'Search Console', 'Google Analytics'],
  },
  {
    kicker: '04 // Sites & tunnels de vente',
    title: 'Développement Web',
    description: 'Sites vitrines, landing pages et tunnels de vente qui fonctionnent sur tous les écrans et sont conçus pour convertir.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'ClickFunnels', 'System.io', 'Design responsive'],
  },
];

const frPipeline: Overlay<(typeof base.pipelineNodes)[number]> = [
  { title: 'Déclencheur', detail: 'Webhook, formulaire, feuille ou tâche planifiée' },
  { title: 'Traitement', detail: 'Validation, nettoyage, formatage, filtrage' },
  { title: 'IA', detail: 'Raisonnement LLM, génération, métadonnées' },
  { title: 'Intégration', detail: 'APIs REST, base de données, WordPress, CRM' },
  { title: 'Action', detail: 'Publier, envoyer une alerte, enregistrer le résultat' },
];

const frWorkflows: Overlay<(typeof base.workflows)[number]> = [
  {
    title: 'Automatisation de contenu SEO',
    badge: 'n8n + IA',
    steps: ['Idée', 'Mot-clé', 'Article assisté par IA', 'Métadonnées', 'Image', 'WordPress', 'Publication'],
    note: 'Part d’un sujet, aboutit à un article optimisé SEO sur WordPress.',
  },
  {
    title: 'Automatisation des leads',
    badge: 'Make.com',
    steps: ['Envoi du formulaire', 'Traitement des données', 'CRM / Feuille', 'Notification', 'Relance'],
    note: 'Chaque formulaire est enregistré, routé et relancé. Plus de copier-coller.',
  },
  {
    title: 'Diffusion de contenu',
    badge: 'Multicanal',
    steps: ['Création du contenu', 'Mise en forme', 'Plusieurs plateformes', 'Publication planifiée'],
    note: 'On l’écrit une fois, puis on le met en forme et on le planifie pour chaque plateforme.',
  },
  {
    title: 'Automatisation métier',
    badge: 'APIs sur mesure',
    steps: ['Déclencheur', 'Logique', 'Intégrations API', 'Base de données / mise à jour', 'Notification'],
    note: 'Relie les outils qu’une entreprise utilise déjà pour que les données restent synchronisées.',
  },
];

const frProjects: Overlay<base.Project> = [
  {
    imageAlt: 'Capture pleine page du site de la conférence internationale SWSM 2026',
    category: 'Site d’événement // Conférence',
    title: 'SWSM 2026 — Site d’une conférence internationale',
    description:
      'Le site d’une conférence scientifique internationale. J’ai organisé et construit tout ce dont les participants ont besoin au même endroit : programme, comités, inscription, soumission d’articles, lieu et infos pratiques.',
    tags: ['WordPress', 'UI/UX', 'Développement responsive', 'Architecture de l’information'],
  },
  {
    imageAlt: 'Capture pleine page du site Normes HACCP pour les professionnels de la restauration',
    category: 'Sécurité alimentaire // Plateforme WordPress',
    title: 'Normes HACCP — Plateforme pour la restauration',
    description:
      'Aide les restaurants, boulangeries et boucheries à gérer leur conformité HACCP. J’ai construit le site, mis en place le SEO et la structure du contenu, et automatisé une partie du workflow.',
    tags: ['WordPress', 'SEO', 'Automatisation', 'Systèmes métier'],
  },
  {
    imageAlt: 'Capture pleine page de la boutique en ligne Equipements Cuisine',
    category: 'E-commerce // Équipement de restauration',
    description: 'Boutique en ligne d’équipements de cuisine professionnelle, avec catégories de produits, offres de la semaine et blog.',
  },
  {
    imageAlt: 'Capture pleine page de la boutique d’étiquettes Jungle Papper',
    category: 'E-commerce // Étiquettes',
    description: 'Boutique d’étiquettes thermiques et adhésives compatibles, classées par marque d’imprimante : Dymo, Zebra, Brother.',
  },
  {
    imageAlt: 'Capture pleine page de la place de marché en ligne Varimart',
    category: 'E-commerce // Place de marché',
    description: 'Place de marché en ligne pour la maison, la cuisine et le style de vie, avec meilleures ventes, packs promo et blog.',
  },
  {
    imageAlt: 'Capture pleine page de la landing page du sac à dos en cuir Cavelle',
    category: 'Landing page // Produit unique',
    title: 'Cavelle — Sac Selim',
    description: 'Page produit unique pour une marque de sacs à dos en cuir : histoire du produit, comparatif, avis, FAQ et formulaire de commande.',
  },
  {
    imageAlt: 'Capture pleine page du site de voyages Easy Take Travel',
    category: 'Voyage // Circuits',
    description: 'Site d’une agence de voyages marocaine, avec circuits et excursions dans le désert, destinations et recherche de voyage.',
  },
  {
    imageAlt: 'Capture pleine page du site de papier pour tickets de caisse Tickets De Caisse',
    category: 'Landing page // Papier tickets de caisse',
    description: 'Site produit pour rouleaux de papier thermique, avec cas d’usage, caractéristiques techniques, FAQ et offre newsletter.',
  },
  {
    imageAlt: 'Capture pleine page du site du salon de beauté Maya Beauty House',
    category: 'Site vitrine // Salon de beauté',
    description: 'Site d’un salon de beauté à Montpellier, avec prestations, réservation en ligne, offre spéciale et blog.',
  },
];

const frTech: Overlay<(typeof base.techCategories)[number]> = [
  { title: 'Frontend' },
  {
    title: 'Backend & API',
    items: ['Node.js', 'APIs REST', 'PostgreSQL', 'MySQL', 'MongoDB', 'FastAPI', 'Authentification'],
  },
  { title: 'WordPress & Web' },
  {
    title: 'Automatisation & IA',
    items: ['n8n', 'Make.com', 'Webhooks', 'Agents IA', 'Intégrations d’API', 'Développement assisté par IA', 'MCP'],
  },
  { title: 'Cloud & DevOps' },
  {
    title: 'Design & méthode',
    items: ['Figma', 'Git', 'GitHub', 'Design responsive', 'UI/UX', 'Performance web'],
  },
];

const frExperience: Overlay<base.TimelineEntry> = [
  {
    role: 'Développeur Full-Stack · WordPress · SEO · Automatisation',
    period: 'Juin 2024 — Aujourd’hui',
    place: 'Maroc · À distance',
    points: [
      'Je crée des sites WordPress à partir de thèmes professionnels ou de zéro avec Elementor, en ajoutant du code sur mesure quand un thème ne suffit pas.',
      'Je développe des plugins et des fonctionnalités WordPress sur mesure, et je construis et maintiens des applications web.',
      'Je m’occupe du SEO on-page et off-page, ainsi que de la vitesse, des Core Web Vitals, de la sécurité et de la maintenance continue.',
      'J’automatise la production de contenu avec Make.com et n8n : création et publication d’articles de blog SEO, et publications sur les réseaux sociaux.',
      'Je connecte sites web et services via des APIs et des webhooks.',
    ],
  },
  {
    role: 'Développeur WordPress & Responsable SEO',
    period: 'Sept. 2023 — Mars 2024',
    points: [
      'J’ai construit deux sites WordPress pour une agence de voyages : le site principal de l’agence et un site de transport.',
      'J’ai pris en charge le SEO : structure du site, contenu et visibilité organique.',
      'J’ai géré des campagnes Google Ads pour générer du trafic ciblé et des réservations en ligne.',
    ],
  },
  {
    role: 'Développeur Full-Stack',
    period: 'Nov. 2022 — Mars 2023',
    points: [
      'J’ai construit des sites vitrines et des tunnels de vente axés sur la conversion.',
      'J’ai travaillé avec JavaScript, CSS, jQuery, WordPress, ClickFunnels et System.io.',
      'Je me suis assuré que chaque page tienne bien sur mobile et dans tous les navigateurs.',
    ],
  },
  {
    role: 'Stagiaire Développeur Front-End',
    period: 'Avr. 2022 — Juin 2022',
    points: [
      'J’ai développé et maintenu des applications React.js avec des interfaces responsives.',
      'J’ai participé aux revues de code avec l’équipe de développement.',
      'J’ai corrigé des bugs et peaufiné l’expérience front-end.',
    ],
  },
  {
    role: 'Stagiaire Développeur Full-Stack',
    period: 'Mars 2021 — Juin 2021',
    place: 'Maroc · Hybride',
    points: [
      'J’ai construit des interfaces simples à utiliser avec l’équipe de design.',
      'J’ai repéré et corrigé des bugs dans les applications.',
      'J’ai contribué à la planification des fonctionnalités et à l’amélioration de la stabilité.',
    ],
  },
];

const frEducation: Overlay<base.TimelineEntry> = [
  { role: 'Programme de génie logiciel ALX' },
  {
    role: 'Licence Professionnelle',
    org: 'École Supérieure de Technologie — Essaouira',
    note: 'Systèmes informatiques et génie logiciel · Mention Bien',
  },
  {
    role: 'Diplôme Universitaire de Technologie',
    note: 'Génie logiciel · Mention Bien',
  },
  { role: 'Baccalauréat', note: 'Physique-Chimie' },
];

export function getContent(lang: Lang) {
  const en = {
    site: base.site,
    sections: base.sections as readonly { id: base.SectionId; eyebrow: string; nav?: string }[],
    navLinks: base.navLinks,
    heroStack: base.heroStack,
    heroHighlights: base.heroHighlights,
    heroTags: base.heroTags,
    introFacts: base.introFacts,
    services: base.services,
    pipelineNodes: base.pipelineNodes,
    workflows: base.workflows,
    projects: base.projects,
    techCategories: base.techCategories,
    experience: base.experience,
    education: base.education,
  };
  if (lang === 'en') return en;

  const sections = base.sections.map((s) => ({ ...s, ...frSections[s.id] })) as typeof en.sections;
  const homeLabel = 'Accueil';
  return {
    ...en,
    site: { ...base.site, ...frSite },
    sections,
    navLinks: [{ id: 'top', label: homeLabel }, ...sections.flatMap((s) => (s.nav ? [{ id: s.id, label: s.nav }] : []))],
    heroHighlights: frHeroHighlights,
    introFacts: merge(base.introFacts, frIntroFacts),
    services: merge(base.services, frServices),
    pipelineNodes: merge(base.pipelineNodes, frPipeline),
    workflows: merge(base.workflows, frWorkflows),
    projects: merge(base.projects, frProjects),
    techCategories: merge(base.techCategories, frTech),
    experience: merge(base.experience, frExperience),
    education: merge(base.education, frEducation),
  };
}

export type Content = ReturnType<typeof getContent>;
