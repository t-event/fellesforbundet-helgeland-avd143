// Språkregister for nettstedet.
//
// Norsk ligger i HTML-en. Engelsk ligger ved siden av, i data-en-attributter.
// Alle ANDRE språk kommer fra en ordbok i public/i18n/<kode>.json, som slår opp
// på den norske teksten:
//
//   { "Bli medlem": "Deveniți membru" }
//
// VIKTIG: ordbøkene importeres IKKE her. Gjorde vi det, ville alle sju havnet i
// JS-bunten og blitt lastet på hver eneste sidevisning — også for norske
// brukere. Det ble 410 KB. De hentes i stedet med fetch, kun for det språket
// den besøkende faktisk har valgt.
//
// Et språk vises i språkvelgeren FØRST når ordboka har nok innhold (se
// MIN_DEKNING under). Et halvoversatt språk er verre enn ingen oversettelse —
// da får medlemmet en blanding av norsk og sitt eget språk, uten å vite hva
// som mangler.
//
// Slik legger du til et språk:
//   1.  npm run tekster    → skriver src/i18n/ordbok/_mal.json med alle
//                            tekstene som skal oversettes, og viser dekningen
//                            for hvert språk som allerede finnes.
//   2.  Send _mal.json til en som kan språket. Norsk står som nøkkel til
//       venstre; oversettelsen fylles inn til høyre.
//   3.  Lagre svaret som src/i18n/ordbok/<kode>.json.
//   4.  Kjør npm run tekster igjen. Den kopierer ordboka til public/i18n/ og
//       oppdaterer dekningstallet under. Språket dukker opp av seg selv.

export type Sprakkode = 'nb' | 'en' | 'ro' | 'es' | 'pl' | 'lt' | 'lv';

// Hvor stor andel av tekstene som må være oversatt før språket vises.
// 0.85 = 85 %. Senk den bevisst hvis dere heller vil ha delvis oversettelse.
export const MIN_DEKNING = 0.85;

// Antall tekster som skal oversettes totalt. Oppdateres av `npm run tekster`.
export const ANTALL_TEKSTER = 807;

// Andel oversatt per språk (0–1). Skrives av `npm run tekster` — her ligger
// bare tall, aldri selve tekstene.
export const DEKNING: Record<string, number> = {
  es: 1.0000,
  lt: 1.0000,
  lv: 1.0000,
  pl: 1.0000,
  ro: 1.0000,
};

export interface Sprak {
  kode: Sprakkode;
  /** Språkets eget navn — det er slik folk finner sitt eget språk i en liste. */
  navn: string;
  /** Verdien i <html lang="…">. */
  htmlLang: string;
  /** Innebygd = teksten ligger i HTML-en, ikke i en ordbok. */
  innebygd?: boolean;
}

const ALLE: Sprak[] = [
  { kode: 'nb', navn: 'Norsk',      htmlLang: 'no', innebygd: true },
  { kode: 'en', navn: 'English',    htmlLang: 'en', innebygd: true },
  { kode: 'ro', navn: 'Română',     htmlLang: 'ro' },
  { kode: 'es', navn: 'Español',    htmlLang: 'es' },
  { kode: 'pl', navn: 'Polski',     htmlLang: 'pl' },
  { kode: 'lt', navn: 'Lietuvių',   htmlLang: 'lt' },
  { kode: 'lv', navn: 'Latviešu',   htmlLang: 'lv' },
];

/** Språkene som er klare til å vises for besøkende. */
export const AKTIVE_SPRAK: Sprak[] = ALLE.filter(
  s => s.innebygd || (DEKNING[s.kode] ?? 0) >= MIN_DEKNING,
);

export const ALLE_SPRAK = ALLE;

// ── Henting av ordbok ────────────────────────────────────────────────
// Hentes én gang per språk og holdes i minnet. Nettleseren cacher fila,
// så et språkbytte fram og tilbake koster ingenting ekstra.
const hentet: Record<string, Record<string, string>> = {};
const underveis: Record<string, Promise<Record<string, string>>> = {};

/** Ordboka for et språk, hvis den allerede er hentet. Ellers tom. */
export function ordbok(kode: string): Record<string, string> {
  return hentet[kode] ?? {};
}

/** Hent ordboka for et språk. Trygg å kalle flere ganger. */
export function hentOrdbok(kode: string, base = ''): Promise<Record<string, string>> {
  if (kode === 'nb' || kode === 'en') return Promise.resolve({});
  if (hentet[kode]) return Promise.resolve(hentet[kode]);
  if (!underveis[kode]) {
    underveis[kode] = fetch(`${base}/i18n/${kode}.json`)
      .then(r => (r.ok ? r.json() : {}))
      .then(d => { hentet[kode] = d; return d; })
      // Feiler hentingen, faller alt tilbake til norsk — bedre enn tom side.
      .catch(() => { hentet[kode] = {}; return {}; });
  }
  return underveis[kode];
}
