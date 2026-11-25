// A deliberately tiny Markdown subset (paragraphs, "-" lists, **bold**, links). It builds React elements,
// so model output can never inject HTML, and only links to Said's own pages and projects become clickable.
import type { ReactNode } from 'react';
import { projects, site } from '../../data/content';

const hostOf = (url: string) => new URL(url).hostname.replace(/^www\./, '');

const OWN_HOST = hostOf(site.portfolio);
const ALLOWED_HOSTS = new Set([OWN_HOST, 'github.com', 'linkedin.com', 'ma.linkedin.com', ...projects.flatMap((p) => (p.url ? [hostOf(p.url)] : []))]);

/** Returns a safe href, or null if the link should stay plain text. */
export function safeHref(raw: string): string | null {
  if (raw === `mailto:${site.email}` || raw === site.email) return `mailto:${site.email}`;
  if (raw === site.phoneHref) return raw;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    const host = url.hostname.replace(/^www\./, '');
    if (!ALLOWED_HOSTS.has(host)) return null;
    // On GitHub and LinkedIn only Said's own pages are linked.
    if (host === 'github.com' && !/^\/mechkouri(\/|$)/i.test(url.pathname)) return null;
    if (host.endsWith('linkedin.com') && !url.pathname.startsWith('/in/said-mechkouri')) return null;
    // Own-site links stay on whatever host is serving the page (production, preview or local).
    return host === OWN_HOST ? `${url.pathname}${url.search}${url.hash}` : url.href;
  } catch {
    return null;
  }
}

const TOKEN = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|(https:\/\/[^\s<>()]+[^\s<>().,;:!?'"،؛؟])|([\w.+-]+@[\w-]+\.[\w.-]*\w)/g;

function link(href: string, label: string, key: number): ReactNode {
  const external = href.startsWith('https:') || href.endsWith('.pdf');
  return (
    <a
      key={key}
      href={href}
      dir="auto"
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="font-medium break-all text-indigo-700 underline decoration-red-500/50 underline-offset-2 hover:decoration-red-400"
    >
      {label}
    </a>
  );
}

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(TOKEN)) {
    const [whole, bold, label, target, url, email] = match;
    const key = match.index;
    out.push(text.slice(last, key));
    if (bold) out.push(<strong key={key} className="font-semibold text-slate-900">{inline(bold)}</strong>);
    else {
      const href = safeHref(target ?? url ?? email);
      out.push(href ? link(href, label ?? url ?? email, key) : (label ?? whole));
    }
    last = key + whole.length;
  }
  out.push(text.slice(last));
  return out;
}

export function RichText({ text }: { text: string }) {
  const blocks: { list: boolean; lines: string[] }[] = [];
  let gap = true;
  for (const line of text.split('\n')) {
    if (!line.trim()) {
      gap = true;
      continue;
    }
    const item = /^\s*(?:[-*•]|\d+\.)\s+(.*)$/.exec(line);
    const previous = blocks.at(-1);
    if (!gap && previous && previous.list === Boolean(item)) previous.lines.push(item ? item[1] : line);
    else blocks.push({ list: Boolean(item), lines: [item ? item[1] : line] });
    gap = false;
  }

  return (
    <div className="space-y-2">
      {blocks.map((block, i) =>
        block.list ? (
          <ul key={i} dir="auto" className="list-disc space-y-1 ps-4 marker:text-red-400">
            {block.lines.map((line, j) => (
              <li key={j}>{inline(line)}</li>
            ))}
          </ul>
        ) : (
          <p key={i} dir="auto" className="whitespace-pre-line">
            {inline(block.lines.join('\n').replace(/^#+\s*/gm, ''))}
          </p>
        ),
      )}
    </div>
  );
}
