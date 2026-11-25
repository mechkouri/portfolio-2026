import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowUp, FileText, Mail, RotateCcw, Square, Trash2, X } from 'lucide-react';
import { site } from '../../data/content';
import { RichText } from './richText';
import { Robot } from './Robot';
import { CHAT_LANGS, chatStrings, type ChatLang } from './strings';
import { MAX_INPUT, useChat } from './useChat';
import { VOICE_LOCALES } from './voice/strings';
import { useSpeechRecognition } from './voice/useSpeechRecognition';
import { VoiceControls, VoiceStatusLine } from './voice/VoiceControls';

const CV_URL = '/cv/Said-Mechkouri-CV.pdf';
const PHONE_QUERY = '(max-width: 639px)';

const chip =
  'inline-flex items-center gap-1.5 rounded-pill border border-slate-200 bg-slate-100/60 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-red-500/50 hover:text-slate-900';
const iconButton =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-pill text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-30';

/** On phones the panel covers the screen: follow the visible area (keyboard open or not) and lock the page behind. */
function usePhoneViewport() {
  const [box, setBox] = useState<{ top: number; height: number } | null>(null);

  useEffect(() => {
    const phone = window.matchMedia(PHONE_QUERY);
    const viewport = window.visualViewport;
    const update = () => {
      const on = phone.matches;
      document.documentElement.style.overflow = on ? 'hidden' : '';
      setBox(on && viewport ? { top: viewport.offsetTop, height: viewport.height } : null);
    };
    update();
    phone.addEventListener('change', update);
    viewport?.addEventListener('resize', update);
    viewport?.addEventListener('scroll', update);
    return () => {
      document.documentElement.style.overflow = '';
      phone.removeEventListener('change', update);
      viewport?.removeEventListener('resize', update);
      viewport?.removeEventListener('scroll', update);
    };
  }, []);

  return box;
}

function TypingDots({ label }: { label: string }) {
  return (
    <span role="status" aria-label={label} className="flex h-5 items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-red-400"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

interface Props {
  lang: ChatLang;
  onLangChange: (lang: ChatLang) => void;
  onClose: () => void;
}

export default function ChatPanel({ lang, onLangChange, onClose }: Props) {
  const s = chatStrings[lang];
  const rtl = lang === 'ar';
  const { messages, pending, error, send, retry, stop, clear } = useChat(lang);
  const [draft, setDraft] = useState('');
  const box = usePhoneViewport();

  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const stick = useRef(true);

  // Dictation: what is heard is added after whatever was already typed, and can be edited before sending.
  const typed = useRef('');
  const voice = useSpeechRecognition((heard) => setDraft((typed.current ? `${typed.current} ${heard}` : heard).slice(0, MAX_INPUT)));
  const [voiceLang, setVoiceLang] = useState<ChatLang>(lang);
  const recording = voice.status !== 'idle';

  // Switching the chat language also switches the voice language.
  const { cancel: cancelVoice, dismissError } = voice;
  useEffect(() => {
    cancelVoice();
    dismissError();
    setVoiceLang(lang);
  }, [lang, cancelVoice, dismissError]);

  const startVoice = (language: ChatLang) => {
    typed.current = draft.trim();
    voice.start(VOICE_LOCALES[language].code);
  };

  const changeVoiceLang = (next: ChatLang) => {
    setVoiceLang(next);
    voice.dismissError();
    // Mid-sentence switch: listen again in the new language.
    if (recording) {
      voice.cancel();
      voice.start(VOICE_LOCALES[next].code);
    }
  };

  const last = messages.at(-1);
  const waiting = pending && last?.role === 'user';

  // Follow the newest text unless the visitor scrolled up to read.
  useLayoutEffect(() => {
    const el = log.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [messages, pending, error, box?.height]);

  useEffect(() => {
    // Focus moves into the dialog. On phones not into the field, which would open the keyboard over the suggestions.
    (window.matchMedia(PHONE_QUERY).matches ? closeButton : input).current?.focus();
  }, []);

  // Grow the field with its text, up to four lines or so.
  useLayoutEffect(() => {
    const el = input.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
  }, [draft]);

  const submit = (text: string) => {
    if (pending || !text.trim()) return;
    voice.cancel(); // sending while still listening sends what is on screen
    voice.dismissError();
    stick.current = true;
    send(text);
    setDraft('');
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(draft);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit(draft);
    }
  };

  return (
    <motion.section
      id="chat-panel"
      role="dialog"
      aria-label={s.title}
      lang={lang}
      dir={rtl ? 'rtl' : 'ltr'}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 340, damping: 30 }}
      onKeyDown={(e) => {
        if (e.key !== 'Escape') return;
        // The first Escape only stops the microphone.
        if (recording) voice.cancel();
        else onClose();
      }}
      style={box ? { top: box.top, height: box.height } : undefined}
      // "dark" re-points the site's colour tokens for this subtree, whatever the page theme is.
      className="dark fixed inset-x-0 top-0 z-[60] flex h-dvh origin-bottom-right flex-col overflow-hidden bg-slate-50 text-slate-800 sm:inset-x-auto sm:top-auto sm:right-6 sm:bottom-24 sm:h-[min(640px,calc(100dvh-8rem))] sm:w-[400px] sm:[@media(max-height:560px)]:bottom-3 sm:[@media(max-height:560px)]:h-[calc(100dvh-1.5rem)] sm:rounded-[1.25rem] sm:border sm:border-slate-200 sm:shadow-2xl sm:shadow-black/40"
    >
      <div aria-hidden="true" className="h-px shrink-0 bg-gradient-to-r from-transparent via-red-500 to-transparent" />

      <header className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-3 py-2.5">
        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-pill border border-red-500/30 bg-red-500/10">
          <Robot className="h-8 w-8" />
          <span aria-hidden="true" className="absolute -end-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-display text-sm font-bold text-slate-900">{s.title}</h2>
          <p className="truncate text-[11px] text-slate-500">{s.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            voice.cancel();
            voice.dismissError();
            clear();
          }}
          disabled={!messages.length} aria-label={s.clear} title={s.clear} className={iconButton}>
          <Trash2 aria-hidden="true" size={16} />
        </button>
        <button ref={closeButton} type="button" onClick={onClose} aria-label={s.close} title={s.close} className={iconButton}>
          <X aria-hidden="true" size={18} />
        </button>
      </header>

      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 px-3 py-2">
        <nav aria-label={s.linksLabel} className="flex flex-wrap gap-1.5">
          <a href={CV_URL} target="_blank" rel="noopener noreferrer" className={chip} title={s.cv}>
            <FileText aria-hidden="true" size={13} className="text-red-400" /> CV
          </a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={chip}>
            LinkedIn
          </a>
          <a href={site.github} target="_blank" rel="noopener noreferrer" className={chip}>
            GitHub
          </a>
          <a href={`mailto:${site.email}`} className={chip} aria-label={s.email} title={site.email}>
            <Mail aria-hidden="true" size={13} />
          </a>
        </nav>
        <div role="group" aria-label={s.language} dir="ltr" className="flex shrink-0 rounded-pill border border-slate-200 p-0.5">
          {CHAT_LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => onLangChange(l.code)}
              aria-pressed={lang === l.code}
              aria-label={l.name}
              className={`min-w-7 rounded-pill px-1.5 py-1 font-mono text-[11px] font-bold transition-colors ${lang === l.code ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-slate-900'}`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={log}
        role="log"
        aria-live="polite"
        aria-busy={pending}
        tabIndex={0}
        onScroll={(e) => {
          const el = e.currentTarget;
          stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
        }}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-3 py-4 text-sm leading-relaxed"
      >
        <div className="max-w-[88%] rounded-2xl rounded-ss-md border border-slate-200 bg-white px-3.5 py-2.5">{s.welcome}</div>

        {messages.length === 0 && (
          <div role="group" aria-label={s.suggestionsLabel} className="flex flex-col items-start gap-2 pt-1">
            {s.suggestions.map((question, i) => (
              <motion.button
                key={question}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => submit(question)}
                className={`${chip} text-start`}
              >
                {question}
              </motion.button>
            ))}
          </div>
        )}

        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[88%] min-w-0 rounded-2xl px-3.5 py-2.5 break-words ${
                m.role === 'user' ? 'rounded-ee-md bg-gradient-to-br from-red-600 to-red-800 text-white' : 'rounded-ss-md border border-slate-200 bg-white'
              }`}
            >
              <span className="sr-only">{m.role === 'user' ? s.you : s.assistant}: </span>
              {m.role === 'user' ? (
                <p dir="auto" className="whitespace-pre-wrap">
                  {m.content}
                </p>
              ) : (
                <RichText text={m.content} />
              )}
            </div>
          </motion.div>
        ))}

        {waiting && (
          <div className="inline-block rounded-2xl rounded-ss-md border border-slate-200 bg-white px-3.5 py-2.5">
            <TypingDots label={s.typing} />
          </div>
        )}

        {error && (
          <div role="alert" className="rounded-2xl border border-red-500/40 bg-red-500/10 px-3.5 py-2.5 text-slate-800">
            <p>{s.errors[error]}</p>
            <button type="button" onClick={retry} className={`${chip} mt-2`}>
              <RotateCcw aria-hidden="true" size={13} /> {s.retry}
            </button>
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="shrink-0 border-t border-slate-200 bg-white px-3 pt-2.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <VoiceStatusLine lang={lang} status={voice.status} error={voice.error} onDismiss={voice.dismissError} />
        <div
          className={`flex items-end gap-1.5 rounded-2xl border bg-slate-50 p-1.5 transition-colors focus-within:border-red-500/60 ${recording ? 'border-red-500/70' : 'border-slate-300'}`}
        >
          <textarea
            ref={input}
            value={draft}
            onChange={(e) => {
              if (recording) voice.cancel(); // the visitor took over: don't overwrite their edit
              if (voice.error) voice.dismissError();
              setDraft(e.target.value);
            }}
            onKeyDown={onKeyDown}
            rows={1}
            maxLength={MAX_INPUT}
            // An empty field follows the interface language, so the placeholder reads correctly in Arabic.
            dir={draft ? 'auto' : undefined}
            aria-label={s.input}
            placeholder={s.placeholder}
            // 16px on phones stops iOS from zooming into the field.
            className="max-h-28 min-w-0 flex-1 resize-none bg-transparent px-2 py-1.5 text-base text-slate-900 outline-none placeholder:text-slate-400 sm:text-sm"
          />
          {voice.supported && (
            <VoiceControls
              lang={lang}
              voiceLang={voiceLang}
              status={voice.status}
              disabled={pending}
              onLanguage={changeVoiceLang}
              onStart={() => startVoice(voiceLang)}
              onStop={voice.stop}
            />
          )}
          {pending ? (
            <button type="button" onClick={stop} aria-label={s.stop} title={s.stop} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-slate-200 text-slate-900">
              <Square aria-hidden="true" size={12} fill="currentColor" />
            </button>
          ) : (
            <motion.button
              type="submit"
              disabled={!draft.trim()}
              whileTap={{ scale: 0.9 }}
              aria-label={s.send}
              title={s.send}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-red-600 text-white transition-colors hover:bg-red-500 disabled:opacity-35"
            >
              <ArrowUp aria-hidden="true" size={17} strokeWidth={2.5} />
            </motion.button>
          )}
        </div>
        <p className="pt-1.5 text-center text-[10px] text-slate-500">{s.disclaimer}</p>
      </form>
    </motion.section>
  );
}
