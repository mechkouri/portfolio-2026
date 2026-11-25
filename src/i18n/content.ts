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
  // keep in the same order as the projects in data/content.ts (featured first, then the rest)
  {
    imageAlt: 'Capture pleine page du site de la conférence internationale SWSM 2026',
    category: 'Site d’événement // Conférence',
    title: 'IWA SWSM 2026 — Site d’une conférence internationale',
    description:
      'Site officiel d’une conférence internationale, développé de A à Z avec WordPress et Elementor. WooCommerce et une passerelle de paiement gèrent les frais d’inscription, et des plugins sur mesure gèrent l’inscription des participants et synchronisent les données avec l’application mobile de la conférence via des endpoints REST. Le site est aussi connecté à des agents IA via un serveur MCP pour la gestion du contenu.',
    tags: ['WordPress', 'WooCommerce', 'Plugins sur mesure', 'API REST', 'PHP', 'MCP'],
  },
  {
    imageAlt: 'Capture pleine page du site Normes HACCP pour les professionnels de la restauration',
    category: 'Sécurité alimentaire // Site WordPress',
    title: 'Normes HACCP — Site WordPress pour la restauration',
    description:
      'Site d’une plateforme qui aide restaurants, boulangeries et boucheries à gérer leur conformité HACCP. J’ai construit le site, mis en place le SEO et la structure du contenu, et automatisé une partie du workflow.',
    tags: ['WordPress', 'SEO', 'Automatisation', 'Systèmes métier'],
  },
  {
    imageAlt: 'Capture du tableau de bord de l’application web Normes HACCP : températures, livraisons à contrôler, nettoyage et étiquettes produits',
    category: 'Sécurité alimentaire // Application web SaaS',
    title: 'Normes HACCP — Application web de traçabilité alimentaire',
    description:
      'Application web pour restaurants, boulangeries et boucheries, qui digitalise les procédures d’hygiène et les contrôles sanitaires : traçabilité des produits, gestion des lots et des dates de péremption, suivi des températures, plans de nettoyage, tableaux de bord et alertes. J’ai développé le front-end React, avec l’assistance de Claude Code.',
    tags: ['React', 'TypeScript', 'Claude Code'],
  },
  {
    imageAlt: 'Capture pleine page du site AGRI 4.0, entreprise de technologies agricoles intelligentes',
    category: 'AgriTech // Site WordPress',
    title: 'AGRI 4.0 — Site Web AgriTech',
    description:
      'Site d’une entreprise spécialisée dans les technologies agricoles intelligentes. Thème WordPress personnalisé avec Elementor et code sur mesure, SEO on-page, et un workflow Make.com qui rédige et publie automatiquement les articles de blog sur WordPress.',
    tags: ['WordPress', 'Elementor', 'Make.com', 'SEO'],
  },
  {
    imageAlt: 'Capture pleine page du site de l’agence de marketing agricole AtlasGenix',
    category: 'Agence marketing // Secteur agricole',
    title: 'AtlasGenix — Site Web de Marketing Digital',
    description:
      'Site d’une agence marocaine de marketing et de communication spécialisée dans l’agriculture, l’agroalimentaire et l’AgriTech. Thème WordPress personnalisé avec Elementor et code sur mesure, sections services, projets et offres, et SEO on-page.',
    tags: ['WordPress', 'Elementor', 'SEO', 'Code sur mesure'],
  },
  {
    imageAlt: 'Capture pleine page du site du sushi corner Mochis Mochis',
    category: 'Restauration // Cuisine asiatique',
    title: 'Mochis Mochis — Site Web',
    description:
      'Site d’une marque de sushi corners en France. Thème WordPress personnalisé avec Elementor et code sur mesure, SEO on-page, affichage adapté aux ordinateurs, tablettes et mobiles, et automatisation Make.com des articles de blog et des posts LinkedIn. J’ai aussi développé, avec Next.js et React, une application web de gestion de stock pour le stand de sushis : suivi des produits, des entrées et des sorties.',
    tags: ['WordPress', 'Elementor', 'Make.com', 'SEO', 'Next.js', 'React'],
  },
  {
    imageAlt: 'Capture pleine page du site du garage automobile Garage RKJ',
    category: 'Site vitrine // Garage automobile',
    description:
      'Site d’un garage automobile indépendant à Sète : mécanique, carrosserie et entretien toutes marques. Thème WordPress personnalisé avec Elementor et code sur mesure, avec un SEO on-page pensé pour la recherche locale.',
    tags: ['WordPress', 'Elementor', 'SEO', 'Code sur mesure'],
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
  {
    imageAlt: 'Capture pleine page du site de l’intégrateur ERP Opensystemes',
    category: 'Site vitrine // Intégrateur ERP',
    title: 'Opensystemes — Site d’un intégrateur ERP',
    description:
      'Site d’Opensystemes by Infinitdeals, intégrateur ERP : logiciel ERP sur mesure, développement sur SAP, Sage et Odoo, intégration de solutions, conseil et services web.',
    tags: ['WordPress', 'Elementor'],
  },
  {
    imageAlt: 'Capture pleine page du site de l’agence digitale MediaElegant',
    category: 'Site vitrine // Agence digitale',
    title: 'MediaElegant — Site d’une agence digitale',
    description:
      'Site d’une agence digitale à Marrakech : création de sites, assistants IA, automatisation, SEO, marketing digital et design UI/UX, avec un assistant en ligne, des réalisations et un blog en français, anglais et arabe.',
    tags: ['Next.js'],
  },
  {
    imageAlt: 'Capture pleine page du site Wellness Futures Advisory',
    category: 'Site vitrine // Conseil bien-être',
    title: 'Wellness Futures Advisory',
    description:
      'Site d’un cabinet de conseil en bien-être hôtelier, actif au Maroc et en Suisse, avec ses services, son expertise, ses formations et ses articles, en anglais et en français.',
    tags: ['WordPress', 'Elementor'],
  },
  {
    imageAlt: 'Capture pleine page du site personnel de Sophie Agullana',
    category: 'Site personnel // Stratégie bien-être',
    title: 'Sophie Agullana — Stratège bien-être et hôtellerie',
    description:
      'Site personnel d’une stratège en bien-être et hôtellerie : parcours, services, méthode, partenaires et journal, en anglais et en français.',
    tags: ['WordPress', 'Elementor'],
  },
];

const frTech: Overlay<(typeof base.techCategories)[number]> = [
  { title: 'Frontend' },
  {
    title: 'Backend & API',
    items: ['Node.js', 'PHP', 'APIs REST', 'PostgreSQL', 'MySQL', 'MongoDB', 'FastAPI', 'Authentification'],
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
    period: 'Juin 2024 — Nov. 2026',
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
