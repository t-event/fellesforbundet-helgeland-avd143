// Språkregister for nettstedet.
//
// Norsk ligger i HTML-en. Engelsk ligger ved siden av, i data-en-attributter.
// Alle ANDRE språk kommer fra en ordbok i src/i18n/ordbok/<kode>.json, som
// slår opp på den norske teksten:
//
//   { "Bli medlem": "Deveniți membru" }
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
//   4.  Språket dukker opp i velgeren av seg selv ved neste bygg.

import ro from './ordbok/ro.json';
import es from './ordbok/es.json';
import pl from './ordbok/pl.json';
import lt from './ordbok/lt.json';
import lv from './ordbok/lv.json';

export type Sprakkode = 'nb' | 'en' | 'ro' | 'es' | 'pl' | 'lt' | 'lv';

// Hvor stor andel av tekstene som må være oversatt før språket vises.
// 0.85 = 85 %. Senk den bevisst hvis dere heller vil ha delvis oversettelse.
export const MIN_DEKNING = 0.85;

// Antall tekster som skal oversettes totalt. Oppdateres av `npm run tekster`.
// Står den på 0, regnes ingen ordbok som komplett nok.
export const ANTALL_TEKSTER = 660;

export const ORDBOKER: Record<string, Record<string, string>> = { ro, es, pl, lt, lv };

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

/** Hvor stor andel av tekstene ordboka faktisk dekker (0–1). */
export function dekning(kode: Sprakkode): number {
  const ordbok = ORDBOKER[kode];
  if (!ordbok || !ANTALL_TEKSTER) return 0;
  const fylt = Object.values(ordbok).filter(v => typeof v === 'string' && v.trim() !== '').length;
  return fylt / ANTALL_TEKSTER;
}

/** Språkene som er klare til å vises for besøkende. */
export const AKTIVE_SPRAK: Sprak[] = ALLE.filter(
  s => s.innebygd || dekning(s.kode) >= MIN_DEKNING,
);

export const ALLE_SPRAK = ALLE;
