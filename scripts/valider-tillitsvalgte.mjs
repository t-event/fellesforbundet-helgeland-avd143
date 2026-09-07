// Sjekker at src/data/tillitsvalgte.json er gyldig før den brukes til å bygge
// siden. Kjøres av `npm run valider` og automatisk i GitHub Actions, slik at en
// skrivefeil etter årsmøtet stopper utrullingen i stedet for å ødelegge siden.
//
// Scriptet er bevisst strengt på struktur og mildt på innhold: det kan avsløre
// at et navn mangler, ikke at det er feil person. Det er årsmøtets protokoll som
// er fasit — se ÅRSMØTE.md.

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIL = join(__dirname, '..', 'src', 'data', 'tillitsvalgte.json');
const VISNINGSNAVN = 'src/data/tillitsvalgte.json';

const feil = [];
const advarsler = [];

const meld = (sti, tekst) => feil.push(`${sti}: ${tekst}`);

// ── Les og parse ─────────────────────────────────────────────────────
let data;
try {
  data = JSON.parse(readFileSync(FIL, 'utf8'));
} catch (e) {
  console.error(`\n✖ ${VISNINGSNAVN} kan ikke leses som JSON.\n`);
  console.error(`  ${e.message}\n`);
  console.error('  Vanligste årsak er et komma for mye eller for lite, eller et');
  console.error('  manglende anførselstegn. Sammenlign med linjene rundt.\n');
  process.exit(1);
}

// ── Hjelpere ─────────────────────────────────────────────────────────
function sjekkPerson(sti, p, { krever = ['navn'], tillatt = [] } = {}) {
  if (typeof p !== 'object' || p === null || Array.isArray(p)) {
    return meld(sti, 'skal være et objekt med navn og rolle.');
  }
  for (const felt of krever) {
    const v = p[felt];
    if (typeof v !== 'string' || v.trim() === '') {
      meld(sti, `mangler «${felt}» (eller den er tom).`);
    }
  }
  const kjente = new Set([...krever, ...tillatt]);
  for (const felt of Object.keys(p)) {
    if (!kjente.has(felt)) {
      advarsler.push(`${sti}: ukjent felt «${felt}» — skrivefeil? Det vises ikke på siden.`);
    }
  }
  if (typeof p.navn === 'string' && p.navn !== p.navn.trim()) {
    meld(sti, 'navnet har mellomrom i start eller slutt.');
  }
}

function sjekkListe(nokkel, { min = 1, per } = {}) {
  const liste = data[nokkel];
  if (!Array.isArray(liste)) {
    meld(nokkel, 'mangler, eller er ikke en liste [ ... ].');
    return [];
  }
  if (liste.length < min) {
    meld(nokkel, `har ${liste.length} oppføringer, forventet minst ${min}.`);
  }
  liste.forEach((p, i) => per(`${nokkel}[${i + 1}]`, p));
  return liste;
}

function sjekkDubletter(nokkel, navn) {
  const sett = new Map();
  navn.forEach((n, i) => {
    const key = String(n).toLowerCase().replace(/\s+/g, ' ').trim();
    if (sett.has(key)) meld(nokkel, `«${n}» står oppført to ganger (nr. ${sett.get(key)} og ${i + 1}).`);
    else sett.set(key, i + 1);
  });
}

// ── Sist bekreftet ───────────────────────────────────────────────────
if (!/^\d{4}-\d{2}-\d{2}$/.test(data.sist_bekreftet ?? '')) {
  meld('sist_bekreftet', 'skal være en dato på formen ÅÅÅÅ-MM-DD, f.eks. "2027-03-14".');
} else {
  const dato = new Date(data.sist_bekreftet);
  if (Number.isNaN(dato.getTime())) {
    meld('sist_bekreftet', `«${data.sist_bekreftet}» er ikke en gyldig dato.`);
  } else {
    if (dato > new Date()) meld('sist_bekreftet', 'ligger fram i tid.');
    const mnd = (Date.now() - dato.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
    if (mnd > 15) {
      advarsler.push(
        `sist_bekreftet er ${Math.round(mnd)} måneder gammel (${data.sist_bekreftet}). ` +
        'Har det vært årsmøte siden? Se ÅRSMØTE.md.',
      );
    }
  }
}

// ── Styret ───────────────────────────────────────────────────────────
const styre = sjekkListe('styre', {
  min: 2,
  per: (sti, p) =>
    sjekkPerson(sti, p, {
      krever: ['navn', 'rolle', 'rolle_en', 'klubb'],
      tillatt: ['epost', 'tlf', 'tlfFormatert'],
    }),
});

// Siden viser styre[0] som leder i egen, større boks — rekkefølgen er en
// kontrakt, ikke bare pynt.
if (styre.length && styre[0]?.rolle !== 'Leder') {
  meld('styre[1]', `må være lederen (rolle: "Leder"), ikke «${styre[0]?.rolle ?? '?'}». Siden viser første oppføring som leder.`);
}
if (styre.length && !styre[0]?.epost) {
  meld('styre[1]', 'lederen må ha «epost» — den vises som kontaktpunkt på /tillitsvalgte.');
}
if (styre[0]?.tlf && !/^\d{8}$/.test(styre[0].tlf)) {
  meld('styre[1]', `«tlf» skal være 8 siffer uten mellomrom (fikk «${styre[0].tlf}»). «tlfFormatert» er den som vises.`);
}
for (const rolle of ['Leder', 'Nestleder', 'Sekretær']) {
  const antall = styre.filter((p) => p?.rolle === rolle).length;
  if (antall === 0) advarsler.push(`Ingen i styret har rollen «${rolle}».`);
  if (antall > 1) meld('styre', `${antall} personer har rollen «${rolle}» — skal være én.`);
}
sjekkDubletter('styre', styre.map((p) => p?.navn ?? ''));

// ── Ansatte ──────────────────────────────────────────────────────────
const ansatte = sjekkListe('ansatte', {
  per: (sti, p) => {
    sjekkPerson(sti, p, { krever: ['navn', 'rolle', 'rolle_en', 'sted', 'stilling'] });
    if (p?.stilling && !/^\d{1,3} %$/.test(p.stilling)) {
      meld(sti, `«stilling» skal se ut som "100 %" eller "50 %" (fikk «${p.stilling}»).`);
    }
  },
});
sjekkDubletter('ansatte', ansatte.map((p) => p?.navn ?? ''));

// ── Øvrige utvalg ────────────────────────────────────────────────────
const kontroll = sjekkListe('kontrollkomite', {
  per: (sti, p) => sjekkPerson(sti, p, { krever: ['navn', 'vara'] }),
});
sjekkDubletter('kontrollkomite', kontroll.map((p) => p?.navn ?? ''));

const studie = sjekkListe('studieutvalg', {
  per: (sti, p) => sjekkPerson(sti, p, { krever: ['navn', 'sted'] }),
});
sjekkDubletter('studieutvalg', studie.map((p) => p?.navn ?? ''));

const valgkom = sjekkListe('valgkomite', {
  per: (sti, p) => sjekkPerson(sti, p, { krever: ['navn', 'rolle', 'rolle_en', 'sted'] }),
});
sjekkDubletter('valgkomite', valgkom.map((p) => p?.navn ?? ''));

const ungdom = sjekkListe('ungdomsutvalg', {
  per: (sti, p) => sjekkPerson(sti, p, { krever: ['navn', 'rolle', 'rolle_en'] }),
});
sjekkDubletter('ungdomsutvalg', ungdom.map((p) => p?.navn ?? ''));

// ── Representantskapet (ren liste med navn) ──────────────────────────
if (!Array.isArray(data.representantskap)) {
  meld('representantskap', 'mangler, eller er ikke en liste [ ... ].');
} else {
  data.representantskap.forEach((n, i) => {
    if (typeof n !== 'string' || n.trim() === '') {
      meld(`representantskap[${i + 1}]`, 'skal være et navn i anførselstegn, f.eks. "Ola Nordmann".');
    } else if (n !== n.trim()) {
      meld(`representantskap[${i + 1}]`, `«${n}» har mellomrom i start eller slutt.`);
    }
  });
  sjekkDubletter('representantskap', data.representantskap);
}

// ── Ungdomssekretær (ett objekt) ─────────────────────────────────────
sjekkPerson('ungdomssekretar', data.ungdomssekretar, {
  krever: ['navn', 'rolle', 'rolle_en', 'merknad', 'merknad_en'],
});

// ── Rapport ──────────────────────────────────────────────────────────
const tell = (n, ord) => `${n} ${ord}`;

if (advarsler.length) {
  console.warn(`\n⚠  ${tell(advarsler.length, advarsler.length === 1 ? 'advarsel' : 'advarsler')} (stopper ikke utrullingen):\n`);
  for (const a of advarsler) console.warn(`   • ${a}`);
}

if (feil.length) {
  console.error(`\n✖ ${VISNINGSNAVN}: ${tell(feil.length, feil.length === 1 ? 'feil' : 'feil')}.\n`);
  for (const f of feil) console.error(`   • ${f}`);
  console.error('\n  Siden ble IKKE oppdatert. Rett opp punktene over og prøv igjen.\n');
  process.exit(1);
}

console.log(
  `\n✓ ${VISNINGSNAVN} er i orden — ` +
  `${styre.length} i styret, ${ansatte.length} ansatte, ` +
  `${data.representantskap.length} i representantskapet, ` +
  `${ungdom.length} i ungdomsutvalget. Sist bekreftet ${data.sist_bekreftet}.\n`,
);
