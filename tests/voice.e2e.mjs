// Voice input in a real browser, with a simulated speech engine and a faked /api/chat (no mic, no cost).
// Needs the dev server running: npm run dev, then npm run test:voice (BASE_URL overrides the address).
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import puppeteer from 'puppeteer-core';

const BASE = process.env.BASE_URL ?? 'http://localhost:5173/';
const executablePath = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(existsSync);
const browser = await puppeteer.launch({ executablePath, headless: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failures = 0;

/** Replaces the browser's engine with one the test drives by hand. */
const fakeEngine = () => {
  window.__sessions = [];
  class Fake {
    start() { this.started = true; window.__sessions.push(this); }
    stop() { this.stopped = true; setTimeout(() => this.onend?.(), 50); }
    abort() { this.aborted = true; setTimeout(() => { this.onerror?.({ error: 'aborted' }); this.onend?.(); }, 10); }
  }
  window.SpeechRecognition = undefined;
  window.webkitSpeechRecognition = Fake;
};

async function scenario(name, run, { engine = fakeEngine, width = 1280, height = 800, lang = 'en' } = {}) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  const errors = [];
  const sent = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.setViewport({ width, height });
  await page.evaluateOnNewDocument((l) => { localStorage.setItem('chat:lang', l); sessionStorage.setItem('chat:greeted', '1'); }, lang);
  await page.evaluateOnNewDocument(engine);
  await page.setRequestInterception(true);
  page.on('request', (r) => {
    if (!r.url().endsWith('/api/chat')) return r.continue();
    sent.push(JSON.parse(r.postData()));
    r.respond({ status: 200, contentType: 'text/plain; charset=utf-8', body: 'Fake reply.' });
  });
  try {
    await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 90_000 });
    await page.click('button[aria-expanded][title*="Said"], button[aria-expanded][title*="سعيد"]');
    await page.waitForSelector('#chat-panel textarea');
    await sleep(500);
    const t = {
      page,
      sent,
      mic: '#chat-panel button[aria-pressed][title]:has(svg):not([class*="font-mono"])',
      value: () => page.$eval('#chat-panel textarea', (e) => e.value),
      status: () => page.$eval('#chat-panel form [role=status]', (e) => e.innerText.trim()),
      alert: () => page.evaluate(() => document.querySelector('#chat-panel form [role=alert] p')?.textContent ?? null),
      sessions: () => page.evaluate(() => window.__sessions.map(({ lang, started, stopped, aborted }) => ({ lang, started, stopped: !!stopped, aborted: !!aborted }))),
      emit: async (type, payload) => {
        await page.evaluate((type, payload) => {
          const s = window.__sessions.at(-1);
          if (type === 'result') s.onresult({ results: payload.map((transcript) => [{ transcript }]) });
          else if (type === 'error') { s.onerror({ error: payload }); s.onend(); }
          else s['on' + type]?.();
        }, type, payload);
        await sleep(120);
      },
      pressMic: async () => {
        await page.evaluate(() => document.querySelector('#chat-panel form select').nextElementSibling.querySelector('button').click());
        await sleep(150);
      },
    };
    await run(t);
    assert.deepEqual(errors, []);
    console.log(`ok    ${name}`);
  } catch (error) {
    failures++;
    console.log(`FAIL  ${name}: ${error.message}`);
  } finally {
    await context.close();
  }
}

await scenario('microphone is only requested after a click', async (t) => {
  assert.deepEqual(await t.sessions(), []);
  await t.pressMic();
  assert.equal((await t.sessions()).length, 1);
  assert.match(await t.status(), /Allow the microphone/);
  await t.emit('audiostart');
  assert.match(await t.status(), /Listening/);
});

await scenario('transcript appears, can be edited, then goes to the chat API', async (t) => {
  await t.page.type('#chat-panel textarea', 'Hello.');
  await t.pressMic();
  await t.emit('audiostart');
  await t.emit('result', ['what is his']);
  await t.emit('result', ['what is his ', 'experience']);
  assert.equal(await t.value(), 'Hello. what is his experience');
  await t.emit('speechend');
  assert.match(await t.status(), /Processing/);
  await t.emit('end');
  assert.equal(await t.status(), '');
  assert.equal(await t.alert(), null);
  assert.equal(t.sent.length, 0, 'nothing is sent without the visitor');
  await t.page.type('#chat-panel textarea', '?');
  await t.page.keyboard.press('Enter');
  await sleep(500);
  assert.equal(t.sent[0].messages.at(-1).content, 'Hello. what is his experience?');
  assert.equal(await t.value(), '');
});

await scenario('stop button keeps the words; send while listening sends directly', async (t) => {
  await t.pressMic();
  await t.emit('audiostart');
  await t.emit('result', ['his skills']);
  await t.pressMic();
  await sleep(200);
  assert.equal((await t.sessions())[0].stopped, true);
  assert.equal(await t.value(), 'his skills');
  await t.page.$eval('#chat-panel textarea', (e) => e.focus());
  await t.pressMic();
  await t.emit('audiostart');
  await t.emit('result', ['and projects']);
  await t.page.click('#chat-panel button[type=submit]');
  await sleep(500);
  assert.equal(t.sent[0].messages.at(-1).content, 'his skills and projects');
  assert.equal((await t.sessions())[1].aborted, true);
  assert.equal(await t.value(), '');
});

await scenario('voice languages: en-US, fr-FR, ar-MA, and following the chat language', async (t) => {
  await t.pressMic();
  await t.emit('audiostart');
  await t.page.select('#chat-panel form select', 'fr');
  await sleep(200);
  await t.page.select('#chat-panel form select', 'ar');
  await sleep(200);
  const sessions = await t.sessions();
  assert.deepEqual(sessions.map((s) => s.lang), ['en-US', 'fr-FR', 'ar-MA']);
  assert.deepEqual(sessions.map((s) => s.aborted), [true, true, false]);
  await t.page.click('#chat-panel button[aria-label="Français"]');
  await sleep(300);
  assert.equal(await t.page.$eval('#chat-panel form select', (e) => e.value), 'fr');
  assert.equal((await t.sessions()).at(-1).aborted, true);
  await t.pressMic();
  assert.equal((await t.sessions()).at(-1).lang, 'fr-FR');
});

for (const [code, expected] of [
  ['not-allowed', /Microphone access is blocked/],
  ['service-not-allowed', /Microphone access is blocked/],
  ['audio-capture', /No microphone/],
  ['no-speech', /didn’t hear/],
  ['network', /can’t reach/],
  ['language-not-supported', /doesn’t support voice/],
  ['something-new', /didn’t work/],
]) {
  await scenario(`error "${code}" is explained, and typing still works`, async (t) => {
    await t.pressMic();
    await t.emit('error', code);
    assert.match(await t.alert(), expected);
    assert.equal(await t.status(), '');
    await t.page.type('#chat-panel textarea', 'typed');
    assert.equal(await t.value(), 'typed');
    assert.equal(await t.alert(), null);
  });
}

await scenario('silence, Escape, closing the chat and manual typing all end the session', async (t) => {
  await t.pressMic();
  await t.emit('end');
  assert.match(await t.alert(), /didn’t hear/);

  await t.pressMic();
  await t.emit('audiostart');
  await t.page.keyboard.press('Escape'); // focus is on the mic button
  await t.page.$eval('#chat-panel textarea', (e) => e.focus());
  await t.pressMic();
  await t.emit('audiostart');
  await t.page.focus('#chat-panel textarea');
  await t.page.keyboard.press('Escape');
  await sleep(200);
  assert.ok(await t.page.$('#chat-panel'), 'first Escape only stops the microphone');
  assert.equal((await t.sessions()).at(-1).aborted, true);

  await t.pressMic();
  await t.emit('audiostart');
  await t.page.type('#chat-panel textarea', 'x');
  await sleep(100);
  assert.equal((await t.sessions()).at(-1).aborted, true);

  await t.pressMic();
  await t.emit('audiostart');
  await t.page.click('#chat-panel button[aria-label="Close chat"]');
  await sleep(800);
  assert.equal((await t.sessions()).at(-1).aborted, true, 'microphone released on close');
});

await scenario(
  'unsupported browser: no microphone, normal typing',
  async (t) => {
    assert.equal(await t.page.$('#chat-panel form select'), null);
    await t.page.type('#chat-panel textarea', 'hi');
    await t.page.keyboard.press('Enter');
    await sleep(500);
    assert.equal(t.sent[0].messages.at(-1).content, 'hi');
  },
  { engine: () => { window.SpeechRecognition = undefined; window.webkitSpeechRecognition = undefined; } },
);

for (const [width, lang] of [[320, 'fr'], [375, 'ar']]) {
  await scenario(
    `fits a ${width}px phone (${lang})`,
    async (t) => {
      await t.pressMic();
      await t.emit('audiostart');
      const box = await t.page.evaluate(() => ({
        overflow: document.querySelector('#chat-panel form').scrollWidth - document.querySelector('#chat-panel form').clientWidth,
        field: document.querySelector('#chat-panel textarea').clientWidth,
      }));
      assert.equal(box.overflow, 0);
      assert.ok(box.field >= 120, `field is ${box.field}px`);
      if (process.env.SHOTS) await t.page.screenshot({ path: `${process.env.SHOTS}/voice-${width}.png` });
    },
    { width, height: 640, lang },
  );
}

await browser.close();
process.exit(failures ? 1 : 0);
