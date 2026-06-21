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
    vanskelighet_en: 'Moderate',
    distanse: 'ca. 12 km',
    distanse_en: 'approx. 12 km',
    tid: 'ca. 4 t',
    tid_en: 'approx. 4 h',
    beskrivelse:
      'Fin dagstur til Sauvasshytta med vakker utsikt over fjellheimen på Helgeland.',
    beskrivelse_en:
      'A nice day trip to Sauvasshytta with beautiful views over the Helgeland mountains.',
    lenke: 'https://ut.no/hytte/1093/sauvasshytta',
  },
  {
    id: 'kvitstindalstunet',
    navn: 'Kvitstindalstunet',
    vanskelighet: 'Krevende',
    vanskelighet_en: 'Demanding',
    distanse: 'ca. 15 km',
    distanse_en: 'approx. 15 km',
    tid: 'ca. 6 t',
    tid_en: 'approx. 6 h',
    beskrivelse:
      'Topptur til Kvitstindalstunet med panoramautsikt mot Sverige og innover i Rana.',
    beskrivelse_en:
      'A summit hike to Kvitstindalstunet with panoramic views towards Sweden and inland Rana.',
    lenke: 'https://ut.no/hytte/10561/kvitsteindalstunet',
  },
  {
    id: 'virvasshytta',
    navn: 'Virvasshytta',
    vanskelighet: 'Lett',
    vanskelighet_en: 'Easy',
    distanse: 'ca. 8 km',
    distanse_en: 'approx. 8 km',
    tid: 'ca. 3 t',
    tid_en: 'approx. 3 h',
    beskrivelse:
      'Rolig fjelltur til Virvasshytta — passer godt for familier og nybegynnere.',
    beskrivelse_en:
      'A calm mountain walk to Virvasshytta — well suited for families and beginners.',
    lenke: 'https://ut.no/hytte/10571/virvasshytta',
  },
  {
    id: 'kjenvasshytta',
    navn: 'Kjenvasshytta',
    vanskelighet: 'Middels',
    vanskelighet_en: 'Moderate',
    distanse: 'ca. 10 km',
    distanse_en: 'approx. 10 km',
    tid: 'ca. 3,5 t',
    tid_en: 'approx. 3.5 h',
    beskrivelse:
      'Tur til Kjenvasshytta langs stien mot riksgrensen, med stopp ved fiskevatn underveis.',
    beskrivelse_en:
      'A hike to Kjenvasshytta along the trail towards the national border, with a stop by a fishing lake on the way.',
    lenke: 'https://ut.no/hytte/1079/kjennsvasshytta',
  },
  {
    id: 'oksskolten',
    navn: 'Oksskolten',
    vanskelighet: 'Krevende',
    vanskelighet_en: 'Demanding',
    distanse: 'ca. 18 km',
    distanse_en: 'approx. 18 km',
    tid: 'ca. 7 t',
    tid_en: 'approx. 7 h',
    beskrivelse:
      'Norges nordligste brebre — et eventyrlignende fjellmassiv med Oksskolten som høyeste topp (1916 moh.).',
    beskrivelse_en:
      "Norway's northernmost glacier — a fairytale-like massif with Oksskolten as the highest peak (1916 m a.s.l.).",
    lenke: 'https://ut.no/turforslag/117249/oksskolten-1916-moh-hyest-i-nord-norge',
  },
  {
    id: 'arestue-umbukta',
    navn: 'Årestue Umbukta',
    vanskelighet: 'Lett',
    vanskelighet_en: 'Easy',
    distanse: 'Kort tur ved hytta',
    distanse_en: 'Short walk by the cabin',
    tid: '',
    tid_en: '',
    beskrivelse:
      'Gammel årestue ved Umbukta — et stemningsfullt kulturminne med åpent ildsted. Se UT.no for detaljer.',
    beskrivelse_en:
      'An old open-hearth hut (årestue) at Umbukta — an atmospheric cultural heritage site. See UT.no for details.',
    lenke: 'https://ut.no/hytte/10172351/arestue-umbukta',
  },
] as const;
