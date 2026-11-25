// Portfolio assistant. POST /api/chat { messages, lang } -> the reply as a plain-text stream.
//
// Environment variables (Netlify > Project configuration > Environment variables):
//   OPENROUTER_API_KEY    required. Give the key a credit limit in OpenRouter: it is the hard spending cap.
//   OPENROUTER_MODEL      optional. Default: anthropic/claude-haiku-5.5
//   OPENROUTER_FALLBACK   optional. Used if the main model is unavailable. Default: google/gemini-3.5-flash-lite
import type { Config, Context } from '@netlify/functions';
import { buildSystemPrompt } from '../lib/knowledge.mts';
import { LIMITS, createLimiter, parseRequest } from '../lib/guard.mts';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'anthropic/claude-haiku-5.5';
const DEFAULT_FALLBACK = 'google/gemini-3.5-flash-lite';
const SITE = 'https://mechkouri.netlify.app';
const TIMEOUT_MS = 50_000; // Netlify stops a function at 60 s

const take = createLimiter();

const env = (name: string): string | undefined => {
  const g = globalThis as any;
  return g.Netlify?.env.get(name) ?? g.process?.env[name];
};

const fail = (status: number, error: string, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers },
  });

/** Browsers always send Origin on a POST; other sites must not be able to spend this key through visitors. */
function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(req.url).host;
  } catch {
    return false;
  }
}

/** Turns OpenRouter's server-sent events into the plain text of the reply. */
function toTextStream(upstream: ReadableStream<Uint8Array>, stop: () => void) {
  const reader = upstream.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';
  let sent = false;
  let finished = false;

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const end = (error?: string) => {
        stop();
        if (error) controller.error(new Error(error));
        else controller.close();
      };
      try {
        for (;;) {
          const chunk = await reader.read();
          buffer += chunk.done ? '\n' : decoder.decode(chunk.value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          let text = '';
          for (const line of lines) {
            if (!line.startsWith('data:')) continue; // comments and keep-alives
            const payload = line.slice(5).trim();
            if (payload === '[DONE]') {
              finished = true;
              continue;
            }
            let event: any;
            try {
              event = JSON.parse(payload);
            } catch {
              continue;
            }
            if (event.error) {
              console.error('OpenRouter stream error', event.error.code, event.error.message);
              return end('upstream_error');
            }
            text += event.choices?.[0]?.delta?.content ?? '';
            if (event.choices?.[0]?.finish_reason) finished = true;
          }

          if (text) {
            sent = true;
            controller.enqueue(encoder.encode(text));
          }
          // A cut-off or empty reply must reach the browser as an error, not as a complete answer.
          if (chunk.done) return end(finished && sent ? undefined : 'incomplete_reply');
          if (text) return;
        }
      } catch {
        end('upstream_error');
      }
    },
    cancel: stop,
  });
}

export default async (req: Request, context?: Context) => {
  if (req.method !== 'POST') return fail(405, 'method_not_allowed', { Allow: 'POST' });
  if (!sameOrigin(req)) return fail(403, 'forbidden');
  if (!req.headers.get('content-type')?.startsWith('application/json')) return fail(415, 'unsupported_media_type');

  const wait = take(context?.ip ?? req.headers.get('x-nf-client-connection-ip') ?? 'unknown');
  if (wait) return fail(429, 'rate_limited', { 'Retry-After': String(wait) });

  if (Number(req.headers.get('content-length') ?? 0) > LIMITS.bodyBytes) return fail(413, 'too_large');
  const raw = await req.text();
  if (new TextEncoder().encode(raw).length > LIMITS.bodyBytes) return fail(413, 'too_large');

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return fail(400, 'invalid_request');
  }
  const request = parseRequest(data);
  if (!request) return fail(400, 'invalid_request');

  const apiKey = env('OPENROUTER_API_KEY');
  if (!apiKey) return fail(503, 'not_configured');

  const model = env('OPENROUTER_MODEL') || DEFAULT_MODEL;
  const fallback = env('OPENROUTER_FALLBACK') || DEFAULT_FALLBACK;
  const today = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'Africa/Casablanca' }).format(new Date());

  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), TIMEOUT_MS);
  const stop = () => {
    clearTimeout(timer);
    abort.abort();
  };

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      signal: abort.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': SITE,
        'X-Title': 'Portfolio assistant',
      },
      body: JSON.stringify({
        models: fallback === model ? [model] : [model, fallback],
        messages: [{ role: 'system', content: buildSystemPrompt(request.lang, today) }, ...request.messages],
        stream: true,
        max_tokens: 700,
        temperature: 0.3,
        // Only use providers that don't keep visitors' messages for training.
        provider: { data_collection: 'deny' },
      }),
    });

    if (!res.ok || !res.body) {
      // Details stay in the function log; visitors only get a generic code.
      console.error('OpenRouter error', res.status, (await res.text()).slice(0, 500));
      stop();
      return res.status === 429 ? fail(429, 'busy', { 'Retry-After': '30' }) : fail(502, 'upstream_error');
    }

    return new Response(toTextStream(res.body, stop), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    const timedOut = abort.signal.aborted;
    stop();
    console.error('Chat request failed', timedOut ? 'timeout' : (error as Error).message);
    return timedOut ? fail(504, 'timeout') : fail(502, 'upstream_error');
  }
};

export const config: Config = {
  path: '/api/chat',
  // Enforced by Netlify across all instances, before the function runs.
  rateLimit: { action: 'rate_limit', windowLimit: 20, windowSize: 60, aggregateBy: ['ip', 'domain'] },
};
