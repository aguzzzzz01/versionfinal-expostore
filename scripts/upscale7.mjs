import sharp from 'sharp';
import { writeFileSync, existsSync } from 'fs';
const map = [
  ['/tmp/zipx/Bubble Gum EDP 50ML.jfif', 'src/assets/images/drive_zip/bubble_gum_edp_50ml.jpg'],
  ['/tmp/zipx/Asdaaf Ya Habibti EDP 100ml.jfif', 'src/assets/images/drive_zip/asdaaf_ya_habibti_edp_100ml.jpg'],
  ['/tmp/zipx/Badee Al Oud Amethyst EDP 100ml.jfif', 'src/assets/images/drive_zip/badee_al_oud_amethyst_edp_100ml.jpg'],
  ['/tmp/zipx/Emaan EDP 100ml.jfif', 'src/assets/images/drive_zip/emaan_edp_100ml.jpg'],
  ['/tmp/zipx/Fakhar Extrait Gold EDP 100ml.jfif', 'src/assets/images/drive_zip/fakhar_extrait_gold_edp_100ml.jpg'],
  ['/tmp/zipx/Khaltaat Al Arabia Royal Blends EDP 100ml.jfif', 'src/assets/images/drive_zip/khaltaat_al_arabia_royal_blends_edp_100ml.jpg'],
  // qarar: use existing perfumes_pdf2 source
  ['src/assets/images/perfumes_pdf2/pm_asdaaf_qarar_edp_80ml.jpg', 'src/assets/images/perfumes_pdf2/pm_asdaaf_qarar_edp_80ml.jpg'],
];
for (const [src, dst] of map) {
  if (!existsSync(src)) { console.log('SKIP missing', src); continue; }
  const meta = await sharp(src).metadata();
  const targetW = Math.min(2000, Math.max(1600, (meta.width||800) * 3));
  const buf = await sharp(src, { failOn: 'none' })
    .rotate()
    .resize({ width: targetW, kernel: 'lanczos3', withoutEnlargement: false })
    .sharpen({ sigma: 1.0, m1: 1, m2: 2 })
    .jpeg({ quality: 95, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toBuffer();
  writeFileSync(dst, buf);
  console.log(`OK ${meta.width}x${meta.height} -> ${targetW}px (${(buf.length/1024).toFixed(0)}KB) ${dst}`);
}
