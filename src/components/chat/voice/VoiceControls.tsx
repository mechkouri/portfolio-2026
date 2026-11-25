import { motion } from 'motion/react';
import { Loader2, Mic, Square, X } from 'lucide-react';
import type { ChatLang } from '../strings';
import { VOICE_LOCALES, voiceStrings } from './strings';
import type { VoiceError, VoiceStatus } from './useSpeechRecognition';

interface ControlsProps {
  lang: ChatLang;
  voiceLang: ChatLang;
  status: VoiceStatus;
  disabled: boolean;
  onLanguage: (lang: ChatLang) => void;
  onStart: () => void;
  onStop: () => void;
}

/** The language picker and microphone button that sit inside the message field. */
export function VoiceControls({ lang, voiceLang, status, disabled, onLanguage, onStart, onStop }: ControlsProps) {
  const v = voiceStrings[lang];
  const active = status !== 'idle';
  const label = active ? v.stop : v.record;

  return (
    <div className="flex shrink-0 items-center gap-1">
      <select
        value={voiceLang}
        onChange={(e) => onLanguage(e.target.value as ChatLang)}
        aria-label={v.language}
        title={`${v.language}: ${VOICE_LOCALES[voiceLang].name}`}
        className="h-9 w-11 cursor-pointer appearance-none rounded-pill bg-transparent text-center font-mono text-[11px] font-bold text-slate-500 [text-align-last:center] hover:bg-slate-100 hover:text-slate-900"
      >
        {(Object.keys(VOICE_LOCALES) as ChatLang[]).map((code) => (
          <option key={code} value={code} className="bg-white text-slate-900">
            {VOICE_LOCALES[code].label}
          </option>
        ))}
      </select>

      <span className="relative flex">
        {status === 'listening' &&
          [0, 0.6].map((delay) => (
            <motion.span
              key={delay}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-pill border border-red-500"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity, delay, ease: 'easeOut' }}
            />
          ))}
        <motion.button
          type="button"
          onClick={active ? onStop : onStart}
          disabled={disabled && !active}
          whileTap={{ scale: 0.88 }}
          aria-label={label}
          aria-pressed={active}
          title={label}
          className={`relative flex h-9 w-9 items-center justify-center rounded-pill transition-colors disabled:pointer-events-none disabled:opacity-30 ${
            active ? 'bg-red-600 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-red-400'
          }`}
        >
          {status === 'processing' ? (
            <Loader2 aria-hidden="true" size={17} className="animate-spin" />
          ) : active ? (
            <Square aria-hidden="true" size={12} fill="currentColor" />
          ) : (
            <Mic aria-hidden="true" size={18} />
          )}
        </motion.button>
      </span>
    </div>
  );
}

/** Says what the microphone is doing, or what went wrong, just above the field. */
export function VoiceStatusLine({ lang, status, error, onDismiss }: { lang: ChatLang; status: VoiceStatus; error: VoiceError | null; onDismiss: () => void }) {
  const v = voiceStrings[lang];

  return (
    <>
      {/* Always mounted, so screen readers announce each change. */}
      <div role="status" className="text-xs">
        {status !== 'idle' && (
          <div className="flex items-center gap-2 pb-2">
            <span aria-hidden="true" className="flex h-3.5 items-center gap-0.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.span
                  key={i}
                  className="w-0.5 rounded-full bg-red-400"
                  animate={{ height: status === 'listening' ? [4, 14, 6, 11, 4] : 4 }}
                  transition={{ duration: 0.9, repeat: status === 'listening' ? Infinity : 0, delay: i * 0.1 }}
                />
              ))}
            </span>
            <span className="shrink-0 font-semibold text-slate-900">{v[status]}</span>
            <span className="min-w-0 text-[10px] leading-tight text-slate-500">{v.privacy}</span>
          </div>
        )}
      </div>

      {error && status === 'idle' && (
        <div role="alert" className="mb-2 flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/10 py-1.5 ps-2.5 pe-1 text-xs text-slate-800">
          <p className="min-w-0 flex-1 py-0.5">{v.errors[error]}</p>
          <button type="button" onClick={onDismiss} aria-label={v.dismiss} title={v.dismiss} className="flex h-6 w-6 shrink-0 items-center justify-center rounded-pill text-slate-500 hover:text-slate-900">
            <X aria-hidden="true" size={13} />
          </button>
        </div>
      )}
    </>
  );
}
