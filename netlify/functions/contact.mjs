// Contact form handler: validates the message and emails it to the site owner as a branded HTML email
// through Resend (https://resend.com). Runs as a Netlify Function at /api/contact.
//
// Environment variables (Netlify > Project configuration > Environment variables):
//   RESEND_API_KEY  required. Without it the function answers 503 and the site falls back to Netlify Forms.
//   CONTACT_TO      optional. Where messages go. Default: saidmechkouri@gmail.com
//   CONTACT_FROM    optional. Sender. Default: "Portfolio <onboarding@resend.dev>", which Resend only lets you
//                   use to write to the email address of your own Resend account. To send from your own domain,
//                   verify it in Resend and set e.g. "Portfolio <contact@yourdomain.com>".

const DEFAULT_TO = 'saidmechkouri@gmail.com';
const DEFAULT_FROM = 'Portfolio <onboarding@resend.dev>';
const SITE = 'https://mechkouri.netlify.app';

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Strips line breaks so a visitor can't inject extra headers through the name or email. */
const oneLine = (value) => String(value).replace(/[\r\n]+/g, ' ').trim();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** The HTML email. Table layout and inline styles only: that is what email clients render reliably. */
export function renderEmail({ name, email, message, lang, when }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br />');
  const reply = `mailto:${encodeURIComponent(email).replace(/%40/g, '@')}?subject=${encodeURIComponent('Re: your message on mechkouri.netlify.app')}`;
  const initial = escapeHtml(name.trim().charAt(0).toUpperCase() || '?');
  const langLabel = lang === 'fr' ? 'Français' : 'English';

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<title>New message from ${safeName}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${safeName} wrote to you from your portfolio.</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f1f5f9;padding:32px 12px;">
  <tr><td align="center">
    <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;">

      <tr><td style="padding:0 4px 14px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#64748b;font-weight:600;">
        Said Mechkouri &middot; Portfolio
      </td></tr>

      <tr><td style="background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">

          <tr><td style="background:#4338ca;background-image:linear-gradient(135deg,#4338ca 0%,#2563eb 60%,#06b6d4 100%);padding:30px 32px;">
            <div style="font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#c7d2fe;font-weight:600;">New message</div>
            <div style="font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:26px;line-height:1.25;color:#ffffff;font-weight:700;margin-top:8px;">${safeName} wants to work with you</div>
          </td></tr>

          <tr><td style="padding:28px 32px 8px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td width="52" valign="top">
                  <div style="width:44px;height:44px;border-radius:22px;background:#eef2ff;color:#4338ca;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:18px;font-weight:700;line-height:44px;text-align:center;">${initial}</div>
                </td>
                <td valign="middle" style="font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                  <div style="font-size:16px;font-weight:700;color:#0f172a;">${safeName}</div>
                  <div style="font-size:14px;margin-top:2px;"><a href="mailto:${safeEmail}" style="color:#4338ca;text-decoration:none;">${safeEmail}</a></div>
                </td>
              </tr>
            </table>
          </td></tr>

          <tr><td style="padding:16px 32px 4px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#64748b;font-weight:700;">Message</td></tr>
          <tr><td style="padding:0 32px 8px;">
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #4338ca;border-radius:10px;padding:18px 20px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:#1e293b;">${safeMessage}</div>
          </td></tr>

          <tr><td style="padding:22px 32px 30px;">
            <a href="${reply}" style="display:inline-block;background:#4338ca;color:#ffffff;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:13px 26px;border-radius:10px;">Reply to ${safeName}</a>
          </td></tr>

          <tr><td style="border-top:1px solid #e2e8f0;padding:16px 32px;background:#f8fafc;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.7;color:#64748b;">
            Received ${escapeHtml(when)} (Marrakech time) &middot; Site language: ${langLabel}<br />
            Sent from the contact form on <a href="${SITE}" style="color:#4338ca;text-decoration:none;">mechkouri.netlify.app</a>. Hit reply and your answer goes straight to ${safeName}.
          </td></tr>
        </table>
      </td></tr>

      <tr><td align="center" style="padding:18px 8px 0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;color:#94a3b8;">
        This email was generated automatically by your portfolio.
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

  const text = `New message from ${name} <${email}>\n\n${message}\n\n---\nReceived ${when} (Marrakech time). Site language: ${langLabel}.\nReply to this email to answer ${name} directly.\n`;
  return { html, text };
}

export default async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' });

  let data;
  try {
    data = await req.json();
  } catch {
    return json(400, { error: 'invalid_json' });
  }

  // Honeypot: real visitors never fill this in. Pretend it worked so bots move on.
  if (typeof data.company === 'string' && data.company.trim() !== '') return json(200, { ok: true });

  const name = oneLine(data.name ?? '');
  const email = oneLine(data.email ?? '');
  const message = String(data.message ?? '').trim();
  const lang = data.lang === 'fr' ? 'fr' : 'en';

  if (!name || name.length > 100) return json(400, { error: 'invalid_name' });
  if (!EMAIL_PATTERN.test(email) || email.length > 200) return json(400, { error: 'invalid_email' });
  if (message.length < 3 || message.length > 5000) return json(400, { error: 'invalid_message' });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return json(503, { error: 'email_not_configured' });

  const when = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Africa/Casablanca' }).format(new Date());
  const { html, text } = renderEmail({ name, email, message, lang, when });

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || DEFAULT_FROM,
      to: [process.env.CONTACT_TO || DEFAULT_TO],
      reply_to: email,
      subject: `New message from ${name} · Portfolio`,
      html,
      text,
    }),
  });

  if (!res.ok) {
    console.error('Resend error', res.status, await res.text());
    return json(502, { error: 'send_failed' });
  }
  return json(200, { ok: true });
};

export const config = { path: '/api/contact' };
