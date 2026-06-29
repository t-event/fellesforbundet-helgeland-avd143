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

// Fellesforbundet sentralt — offisielle lenker (ekte)
export const FF_LENKER = {
  medlemskap: 'https://www.fellesforbundet.no/medlemskap/',
  kontingent: 'https://www.fellesforbundet.no/medlemskap/hva-koster-det/',
} as const;

// Avdelingens ledelse (offentlig registrert i Brønnøysund).
// MERK: utvid med flere tillitsvalgte + direkte kontakt når avdelingen oppgir det.
export const LEDELSE = [
  { navn: 'Tommy Rannov Nystad', rolle: 'Leder',     rolle_en: 'Leader' },
  { navn: 'Kjell Arne Olsen',    rolle: 'Nestleder', rolle_en: 'Deputy leader' },
] as const;

export const UMBUKTA = {
  kart: 'https://maps.app.goo.gl/Q8f8DPbiG6TmMtpy6',
  lat: 66.1659051,
  lon: 14.5832452,
  sengeplasser: 12,
  soverom: '2 soverom, sovealkove og romslig hems',
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
    distanse: '8,5–11,5 km',
    distanse_en: '8.5–11.5 km',
    tid: 'ca. 4 t',
    tid_en: 'approx. 4 h',
    beskrivelse:
      'DNT-hytte sørvest for Umbukta. Korteste innmarsj er merket sti fra Plurdalen (8,5 km), eller langs Nordlandsruta fra Umbukta fjellstue (11,5 km).',
    beskrivelse_en:
      'DNT cabin southwest of Umbukta. The shortest approach is the marked trail from Plurdalen (8.5 km), or along the Nordland route from Umbukta mountain lodge (11.5 km).',
    lenke: 'https://ut.no/hytte/1093/sauvasshytta',
  },
  {
    id: 'kvitsteindalstunet',
    navn: 'Kvitsteindalstunet',
    vanskelighet: 'Krevende',
    vanskelighet_en: 'Demanding',
    distanse: 'ca. 15 km',
    distanse_en: 'approx. 15 km',
    tid: 'ca. 6 t',
    tid_en: 'approx. 6 h',
    beskrivelse:
      'Avsidesliggende hytte ved Kallvatnet. Sommerstid via anleggsvei til Østerdal og merket rute over Gammalgardsfjellet, eller med båt over vatnet. Fin på skitur via Sauvasshytta og Virvasshytta.',
    beskrivelse_en:
      'Remote cabin by Kallvatnet. In summer via the access road to Østerdal and a marked route over Gammalgardsfjellet, or by boat across the lake. Great on a ski tour via Sauvasshytta and Virvasshytta.',
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
      'Hytte i vestenden av Virvatnet. Om sommeren fra E6 ved Krokstrand: 16 km anleggsvei til demningen, deretter sti til hytta. Anleggsveien er ikke vinterbrøytet.',
    beskrivelse_en:
      'Cabin at the western end of Virvatnet. In summer from the E6 at Krokstrand: 16 km of access road to the dam, then a trail to the cabin. The access road is not ploughed in winter.',
    lenke: 'https://ut.no/hytte/10571/virvasshytta',
  },
  {
    id: 'kjennsvasshytta',
    navn: 'Kjennsvasshytta',
    vanskelighet: 'Lett',
    vanskelighet_en: 'Easy',
    distanse: 'Bilvei om sommeren',
    distanse_en: 'Road in summer',
    tid: '',
    tid_en: '',
    beskrivelse:
      'Sommerstid er det bilvei helt fram: kjør til Umbukta, ta av mot Umskaret etter tunnelen og følg Akersvass-/Kjennsvassveien (ca. 40 km grusvei). Til fots på merket rute over Tverråskardet eller gjennom Leirbotnet.',
    beskrivelse_en:
      'In summer there is a road all the way: drive to Umbukta, turn off towards Umskaret after the tunnel and follow the Akersvass/Kjennsvass road (about 40 km of gravel road). On foot via the marked route over Tverråskardet or through Leirbotnet.',
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
      'Nord-Norges høyeste fjell (1916 moh). Vanlig utgangspunkt er Kjennsvasshytta — fra E12 ved Umbukta til Umskaret og ca. 40 km anleggsvei (sommer). Krevende høgfjellstur; bre og ising krever erfaring og utstyr.',
    beskrivelse_en:
      "Northern Norway's highest mountain (1916 m). The usual starting point is Kjennsvasshytta — from the E12 at Umbukta to Umskaret and about 40 km of access road (summer). A demanding high-mountain trip; glacier and ice require experience and equipment.",
    lenke: 'https://ut.no/turforslag/117249/oksskolten-1916-moh-hyest-i-nord-norge',
  },
  {
    id: 'arestue-umbukta',
    navn: 'Årestue Umbukta',
    vanskelighet: 'Lett',
    vanskelighet_en: 'Easy',
    distanse: 'Ved E12, ca. 1 km',
    distanse_en: 'By the E12, approx. 1 km',
    tid: '',
    tid_en: '',
    beskrivelse:
      'Gammel årestue ved Uman, ca. 1 km øst for Umbukta langs E12. Ligger ved en opparbeidet parkeringsplass på en tange ut i vatnet — bilvei hele året.',
    beskrivelse_en:
      'Old open-hearth hut by Uman, about 1 km east of Umbukta along the E12. By a prepared car park on a point reaching into the lake — road access all year.',
    lenke: 'https://ut.no/hytte/10172351/arestue-umbukta',
  },
] as const;
