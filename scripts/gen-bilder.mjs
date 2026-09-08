// Lager responsive WebP-varianter av fotoene i public/images/.
//
//   npm run bilder
//
// Originalene beholdes som de er og brukes som reserve for nettlesere uten
// WebP-støtte. Variantene skrives til public/images/opt/ og sjekkes inn, så
// bygget slipper å produsere binærfiler.
//
// Bakgrunn: fotoene lå i full oppløsning (opptil 1600 px bred, 400 KB) selv der
// de vises i en spalte på ~500 px. Lighthouse målte over 500 KB å spare på
// forsiden alene.
//
// Bruk dem via <Bilde>-komponenten (src/components/Bilde.astro), som setter opp
// <picture> med srcset og lar nettleseren velge riktig bredde.

import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync, statSync } from 'fs';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BILDER = join(__dirname, '..', 'public', 'images');
const UT = join(BILDER, 'opt');

// Breddene dekker mobil, tablet og desktop, samt 2× for skjermer med høy
// pikseltetthet. Ingen variant lages større enn originalen.
//
// 768 finnes fordi spranget 640 → 900 var for stort: en vanlig mobil (380 CSS-px
// innholdsbredde) trenger 665 px ved DPR 1.75 og 760 px ved DPR 2, og måtte
// derfor hente 900 og kaste ~40 % av pikslene. Endrer du lista, kjør
// `npm run bilder` — variantene er sjekket inn i repoet.
const BREDDER = [400, 640, 768, 900, 1400];

// Mapper med foto. logo/ og og/ holdes utenfor: logoen er SVG, og
// delingsbildene har sin egen faste størrelse (se gen-og-bilder.mjs).
const MAPPER = ['hovedside', 'umbukta', 'elsvatn'];

const FOTO = /\.(jpe?g|png)$/i;

mkdirSync(UT, { recursive: true });

let laget = 0;
let hoppet = 0;
let spart = 0;

for (const mappe of MAPPER) {
  const kilde = join(BILDER, mappe);
  if (!existsSync(kilde)) continue;
  mkdirSync(join(UT, mappe), { recursive: true });

  for (const fil of readdirSync(kilde).filter(f => FOTO.test(f))) {
    const sti = join(kilde, fil);
    const navn = basename(fil, extname(fil));
    const meta = await sharp(sti).metadata();
    const original = statSync(sti).size;
    let minst = original;

    for (const bredde of BREDDER) {
      // Ikke forstørr — det gir større fil uten mer detalj.
      if (bredde > meta.width) continue;
      const utfil = join(UT, mappe, `${navn}-${bredde}.webp`);
      if (existsSync(utfil)) { hoppet++; minst = Math.min(minst, statSync(utfil).size); continue; }

      await sharp(sti)
        .resize({ width: bredde, withoutEnlargement: true })
        .webp({ quality: 78, effort: 5 })
        .toFile(utfil);
      laget++;
      minst = Math.min(minst, statSync(utfil).size);
    }

    // Grov gevinst: forskjellen mellom originalen og den minste varianten,
    // altså det en mobilbruker sparer.
    spart += Math.max(0, original - minst);
  }
}

const mb = n => `${(n / 1024 / 1024).toFixed(1)} MB`;
console.log(`\n✓ ${laget} varianter laget${hoppet ? `, ${hoppet} fantes fra før` : ''}.`);
console.log(`  Spart for en mobilbruker som ser alle bildene: ca. ${mb(spart)}.`);
console.log(`  Bruk dem via <Bilde> (src/components/Bilde.astro).\n`);
