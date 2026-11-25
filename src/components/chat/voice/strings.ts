import type { ChatLang } from '../strings';
import type { VoiceError } from './useSpeechRecognition';

export const VOICE_LOCALES: Record<ChatLang, { code: string; label: string; name: string }> = {
  en: { code: 'en-US', label: 'EN', name: 'English (US)' },
  fr: { code: 'fr-FR', label: 'FR', name: 'Français (France)' },
  ar: { code: 'ar-MA', label: 'ع', name: 'العربية (المغرب)' },
};

interface VoiceStrings {
  record: string;
  stop: string;
  language: string;
  starting: string;
  listening: string;
  processing: string;
  privacy: string;
  dismiss: string;
  errors: Record<VoiceError, string>;
}

export const voiceStrings: Record<ChatLang, VoiceStrings> = {
  en: {
    record: 'Speak your question',
    stop: 'Stop recording',
    language: 'Voice language',
    starting: 'Allow the microphone to start…',
    listening: 'Listening…',
    processing: 'Processing…',
    privacy: 'Your browser may send audio to its speech service.',
    dismiss: 'Close message',
    errors: {
      denied: 'Microphone access is blocked. Allow it in your browser’s site settings, or type your question.',
      noMic: 'No microphone was found. You can type your question instead.',
      noSpeech: 'I didn’t hear anything. Tap the microphone and try again.',
      network: 'Voice recognition can’t reach its service. Check your connection, or type instead.',
      language: 'Your browser doesn’t support voice in this language. Pick another, or type instead.',
      failed: 'Voice input didn’t work. Please try again or type your question.',
    },
  },
  fr: {
    record: 'Dicter votre question',
    stop: 'Arrêter l’enregistrement',
    language: 'Langue de dictée',
    starting: 'Autorisez le micro pour commencer…',
    listening: 'Je vous écoute…',
    processing: 'Traitement…',
    privacy: 'Votre navigateur peut envoyer l’audio à son service vocal.',
    dismiss: 'Fermer le message',
    errors: {
      denied: 'L’accès au micro est bloqué. Autorisez-le dans les réglages du site, ou écrivez votre question.',
      noMic: 'Aucun micro détecté. Vous pouvez écrire votre question.',
      noSpeech: 'Je n’ai rien entendu. Touchez le micro et réessayez.',
      network: 'Le service de reconnaissance vocale est injoignable. Vérifiez la connexion, ou écrivez.',
      language: 'Votre navigateur ne prend pas en charge la dictée dans cette langue. Choisissez-en une autre, ou écrivez.',
      failed: 'La dictée n’a pas fonctionné. Réessayez ou écrivez votre question.',
    },
  },
  ar: {
    record: 'اطرح سؤالك بصوتك',
    stop: 'إيقاف التسجيل',
    language: 'لغة الصوت',
    starting: 'اسمح باستخدام الميكروفون للبدء…',
    listening: 'أنا أستمع…',
    processing: 'جارٍ المعالجة…',
    privacy: 'قد يرسل متصفحك الصوت إلى خدمة التعرف على الكلام الخاصة به.',
    dismiss: 'إغلاق الرسالة',
    errors: {
      denied: 'الوصول إلى الميكروفون محظور. اسمح به من إعدادات الموقع في المتصفح، أو اكتب سؤالك.',
      noMic: 'لم يتم العثور على ميكروفون. يمكنك كتابة سؤالك.',
      noSpeech: 'لم أسمع شيئًا. اضغط على الميكروفون وحاول مرة أخرى.',
      network: 'تعذر الوصول إلى خدمة التعرف على الصوت. تحقق من الاتصال أو اكتب سؤالك.',
      language: 'متصفحك لا يدعم الإملاء بهذه اللغة. اختر لغة أخرى أو اكتب سؤالك.',
      failed: 'لم ينجح الإدخال الصوتي. حاول مرة أخرى أو اكتب سؤالك.',
    },
  },
};
