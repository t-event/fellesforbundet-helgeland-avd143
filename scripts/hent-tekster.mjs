// Henter ut alle tekstene på nettstedet som skal oversettes, og skriver dem til
// src/i18n/ordbok/_mal.json — fila du sender til den som skal oversette.
//
//   npm run tekster
//
// Scriptet leser den ferdigbygde HTML-en i dist/, så kjør `npm run build`
// først (eller bare `npm run tekster` — den bygger selv hvis dist/ mangler).
//
// Malen ser slik ut, med norsk til venstre og tomt til høyre:
//
//   {
//     "Bli medlem": "",
//     "Lønn & tariff": ""
//   }
//
// Den oversatte fila lagres som src/i18n/ordbok/<kode>.json. Språket dukker
// opp i språkvelgeren av seg selv når dekningen er høy nok (se src/i18n/sprak.ts).
//
// Scriptet oppdaterer også ANTALL_TEKSTER i sprak.ts, som dekningen regnes ut fra.

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROT = join(__dirname, '..');
const DIST = join(ROT, 'dist');
const ORDBOK = join(ROT, 'src', 'i18n', 'ordbok');

if (!existsSync(DIST)) {
  console.error('\n✖ Fant ikke dist/. Kjør `npm run build` først.\n');
  process.exit(1);
}

// ── Finn alle HTML-filer ─────────────────────────────────────────────
function htmlFiler(katalog) {
  return readdirSync(katalog).flatMap(navn => {
    const sti = join(katalog, navn);
    if (statSync(sti).isDirectory()) return htmlFiler(sti);
    return navn.endsWith('.html') ? [sti] : [];
  });
}

// Astros scope-hash (data-astro-cid-…) endres når stilene i komponenten
// endres. Den må ikke bli en del av ordboknøkkelen.
// Myk bindestrek og hardt mellomrom står som entiteter i HTML-kilden, men
// kjøretiden ser dem som tegn via innerHTML. Begge gjøres om til det samme,
// ellers kan tekst med &shy; eller &nbsp; aldri slås opp i ordboka.
// MERK rekkefølgen: &amp; avkodes SIST. Gjøres den først, blir teksten
// «&amp;shy;» (som skal vise «&shy;») til «&shy;» og deretter strippet som myk
// bindestrek — dobbel avkoding, og nøkkelen matcher ikke kjøretiden.
const normaliser = s =>
  s.replace(/\s*data-astro-cid-[\w-]+(?:="[^"]*")?/g, '')
   .replace(/&shy;|\u00ad/g, '')
   .replace(/&nbsp;|\u00a0/g, ' ')
   .replace(/&amp;/g, '&')
   .replace(/\s+/g, ' ').trim();

// Avkod de HTML-entitetene Astro faktisk produserer i attributtverdier.
const avkod = s =>
  s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
   .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

// Norsk tekst ligger som innhold i elementer med data-en (og som placeholder
// på felt med data-en-ph). Vi henter den norske siden — den er nøkkelen.
const tekster = new Map(); // normalisert tekst -> hvor den ble funnet
const nostede = new Set(); // data-en inni data-en — kan ikke oversettes

// Elementer uten sluttagg — de kan aldri være «foreldre» til noe.
const TOMME = new Set(['br', 'img', 'input', 'hr', 'meta', 'link', 'source', 'area', 'base', 'col', 'embed', 'track', 'wbr']);

// Finn slutten på elementet som starter ved `fra` (indeks til '<'), ved å telle
// åpne og lukkede tagger med samme navn. Regex alene stopper på FØRSTE
// sluttagg, som blir feil så snart et element av samme type ligger inni.
function finnSlutt(html, fra, tag) {
  const re = new RegExp(`<(/?)${tag}\\b([^>]*)>`, 'gi');
  re.lastIndex = fra;
  // Vi står allerede INNE i elementet (fra = rett etter åpningstaggen), så
  // dybden starter på 1. Første umatchede sluttagg er vår egen.
  let dybde = 1;
  let m;
  while ((m = re.exec(html)) !== null) {
    const erSlutt = m[1] === '/';
    const selvlukkende = m[2].trimEnd().endsWith('/');
    if (erSlutt) {
      if (--dybde === 0) return { innhold: html.slice(fra, m.index), etter: re.lastIndex };
    } else if (!selvlukkende && !TOMME.has(tag.toLowerCase())) {
      dybde++;
    }
  }
  return null;
}

function samle(html, fil) {
  // Finn hvert element som har data-en, og hent ut det norske innholdet.
  // Innholdet kan inneholde markup (f.eks. en <a>-lenke midt i en setning) —
  // det er meningen: kjøretiden slår opp på nøyaktig denne innerHTML-en.
  const start = /<([a-z0-9]+)\b[^>]*\bdata-en=(?:"[^"]*"|'[^']*')[^>]*>/gi;
  let m;
  while ((m = start.exec(html)) !== null) {
    const tag = m[1];
    const apning = m.index + m[0].length;
    const funn = finnSlutt(html, apning, tag);
    if (!funn) continue;

    const norsk = normaliser(funn.innhold);
    if (norsk) tekster.set(norsk, fil);

    // Et data-en inni et annet data-en kan ikke oversettes: når forelderen får
    // ny innerHTML, forsvinner barnet fra DOM-en før det rekker å bli byttet.
    if (/\bdata-en=/.test(funn.innhold)) {
      nostede.add(`${fil}: ${norsk.slice(0, 70)}…`);
    }
  }

  // aria-label / title på elementer som er merket for oversettelse
  for (const [attr, kilde] of [['aria-label', 'data-en-aria'], ['title', 'data-en-title'], ['alt', 'data-en-alt']]) {
    const re = new RegExp(`<[^>]*\\b${kilde}=[^>]*>`, 'gi');
    let t;
    while ((t = re.exec(html)) !== null) {
      const v = t[0].match(new RegExp(`(?<![-\\w])${attr}="([^"]*)"`, 'i'));
      if (v) { const norsk = normaliser(avkod(v[1])); if (norsk) tekster.set(norsk, fil); }
    }
  }

  // Bildetekster i galleriet ligger som data-alt (norsk) / data-alt-en.
  // De settes av JS på hovedbildet og i lightboxen.
  {
    const re = /\bdata-alt="([^"]*)"/gi;
    let t;
    while ((t = re.exec(html)) !== null) {
      const norsk = normaliser(avkod(t[1]));
      if (norsk) tekster.set(norsk, fil);
    }
  }

  // placeholder="NORSK" på felt som også har data-en-ph
  // Rekkefølgen på attributtene i taggen skal ikke ha noe å si.
  const rePh = /<[^>]*\bdata-en-ph=[^>]*>/gi;
  while ((m = rePh.exec(html)) !== null) {
    const t = m[0].match(/(?<![-\w])placeholder="([^"]*)"/i);
    if (t) { const norsk = normaliser(avkod(t[1])); if (norsk) tekster.set(norsk, fil); }
  }
}

const filer = htmlFiler(DIST);
for (const f of filer) samle(readFileSync(f, 'utf8'), f.replace(DIST + '/', ''));

// Tekst som lages av JavaScript ligger som oversett('norsk', 'english')-kall i
// kildekoden, ikke i den ferdige HTML-en. Vi henter det norske argumentet.
// Kall med backticks (`...${variabel}...`) hoppes over: nøkkelen finnes først
// når verdien er satt inn, så den kan ikke slås opp i en fast ordbok.
const medMal = new Set();
const kildefiler = readdirSync(join(ROT, 'src'), { recursive: true, encoding: 'utf8' })
  .filter(f => f.endsWith('.astro') || f.endsWith('.ts'))
  .map(f => join(ROT, 'src', f));

for (const fil of kildefiler) {
  let kilde;
  try { kilde = readFileSync(fil, 'utf8'); } catch { continue; }
  const rel = fil.replace(ROT + '/', '');

  for (const m of kilde.matchAll(/\boversett\(\s*'((?:[^'\\]|\\.)*)'/g)) {
    const norsk = normaliser(m[1].replace(/\\'/g, "'").replace(/\\n/g, ' '));
    if (norsk) tekster.set(norsk, rel);
  }
  // Registrer at fila har mal-kall vi IKKE kan hente ut, så vi kan si fra.
  if (/\boversett\(\s*`/.test(kilde)) medMal.add(rel);
}

// Fanetitlene står som title="…" på <Layout> i hver side. De vises i
// nettleserfanen og i bokmerker, så de skal oversettes som all annen tekst.
// (title-attributter på andre elementer, f.eks. kart-iframes, hoppes over.)
for (const fil of kildefiler.filter(f => f.includes('/pages/'))) {
  const kilde = readFileSync(fil, 'utf8');
  const m = kilde.match(/<Layout\b[^>]*?\n\s*title="([^"]+)"/s);
  if (m) tekster.set(normaliser(m[1]), fil.replace(ROT + '/', ''));
}

// Værteksten settes sammen av en dekoder i WeatherWidget (nedbørtype +
// intensitet + byge + torden), så den finnes ikke som literal i koden og kan
// ikke plukkes automatisk. Kombinasjonene listes derfor her. Endrer du
// symbolTekst() i WeatherWidget, må denne lista følge med.
const VÆR = [
  'Klarvær', 'Lettskyet', 'Delvis skyet', 'Skyet', 'Tåke',
  'Regn', 'Lett regn', 'Kraftig regn', 'Regnbyger', 'Lette regnbyger', 'Kraftige regnbyger',
  'Sludd', 'Lett sludd', 'Kraftig sludd', 'Sluddbyger', 'Lette sluddbyger', 'Kraftige sluddbyger',
  'Snø', 'Lett snø', 'Kraftig snø', 'Snøbyger', 'Lette snøbyger', 'Kraftige snøbyger',
];
// Kompassretningene kommer fra samme slags tabell og fanges heller ikke
// automatisk. Norsk bruker Ø/V (øst/vest); andre språk bruker som regel de
// internasjonale N/E/S/W.
const KOMPASS = ['N','NNØ','NØ','ØNØ','Ø','ØSØ','SØ','SSØ','S','SSV','SV','VSV','V','VNV','NV','NNV'];
for (const retning of KOMPASS) tekster.set(retning, 'src/components/WeatherWidget.astro');

for (const grunn of VÆR) {
  tekster.set(grunn, 'src/components/WeatherWidget.astro');
  tekster.set(`${grunn} og torden`, 'src/components/WeatherWidget.astro');
}

// Delte strenger med nøkkel ligger i translations.ts, ikke i HTML-en.
const tsKilde = readFileSync(join(ROT, 'src', 'i18n', 'translations.ts'), 'utf8');
const nbBlokk = tsKilde.match(/\bnb:\s*\{([\s\S]*?)\n {2}\},/);
if (nbBlokk) {
  for (const m of nbBlokk[1].matchAll(/^\s*\w+:\s*'((?:[^'\\]|\\.)*)',/gm)) {
    const norsk = normaliser(m[1].replace(/\\'/g, "'"));
    if (norsk) tekster.set(norsk, 'src/i18n/translations.ts');
  }
}

// Enkelte plassholdere bærer et i18n-nøkkelnavn som verdi (settes av JS ved
// oppstart). De skal ikke oversettes.
const erNokkelnavn = t => /^[a-z][a-z0-9]*(_[a-z0-9]+)+$/.test(t);
for (const t of [...tekster.keys()]) if (erNokkelnavn(t)) tekster.delete(t);

const alle = [...tekster.keys()].sort((a, b) => a.localeCompare(b, 'nb'));

// ── Skriv malen ──────────────────────────────────────────────────────
const mal = Object.fromEntries(alle.map(t => [t, '']));
writeFileSync(join(ORDBOK, '_mal.json'), JSON.stringify(mal, null, 2) + '\n', 'utf8');

// ── Kopier ordbøkene til public/i18n/ ────────────────────────────────
// Ordbøkene hentes med fetch i nettleseren, ikke via import. Importerte vi dem
// i sprak.ts, havnet alle sju i JS-bunten og ble lastet på hver sidevisning —
// det var 410 KB, også for norske brukere.
const PUBLIC_I18N = join(ROT, 'public', 'i18n');
mkdirSync(PUBLIC_I18N, { recursive: true });

const dekning = {};
for (const fil of readdirSync(ORDBOK).filter(f => f.endsWith('.json') && !f.startsWith('_'))) {
  const kode = fil.replace('.json', '');
  const ordbok = JSON.parse(readFileSync(join(ORDBOK, fil), 'utf8'));
  const fylt = Object.entries(ordbok)
    .filter(([k, v]) => typeof v === 'string' && v.trim() !== '' && tekster.has(k)).length;
  dekning[kode] = alle.length ? fylt / alle.length : 0;
  // Bare nøkler som fortsatt finnes på siden — utdaterte oversettelser er
  // dødvekt over nettet.
  const rensket = Object.fromEntries(
    Object.entries(ordbok).filter(([k, v]) => tekster.has(k) && typeof v === 'string' && v.trim() !== ''),
  );
  writeFileSync(join(PUBLIC_I18N, fil), JSON.stringify(rensket), 'utf8');
}

// ── Oppdater ANTALL_TEKSTER og DEKNING i sprak.ts ────────────────────
const sprakSti = join(ROT, 'src', 'i18n', 'sprak.ts');
let sprakKilde = readFileSync(sprakSti, 'utf8');
const før = sprakKilde;
sprakKilde = sprakKilde.replace(
  /export const ANTALL_TEKSTER = \d+;/,
  `export const ANTALL_TEKSTER = ${alle.length};`,
);
sprakKilde = sprakKilde.replace(
  /export const DEKNING: Record<string, number> = \{[^}]*\};/,
  'export const DEKNING: Record<string, number> = {\n' +
    Object.entries(dekning).sort().map(([k, v]) => `  ${k}: ${v.toFixed(4)},`).join('\n') +
    '\n};',
);
if (sprakKilde !== før) writeFileSync(sprakSti, sprakKilde, 'utf8');

// ── Rapport ──────────────────────────────────────────────────────────
console.log(`\n✓ ${alle.length} tekster fra ${filer.length} sider skrevet til src/i18n/ordbok/_mal.json\n`);

const MIN = 0.85;
console.log('  Dekning per språk:');
for (const fil of readdirSync(ORDBOK).filter(f => f.endsWith('.json') && !f.startsWith('_'))) {
  const kode = fil.replace('.json', '');
  const ordbok = JSON.parse(readFileSync(join(ORDBOK, fil), 'utf8'));
  const fylt = Object.entries(ordbok).filter(([k, v]) => typeof v === 'string' && v.trim() !== '' && tekster.has(k)).length;
  const utdaterte = Object.keys(ordbok).filter(k => !tekster.has(k)).length;
  const pst = alle.length ? Math.round((fylt / alle.length) * 100) : 0;
  const status = pst >= MIN * 100 ? 'vises på siden' : `skjult (trenger ${Math.round(MIN * 100)} %)`;
  console.log(
    `   ${kode}  ${String(pst).padStart(3)} %  ${String(fylt).padStart(4)}/${alle.length}  ${status}` +
    (utdaterte ? `  ⚠ ${utdaterte} tekst(er) finnes ikke lenger på siden` : ''),
  );
}
if (medMal.size) {
  console.log(`\n  ℹ ${medMal.size} fil(er) har oversett()-kall med innsatte verdier (backticks).`);
  console.log('    De kan ikke stå i ordboka, siden nøkkelen først finnes når verdien');
  console.log('    er satt inn. De vises på norsk på andre språk enn engelsk:');
  for (const f of [...medMal].sort()) console.log(`      • ${f}`);
}

if (nostede.size) {
  console.log(`\n  ⚠ ${nostede.size} element(er) har data-en inni et annet data-en.`);
  console.log('    Det innerste blir aldri oversatt — flytt teksten ut, eller la');
  console.log('    forelderen dekke hele setningen:');
  for (const n of [...nostede].slice(0, 8)) console.log(`      • ${n}`);
  if (nostede.size > 8) console.log(`      … og ${nostede.size - 8} til`);
}

console.log('');
