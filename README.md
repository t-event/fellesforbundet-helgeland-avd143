# Fellesforbundet Helgeland avd. 143 — Hyttebooking

Bookingside for Umbukta-hytta og Elsvatn-hytta. Bygget med Astro 5 + Tailwind CSS, publisert på GitHub Pages. Ingen backend, ingen database — alt er statisk HTML med GitHub Actions for kalendersynkronisering.

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
- Node.js 20+ installert
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

- Tar imot bookingskjemaet og sender e-post til `avd143@fellesforbundet.org`
- Sender automatisk kvitteringse-post til den som booker
- Tar imot påske-loddtrekningsskjemaet og sender e-post til kontoret

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

En GitHub Actions-jobb kjører hvert minutt av timen (kl. 00, 01, 02 osv.) og:

1. Henter kalenderens `.ics`-fil fra Outlook
2. Leser alle hendelser med tittel «Opptatt» (case-insensitiv)
3. Skriver en liste med opptatte datoer til `public/availability.json`
4. Pusher endringen til `main`-grenen dersom noe er endret

Kalenderen på nettsiden leser så `availability.json` og farger opptatte dager rødt.

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

Den som booker mottar også automatisk en kvitterings-e-post med samme info.

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
| Rammeverk | [Astro 5](https://astro.build) (statisk) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com) |
| Skjema-til-e-post | [Web3Forms](https://web3forms.com) |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |
| Kalender | Microsoft Outlook (ICS) |
| Vær | MET Norway Locationforecast API |
| Webkamera | Statens vegvesen kamera-API |
| Bookings for Elsvatn | [inatur.no](https://www.inatur.no) (ekstern lenke) |

---

## Kontakt og support

**Kontoret:** avd143@fellesforbundet.org · 75 15 12 28  
**Adresse:** Søndre gate 13, 8624 Mo i Rana  
**Åpningstider:** 08:00–15:30

Tekniske spørsmål om nettsiden: ta kontakt med den som satte opp siden.
