// Generates responsive WebP + JPEG renditions for reference artwork and video posters.
// Usage: node scripts/optimize-images.mjs
import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';

const JOBS = [
  { srcDir: 'raw-assets/images', outDir: 'public/assets/reference', widths: [640, 1080] },
  { srcDir: 'raw-assets/video', outDir: 'public/assets/reference', widths: [640, 960] },
];
const WEBP_QUALITY = 78;
const JPEG_QUALITY = 80;

for (const job of JOBS) {
  await mkdir(job.outDir, { recursive: true });
  const files = (await readdir(job.srcDir)).filter((f) => /\.(png|jpe?g)$/i.test(f));
  for (const file of files) {
    const name = path.parse(file).name;
    const input = sharp(path.join(job.srcDir, file));
    const meta = await input.metadata();
    for (const w of job.widths) {
      const width = Math.min(w, meta.width ?? w);
      await input.clone().resize({ width }).webp({ quality: WEBP_QUALITY }).toFile(path.join(job.outDir, `${name}-${w}.webp`));
      await input.clone().resize({ width }).jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(path.join(job.outDir, `${name}-${w}.jpg`));
    }
    console.log(`${file}: ${meta.width}x${meta.height} → ${job.widths.join('/')}w webp+jpg`);
  }
}
