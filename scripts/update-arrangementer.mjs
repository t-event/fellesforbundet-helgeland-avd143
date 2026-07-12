// Henter Fellesforbundets kurs + konferanser for Nordland og skriver
// src/data/arrangementer.json til repoet. Kjøres av GitHub Actions (planlagt).
//
// Kilden legger arrangementene inn som strukturert JSON i sidens HTML
// (entity-kodet). Vi henter begge type-sidene (Kurs + Konferanse), plukker ut
// objektene, slår sammen, filtrerer bort passerte datoer og sorterer.
//
// Robust mot at kilden endrer seg: hvis vi ikke får ut arrangementer, avslutter
// scriptet med feil UTEN å skrive — da beholder repoet forrige gode data.

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'src', 'data', 'arrangementer.json');

const BASE_URL = 'https://www.fellesforbundet.no';
const LISTE = `${BASE_URL}/aktuelt/kurs-og-arrangementer/`;
const COUNTY = 'Nordland - Nordlánnda';
const URLS = [
  `${LISTE}?county=${encodeURIComponent(COUNTY)}&type=Kurs`,
  `${LISTE}?county=${encodeURIComponent(COUNTY)}&type=Konferanse`,
];
const UA = 'Mozilla/5.0 (compatible; FFH-Arrangement-Bot/1.0; +https://t-event.github.io/fellesforbundet-helgeland-avd143)';
const MAKS = 12; // vis maks så mange kommende arrangement

function unescapeHtml(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&'); // &amp; sist, ellers dobbeltdekoding
}

async function hent(url) {
  // Timeout så en treg/hengende kilde ikke holder jobben til Actions' 6-timersgrense.
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, 'Accept-Language': 'nb,no;q=0.9' },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

// Plukk ut event-objektene fra (entity-dekodet) HTML.
function parseArrangementer(html) {
  const dekodet = unescapeHtml(html);
  const objekter = dekodet.match(/\{[^{}]*?"startDate"[^{}]*?\}/g) || [];
  const ut = [];
  for (const o of objekter) {
    try {
      const e = JSON.parse(o);
      if (!e.startDate || !e.heading) continue;
      ut.push({
        tittel: String(e.heading).trim(),
        type: e.type ? String(e.type).trim() : 'Arrangement',
        dato: e.startDate,
        sted: e.location ? String(e.location).replace(/\s+/g, ' ').trim() : '',
        url: e.url ? (e.url.startsWith('http') ? e.url : BASE_URL + e.url) : `${BASE_URL}/aktuelt/kurs-og-arrangementer/`,
      });
    } catch { /* hopp over ugyldig objekt */ }
  }
  return ut;
}

async function main() {
  const alle = [];
  let feil = 0;
  for (const url of URLS) {
    try {
      alle.push(...parseArrangementer(await hent(url)));
    } catch (e) {
      feil++;
      console.error('Klarte ikke hente', url, '-', e.message);
    }
  }

  // Dedup på url, filtrer bort passerte, sorter stigende, kutt til MAKS.
  const idag = new Date(); idag.setHours(0, 0, 0, 0);
  const sett = new Set();
  const arrangementer = alle
    .filter(a => { if (sett.has(a.url)) return false; sett.add(a.url); return true; })
    .filter(a => new Date(a.dato) >= idag)
    .sort((a, b) => new Date(a.dato) - new Date(b.dato))
    .slice(0, MAKS);

  if (arrangementer.length === 0) {
    console.error(`Fant ingen kommende arrangement (${feil} feilede hentinger). Skriver IKKE — beholder forrige data.`);
    process.exit(1);
  }

  const data = {
    oppdatert: new Date().toISOString(),
    kilde: 'fellesforbundet.no — kurs og konferanser (Nordland)',
    kildeUrl: `${LISTE}?county=${encodeURIComponent(COUNTY)}`,
    arrangementer,
  };
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Skrev ${arrangementer.length} arrangement til ${OUT}`);
}

main().catch(e => { console.error(e); process.exit(1); });
