// Voice-to-text with the browser's own Web Speech API: free, no key, no server of ours.
// Note that some browsers (Chrome among them) send the audio to their vendor's speech service.
import { useCallback, useEffect, useRef, useState } from 'react';

export type VoiceStatus = 'idle' | 'starting' | 'listening' | 'processing';
export type VoiceError = 'denied' | 'noMic' | 'noSpeech' | 'network' | 'language' | 'failed';

/** The parts of the API used here; TypeScript's DOM library doesn't declare it. */
interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onaudiostart: (() => void) | null;
  onspeechend: (() => void) | null;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

type RecognitionClass = new () => Recognition;

function recognitionClass(): RecognitionClass | undefined {
  if (typeof window === 'undefined') return undefined;
  const w = window as unknown as { SpeechRecognition?: RecognitionClass; webkitSpeechRecognition?: RecognitionClass };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

const ERRORS: Record<string, VoiceError> = {
  'not-allowed': 'denied',
  'service-not-allowed': 'denied',
  'audio-capture': 'noMic',
  'no-speech': 'noSpeech',
  network: 'network',
  'language-not-supported': 'language',
};

/** If the browser never reports the end after "stop", give up waiting. */
const PROCESSING_TIMEOUT = 6_000;

export function useSpeechRecognition(onTranscript: (text: string) => void) {
  const [supported] = useState(() => Boolean(recognitionClass()));
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [error, setError] = useState<VoiceError | null>(null);
  const current = useRef<Recognition | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const callback = useRef(onTranscript);
  callback.current = onTranscript;

  /** Drops the session at once: nothing it hears afterwards is used. */
  const cancel = useCallback(() => {
    const recognition = current.current;
    current.current = null;
    clearTimeout(timer.current);
    recognition?.abort();
    setStatus('idle');
  }, []);

  /** Must be called from a click: that is when the browser asks for the microphone. */
  const start = useCallback(
    (lang: string) => {
      const Class = recognitionClass();
      if (!Class) return;
      cancel();
      setError(null);

      const recognition = new Class();
      recognition.lang = lang;
      recognition.continuous = false; // stops by itself after a pause
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      let heard = false;
      let failed = false;
      const mine = () => current.current === recognition;

      // "audiostart", not "start": the microphone is only live once permission has been granted.
      recognition.onaudiostart = () => mine() && setStatus('listening');
      recognition.onspeechend = () => mine() && setStatus('processing');
      recognition.onresult = (event) => {
        if (!mine()) return;
        // Rebuilt from every result each time, so repeated events can't duplicate words.
        const text = Array.from(event.results, (result) => result[0].transcript).join('');
        if (!text.trim()) return;
        heard = true;
        setStatus((now) => (now === 'starting' ? 'listening' : now));
        callback.current(text.trim());
      };
      recognition.onerror = (event) => {
        if (!mine() || event.error === 'aborted') return;
        failed = true;
        setError(ERRORS[event.error] ?? 'failed');
      };
      recognition.onend = () => {
        if (!mine()) return;
        current.current = null;
        clearTimeout(timer.current);
        setStatus('idle');
        if (!heard && !failed) setError('noSpeech');
      };

      current.current = recognition;
      setStatus('starting');
      try {
        recognition.start();
      } catch {
        current.current = null;
        setStatus('idle');
        setError('failed');
      }
    },
    [cancel],
  );

  /** Stops the microphone but keeps what was said. */
  const stop = useCallback(() => {
    const recognition = current.current;
    if (!recognition) return;
    setStatus('processing');
    recognition.stop();
    clearTimeout(timer.current);
    timer.current = setTimeout(cancel, PROCESSING_TIMEOUT);
  }, [cancel]);

  const dismissError = useCallback(() => setError(null), []);

  // Never leave the microphone on: closing the chat or hiding the tab ends the session.
  useEffect(() => {
    const onHide = () => document.hidden && cancel();
    document.addEventListener('visibilitychange', onHide);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      cancel();
    };
  }, [cancel]);

  return { supported, status, error, start, stop, cancel, dismissError };
}
