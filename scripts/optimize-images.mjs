// Converts the raw design assets in assets-src/ into optimized WebP files in public/images/.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const OUT = 'public/images';
const jobs = [
  { src: 'assets-src/img1', out: 'logo.png', png: true },
  { src: 'assets-src/img2', out: 'portrait-studio.webp', width: 1024 },
  { src: 'assets-src/img7', out: 'portrait-office.webp', width: 1024 },
  { src: 'assets-src/img4', out: 'project-swsm.webp', width: 800 },
  { src: 'assets-src/img5', out: 'project-haccp.webp', width: 800 },
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
