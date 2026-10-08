// Captures high-resolution screenshots of live sites with the locally installed Chrome/Edge (no extra downloads).
//
//   npm run capture                          # every entry in scripts/capture-urls.json
//   npm run capture -- varimart cavelle      # only these names
//   node scripts/capture-screenshots.mjs --config other.json --out some/dir
//
// capture-urls.json is { "<name>": "https://site.example" }. Output is assets-src/screenshots/<name>.png,
// which `npm run images` then turns into the optimized WebP used by the slider.
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile } from 'node:fs/promises';
import { promisify } from 'node:util';

const run = promisify(execFile);

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

const browser = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(existsSync);
if (!browser) throw new Error('No Chrome or Edge found. Install one, or capture the screenshots manually.');

const WIDTH = 1440; // desktop layout
const HEIGHT = 3200; // 2.2x the width: the slider only shows the top of each page
const SCALE = 2; // retina-sharp; downscaled later by `npm run images`

const entries = Object.entries(JSON.parse(await readFile(configPath, 'utf8'))).filter(([name]) => !only.length || only.includes(name));
await mkdir(outDir, { recursive: true });

for (const [name, url] of entries) {
  const file = `${outDir}/${name}.png`;
  try {
    await run(
      browser,
      [
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        '--no-first-run',
        `--user-data-dir=${process.env.TEMP ?? '/tmp'}/capture-profile-${name}`,
        `--window-size=${WIDTH},${HEIGHT}`,
        `--force-device-scale-factor=${SCALE}`,
        '--virtual-time-budget=12000', // let fonts, lazy images and entrance animations settle
        `--screenshot=${file}`,
        url,
      ],
      { timeout: 60000 },
    );
    console.log(`ok    ${name}  <-  ${url}`);
  } catch (error) {
    console.log(`FAIL  ${name}  <-  ${url}  (${error.message.split('\n')[0]})`);
  }
}
