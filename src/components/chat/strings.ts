// Widget copy. Separate from i18n/ui.ts because the chat also speaks Arabic, which the site itself does not.
export type ChatLang = 'en' | 'fr' | 'ar';

export const CHAT_LANGS: { code: ChatLang; label: string; name: string }[] = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'ar', label: 'ع', name: 'العربية' },
];

export type ErrorKind = 'rate' | 'unavailable' | 'offline' | 'generic';

const en = {
  open: 'Chat with Said’s AI assistant',
  close: 'Close chat',
  title: 'Said’s AI assistant',
  subtitle: 'Answers from his portfolio and CV',
  language: 'Chat language',
  clear: 'Clear chat',
  welcome: 'Hi! I’m Said’s AI assistant. Ask me about his experience, projects, skills or services.',
  suggestionsLabel: 'Suggested questions',
  suggestions: [
    'What is Said’s experience?',
    'Show me his React and WordPress projects',
    'What can he automate with n8n or Make.com?',
    'How can he help with SEO?',
    'How do I contact him?',
  ],
  linksLabel: 'Said’s links',
  cv: 'CV (PDF, French)',
  email: 'Email',
  placeholder: 'Ask a question…',
  input: 'Your message',
  send: 'Send',
  stop: 'Stop',
  typing: 'The assistant is typing',
  you: 'You',
  assistant: 'Assistant',
  disclaimer: 'AI can make mistakes. Please don’t share sensitive information.',
  retry: 'Try again',
  errors: {
    rate: 'Too many messages in a short time. Please wait a moment, then try again.',
    unavailable: 'The assistant is unavailable right now. You can still reach Said by email or LinkedIn.',
    offline: 'You seem to be offline. Check your connection and try again.',
    generic: 'Something went wrong. Please try again.',
  } satisfies Record<ErrorKind, string>,
};

export type ChatStrings = typeof en;

const fr: ChatStrings = {
  open: 'Discuter avec l’assistant IA de Said',
  close: 'Fermer la discussion',
  title: 'Assistant IA de Said',
  subtitle: 'Réponses tirées de son portfolio et de son CV',
  language: 'Langue de la discussion',
  clear: 'Effacer la discussion',
  welcome: 'Bonjour ! Je suis l’assistant IA de Said. Posez-moi vos questions sur son parcours, ses projets, ses compétences ou ses services.',
  suggestionsLabel: 'Questions suggérées',
  suggestions: [
    'Quelle est l’expérience de Said ?',
    'Montrez-moi ses projets React et WordPress',
    'Que peut-il automatiser avec n8n ou Make.com ?',
    'Comment peut-il aider en SEO ?',
    'Comment le contacter ?',
  ],
  linksLabel: 'Liens de Said',
  cv: 'CV (PDF)',
  email: 'E-mail',
  placeholder: 'Posez une question…',
  input: 'Votre message',
  send: 'Envoyer',
  stop: 'Arrêter',
  typing: 'L’assistant écrit',
  you: 'Vous',
  assistant: 'Assistant',
  disclaimer: 'L’IA peut se tromper. Ne partagez pas d’informations sensibles.',
  retry: 'Réessayer',
  errors: {
    rate: 'Trop de messages en peu de temps. Patientez un instant, puis réessayez.',
    unavailable: 'L’assistant est indisponible pour le moment. Vous pouvez contacter Said par e-mail ou sur LinkedIn.',
    offline: 'Vous semblez hors ligne. Vérifiez votre connexion et réessayez.',
    generic: 'Une erreur s’est produite. Veuillez réessayer.',
  },
};

const ar: ChatStrings = {
  open: 'تحدّث مع المساعد الذكي لسعيد',
  close: 'إغلاق المحادثة',
  title: 'المساعد الذكي لسعيد',
  subtitle: 'إجابات من معرض أعماله وسيرته الذاتية',
  language: 'لغة المحادثة',
  clear: 'مسح المحادثة',
  welcome: 'مرحبًا! أنا المساعد الذكي لسعيد. اسألني عن خبرته ومشاريعه ومهاراته وخدماته.',
  suggestionsLabel: 'أسئلة مقترحة',
  suggestions: [
    'ما هي خبرة سعيد المهنية؟',
    'أرني مشاريعه في React وWordPress',
    'ما الذي يمكنه أتمتته باستخدام n8n أو Make.com؟',
    'كيف يمكنه المساعدة في تحسين محركات البحث (SEO)؟',
    'كيف يمكنني التواصل معه؟',
  ],
  linksLabel: 'روابط سعيد',
  cv: 'السيرة الذاتية (PDF بالفرنسية)',
  email: 'البريد',
  placeholder: 'اكتب سؤالك…',
  input: 'رسالتك',
  send: 'إرسال',
  stop: 'إيقاف',
  typing: 'المساعد يكتب',
  you: 'أنت',
  assistant: 'المساعد',
  disclaimer: 'قد يخطئ الذكاء الاصطناعي. من فضلك لا تشارك معلومات حساسة.',
  retry: 'إعادة المحاولة',
  errors: {
    rate: 'رسائل كثيرة في وقت قصير. انتظر لحظة ثم حاول مرة أخرى.',
    unavailable: 'المساعد غير متاح حاليًا. يمكنك التواصل مع سعيد عبر البريد أو LinkedIn.',
    offline: 'يبدو أنك غير متصل بالإنترنت. تحقق من اتصالك وحاول مرة أخرى.',
    generic: 'حدث خطأ ما. من فضلك حاول مرة أخرى.',
  },
};

export const chatStrings: Record<ChatLang, ChatStrings> = { en, fr, ar };
