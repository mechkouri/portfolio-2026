import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChatLang, ErrorKind } from './strings';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const STORAGE_KEY = 'chat:history';
/** Kept in this browser only. */
const MAX_STORED = 30;
/** The server keeps the same number of turns. */
const MAX_SENT = 10;
export const MAX_INPUT = 800;

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

function load(): Message[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(saved)) return [];
    return saved
      .filter((m): m is Message => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string' && typeof m.id === 'string')
      .slice(-MAX_STORED);
  } catch {
    return [];
  }
}

function errorKind(status: number): ErrorKind {
  if (status === 429) return 'rate';
  if (status === 503 || status === 502 || status === 504 || status === 404) return 'unavailable';
  return 'generic';
}

export function useChat(lang: ChatLang) {
  const [messages, setMessages] = useState<Message[]>(load);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<ErrorKind | null>(null);
  const request = useRef<AbortController | null>(null);

  useEffect(() => {
    // Save finished turns only, not every streamed chunk.
    if (pending) return;
    try {
      if (messages.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_STORED)));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* history just won't be remembered */
    }
  }, [messages, pending]);

  useEffect(() => () => request.current?.abort(), []);

  /** Asks for the reply to `history`, which must end with a visitor message. */
  const ask = useCallback(
    async (history: Message[]) => {
      const abort = new AbortController();
      request.current?.abort();
      request.current = abort;
      setMessages(history);
      setError(null);
      setPending(true);

      const id = newId();
      let reply = '';
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: abort.signal,
          body: JSON.stringify({
            lang,
            messages: history.slice(-MAX_SENT).map(({ role, content }) => ({ role, content: content.slice(0, role === 'user' ? MAX_INPUT : 4000) })),
          }),
        });
        // A static host without the function answers with the HTML page: treat that as unavailable too.
        if (!res.ok || !res.body || !res.headers.get('content-type')?.startsWith('text/plain')) {
          setError(errorKind(res.ok ? 503 : res.status));
          return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          reply += decoder.decode(value, { stream: true });
          if (request.current === abort) setMessages([...history, { id, role: 'assistant', content: reply }]);
        }
        if (!reply.trim()) setError('generic');
      } catch {
        if (abort.signal.aborted) return; // stopped or cleared by the visitor
        setMessages(history); // drop the half answer
        setError(navigator.onLine ? 'generic' : 'offline');
      } finally {
        if (request.current === abort) setPending(false);
      }
    },
    [lang],
  );

  const send = useCallback(
    (text: string) => {
      const content = text.trim().slice(0, MAX_INPUT);
      if (!content || pending) return;
      // A question that failed earlier is replaced rather than sent twice in a row.
      const history = messages.at(-1)?.role === 'user' ? messages.slice(0, -1) : messages;
      void ask([...history, { id: newId(), role: 'user', content }]);
    },
    [ask, messages, pending],
  );

  const retry = useCallback(() => {
    const lastUser = messages.map((m) => m.role).lastIndexOf('user');
    if (lastUser >= 0) void ask(messages.slice(0, lastUser + 1));
  }, [ask, messages]);

  const stop = useCallback(() => {
    request.current?.abort();
    setPending(false);
  }, []);

  const clear = useCallback(() => {
    request.current?.abort();
    setPending(false);
    setError(null);
    setMessages([]);
  }, []);

  return { messages, pending, error, send, retry, stop, clear };
}
