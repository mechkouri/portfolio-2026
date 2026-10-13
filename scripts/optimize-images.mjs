// Converts the raw design assets in assets-src/ into optimized WebP files in public/images/.
import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';
import { parse } from 'node:path';

const OUT = 'public/images';
const jobs = [
  { src: 'assets-src/img1', out: 'logo.png', png: true },
  { src: 'assets-src/img2', out: 'portrait-studio.webp', width: 1536, quality: 86 },
  { src: 'assets-src/img7', out: 'portrait-office.webp', width: 1024, quality: 86 },
];

await mkdir(OUT, { recursive: true });
for (const job of jobs) {
  const img = sharp(job.src);
  const meta = await img.metadata();
  const pipeline = job.width && meta.width > job.width ? img.resize({ width: job.width }) : img;
  const info = job.png
    ? await pipeline.png({ compressionLevel: 9, palette: true }).toFile(`${OUT}/${job.out}`)
    : await pipeline.webp({ quality: job.quality ?? 82, effort: 6 }).toFile(`${OUT}/${job.out}`);
  console.log(`${job.out}: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} KB`);
}

// Company / school logos for the timeline nodes: trim whitespace, fit a 192px box (3x the node size).
await mkdir(`${OUT}/logos`, { recursive: true });
for (const file of await readdir('assets-src/logos')) {
  const out = `logos/${parse(file).name}.webp`;
  const info = await sharp(`assets-src/logos/${file}`)
    .trim({ threshold: 20 })
    .resize({ width: 192, height: 192, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 100, effort: 6 })
    .toFile(`${OUT}/${out}`);
  console.log(`${out}: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} KB`);
}

// Project screenshots: keep the whole page down to the footer (the cards scroll to the bottom on hover;
// the height cap is only WebP's 16383px limit), cap width at 1600px (sharp on retina at the slider's
// ~700px size), and re-encode. A fresh capture (.png from `npm run capture`)
// wins over an older low-res .webp with the same name.
await mkdir(`${OUT}/projects`, { recursive: true });
const shots = await readdir('assets-src/screenshots');
for (const file of shots) {
  const { name, ext } = parse(file);
  if (ext === '.webp' && shots.includes(`${name}.png`)) continue;
  const input = sharp(`assets-src/screenshots/${file}`);
  const meta = await input.metadata();
  // Keep the image under 10000px tall (phones decode these lazily; WebP allows 16383) by narrowing very tall pages.
  const MAX_H = 10000;
  const width = Math.min(meta.width, 1600, Math.round((MAX_H * meta.width) / meta.height));
  const maxHeight = 16000;
  const info = await input
    .resize({ width, withoutEnlargement: true })
    .extract({ left: 0, top: 0, width, height: Math.min(maxHeight, Math.round((meta.height * width) / meta.width)) })
    .webp({ quality: 85, effort: 6 })
    .toFile(`${OUT}/projects/${name}.webp`);
  console.log(`projects/${name}.webp: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} KB (source ${meta.width}px wide)`);
}
