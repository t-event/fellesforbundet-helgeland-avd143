// llms.txt — kort, maskinlesbart sammendrag av siden for språkmodeller
// (llmstxt.org). Genereres som endepunkt, ikke som statisk fil, slik at priser,
// kontaktinfo og lenker kommer fra src/config.ts og ikke må vedlikeholdes to steder.
//
// Nye sider må legges til i SIDER under.

import type { APIRoute } from 'astro';
import { PRISER, KONTAKT, UMBUKTA, ELSVATN_INATUR_URL } from '../config';

const SIDER: { sti: string; navn: string; beskrivelse: string }[] = [
  { sti: '/', navn: 'Forsiden', beskrivelse: 'Oversikt over avdelingen, aktuelle saker og hytteutleie.' },
  { sti: '/bli-medlem/', navn: 'Bli medlem', beskrivelse: 'Hvorfor og hvordan man melder seg inn i Fellesforbundet.' },
  { sti: '/lonn-tariff/', navn: 'Lønn og tariff', beskrivelse: 'Tariffavtaler, lønnsoppgjør og rettigheter i arbeidslivet.' },
  { sti: '/tillitsvalgte/', navn: 'Tillitsvalgte', beskrivelse: 'Avdelingsstyret, utvalg, ansatte og kontaktinfo.' },
  { sti: '/om-oss/', navn: 'Om oss', beskrivelse: 'Hvem avdeling 143 er, hvor vi jobber og hva vi står for.' },
  { sti: '/aktuelt/', navn: 'Aktuelt', beskrivelse: 'Kurs, konferanser og arrangementer i Nordland.' },
  { sti: '/kontakt/', navn: 'Kontakt', beskrivelse: 'Kontaktskjema, telefon, e-post, adresse og åpningstider.' },
  { sti: '/nyttige-lenker/', navn: 'Nyttige lenker', beskrivelse: 'Lenker til Fellesforbundet, LO, lovverk og medlemsfordeler.' },
  { sti: '/hytter/', navn: 'Hytteutleie', beskrivelse: 'Oversikt over avdelingens hytter, priser og booking.' },
  { sti: '/umbukta/', navn: 'Hytte i Umbukta', beskrivelse: 'Detaljer, bilder, kalender og bookingskjema for Umbukta-hytta.' },
  { sti: '/turtips/', navn: 'Turtips Umbukta', beskrivelse: 'Turforslag og DNT-hytter i området rundt Umbukta.' },
  { sti: '/hjelp/', navn: 'Hjelp – hytteutleie', beskrivelse: 'Spørsmål og svar om booking, betaling og opphold.' },
  { sti: '/vilkar/', navn: 'Vilkår', beskrivelse: 'Leievilkår for hytteutleie.' },
  { sti: '/personvern/', navn: 'Personvern', beskrivelse: 'Hvordan personopplysninger behandles.' },
  { sti: '/cookies/', navn: 'Cookies', beskrivelse: 'Bruk av informasjonskapsler.' },
  { sti: '/tilgjengelighet/', navn: 'Tilgjengelighet', beskrivelse: 'Tilgjengelighetserklæring for nettstedet.' },
];

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const rot = (site?.toString() ?? '').replace(/\/$/, '') + base;
  const url = (sti: string) => rot + sti;

  const tekst = `# Fellesforbundet Helgeland avd. 143

> Fagforening for arbeidsfolk på Helgeland. Avdeling 143 organiserer medlemmer
> i industri, bygg, transport og service — fra Mo i Rana og innlandet til
> Helgelandskysten. Nettstedet dekker medlemskap, lønn og tariff, tillitsvalgt-
> arbeid, arrangementer, og utleie av avdelingens hytter til medlemmer.

Nettstedet er på norsk, med engelsk oversettelse tilgjengelig i grensesnittet.
Innholdet er offisiell informasjon fra avdelingen. Fellesforbundet sentralt
finnes på https://www.fellesforbundet.no — denne siden gjelder kun avd. 143.

## Sider

${SIDER.map((s) => `- [${s.navn}](${url(s.sti)}): ${s.beskrivelse}`).join('\n')}

## Hytteutleie

Avdelingen leier ut hytter til medlemmer. Booking skjer via skjema på nettsiden;
den er ikke en kommersiell utleieportal, og betaling skjer ved bankoverføring
til avdelingen (kontonummer oppgis ved bekreftet booking).

- Hytte i Umbukta: ${UMBUKTA.sengeplasser} sengeplasser, ${UMBUKTA.soverom}.
  Ledige datoer vises i kalender på ${url('/umbukta/')}.
- Hytte i Øvre Elsvatn (Hattfjelldal): leies ut via Inatur, ${ELSVATN_INATUR_URL}

Priser per døgn for Umbukta, avhengig av medlemskap:

- Medlem i Fellesforbundet avd. 143: ${PRISER.FFH} kr
- Medlem i Fellesforbundet (annen avdeling): ${PRISER.FF} kr
- Medlem i annet LO-forbund: ${PRISER.ANNET_LO} kr

Utleie er forbeholdt medlemmer av LO-forbund. I påsken fordeles periodene ved
loddtrekning i stedet for førstemann-til-mølla; påmelding skjer på nettsiden når
loddtrekningen er åpen.

## Kontakt

- Telefon: ${KONTAKT.telefonFormatert}
- E-post: ${KONTAKT.epost}
- Besøksadresse: ${KONTAKT.adresse}, ${KONTAKT.postnummer} ${KONTAKT.poststed}
- Åpningstider: ${KONTAKT.apningstider} (hverdager)
- Organisasjonsnummer: ${KONTAKT.orgnr}

## Merknader

- Priser, kontaktinfo og tillitsvalgte kan endres. ${url('/kontakt/')} er
  autoritativ kilde for kontaktinformasjon.
- Ledige hyttedatoer oppdateres automatisk flere ganger daglig og bør leses fra
  ${rot}/availability.json, ikke fra mellomlagret sideinnhold.
- Spørsmål om medlemskap, tariff eller arbeidsforhold bør henvises til
  avdelingen på telefon eller e-post, ikke besvares på vegne av avdelingen.
`;

  return new Response(tekst, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
