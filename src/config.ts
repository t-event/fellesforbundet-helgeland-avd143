// Sentral konfig — alle priser, kontaktinfo og konstanter her.
// Endring av pris eller konto = rediger her + ny deploy, ingen database.

export const PRISER = {
  FFH: 700,
  FF: 1050,
  ANNET_LO: 1200,
} as const;

export type Prisgruppe = keyof typeof PRISER;

export const KONTONUMMER = '451635821274';

export const KONTAKT = {
  telefon: '75151228',
  telefonFormatert: '75 15 12 28',
  epost: 'avd143@fellesforbundet.org',
  adresse: 'Søndre gate 13',
  postnummer: '8624',
  poststed: 'Mo i Rana',
  apningstider: '08:00–15:30',
  orgnr: '943238049',
  facebookUrl: 'https://www.facebook.com/profile.php?id=100064457660890',
  fellesforbundetUrl: 'https://www.fellesforbundet.no/avdelinger/avd143/',
  brreg: 'https://virksomhet.brreg.no/nb/oppslag/enheter/943238049',
} as const;

export const UMBUKTA = {
  kart: 'https://maps.app.goo.gl/Q8f8DPbiG6TmMtpy6',
  lat: 66.1659051,
  lon: 14.5832452,
  sengeplasser: 14,
  soverom: '3 soverom + hems',
} as const;

export const ELSVATN_INATUR_URL =
  'https://www.inatur.no/hytte/670e2bd422a51709667760cd/hytte-i-ovre-elsvatn-hattfjelldal';

export const VEGVESEN_KAMERA_URL =
  'https://kamera.atlas.vegvesen.no/api/images/1800193_1';

export const YR_URL =
  `https://www.yr.no/nb/værvarsel/daglig-tabell/${UMBUKTA.lat},${UMBUKTA.lon}/`;

// Full liste over LO-forbund til nedtrekksmenyen
export const LO_FORBUND = [
  'Fagforbundet',
  'EL og IT Forbundet',
  'Industri Energi',
  'Norsk Transportarbeiderforbund',
  'Norsk Arbeidsmandsforbund',
  'HK – Handel og Kontor',
  'Fellesorganisasjonen (FO)',
  'Norsk Jernbaneforbund',
  'Norsk Nærings- og Nytelsesmiddelarbeiderforbund',
  'Norsk Sjømannsforbund',
  'Skolenes landsforbund',
  'Norsk Lokomotivmannsforbund',
  'SAFE',
  'Parat',
  'Musikernes fellesorganisasjon',
  'Norges Musikkorps Forbund',
  'NTL – Norsk Tjenestemannslag',
  'Norsk Fengsels- og Friomsorgsforbund',
  'Norsk Tollerforbund',
  'Annet LO-forbund',
] as const;

export type LOForbund = typeof LO_FORBUND[number];

// Turtips i Umbukta-området
export const TURTIPS = [
  {
    id: 'sauvasshytta',
    navn: 'Sauvasshytta',
    vanskelighet: 'Middels',
    distanse: 'ca. 12 km',
    tid: 'ca. 4 t',
    beskrivelse:
      'Fin dagstur til Sauvasshytta med vakker utsikt over fjellheimen på Helgeland.',
  },
  {
    id: 'kvitstindalstunet',
    navn: 'Kvitstindalstunet',
    vanskelighet: 'Krevende',
    distanse: 'ca. 15 km',
    tid: 'ca. 6 t',
    beskrivelse:
      'Topptur til Kvitstindalstunet med panoramautsikt mot Sverige og innover i Rana.',
  },
  {
    id: 'virvasshytta',
    navn: 'Virvasshytta',
    vanskelighet: 'Lett',
    distanse: 'ca. 8 km',
    tid: 'ca. 3 t',
    beskrivelse:
      'Rolig fjelltur til Virvasshytta — passer godt for familier og nybegynnere.',
  },
  {
    id: 'kjenvasshytta',
    navn: 'Kjenvasshytta',
    vanskelighet: 'Middels',
    distanse: 'ca. 10 km',
    tid: 'ca. 3,5 t',
    beskrivelse:
      'Tur til Kjenvasshytta langs stien mot riksgrensen, med stopp ved fiskevatn underveis.',
  },
  {
    id: 'oksskolten',
    navn: 'Oksskolten',
    vanskelighet: 'Krevende',
    distanse: 'ca. 18 km',
    tid: 'ca. 7 t',
    beskrivelse:
      'Norges nordligste brebre — et eventyrlignende fjellmassiv med Oksskolten som høyeste topp (1916 moh.).',
  },
  {
    id: 'uman',
    navn: 'Uman',
    vanskelighet: 'Lett',
    distanse: 'ca. 6 km',
    tid: 'ca. 2 t',
    beskrivelse:
      'Kortere tur langs Uman-vatnet med godt fiske og rolig natur like utenfor hyttedøra.',
  },
] as const;
