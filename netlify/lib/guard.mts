// Input validation and a small in-memory rate limiter for the chat function.

export type Lang = 'en' | 'fr' | 'ar';
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
export interface ChatRequest {
  messages: ChatMessage[];
  lang: Lang;
}

export const LIMITS = {
  bodyBytes: 40_000,
  userChars: 800,
  assistantChars: 4_000,
  /** Older turns are dropped, which also caps the cost of one request. */
  history: 10,
  perMinute: 8,
  perHour: 60,
  /** Ceiling per warm function instance. The hard spending cap is the credit limit on the OpenRouter key. */
  perDayTotal: 600,
};

/** Control characters (except tab and newline) have no place in a chat message. */
const stripControl = (value: string) =>
  [...value]
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code === 9 || code === 10 || (code >= 32 && code !== 127);
    })
    .join('');

/** Returns a clean request, or null if anything about it is off. Unknown fields and roles are never forwarded. */
export function parseRequest(data: unknown): ChatRequest | null {
  if (!data || typeof data !== 'object') return null;
  const { messages, lang } = data as { messages?: unknown; lang?: unknown };
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 60) return null;

  const clean: ChatMessage[] = [];
  for (const m of messages) {
    if (!m || typeof m !== 'object') return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null;
    const text = stripControl(content).trim();
    if (!text || text.length > (role === 'user' ? LIMITS.userChars : LIMITS.assistantChars)) return null;
    clean.push({ role, content: text });
  }
  if (clean[clean.length - 1].role !== 'user') return null;

  return { messages: clean.slice(-LIMITS.history), lang: lang === 'fr' || lang === 'ar' ? lang : 'en' };
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function createLimiter(now: () => number = Date.now) {
  const hits = new Map<string, number[]>();
  let day = { start: now(), count: 0 };

  /** Records a request. Returns 0 if allowed, otherwise the seconds to wait. */
  return function take(key: string): number {
    const t = now();
    if (t - day.start >= DAY) day = { start: t, count: 0 };
    if (day.count >= LIMITS.perDayTotal) return Math.ceil((day.start + DAY - t) / 1000);

    const recent = (hits.get(key) ?? []).filter((at) => t - at < HOUR);
    const lastMinute = recent.filter((at) => t - at < MINUTE);
    if (lastMinute.length >= LIMITS.perMinute) return Math.ceil((lastMinute[0] + MINUTE - t) / 1000);
    if (recent.length >= LIMITS.perHour) return Math.ceil((recent[0] + HOUR - t) / 1000);

    recent.push(t);
    if (hits.size > 5_000) hits.clear(); // bounded memory
    hits.set(key, recent);
    day.count += 1;
    return 0;
  };
}
