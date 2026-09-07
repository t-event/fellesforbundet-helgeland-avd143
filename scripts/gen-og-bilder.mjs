// Genererer delingsbildene (Open Graph) i public/images/og/.
//
// Kjøres manuelt ved behov: `npm run og`. Resultatet sjekkes inn i repoet, så
// bygget slipper å produsere binærfiler — og vi slipper å stole på at riktige
// fonter finnes på byggmaskinen.
//
// Design: foto i 1200×630, mørk navy tone nedover mot bunnen, Fellesforbundets
// hvite logo nede til venstre og en rød merkestripe i bunn. Tittel og ingress
// bakes bevisst IKKE inn i bildet — Facebook, LinkedIn og Slack viser og:title
// og og:description som tekst ved siden av bildet uansett, og innbakt tekst
// ville blitt beskåret ulikt i hver tjeneste.

import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public');
const UT = join(PUBLIC, 'images', 'og');

const B = 1200;
const H = 630;

// Delingsbilde per sidetype. `kilde` er fotoet, `fokus` styrer hvilken del av
// bildet som beholdes når det beskjæres til 1200×630.
const BILDER = [
  {
    fil: 'og-default.jpg',
    kilde: 'images/hovedside/1mai-tog-mo-i-rana.jpg',
    fokus: 'attention',
    om: 'Avdelingen — forside, om oss, kontakt, tillitsvalgte',
  },
  {
    fil: 'og-medlem.jpg',
    kilde: 'images/hovedside/medlemsmote.jpg',
    fokus: 'attention',
    om: 'Bli medlem',
  },
  {
    fil: 'og-tariff.jpg',
    kilde: 'images/hovedside/markering-mo-i-rana.jpg',
    fokus: 'attention',
    om: 'Lønn og tariff',
  },
  {
    fil: 'og-hytter.jpg',
    kilde: 'images/umbukta/umbukta-eksterior-terrasse.jpg',
    fokus: 'centre',
    om: 'Hytteutleie, Umbukta, turtips, hjelp',
  },
];

// Mørk navy tone nedover, så logoen alltid har nok kontrast uansett foto.
const OVERLAY = Buffer.from(`
<svg width="${B}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#1A1836" stop-opacity="0"/>
      <stop offset="52%"  stop-color="#1A1836" stop-opacity="0"/>
      <stop offset="78%"  stop-color="#1A1836" stop-opacity="0.48"/>
      <stop offset="100%" stop-color="#1A1836" stop-opacity="0.93"/>
    </linearGradient>
  </defs>
  <rect width="${B}" height="${H}" fill="url(#g)"/>
  <rect x="0" y="${H - 12}" width="${B}" height="12" fill="#CF0000"/>
</svg>`);

const LOGO_B = 420;
const logoSvg = readFileSync(join(PUBLIC, 'images', 'logo', 'ff_logo_hvit_rgb.svg'));

mkdirSync(UT, { recursive: true });

const logo = await sharp(logoSvg, { density: 300 })
  .resize({ width: LOGO_B })
  .png()
  .toBuffer();
const logoH = (await sharp(logo).metadata()).height;

for (const b of BILDER) {
  const foto = await sharp(join(PUBLIC, b.kilde))
    .resize(B, H, { fit: 'cover', position: sharp.strategy[b.fokus] ?? b.fokus })
    .toBuffer();

  await sharp(foto)
    .composite([
      { input: OVERLAY, top: 0, left: 0 },
      { input: logo, top: H - logoH - 52, left: 56 },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(UT, b.fil));

  console.log(`  ${b.fil.padEnd(18)} ${b.om}`);
}

console.log(`\n✓ ${BILDER.length} delingsbilder skrevet til public/images/og/\n`);
