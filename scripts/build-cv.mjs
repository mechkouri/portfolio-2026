// Renders cv/cv.html to cv/Said-Mechkouri-CV.pdf with the locally installed Chrome/Edge.
// Prints the page count, so you can check the CV still fits on one page after editing.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import puppeteer from 'puppeteer-core';

const executablePath = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(existsSync);
if (!executablePath) throw new Error('Chrome or Edge not found');

const source = resolve('cv/cv.html');
const out = resolve('cv/Said-Mechkouri-CV.pdf');

const browser = await puppeteer.launch({ executablePath, headless: true });
try {
  const page = await browser.newPage();
  // Fonts are inlined as data URIs: Chrome can't open files on very deep Windows paths (260-char limit),
  // and this also makes the render independent of where the project sits on disk.
  const html = readFileSync(source, 'utf8').replace(/url\('(\.\.\/node_modules\/[^']+)'\)/g, (_, rel) => {
    const data = readFileSync(resolve(dirname(source), rel)).toString('base64');
    return `url(data:font/woff2;base64,${data})`;
  });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  // The .page box is fixed to A4 with hidden overflow, so measure the real content height.
  const fit = await page.evaluate(() => {
    const el = document.querySelector('.page');
    return { content: el.scrollHeight, box: el.clientHeight };
  });
  await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
  const pages = (readFileSync(out).toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
  console.log(`PDF: ${out}`);
  console.log(`pages: ${pages} | content ${fit.content}px / box ${fit.box}px ${fit.content > fit.box ? '(OVERFLOW: content is cut off)' : '(fits)'}`);
} finally {
  await browser.close();
}
