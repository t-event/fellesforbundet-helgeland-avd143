// Henter Fellesforbundets kurs + konferanser som er aktuelle for Nordland og
// skriver src/data/arrangementer.json til repoet. Kjøres av GitHub Actions (planlagt).
//
// fellesforbundet.no gikk over til WordPress + The Events Calendar i nov. 2026.
// Vi bruker to åpne JSON-API-er derfra, ikke HTML-skraping:
//   - tribe/events/v1/events   → dato, sted, kategori (Kurs/Konferanse), lenke
//   - wp/v2/tribe_events       → fylkesmerkingen (ff_event_county), som det
//                                første API-et ikke tar med
//
// Utvalget skal være det samme som den gamle Nordland-lista ga: Region Nord-kurs
// pluss landsdekkende arrangementer. Fellesforbundet merker Region Nord-kursene
// med «Troms og Finnmark» også når de holdes i Bodø, så Nordland alene gir null
// treff. Regelen er derfor:
//   - merket Nordland eller Troms og Finnmark → med
//   - ellers med bare hvis tittelen ikke nevner en region (= landsdekkende),
//     slik at «Tillitsvalgt 2 – Region Vest» o.l. holdes ute
//
// Robust mot at kilden endrer seg: hvis vi ikke får ut arrangementer, avslutter
// scriptet med feil UTEN å skrive — da beholder repoet forrige gode data.

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'src', 'data', 'arrangementer.json');

const BASE_URL = 'https://www.fellesforbundet.no';
const LISTE = `${BASE_URL}/events/`;
const EVENTS_API = `${BASE_URL}/wp-json/tribe/events/v1/events?per_page=100&start_date=now`;
const FYLKE_API = `${BASE_URL}/wp-json/wp/v2/tribe_events?per_page=100&_fields=id,ff_event_county`;
const FYLKER_API = `${BASE_URL}/wp-json/wp/v2/ff_event_county?per_page=100`;
const VÅRE_FYLKER = ['nordland', 'troms-og-finnmark']; // slug i ff_event_county
const UA = 'Mozilla/5.0 (compatible; FFH-Arrangement-Bot/2.0; +https://ffh143.no)';
const MAKS = 12; // vis maks så mange kommende arrangement

function unescapeHtml(s) {
  return String(s)
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&'); // &amp; sist, ellers dobbeltdekoding
}

async function hentJson(url) {
  // Timeout så en treg/hengende kilde ikke holder jobben til Actions' 6-timersgrense.
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'application/json' },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

// Kategori → typen siden kjenner (Kurs / Konferanse). Noen arrangement mangler
// kategori i kilden; da avgjør tittelen.
function typeFor(e, tittel) {
  const kat = (e.categories ?? []).map(c => c.name);
  if (kat.includes('Konferanse')) return 'Konferanse';
  if (kat.includes('Kurs')) return 'Kurs';
  return /konferanse/i.test(tittel) ? 'Konferanse' : 'Kurs';
}

function stedFor(venue) {
  if (!venue || Array.isArray(venue)) return '';
  const navn = unescapeHtml(venue.venue ?? '').replace(/\s+/g, ' ').trim();
  const by = (venue.city ?? '').trim();
  return by && !navn.includes(by) ? `${navn}, ${by}` : navn;
}

async function main() {
  const [{ events = [] }, fylkeMerking, fylker] = await Promise.all([
    hentJson(EVENTS_API), hentJson(FYLKE_API), hentJson(FYLKER_API),
  ]);

  const våreIder = new Set(fylker.filter(f => VÅRE_FYLKER.includes(f.slug)).map(f => f.id));
  if (våreIder.size !== VÅRE_FYLKER.length) {
    throw new Error(`Fant ikke alle fylkene ${VÅRE_FYLKER.join(', ')} i ff_event_county — har kilden endret seg?`);
  }
  const fylkerPerId = new Map(fylkeMerking.map(e => [e.id, e.ff_event_county ?? []]));

  const idag = new Date(); idag.setHours(0, 0, 0, 0);
  const arrangementer = events
    .filter(e => e.status === 'publish' && !e.hide_from_listings)
    .map(e => {
      const tittel = unescapeHtml(e.title).replace(/\s+/g, ' ').trim();
      const vårt = (fylkerPerId.get(e.id) ?? []).some(id => våreIder.has(id));
      return {
        med: vårt || !/\bregion/i.test(tittel),
        tittel,
        type: typeFor(e, tittel),
        dato: e.start_date.slice(0, 10) + 'T00:00:00', // som før: bare dato, lokal tid
        sted: stedFor(e.venue),
        url: e.url || LISTE,
      };
    })
    .filter(a => a.med && new Date(a.dato) >= idag)
    .map(({ med, ...a }) => a)
    .sort((a, b) => new Date(a.dato) - new Date(b.dato))
    .slice(0, MAKS);

  if (arrangementer.length === 0) {
    console.error(`Fant ingen kommende arrangement (${events.length} totalt i kilden). Skriver IKKE — beholder forrige data.`);
    process.exit(1);
  }

  const data = {
    oppdatert: new Date().toISOString(),
    kilde: 'fellesforbundet.no — kurs og konferanser (Region Nord + landsdekkende)',
    kildeUrl: LISTE,
    arrangementer,
  };
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Skrev ${arrangementer.length} arrangement til ${OUT}`);
}

main().catch(e => { console.error(e); process.exit(1); });
