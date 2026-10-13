// Captures high-resolution screenshots of live sites with the locally installed Chrome/Edge.
// (puppeteer-core only drives that browser; nothing is downloaded.)
//
//   npm run capture                          # every entry in scripts/capture-urls.json
//   npm run capture -- varimart cavelle      # only these names
//   node scripts/capture-screenshots.mjs --config other.json --out some/dir
//
// capture-urls.json is { "<name>": "https://site.example" }, or for a fussy site
//   { "<name>": { "url": "https://...", "tidy": false, "scroll": false } }
// (tidy: close/hide pop-ups; scroll: scroll the page once to trigger lazy loading). Output is assets-src/screenshots/<name>.png,
// which `npm run images` then turns into the optimized WebP used by the slider.
//
// Before shooting, the page is made presentable: cookie banners, newsletter pop-ups and chat widgets are
// closed or hidden, and the page is scrolled top to bottom so lazy-loaded images and entrance animations
// have run. Always look at the result: sites differ, and a capture of the wrong page is still "ok".
import { existsSync } from 'node:fs';
import { mkdir, readFile } from 'node:fs/promises';
import puppeteer from 'puppeteer-core';

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const [, value] = args.splice(i, 2);
  return value;
};
const configPath = flag('config', 'scripts/capture-urls.json');
const outDir = flag('out', 'assets-src/screenshots');
const only = args;

const executablePath = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(existsSync);
if (!executablePath) throw new Error('No Chrome or Edge found. Install one, or capture the screenshots manually.');

const WIDTH = 1440; // desktop layout
const HEIGHT = 900; // viewport; the capture itself is the full page (up to MAX_PAGE_HEIGHT)
// The project cards scroll their screenshot down to the bottom on hover, so capture down to the footer.
// Tall pages are shot at a lower scale so the bitmap (height x scale) stays under Chrome's 16384px
// limit; it never drops below 1.2, which is still enough for the 1600px-wide output.
const MAX_PAGE_HEIGHT = 13000;
const MAX_BITMAP = 16000;
const SCALE = 2; // retina-sharp; downscaled later by `npm run images`
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Runs in the page: close what can be closed, hide what can't. */
function tidyPage() {
  const closeSelectors = [
    '[aria-label*="close" i]',
    '[aria-label*="fermer" i]',
    '[class*="popup" i] [class*="close" i]',
    '[class*="modal" i] [class*="close" i]',
    '[id*="popup" i] [class*="close" i]',
    '[class*="cookie" i] button',
    '[id*="cookie" i] button',
    '.mfp-close',
    '.pum-close',
    '.elementor-popup-modal .dialog-close-button',
  ];
  for (const sel of closeSelectors) {
    document.querySelectorAll(sel).forEach((el) => {
      const text = (el.textContent || '').toLowerCase();
      // For cookie banners prefer the "decline / essential" style buttons over "accept all".
      if (sel.includes('cookie') && /accept|accepter|tout|allow|agree/.test(text) && !/refus|decline|reject|only|essential/.test(text)) return;
      try {
        el.click();
      } catch {
        /* ignore */
      }
    });
  }
  // Anything fixed to the screen would be burned into the middle of a tall capture. Keep the header
  // (fixed at the very top) and hide the rest: bottom bars, chat/back-to-top buttons, full-screen
  // overlays and pop-ups. Done by geometry rather than class names, so it works on any site.
  for (const el of document.querySelectorAll('body *')) {
    if (getComputedStyle(el).position !== 'fixed') continue;
    const r = el.getBoundingClientRect();
    const coversScreen = r.width >= innerWidth * 0.9 && r.height >= innerHeight * 0.5;
    const isTopBar = r.top <= 20 && r.height <= 160;
    if (coversScreen || !isTopBar) el.style.setProperty('display', 'none', 'important');
  }
  document.documentElement.style.setProperty('overflow', 'visible', 'important');
  document.body.style.setProperty('overflow', 'visible', 'important');
}

/** Scroll the whole page so lazy images load and reveal-on-scroll content runs, then return to the top. */
async function warmUp(page) {
  await page.evaluate(async () => {
    const step = Math.max(400, window.innerHeight * 0.8);
    for (let y = 0; y < Math.min(document.body.scrollHeight, 12000); y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 250));
    }
    window.scrollTo(0, 0);
  });
}

const entries = Object.entries(JSON.parse(await readFile(configPath, 'utf8'))).filter(([name]) => !only.length || only.includes(name));
await mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--hide-scrollbars', '--no-first-run'] });
try {
  for (const [name, entry] of entries) {
    const { url, tidy = true, scroll = true } = typeof entry === 'string' ? { url: entry } : entry;
    const page = await browser.newPage();
    try {
      await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: SCALE });
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
      // Some hosts show a short "checking your browser" page first. A normal visitor just waits for it,
      // so do the same (and give up with a clear message if it never goes away, e.g. a real CAPTCHA).
      await page
        .waitForFunction(() => !/checking your browser|just a moment|verify you are human/i.test(document.body?.innerText ?? ''), { timeout: 25000 })
        .catch(() => {
          throw new Error('blocked by a bot check; capture this site manually');
        });
      await page.waitForNetworkIdle({ idleTime: 800, timeout: 15000 }).catch(() => {});
      await sleep(1500);
      if (tidy) await page.evaluate(tidyPage);
      if (scroll) {
        await warmUp(page);
        await sleep(1200);
      }
      if (tidy) await page.evaluate(tidyPage); // pop-ups often open on a timer or on first scroll
      await sleep(600);
      const pageHeight = await page.evaluate(() => Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
      const height = Math.min(pageHeight, MAX_PAGE_HEIGHT);
      const scale = Math.max(1.2, Math.min(SCALE, MAX_BITMAP / height));
      if (scale !== SCALE) await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: scale });
      await page.screenshot({ path: `${outDir}/${name}.png`, clip: { x: 0, y: 0, width: WIDTH, height }, captureBeyondViewport: true });
      console.log(`ok    ${name}  <-  ${url}  (${pageHeight}px tall, scale ${scale.toFixed(2)}${pageHeight > MAX_PAGE_HEIGHT ? ', CUT at ' + MAX_PAGE_HEIGHT : ''})`);
    } catch (error) {
      console.log(`FAIL  ${name}  <-  ${url}  (${error.message.split('\n')[0]})`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}
