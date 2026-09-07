// Delte språkhjelpere for skript som kjører i nettleseren.
//
// Tekst som lages av JavaScript — valideringsfeil i skjemaene, «Ledig fra i
// dag», værmeldingens statuslinje — ligger ikke i HTML-en, og fanges derfor
// ikke opp av data-en/ordbok-mekanikken i Layout.astro. Slike strenger skal gå
// gjennom `oversett()` her.
//
//   oversett('Oppgi navn.', 'Enter your name.')
//
// Norsk er nøkkelen, engelsk står ved siden av, og alle andre språk slås opp i
// src/i18n/ordbok/<kode>.json — akkurat som for teksten i HTML-en. Mangler et
// oppslag, vises norsk.
//
// `npm run tekster` plukker opp disse kallene fra kildekoden, så de havner i
// oversettelsesmalen sammen med resten.

import { ORDBOKER, AKTIVE_SPRAK, type Sprakkode } from './sprak';

// Locale for dato- og tallformatering per språk.
const LOCALE: Record<string, string> = {
  nb: 'nb-NO', en: 'en-GB', ro: 'ro-RO', es: 'es-ES',
  pl: 'pl-PL', lt: 'lt-LT', lv: 'lv-LV',
};

/** Språket den besøkende har valgt. Faller tilbake til norsk. */
export function aktivtSprak(): Sprakkode {
  let lagret: string | null = null;
  try { lagret = localStorage.getItem('lang'); } catch { /* privat vindu */ }
  // Et språk kan ha blitt slått av igjen etter at noen valgte det.
  return AKTIVE_SPRAK.some(s => s.kode === lagret) ? (lagret as Sprakkode) : 'nb';
}

// Samme normalisering som i Layout.astro, slik at nøklene treffer hverandre.
const nokkel = (s: string) => s.replace(/\s+/g, ' ').trim();

/**
 * Oversett en streng som lages i JavaScript.
 *
 * @param norsk    Teksten på norsk — dette er nøkkelen i ordboka.
 * @param engelsk  Teksten på engelsk. Utelates den, brukes norsk.
 * @param verdier  Verdier som settes inn der teksten har {navn}.
 *
 * Verdier som varierer (antall, priser, datoer) MÅ sendes inn her, ikke limes
 * inn i strengen med backticks. En streng som allerede inneholder «3 døgn» er
 * en annen nøkkel enn «4 døgn», og ville aldri truffet i ordboka:
 *
 *   oversett('{antall} døgn × {pris} kr', '{antall} nights × NOK {pris}',
 *            { antall: dager, pris: tallformat(rate) })
 *
 * Plassholderne står igjen som de er hvis oversetteren har glemt en av dem —
 * det er synlig, i motsetning til tekst som stille faller tilbake til norsk.
 */
export function oversett(
  norsk: string,
  engelsk?: string,
  verdier?: Record<string, string | number>,
): string {
  const lang = aktivtSprak();
  let ut: string;
  if (lang === 'nb') ut = norsk;
  else if (lang === 'en') ut = engelsk ?? norsk;
  else {
    const treff = ORDBOKER[lang]?.[nokkel(norsk)];
    ut = treff && treff.trim() !== '' ? treff : norsk;
  }
  if (!verdier) return ut;
  return ut.replace(/\{(\w+)\}/g, (hel, navn) =>
    navn in verdier ? String(verdier[navn]) : hel);
}

/** Locale-streng til toLocaleDateString o.l. for valgt språk. */
export function locale(): string {
  return LOCALE[aktivtSprak()] ?? 'nb-NO';
}

/** Navnet på hendelsen Layout.astro sender når språket byttes. */
export const SPRAKENDRET = 'sprakendret';

/**
 * Kjør noe hver gang språket byttes — for innhold som er tegnet opp av JS og
 * må tegnes på nytt (kalender, værwidget, datoer).
 *
 * Ikke lytt på klikk i språkvelgeren direkte: den er en flaggrad ved to språk
 * og en nedtrekksmeny ved flere, og markupen er dermed ikke den samme.
 */
export function paSprakendring(callback: () => void): void {
  document.addEventListener(SPRAKENDRET, () => callback());
}
