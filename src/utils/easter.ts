// Beregner påskedato for et gitt år.
// Algoritme: Meeus/Jones/Butcher — fungerer for alle år 1900–2099.
export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 1-indexed
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

// Legger til dager til en dato
function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// ISO-dato-streng (YYYY-MM-DD) uten tidssone-forskyving
function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export interface EasterPeriods {
  year: number;
  easterSundayDate: Date;
  // P1: fredag i palmehelga → onsdag i stille uke (ekskl. onsdag, dvs. til 12:00)
  p1Start: Date; // Påskedag − 9 (fredag i palmehelga)
  p1End: Date;   // Påskedag − 4 (onsdag i stille uke, utsjekk 12:00)
  // P2: onsdag i stille uke (fra 16:00) → 2. påskedag
  p2Start: Date; // Påskedag − 4 (onsdag i stille uke, innsjekk 16:00)
  p2End: Date;   // Påskedag + 1 (2. påskedag)
  // Alle datoer som skal vises som «loddtrekning» i kalenderen (P1 + P2)
  allDates: string[];
  // Tre uker før påske = påmeldingsfrist
  registrationDeadline: Date;
  // Påmeldingsstart = 1. oktober året før
  registrationStart: Date;
}

export function getEasterPeriods(year: number): EasterPeriods {
  const easter = easterSunday(year);
  const p1Start = addDays(easter, -9);
  const p1End   = addDays(easter, -4);
  const p2Start = addDays(easter, -4);
  const p2End   = addDays(easter, 1);

  // Alle dager fra P1-start t.o.m. P2-slutt
  const allDates: string[] = [];
  const current = new Date(p1Start);
  while (current <= p2End) {
    allDates.push(isoDate(current));
    current.setDate(current.getDate() + 1);
  }

  return {
    year,
    easterSundayDate: easter,
    p1Start,
    p1End,
    p2Start,
    p2End,
    allDates,
    registrationDeadline: addDays(easter, -21),
    registrationStart: new Date(year - 1, 9, 1), // 1. oktober året før
  };
}

// Returnerer påskeperiodene som er relevante å vise nå (inneværende eller neste år).
// Prioriterer neste år hvis vi er etter påske i inneværende år.
export function getRelevantEaster(now: Date = new Date()): EasterPeriods {
  const year = now.getFullYear();
  const thisYear = getEasterPeriods(year);
  // Hvis vi er etter 2. påskedag, bruk neste år
  if (now > thisYear.p2End) {
    return getEasterPeriods(year + 1);
  }
  return thisYear;
}

// Er vi i registreringsvinduet? (Mellom 1. okt. og 3 uker før påske)
export function isEasterRegistrationOpen(now: Date = new Date()): boolean {
  const ep = getRelevantEaster(now);
  return now >= ep.registrationStart && now < ep.registrationDeadline;
}

// Er loddtrekning-seksjonen synlig? (Mellom 1. okt. og etter 2. påskedag)
export function isEasterSectionVisible(now: Date = new Date()): boolean {
  const ep = getRelevantEaster(now);
  return now >= ep.registrationStart;
}

// Formater dato til norsk kort format: «27. mars»
export function formatNorsk(d: Date): string {
  return d.toLocaleDateString('nb-NO', { day: 'numeric', month: 'long' });
}
