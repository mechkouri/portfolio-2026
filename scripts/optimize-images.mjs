// Converts the raw design assets in assets-src/ into optimized WebP files in public/images/.
import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';
import { parse } from 'node:path';

const OUT = 'public/images';
const jobs = [
  { src: 'assets-src/img1', out: 'logo.png', png: true },
  { src: 'assets-src/img2', out: 'portrait-studio.webp', width: 1024 },
  { src: 'assets-src/img7', out: 'portrait-office.webp', width: 1024 },
  { src: 'assets-src/img6', out: 'project-budgeviser.webp', width: 800 },
];

await mkdir(OUT, { recursive: true });
for (const job of jobs) {
  const img = sharp(job.src);
  const meta = await img.metadata();
  const pipeline = job.width && meta.width > job.width ? img.resize({ width: job.width }) : img;
  const info = job.png
    ? await pipeline.png({ compressionLevel: 9, palette: true }).toFile(`${OUT}/${job.out}`)
    : await pipeline.webp({ quality: 82, effort: 6 }).toFile(`${OUT}/${job.out}`);
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

// Full-page project screenshots: keep the top of the page, cap width, and re-encode.
await mkdir(`${OUT}/projects`, { recursive: true });
for (const file of await readdir('assets-src/screenshots')) {
  const out = `projects/${parse(file).name}.webp`;
  const info = await sharp(`assets-src/screenshots/${file}`)
    .resize({ width: 720, withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(`${OUT}/${out}`);
  console.log(`${out}: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} KB`);
}
