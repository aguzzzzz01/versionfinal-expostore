import sharp from 'sharp';
import { readdirSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';
const MAX_DIM = 1400, JPEG_Q = 82, PNG_Q = 82;
async function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) { await walk(p); continue; }
    if (!/\.(jpe?g|png)$/i.test(entry)) continue;
    try {
      const meta = await sharp(p).metadata();
      const w = meta.width || 0, h = meta.height || 0;
      const needsResize = Math.max(w, h) > MAX_DIM;
      const before = st.size;
      let pipeline = sharp(p, { failOn: 'none' }).rotate();
      if (needsResize) pipeline = pipeline.resize({ width: MAX_DIM, height: MAX_DIM, fit: 'inside', withoutEnlargement: true });
      pipeline = pipeline.sharpen({ sigma: 0.5 });
      const isPng = /\.png$/i.test(entry);
      const out = isPng
        ? await pipeline.png({ quality: PNG_Q, compressionLevel: 9, palette: true }).toBuffer()
        : await pipeline.jpeg({ quality: JPEG_Q, mozjpeg: true, progressive: true }).toBuffer();
      if (out.length < before * 0.95 || needsResize) {
        writeFileSync(p, out);
        console.log(`${(before/1024).toFixed(0)}KB->${(out.length/1024).toFixed(0)}KB ${w}x${h}${needsResize?' R':''} ${p}`);
      }
    } catch (e) { console.error('FAIL', p, e.message); }
  }
}
await walk('src/assets/images');
