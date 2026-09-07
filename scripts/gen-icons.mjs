// Genererer PWA-ikonene i public/ ut fra public/favicon.svg.
//
// Kjøres manuelt ved behov (ikke i bygget): `node scripts/gen-icons.mjs`.
// Resultatet sjekkes inn i repoet, så bygget slipper å produsere binærfiler.
//
// Bytt favicon.svg og kjør på nytt hvis merket endres.

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public');

const svg = readFileSync(join(PUBLIC, 'favicon.svg'));

// «any»-ikonene: SVG-en som den er — hvit avrundet flate med det røde merket.
for (const size of [192, 512]) {
  await sharp(svg, { density: 400 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(join(PUBLIC, `icon-${size}.png`));
}

// «maskable»-ikonet: Android beskjærer fritt (ofte til sirkel), så merket må
// ligge innenfor en trygg sone på ca. 80 % og bakgrunnen gå helt ut i kanten.
// Partall, slik at merket kan sentreres på heltalls piksel (sharp krever int).
const INNER = 2 * Math.round((512 * 0.62) / 2);
const MARG = (512 - INNER) / 2;
const merke = await sharp(svg, { density: 400 }).resize(INNER, INNER).png().toBuffer();

await sharp({
  create: { width: 512, height: 512, channels: 4, background: '#FFFFFF' },
})
  .composite([{ input: merke, top: MARG, left: MARG }])
  .png({ compressionLevel: 9 })
  .toFile(join(PUBLIC, 'icon-maskable-512.png'));

console.log('Skrev icon-192.png, icon-512.png og icon-maskable-512.png til public/');
