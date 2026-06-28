# Fellesforbundet Helgeland avd. 143 — Hyttebooking

Bookingside for Umbukta-hytta og Elsvatn-hytta. Bygget med Astro 6 (egen CSS, Node ≥ 22), publisert på GitHub Pages. Ingen backend, ingen database — alt er statisk HTML med GitHub Actions for kalendersynkronisering.

---

## Innholdsfortegnelse

1. [Første gangs oppsett](#1-første-gangs-oppsett)
2. [GitHub-hemmeligheter (secrets)](#2-github-hemmeligheter-secrets)
3. [Web3Forms-konto](#3-web3forms-konto)
4. [GitHub Pages aktivering](#4-github-pages-aktivering)
5. [Eget domene (valgfritt)](#5-eget-domene-valgfritt)
6. [Kalendersynkronisering](#6-kalendersynkronisering)
7. [Kontorutiner — bookingflyt](#7-kontorutiner--bookingflyt)
8. [Påske-loddtrekning](#8-påske-loddtrekning)
9. [Vedlikehold og oppdateringer](#9-vedlikehold-og-oppdateringer)
10. [Lokal utvikling](#10-lokal-utvikling)

---

## 1. Første gangs oppsett

### Forutsetninger
- Git installert på maskinen
- Node.js 22+ installert (Astro 6 krever Node ≥ 22.12)
- GitHub-konto med tilgang til organisasjonen `t-event`

### Klone og installere

```bash
git clone https://github.com/t-event/fellesforbundet-helgeland-avd143.git
cd fellesforbundet-helgeland-avd143
npm install
```

### Deaktiver Astro-telemetri (valgfritt)

```bash
npx astro telemetry disable
```

---

## 2. GitHub-hemmeligheter (secrets)

Gå til **GitHub → repoet → Settings → Secrets and variables → Actions** og legg inn disse to hemmelighetene:

| Navn | Verdi | Hvorfor |
|------|-------|---------|
| `CALENDAR_ICS_URL` | Outlook-kalenderens `.ics`-lenke (se under) | Brukes av timeplanen som henter bookede datoer |
| `WEB3FORMS_KEY` | Access key fra Web3Forms-kontoen | Brukes av GitHub Actions under bygging |

### Hvor finner du ICS-lenken?

ICS-lenken for Umbukta-kalenderens Outlook-kalender lagres **KUN** her som GitHub-hemmelighet. Lenken skal aldri inn i kode, e-post eller publiserte filer.

### Viktig sikkerhetsmerk

> **Dørkoden (koden til hyttedøren) skal ALDRI legges inn på nettsiden, i koden, i automatiske e-poster eller i repoet.** Kontoret sender dørkoden manuelt via SMS eller e-post etter betalingsbekreftelse er mottatt.

---

## 3. Web3Forms-konto

Nettsiden bruker [Web3Forms](https://web3forms.com) som skjematjeneste — gratis, ingen backend nødvendig.

### Opprette konto

1. Gå til [web3forms.com](https://web3forms.com)
2. Registrer deg med e-postadressen `avd143@fellesforbundet.org`
3. Kopier **Access Key** (en lang streng, f.eks. `abc123-...`)
4. Legg denne inn som GitHub-hemmeligheten `WEB3FORMS_KEY` (se trinn 2 over)
5. Legg den også inn i `.env`-filen lokalt (kopier `.env.example` til `.env` og fyll inn)

### Hva Web3Forms gjør

- Tar imot booking-, kontakt- og påskeskjemaet og sender e-post til kontorets innboks (Web3Forms-kontoens e-post)
- Den som booker ser betalingsinfo på kvitteringssiden (`/takk`) umiddelbart. Det sendes **ingen automatisk** e-postkvittering — Web3Forms' autosvar er en betalt funksjon. Kontoret følger opp manuelt på e-post.

Gratis-planen tillater **250 skjemainnsendinger per måned** — mer enn nok for hyttetrafikken.

---

## 4. GitHub Pages aktivering

1. Gå til **GitHub → repoet → Settings → Pages**
2. Under **Source**: velg **GitHub Actions**
3. Trykk **Save**

Siden vil nå bygges og publiseres automatisk ved hvert push til `main`-grenen. Første gang tar det ca. 1–2 minutter.

**URL uten eget domene:**
`https://t-event.github.io/fellesforbundet-helgeland-avd143`

---

## 5. Eget domene (valgfritt)

Når dere kjøper domenenavnet (f.eks. `hytteutleie-ffh143.no`):

### Oppdater i kodebasen

Åpne [public/CNAME](public/CNAME) og erstatt plassholder-domenet med det faktiske domenenavnet.

Åpne [public/robots.txt](public/robots.txt) og oppdater sitemap-URL.

Oppdater [astro.config.mjs](astro.config.mjs) — legg inn domenet som standard for `SITE` og sett `BASE` til `/`.

### DNS-oppsett hos domeneregistrar

Legg inn disse DNS-postene hos der domenet er registrert:

```
A     @    185.199.108.153
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
CNAME www  t-event.github.io
```

### GitHub Pages — legg til domenet

1. **GitHub → repoet → Settings → Pages**
2. Under **Custom domain**: skriv inn domenenavnet
3. Huk av **Enforce HTTPS**

Det tar 15–60 minutter for DNS å propagere første gang.

---

## 6. Kalendersynkronisering

### Slik fungerer det

En GitHub Actions-jobb kjører på toppen av hver time (cron `0 * * * *`) og:

1. Henter kalenderens `.ics`-fil fra Outlook
2. Leser alle hendelser med tittel «Opptatt» (case-insensitiv)
3. Skriver en liste med opptatte datoer til `public/availability.json` — **kun når de opptatte datoene faktisk har endret seg** (ikke bare fordi tidsstempelet endrer seg)
4. Committer og pusher til `main` kun ved en reell endring → da bygges/deployes siden på nytt. Står ingenting endret, skjer ingen deploy.

Kalenderen på nettsiden leser så `availability.json` og farger opptatte dager rødt. Booking-skjemaet bruker samme data: man kan **ikke** sende forespørsel på en periode som inneholder en opptatt dato (verken innsjekk eller utsjekk på en opptatt dag).

### Merke en dato som opptatt i Outlook

Kontoret bruker Outlook-kalenderen for Umbukta-hytta. Slik merker du en periode som opptatt slik at den vises på nettsiden:

1. Opprett en ny hendelse i Outlook-kalenderen
2. Sett tittelen til nøyaktig **«Opptatt»** (stor O)
3. Sett start- og sluttdato for bookingperioden
4. Lagre hendelsen

Innen én time vil de aktuelle dagene vises som opptatte på nettsiden.

> Hendelser med andre titler (f.eks. «Påske», «Vedlikehold», private notater) ignoreres av synkroniseringen og vises **ikke** på nettsiden.

---

## 7. Kontorutiner — bookingflyt

### Når en booking kommer inn

Kontoret mottar en e-post fra `noreply@web3forms.com` med:
- Navn og kontaktinfo på den som booker
- Ønsket periode (fra–til)
- Antall gjester, gruppe (FFH / FF / annet LO-forbund)
- Beregnet pris og betalingsreferanse (f.eks. `UMB-2026 0712-JNH`)
- Kontonummer `451635821274`

Den som booker ser samme info på kvitteringssiden (`/takk`) umiddelbart. (Automatisk e-postkvittering krever Web3Forms' betalte autosvar og er ikke aktivert.)

### Kontorets oppgave etter mottak

1. **Sjekk om perioden er ledig** i Outlook-kalenderen
2. **Bekreft booking** — send e-post/SMS til den som booker med:
   - Bekreftelse på at hytta er reservert
   - Betalingsfrist
   - **Dørkoden** (send denne manuelt — den finnes ikke på nettsiden)
3. **Merk perioden som opptatt** i Outlook-kalenderen (tittel: «Opptatt»)
4. **Følg opp betaling** — kontroller at betalingsreferansen stemmer mot innbetaling
5. **Send nøkkel/adgang** etter betalingsbekreftelse

> **Viktig:** Nettsiden er ikke et bindende bookingsystem. Booking er ikke bekreftet før kontoret sender bekreftelse. Vennligst gjør dette innen 1–2 virkedager.

### Priser (per natt)

| Gruppe | Pris per natt |
|--------|--------------|
| Fellesforbundet Helgeland avd. 143 (FFH) | 700 kr |
| Fellesforbundet øvrige avdelinger (FF) | 1 050 kr |
| Annet LO-forbund | 1 200 kr |

---

## 8. Påske-loddtrekning

Umbukta-hytta er populær i påsken. Systemet håndterer dette automatisk:

### Tidslinje (automatisk)

| Tidspunkt | Hva skjer |
|-----------|-----------|
| 1. oktober | Påske-seksjonen blir synlig på nettsiden, registreringsskjemaet åpner |
| 3 uker før påskedag | Skjemaet stenges, loddtrekning gjøres av kontoret |
| Etter påske | Seksjonen skjules igjen til neste 1. oktober |

Ingen manuell konfigurasjon nødvendig — alt er automatisk basert på norsk påskedato.

### Vis påske-seksjonen manuelt (forhåndsvisning / utenom sesong)

Noen ganger ønsker man å se eller vise fram påske-seksjonen utenom det automatiske vinduet (f.eks. for at styret skal se hvordan den ser ut). Det finnes to måter:

- **Kun for deg selv (lenke):** legg til `?paske=test` i URL-en, f.eks.
  `…/umbukta?paske=test`. Vanlige besøkende påvirkes ikke.
- **For alle besøkende (bryter i koden):** sett `PASKE_MANUELL_VISNING = true` i
  [src/utils/easter.ts](src/utils/easter.ts) og push. Da vises seksjonen **og det
  innsendbare skjemaet** for alle, uavhengig av dato. **Husk å sette den tilbake til
  `false`** etterpå, ellers ser publikum en påske-loddtrekning utenom sesong.

Den automatiske visningen (1. okt. → etter påske) virker som normalt når begge står av.

### Loddtrekning (kontorets oppgave)

Rundt 3 uker før påske mottar kontoret alle påske-registreringer på e-post. Kontoret gjennomfører loddtrekning og kontakter vinnerne manuelt.

---

## 9. Vedlikehold og oppdateringer

### Hva krever ingen vedlikehold

- Kalendersynkronisering (kjører automatisk hver time)
- Påske-datoer (beregnes automatisk for alle fremtidige år)
- Været og webkamera (hentes live fra MET og Statens vegvesen)
- Årstall i bunnteksten (oppdateres automatisk)

### Hva kontoret oppdaterer i Outlook

- Merke perioder som «Opptatt» (se trinn 6)
- Det er alt!

### Hva som krever kodeendringer

- Prisendringer → oppdater `src/config.ts` (variabelen `PRISER`)
- Kontaktinfo-endringer → oppdater `src/config.ts` (variabelen `KONTAKT`)
- Nye bilder → legg til i `public/images/umbukta/` eller `public/images/elsvatn/` og oppdater bildegalleriet i sidene

### Slik pusher du endringer til nettsiden

```bash
git add src/config.ts
git commit -m "Oppdater priser 2027"
git push
```

GitHub Actions bygger og publiserer siden automatisk (tar ca. 1–2 minutter).

### GitHub Actions-workflows

| Workflow | Trigger | Gjør |
|----------|---------|------|
| `deploy.yml` | Push til `main` | Bygger (Node 22) og deployer til GitHub Pages |
| `build-check.yml` | Push til andre brancher + PR-er | Bygger **uten** å deploye — validerer at koden kompilerer før merge til `main` |
| `update-availability.yml` | Cron (hver time) | Synker Outlook-kalenderen → `availability.json` (deployer kun ved reell endring) |

> Astro 6 krever Node ≥ 22, så begge bygge-workflowene bruker Node 22.

---

## 10. Lokal utvikling

```bash
# Kopier miljøvariabler
cp .env.example .env
# Fyll inn PUBLIC_WEB3FORMS_KEY i .env

# Start utviklingsserver
npm run dev
# Åpner på http://localhost:4321/fellesforbundet-helgeland-avd143/

# Bygg for produksjon
npm run build

# Forhåndsvis produksjonsbygg
npm run preview
```

### Manuell kjøring av kalendersynkronisering

```bash
CALENDAR_ICS_URL="<ics-lenken>" node scripts/update-availability.js
```

### Legg til siden i Google Search Console (valgfritt)

Etter at siden er oppe og domenet er satt:

1. Gå til [Google Search Console](https://search.google.com/search-console)
2. Legg til eiendom: domenet ditt
3. Verifiser eierskap (DNS TXT-post eller HTML-fil)
4. Send inn sitemap: `https://dittdomene.no/sitemap-index.xml`

---

## Teknisk stack

| Komponent | Teknologi |
|-----------|-----------|
| Rammeverk | [Astro 6](https://astro.build) (statisk, Node ≥ 22) |
| Styling | Egen CSS + CSS-variabler (Tailwind fjernet — var ubrukt) |
| Skrift | Inter — **selv-hostet** woff2 (`src/fonts/`), ingen ekstern Google Fonts |
| Skjema-til-e-post | [Web3Forms](https://web3forms.com) |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |
| Kalender | Microsoft Outlook (ICS) |
| Vær | MET Norway Locationforecast API |
| Webkamera | Statens vegvesen kamera-API |
| Bookings for Elsvatn | [inatur.no](https://www.inatur.no) (ekstern lenke) |

---

## Kontakt og support

**Kontoret (booking, drift):** avd143@fellesforbundet.org · 75 15 12 28  
**Adresse:** Søndre gate 13, 8624 Mo i Rana  
**Åpningstider:** 08:00–15:30

**Tekniske spørsmål om nettsiden:** T-Event v/ Mathias — [mathias@t-event.no](mailto:mathias@t-event.no) · 929 63 907

Alt som gjelder selve nettsiden (feil, endringer, utvikling, domene, GitHub, secrets) håndteres av T-Event. Kontoret håndterer booking og hyttedrift.

Sikkerhetssvakheter meldes privat til T-Event — se [SECURITY.md](SECURITY.md).
