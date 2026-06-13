import sharp from 'sharp';
import { readdirSync, statSync, writeFileSync } from 'fs';
import { join, extname } from 'path';
const DIRS = [
  'src/assets/images/drive_zip',
  'src/assets/images/perfumes_pdf',
  'src/assets/images/perfumes_pdf2',
  'src/assets/images/nuevos/perfumes_v2',
];
const TARGET = 1400; // px width
let n=0, skipped=0;
for (const dir of DIRS) {
  let files=[]; try { files = readdirSync(dir); } catch { continue; }
  for (const f of files) {
    if (!/\.(jpe?g|png|webp)$/i.test(f)) continue;
    const p = join(dir, f);
    try {
      const meta = await sharp(p).metadata();
      const w = meta.width||0, h = meta.height||0;
      if (w >= 1200 && h >= 1200) { skipped++; continue; }
      const targetW = w < TARGET ? TARGET : w;
      let pipe = sharp(p, { failOn:'none' }).rotate()
        .resize({ width: targetW, kernel:'lanczos3', withoutEnlargement:false })
        .sharpen({ sigma: 0.8, m1: 0.8, m2: 2 });
      const ext = extname(f).toLowerCase();
      let buf;
      if (ext === '.png') buf = await pipe.png({ quality: 90, compressionLevel: 9 }).toBuffer();
      else if (ext === '.webp') buf = await pipe.webp({ quality: 92 }).toBuffer();
      else buf = await pipe.jpeg({ quality: 92, mozjpeg: true, progressive: true, chromaSubsampling:'4:4:4' }).toBuffer();
      writeFileSync(p, buf);
      n++;
    } catch(e) { console.error('FAIL', p, e.message); }
  }
}
console.log(`Processed: ${n}, skipped (already large): ${skipped}`);
