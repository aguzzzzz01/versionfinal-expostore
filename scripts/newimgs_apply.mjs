import sharp from 'sharp';
import { writeFileSync, existsSync } from 'fs';
const SRC = '/tmp/newimgs/';
const map = [
  ['17a91530-86fc-41bb-823d-41496c23e970.jfif', 'src/assets/images/nuevos/17a91530-86fc-41bb-823d-41496c23e970.jpg'],
  ['AUTO EST#U00c9REO MP5 DE 7.jfif', 'src/assets/images/nuevos/r_auto_estereo.jpg'],
  ['Aire Acondicionado Split TCL 2600W.jfif', 'src/assets/images/nuevos/r_aire_tcl.jpg'],
  ['COMBO HOGAR EXPOSTORE.jfif', 'src/assets/images/nuevos/r_combo_hogar.jpg'],
  ['EL COMBO M#U00c1S COMPLETO .jfif', 'src/assets/images/nuevos/r_combo_reventa.jpg'],
  ['FREEZER NEBA 180 L.jfif', 'src/assets/images/nuevos/r_freezer_neba.jpg'],
  ['HELADERA DREAN 400L CON DISPENSER.jfif', 'src/assets/images/nuevos/r_heladera_drean.jpg'],
  ['HELADERA GAFA 354L GRIS PLATA NO FROST.jfif', 'src/assets/images/nuevos/r_heladera_gafa356.jpg'],
  ['HELADERA GAFA NO FROST 262 L  BLANCA.jfif', 'src/assets/images/nuevos/r_heladera_gafa262.jpg'],
  ['HELADERA NEBA 240L.jfif', 'src/assets/images/nuevos/r_heladera_neba.jpg'],
  ['PROYECTOR PORT#U00c1TIL DINAX.jfif', 'src/assets/images/nuevos/r_proyector_dinax.jpg'],
  ['SMART TV HYUNDAI 32  .jfif', 'src/assets/images/nuevos/r_tv_hyundai.jpg'],
  ['SMART TV HYUNDAI 32.jfif', 'src/assets/images/nuevos/r_tv_hyundai_b.jpg'],
  ['SMART TV RCA 65#U201d ANDROID.jfif', 'src/assets/images/nuevos/r_tv_rca65.jpg'],
  ['SMART TV TCL 43#U201d.jfif', 'src/assets/images/nuevos/r_tv_tcl43.jpg'],
  ['TOSTADORA ATMA STAR WARS.jfif', 'src/assets/images/nuevos/r_tostadora_starwars.jpg'],
  ['Waflera Sandwichera Minnie 2 en 1.jfif', 'src/assets/images/nuevos/r_waflera_minnie.jpg'],
  ['Waflera mandalorian.jfif', 'src/assets/images/nuevos/r_waflera_mandalorian.jpg'],
  ['expo store terrible combo.jfif', 'src/assets/images/nuevos/r_combo_terrible.jpg'],
  ['sandwichera spider man.jfif', 'src/assets/images/nuevos/r_sandwichera_spiderman.jpg'],
  ['tostadora spiderman.jfif', 'src/assets/images/nuevos/r_tostadora_spiderman.jpg'],
];
for (const [s, dst] of map) {
  const src = SRC + s;
  if (!existsSync(src)) { console.log('MISS', src); continue; }
  const meta = await sharp(src).metadata();
  const w = meta.width || 0;
  let pipe = sharp(src, { failOn: 'none' }).rotate();
  if (w < 1400) pipe = pipe.resize({ width: 1400, kernel: 'lanczos3' }).sharpen({ sigma: 0.7 });
  else if (w > 1600) pipe = pipe.resize({ width: 1600, kernel: 'lanczos3' });
  const buf = await pipe.jpeg({ quality: 88, mozjpeg: true, progressive: true }).toBuffer();
  writeFileSync(dst, buf);
  console.log(`OK ${w}px -> ${(buf.length/1024).toFixed(0)}KB ${dst}`);
}
