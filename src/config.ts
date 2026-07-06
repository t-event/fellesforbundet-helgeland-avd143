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
  // Omtrentlige koordinater for kontoret (Søndre gate 13, Mo i Rana) — brukt til
  // kartmarkør. Finjuster ved behov mot faktisk inngang.
  lat: 66.31249,
  lon: 14.14260,
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

// Nyttige eksterne lenker til Fellesforbundet og LO (vises på /nyttige-lenker).
// Kilde: avdelingens dokument «Nyttige lenker til Fellesforbundet og LO».
export const LENKER_GRUPPER = [
  {
    tittel: 'Fellesforbundet', tittel_en: 'Fellesforbundet',
    lenker: [
      { navn: 'Medlemskap',            navn_en: 'Membership',            desc: 'Bli medlem og se hva medlemskapet gir deg.',          desc_en: 'Join and see what membership gives you.',           url: 'https://www.fellesforbundet.no/medlemskap/' },
      { navn: 'Lønn og tariff',        navn_en: 'Pay & agreements',      desc: 'Tariffavtaler, lønnsoppgjør og dine rettigheter.',    desc_en: 'Collective agreements, settlements and your rights.', url: 'https://www.fellesforbundet.no/lonn-og-tariff/' },
      { navn: 'Om Fellesforbundet',    navn_en: 'About Fellesforbundet', desc: 'Hvem forbundet er og hva det jobber for.',            desc_en: 'Who the union is and what it works for.',           url: 'https://www.fellesforbundet.no/om-fellesforbundet/' },
      { navn: 'Finn din avdeling',     navn_en: 'Find your branch',      desc: 'Oversikt over alle avdelinger i landet.',             desc_en: 'Overview of all branches in the country.',          url: 'https://www.fellesforbundet.no/avdelinger/' },
      { navn: 'For tillitsvalgte',     navn_en: 'For shop stewards',     desc: 'Verktøy, kurs og støtte i tillitsvervet.',            desc_en: 'Tools, courses and support in the role.',           url: 'https://www.fellesforbundet.no/for-tillitsvalgte/' },
      { navn: 'Min side (innlogging)', navn_en: 'My page (login)',       desc: 'Logg inn for medlemskort, kontingent og dine data.',  desc_en: 'Log in for membership card, fees and your data.',    url: 'https://minside.fellesforbundet.no' },
    ],
  },
  {
    // De viktigste verktøyene for tillitsvalgte (jf. styrets innspill):
    // tariffavtaler, Hovedavtalen og arbeidsmiljøloven.
    tittel: 'Lov- og avtaleverk', tittel_en: 'Laws & agreements',
    lenker: [
      { navn: 'Arbeidsmiljøloven (AML)', navn_en: 'Working Environment Act', desc: 'Loven om arbeidsmiljø, arbeidstid og stillingsvern.', desc_en: 'The act on working environment, hours and job protection.', url: 'https://lovdata.no/dokument/NL/lov/2005-06-17-62' },
      { navn: 'Hovedavtalen LO–NHO',     navn_en: 'The Basic Agreement',      desc: '«Arbeidslivets grunnlov» mellom LO og NHO.',        desc_en: 'The «constitution of working life» between LO and NHO.',   url: 'https://www.lo.no/hovedavtalen/' },
      { navn: 'Tariffavtaler',           navn_en: 'Collective agreements',    desc: 'Fellesforbundets tariffavtaler og lønnsvilkår.',    desc_en: 'Fellesforbundet\'s collective agreements and pay terms.', url: 'https://www.fellesforbundet.no/lonn-og-tariff/' },
    ],
  },
  {
    tittel: 'Medlemsfordeler og forsikring', tittel_en: 'Member benefits & insurance',
    lenker: [
      { navn: 'LO Favør',                 navn_en: 'LO Favør',              desc: 'Medlemsfordeler, rabatter og forsikringer.',     desc_en: 'Member benefits, discounts and insurance.',     url: 'https://www.lofavor.no' },
      { navn: 'Advokatforsikring (HELP)', navn_en: 'Legal insurance (HELP)', desc: 'Juridisk bistand i privatlivet for medlemmer.', desc_en: 'Legal assistance in private life for members.', url: 'https://help.no/forbund-bank/fellesforbundet/' },
    ],
  },
  {
    tittel: 'LO', tittel_en: 'LO',
    lenker: [
      { navn: 'LO – Landsorganisasjonen', navn_en: 'LO – Confederation of Trade Unions', desc: 'Norges største arbeidstakerorganisasjon.', desc_en: 'Norway\'s largest workers\' organisation.', url: 'https://www.lo.no' },
      { navn: 'Hvem vi er',            navn_en: 'Who we are',            desc: 'Om LO og fellesskapet av forbund.',                   desc_en: 'About LO and the community of unions.',             url: 'https://www.lo.no/hvem-vi-er/' },
      { navn: 'Hva vi gjør',           navn_en: 'What we do',            desc: 'LOs arbeid for arbeidslivet.',                        desc_en: 'LO\'s work for working life.',                      url: 'https://www.lo.no/hva-vi-gjor/' },
      { navn: 'Hva vi mener',          navn_en: 'What we stand for',     desc: 'LOs politikk og standpunkter.',                       desc_en: 'LO\'s politics and positions.',                     url: 'https://www.lo.no/hva-vi-mener/' },
      { navn: 'Bli medlem i LO',       navn_en: 'Join LO',               desc: 'Medlemskap via et LO-forbund.',                       desc_en: 'Membership through an LO union.',                   url: 'https://www.lo.no/bli-medlem/' },
      { navn: 'Hovedavtalen',          navn_en: 'The Basic Agreement',   desc: '«Arbeidslivets grunnlov» mellom LO og NHO.',          desc_en: 'The «constitution of working life» between LO and NHO.', url: 'https://www.lo.no/hovedavtalen/' },
    ],
  },
] as const;

// Avdelingens ansatte (lønnede på kontoret). PLASSHOLDER: navn/bilder ikke
// mottatt ennå — vises som «Navn kommer» med rolle. Fyll inn når avdelingen
// sender dem. Egen gruppe fra STYRE (valgt). Brukt på forside + /tillitsvalgte.
export const ANSATTE = [
  { rolle: 'Daglig leder',          rolle_en: 'General manager' },
  { rolle: 'Organisasjonsarbeider', rolle_en: 'Organiser' },
  { rolle: 'Ungdomssekretær',       rolle_en: 'Youth secretary' },
  { rolle: 'Medlemsservice',        rolle_en: 'Member services' },
  { rolle: 'Regnskap og økonomi',   rolle_en: 'Accounting & finance' },
  { rolle: 'Sekretariat',           rolle_en: 'Secretariat' },
] as const;

// Avdelingens styre (offentlig registrert i Brønnøysund).
// Verv: Tommy Rannov Nystad = leder (daglig leder + styreleder); øvrige = styremedlemmer.
// Avregistrerte er utelatt. MERK: dette er STYRET (valgt) — de 6 ANSATTE (lønnede
// på kontoret) er en egen gruppe som ikke er lagt inn ennå (navn ikke mottatt).
export const STYRE = [
  { navn: 'Tommy Rannov Nystad',             rolle: 'Leder',       rolle_en: 'Leader' },
  { navn: 'Kjell Arne Olsen',                rolle: 'Styremedlem', rolle_en: 'Board member' },
  { navn: 'Roger Eugen Ranfjordnes',         rolle: 'Styremedlem', rolle_en: 'Board member' },
  { navn: 'Ulrikke Bergitte Hansen Skjevik', rolle: 'Styremedlem', rolle_en: 'Board member' },
  { navn: 'Mathias Erlandsen Tustervatn',    rolle: 'Styremedlem', rolle_en: 'Board member' },
  { navn: 'Mary-Linn Kümmel',                rolle: 'Styremedlem', rolle_en: 'Board member' },
  { navn: 'Arnt Ove Kirknes',                rolle: 'Styremedlem', rolle_en: 'Board member' },
  { navn: 'Ann Kristin Sletvold',            rolle: 'Styremedlem', rolle_en: 'Board member' },
  { navn: 'Remi Andre Knapstad',             rolle: 'Styremedlem', rolle_en: 'Board member' },
  { navn: 'Johan Hovind',                    rolle: 'Styremedlem', rolle_en: 'Board member' },
  { navn: 'Andreas Bech Stene',              rolle: 'Styremedlem', rolle_en: 'Board member' },
  { navn: 'Stein André Olsen',               rolle: 'Styremedlem', rolle_en: 'Board member' },
  { navn: 'Jon Arne Myrvold Nygård',         rolle: 'Styremedlem', rolle_en: 'Board member' },
  { navn: 'Matz Petter Johansen',            rolle: 'Styremedlem', rolle_en: 'Board member' },
  { navn: 'Bjørn Tore Isaksen',              rolle: 'Styremedlem', rolle_en: 'Board member' },
] as const;

export const UMBUKTA = {
  kart: 'https://maps.app.goo.gl/Q8f8DPbiG6TmMtpy6',
  // Koordinater hentet fra avdelingens Google Maps-pin (kart-lenka over).
  // Styrer kartmarkør, værvarsel (yr), GPS-visning og schema.org.
  lat: 66.162769,
  lon: 14.589775,
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
