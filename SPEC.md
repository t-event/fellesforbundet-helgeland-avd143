# SPEC.md — Bookingnettside for Fellesforbundet Helgeland

> Dokument til godkjenning. Etter grønt lys begynner bygging.

---

## 1. Oversikt

Statisk nettside for Fellesforbundet Helgeland (avd. 143): **avdelingens hjemmeside** og **hyttebooking** for de to hyttene. Ingen database, ingen backend, ingen betalingsløsning på nettsiden. Alt hostes på GitHub Pages i **ett repo / ett Astro-prosjekt**.

**GitHub-repo:** `https://github.com/t-event/fellesforbundet-helgeland-avd143`  
**Domene:** `ffh143.no` (bestilt via domene.no — aktivt når faktura er betalt). Ved endelig lansering: forside på `ffh143.no`, hyttebooking via videresending `hyttebooking.ffh143.no`.  
**Pages-URL midlertidig:** `t-event.github.io/fellesforbundet-helgeland-avd143`  
**Status:** Avdelingens hovedside er **fronten** (rot `/`). Hytteutleia er en seksjon under «Hytteutleie ▾» i menyen (`/hytter`, `/umbukta`, `/turtips`, `/hjelp`). Én felles meny/footer for hele sida (ingen variant-splitt). MERK: noen plassholdere gjenstår (6 ansatte = navn, lokal kontingentsats). Domene `ffh143.no` ikke aktivt ennå.

---

## 2. Teknologistack

| Lag | Teknologi | Begrunnelse |
|---|---|---|
| Framework | **Astro 6** (statisk eksport, Node ≥ 22) | Fleksibel SSG, glimrende for innholdsside med komponenter, støttes av GitHub Pages |
| Styling | **Egen CSS + CSS-variabler** fra designfilen (Tailwind fjernet — ingen utility-klasser i bruk, kun preflight) | Mobil-først, designsystemet følges nøyaktig |
| Skrift | **Inter** (brødtekst) + **Space Grotesk** (overskrifter) — begge **selv-hostet woff2** (`src/fonts/`) | Ingen ekstern Google Fonts (personvern). Space Grotesk = fri erstatning for merkevarefonten Monument Grotesk (som aldri lastet) |
| Ikoner | **Lucide** vendret inn som SVG (`src/icons/`), inlines via `Icon.astro` | Erstatter emoji (rendret ulikt per OS); `currentColor` gir merkefarge. Ingen CDN/dependency |
| Kart | **Google Maps keyless embed** (`?q=…&output=embed`) på Kontakt + Umbukta | Ingen API-nøkkel (ingenting å lekke), presis geokoding |
| Skjema → e-post | **Web3Forms** (gratis, ingen backend) | Stateless POST, autosvar-funksjon, trygg public key |
| Kalender-data | **GitHub Actions → `availability.json`** | CORS-fri henting av .ics, statisk JSON leses av klienten |
| Vær | **MET Norway Locationforecast API** | Gratis, CORS-tillatt, `User-Agent`-krav følges |
| Webkamera | **Statens vegvesen kamera-API** | Oppdateres hvert 5. min i nettleseren |
| Bilder | Lokale filer → **WebP-optimert via Astro** | Fast innlasting, god Lighthouse-score |

---

## 3. Sider og ruter

| Rute | Fil | Innhold |
|---|---|---|
| `/` | `index.astro` | **Avdelingens forside**: hero, medlemsfordeler, om, aktuelt-teaser, styre-teaser, hytte-teaser, kontakt |
| `/bli-medlem` | `bli-medlem.astro` | Medlemsfordeler, kontingent, innmelding |
| `/lonn-tariff` | `lonn-tariff.astro` | Avtaleområder + ressurser |
| `/tillitsvalgte` | `tillitsvalgte.astro` | Styret (Brreg) + ansatte (plassholder) + verktøy |
| `/aktuelt` | `aktuelt.astro` | Facebook-feed (samtykke) + følg-lenker |
| `/kontakt` | `kontakt.astro` | Kontaktinfo + Web3Forms-melding |
| `/hytter` | `hytter.astro` | Hytteoversikt (to hyttekort) — seksjonsforside for «Hytteutleie» |
| `/umbukta` | `umbukta.astro` | Full hytteside (se seksjon 5) |
| `/turtips` | `turtips.astro` | 6 turtips fra Umbukta-området |
| `/hjelp` | `hjelp.astro` | FAQ-accordion + kontaktskjema |
| `/takk` | `takk.astro` | Kvitteringsside etter bookingforespørsel |
| `/om-oss` | `om-oss.astro` | Om avdelingen (historie fra 1965), kontakt, lenker |
| `/personvern` | `personvern.astro` | GDPR-personvernerklæring |
| `/cookies` | `cookies.astro` | Informasjonskapsler + samtykke |
| `/404` | `404.astro` | «Side ikke funnet» |

### Hovedside — go-live utført

Avdelingens hovedside er nå **den offentlige fronten** (rot `/`), bygget fra designet `Hovedside design/Fellesforbundet avd 143 - Hovedside.html` (Vue-mockup) i designsystemet (profilhåndbok-CSS + `data-en`-i18n + offisielle FF-illustrasjoner). Hytteutleia er en **seksjon** under «Hytteutleie ▾» i menyen.

- **Én felles meny** (`Header.astro`): Hjem · Medlem ▾ (Bli medlem, Lønn & tariff, Tillitsvalgte, Nyttige lenker) · Aktuelt · Om oss · Kontakt · Hytteutleie ▾ (Begge hyttene, Hytte i Umbukta, Hytte i Øvre Elsvatn ↗, Turtips Umbukta, Hjelp – hytteutleie). Ingen variant-splitt lenger.
- **Én felles footer** (`Footer.astro`): Avdelingen, Hyttene, Kontakt + juridisk bunnlinje.
- Tidligere skjult `/forhandsvisning`-struktur er fjernet (sidene flyttet til rot, `noindex` + sitemap-filter borte).

**Gjenstår (plassholdere/ekstern):** 6 ansatte (navn — plassholder vises), lokal kontingentsats, domene `ffh143.no` + ev. `hyttebooking.ffh143.no`-videresending (oppdater `CNAME`, `SITE`/`BASE`, robots.txt når aktivt).

---

## 4. De tre integrasjonene

### Integrasjon 1 — Outlook-kalender → availability.json

**Fil:** `.github/workflows/update-availability.yml`

- **Trigger:** Cron `0 * * * *` (hvert hele time) + manuell dispatch
- **Secret:** `CALENDAR_ICS_URL` i GitHub repo-settings (ICS-lenken legges ALDRI i kildekode)
- **Henting:** `curl`/`fetch` i Node.js-script, parser rå ICS-tekst
- **Parse-regler:**
  - VEVENT med `SUMMARY` som matcher `/^opptatt$/i` → blokkerte datoer
  - VEVENT med `SUMMARY` som matcher `/^ledig$/i` eller ingen hendelse → tilgjengelig
  - Heldagshendelser: `DTSTART;VALUE=DATE` / `DTEND;VALUE=DATE` (DTEND er eksklusiv)
  - Matcher case-insensitivt, trimmer whitespace
- **Output:** `public/availability.json`

```json
{
  "lastUpdated": "2026-06-20T14:00:00Z",
  "bookedDates": ["2026-07-11", "2026-07-12", "2026-07-13"]
}
```

- **GitHub-bot committer** filen tilbake til `main` **kun når de opptatte datoene faktisk endrer seg** (ikke ved tidsstempel-endring alene) → Pages deployer på nytt. Ingen endring = ingen deploy.
- **Forbehold på nettsiden:** «Dato er ikke garantert reservert før avdelingen bekrefter — kalenderen oppdateres ca. én gang i timen.»

### Integrasjon 2 — Web3Forms (bookingforespørsel + kontaktskjema)

**Endepunkt:** `https://api.web3forms.com/submit`  
**Key:** `PUBLIC_WEB3FORMS_KEY` (Astro-env) — injiseres ved bygging fra GitHub-secret `WEB3FORMS_KEY`. Offentlig/trygg i frontend. Form-navn hos Web3Forms: «Hyttebooking Umbukta».

**Booking-skjema sender:**
- Datoer (fra/til), antall døgn
- Navn, e-post, telefon
- Prisgruppe (FFH / FF / Annet LO) + eventuelt valgt LO-forbund
- Beregnet totalpris
- `replyto` = bestillers e-post → avdelingen kan svare direkte

**Validering mot opptatte datoer:** Booking-skjemaet henter samme `availability.json` som kalenderen og blokkerer innsending hvis det valgte intervallet `[fra, til]` inneholder en opptatt dato (inklusiv begge endepunkter — verken innsjekk eller utsjekk på en opptatt dag). Kalenderen tillater heller ikke å markere et intervall som spenner over opptatte netter.

**Kvittering til bestiller:** Vises umiddelbart på `/takk`-siden (ikke e-post — Web3Forms' autosvar er en betalt funksjon som ikke er aktivert):
- Valgte datoer, antall døgn, prisgruppe, totalpris
- Kontonummer `451635821274`
- Betalingsreferanse (`UMB-ÅÅÅÅMMDD-INITIALER`, f.eks. `UMB-20260718-ON`)
- «Datoen er ikke reservert før avdelingen bekrefter. Dørkoden sendes på SMS/e-post fra avdelingen når betalingen er registrert.»
- Web3Forms-skjemaene sender `email`-feltet (bestillerens adresse) slik at kontoret kan svare direkte (Reply-To).

**Kontaktskjema (Hjelpesenter):** Samme key, emne-tag skiller de to.

**Spam-beskyttelse:** Honeypot-felt (`<input name="botcheck" hidden>`).

### Integrasjon 3 — Prisberegning (in-browser)

Kilde: `src/config.ts`

```ts
export const PRISER = { FFH: 700, FF: 1050, ANNET_LO: 1200 } as const;
```

- Beregnes live: `antall_dager × pris`
- Oppdateres når datoer eller prisgruppe endres
- Totalpris vises i `price-summary`-komponent før innsending
- Betalingsreferanse genereres i nettleseren, sendes med skjema og vises på kvitteringsside

---

## 5. Umbukta-siden — seksjonsoversikt

1. **Hero** — stort bilde med overlay-tittel og badge
2. **Om hytta** — inntil 12 sengeplasser, 2 soverom + sovealkove + romslig hems, 3,5 mil fra Mo i Rana, 3 km fra Sverige
3. **Bildegalleri** — sommerbilder fra Rikke (`public/images/umbukta/umbukta-*.jpg`): eksteriør, stue, kjøkken, spisestue med utsikt, soverom, hems, bad, naust med båt
4. **Fasiliteter** — SVG-ikoner: innlagt vann + strøm, varmepumpe, vedovn, dusj, fullt kjøkken, mobildekning, WiFi, TV, parkering (4–5 biler), naust med aluminiumsbåt
5. **Beliggenhet** — innebygd **Google Maps keyless embed** (`?q=lat,lon&output=embed`, ingen API-nøkkel) + «Åpne i Google Maps»-lenke, veibeskrivelse, parkering, vinteradkomst (vei brøytes — bilvei helt fram hele året). Koordinater fra `UMBUKTA.lat/lon` (hentet fra avdelingens Maps-pin), som også styrer værvarsel + GPS-visning.
6. **Vær & webkamera** — MET API + Vegvesen-kamera (side ved side)
7. **Priser** — tre prisskort (FFH 700 / FF 1050 / Annet LO 1200 kr/døgn)
8. **Ledighetskalender + bookingskjema** — side ved side (stakkede på mobil)
9. **Påske / loddtrekning** — vises automatisk basert på dato (se seksjon 6)
10. **Husregler** — innsjekk 16:00, utsjekk 12:00, ingen refusjon, hunder ok (ikke i seng/sofa), elbillader på Umbukta fjellstue ca. 300 m unna
11. **FAQ-accordion** — 6+ spørsmål

---

## 6. Påske — fullautomatisk logikk

Ingen manuell oppdatering nødvendig.

**Beregning:** Meeus/Jones/Butcher-algoritmen beregner påskedato for ethvert år.

**Perioder:**
- P1: Fredag i palmehelga (Påskedag − 9) → Onsdag i stille uke kl. 12 (Påskedag − 4)
- P2: Onsdag i stille uke kl. 16 (Påskedag − 4) → 2. påskedag (Påskedag + 1)
- Påmelding: man kan velge **begge** perioder, men kan vinne **maks én** (trekkes manuelt av kontoret).
- Test/forhåndsvisning: legg til `?paske=test` i URL-en for å tvinge seksjonen + skjemaet synlig uavhengig av dato (kun for den med lenken).
- Manuell bryter for ALLE besøkende: `PASKE_MANUELL_VISNING = true` i `src/utils/easter.ts` tvinger seksjonen + skjemaet synlig uavhengig av dato. Settes tilbake til `false` for normal automatikk.

**Eksempel 2026:** Påskedag 5. april  
- P1: 27. mars → 1. april (kl. 12)  
- P2: 1. april (kl. 16) → 6. april

**Visningslogikk (automatisk, basert på dagens dato):**

| Periode | Hva vises |
|---|---|
| 1. oktober → 3 uker før Påskedag | Loddtrekning-seksjon med skjema og påmeldingsfrist |
| < 3 uker før Påskedag | Seksjon vises, men skjema skjules — melding: «Påmeldingsfristen er ute» |
| Etter Påskedag → 30. september | Loddtrekning-seksjonen skjules helt |

- **Kalender:** Viser alltid gule «Loddtrekning»-dager for begge perioder, uavhengig av registreringsvindu
- **Påmeldingsfrist:** Vises som «3 uker før Påskedag» (beregnes automatisk)
- Neste år beregnes automatisk: fra 1. oktober i inneværende år → neste påske

---

## 7. Hyttene — innhold

### Umbukta (intern booking)
- **Sengeplasser:** inntil 12 (2 soverom + sovealkove + romslig hems)
- **Fasiliteter:** innlagt vann, strøm, varmepumpe, vedovn, dusj, fullt kjøkken, mobildekning, WiFi, TV, dyner/puter, parkering (4–5 biler)
- **Naust:** Aluminiumsbåt med liten motor — ta med eget drivstoff
- **Elbillader:** Ikke på hytta, men på Umbukta fjellstue ca. 300 m unna
- **Foreninger o.l.:** Kan leie hytta på hverdager uten overnatting (kontakt avdelingen)
- **Ta med selv:** Sengetøy/laken, håndklær, toalettpapir, kjøkkenhåndkle
- **Husdyr:** Tillatt — ikke i sofa/seng
- **Avbestilling:** Ingen refusjon
- **Kart:** GPS 66.1659, 14.5832
- **Kun for medlemmer** (FFH, FF, andre LO-forbund)

### Øvre Elsvatn (ekstern booking via inatur.no)
- **50 m², 6 sengeplasser, 2 soverom**
- Vedfyring, solcelle med batteri, utedo (ikke innlagt vann), gassbluss
- 13 fots motorbåt følger med
- Husdyr tillatt
- Ca. 30 min gange fra vei (3 km)
- Nøkkelhenting i Mosjøen eller Hattfjelldal etter avtale
- **Åpen for alle** — bookes via inatur.no

---

## 8. Turtips (6 stk.)

Sauvasshytta, Kvitstindalstunet, Virvasshytta, Kjenvasshytta, Oksskolten, **Årestue Umbukta** (erstattet Uman).  
Hvert kort lenker til turens side på **UT.no**.  
Turkortene er tekstbaserte (ingen bilder — avdelingen har ikke bilderettigheter til turene). Bilder finnes via UT.no-lenken.

---

## 9. Konfigurasjon (`src/config.ts`)

```ts
export const PRISER = { FFH: 700, FF: 1050, ANNET_LO: 1200 } as const;
export const KONTONUMMER = "451635821274";
export const KONTAKT = {
  telefon: "75151228",
  epost: "avd143@fellesforbundet.org",
  adresse: "Søndre gate 13, 8624 Mo i Rana",
  apningstider: "08:00–15:30",
  orgnr: "943238049",
};
export const UMBUKTA = {
  kart: "https://maps.app.goo.gl/Q8f8DPbiG6TmMtpy6",
  lat: 66.1659051,
  lon: 14.5832452,
};
export const ELSVATN_INATUR_URL =
  "https://www.inatur.no/hytte/670e2bd422a51709667760cd/hytte-i-ovre-elsvatn-hattfjelldal";

export const LO_FORBUND = [
  "Fagforbundet",
  "EL og IT Forbundet",
  "Industri Energi",
  "Norsk Transportarbeiderforbund",
  "Norsk Arbeidsmandsforbund",
  "HK – Handel og Kontor",
  "Fellesorganisasjonen (FO)",
  "Norsk Jernbaneforbund",
  "Norsk Nærings- og Nytelsesmiddelarbeiderforbund",
  "Musikernes fellesorganisasjon",
  "Norsk Sjømannsforbund",
  "Norges Musikkorps Forbund",
  "Skolenes landsforbund",
  "Norsk Lokomotivmannsforbund",
  "SAFE",
  "Parat",
  "Annet LO-forbund",
] as const;
```

---

## 10. Språk (NO/EN, JS-basert)

- `lang="no"` på `<html>`
- Delte/korte strenger (nav, overskrifter, skjemaetiketter) i `src/i18n/translations.ts` med `{ nb, en }`, tagget `data-i18n="nøkkel"`
- Lengre brødtekst/lister tagges inline med `data-en="..."` (engelsk ved siden av norsk i HTML-en); språkskriptet bytter `innerHTML`. `data-en-ph` bytter placeholder på input/textarea.
- Valg lagres i `localStorage('lang')`
- Init-skript kjører på `DOMContentLoaded`, bytter alle tekster
- Språkvelger i header (NO / EN)
- E-post til avdelingen alltid på norsk

---

## 11. SEO

- `<title>` og `<meta name="description">` unike per side
- Open Graph-tagger (`og:title`, `og:description`, `og:image 1200×630`, `og:url`)
- Twitter Card (`summary_large_image`)
- `robots.txt` — tillater indeksering, peker til `sitemap.xml`
- `sitemap.xml` — genereres automatisk av Astro `@astrojs/sitemap`
- `hreflang` — ikke aktuelt (JS-switching, én URL per side)
- Schema.org JSON-LD: `LodgingBusiness` for Umbukta, `Organization` for FFH
- Semantisk HTML: `<header>`, `<main>`, `<nav>`, `<footer>`, `<article>`, `<section>`
- Bilder: `alt`-tekst, WebP, `width`/`height`, `loading="lazy"`
- Canonical-tag per side

---

## 12. Avbestillingsregler (viktig)

Vises tydelig på Umbukta-siden og kvitteringssiden:

> **Avbestilt leie refunderes ikke.** Vi anbefaler at du har reise-/avbestillingsforsikring i orden.

---

## 13. Sikkerhets- og personvernpunkter

- ICS-URL kun i GitHub Actions-secret, aldri i kildekode
- Web3Forms access-key er public/trygg — OK i frontend
- Ingen server-hemmeligheter i drift
- GDPR: Nettsiden lagrer ingenting — data finnes kun hos avdelingen og Web3Forms
- Samtykketekst vises i booking- og kontaktskjema
- Dørkode: håndteres utelukkende av avdelingen, ALDRI i kode, e-poster eller nettsted
- **Skrift selv-hostet** (Inter + Space Grotesk woff2 i `src/fonts/`) — ingen ekstern Google Fonts-forespørsel, så besøkendes IP deles ikke med Google
- **Google Maps API-nøkkel** (fra tidlig versjon) ble lekket i git-historikk → **revokert i Google Cloud Console og fjernet fra historikken** (filter-branch + force-push). Kartene bruker nå **keyless Google Maps embed** (`?q=…&output=embed`) — helt uten API-nøkkel, så det finnes ingenting å lekke. **Ikke gjeninnfør en NØKKEL-basert Google Maps-embed (Maps JS/Embed API); den keyless varianten er trygg.**
- **DOM-XSS** på takk-siden (navn fra URL i `innerHTML`) er lukket — bygges nå med `createTextNode`/`replaceChildren`.
- Sårbarhetsrapportering: se [SECURITY.md](SECURITY.md) (privat melding til T-Event)

---

## 14. Footer-krav

- Auto-oppdaterende `© {new Date().getFullYear()} Fellesforbundet Helgeland`
- Org.nr. 943 238 049 med lenke til Brønnøysundregistrene
- Lenker: Personvern, Om FFH, Cookies
- Kontakt: tlf. 75151228, avd143@fellesforbundet.org

---

## 15. Avdelingens arbeidsflyt (dokumenteres i README)

Nettsiden har ingen admin-del. Etter mottatt e-postforespørsel:

1. Sjekk bankkonto for overføring (bruk betalingsreferanse i meldingsteksten)
2. Registrer bookingen i Outlook-kalenderen som «Opptatt» → forsvinner fra ledige datoer innen 1 time
3. Send dørkoden til leietaker på SMS eller e-post

---

## 16. Bygge-faser

| Fase | Innhold |
|---|---|
| 1 | Prosjektoppsett (Astro, konfig, bilder), forside, layout, header/footer |
| 2 | Umbukta-side: galleri, fasiliteter, beliggenhet, priser, husregler, FAQ |
| 3 | GitHub Action → `availability.json`, kalendervisning (ledig/opptatt/loddtrekning) |
| 4 | Bookingskjema: datovelger, prisberegning, Web3Forms-integrasjon, kvitteringsside |
| 5 | Påskelogikk (automatisk), loddtrekning-skjema |
| 6 | Vær (MET API) + webkamera (Vegvesen), turtips, hjelpesenter/FAQ |
| 7 | SEO, schema.org, robots.txt, sitemap, OG-bilder, 404, om-oss, personvern, cookies |
| 8 | Engelsk oversettelse, README, .env.example, polish, tilgjengelighet |

---

## 17. Avvik: design vs. spec

| Design-HTML sier | Spec/faktisk verdi | Vinner |
|---|---|---|
| Avbestilling: gratis inntil 7 dager | Ingen refusjon ved avbestilling | **Spec** |
| 6 sengeplasser, 2 soverom | 12 sengeplasser, 2 soverom + sovealkove + romslig hems | **Spec** |
| 4 turtips (Umbukta-basert) | 6 turtips: Sauvasshytta, Kvitstindalstunet, Virvasshytta, Kjenvasshytta, Oksskolten, Uman | **Spec** |
| Plassholder-tlf. 75 00 00 00 | 75151228 | **Spec** |
| Plassholder-konto 1503.27.44871 | 451635821274 | **Spec** |

CSS-variabler, komponent-stilene og layout følger design-HTML nøyaktig.

## 18. As-built — tillegg etter go-live

Endringer og tillegg utover opprinnelig spec:

- **Tillitsvalgte-siden** viser nå avdelingens organer med reelle navn/verv (fra
  `src/config.ts`): `ANSATTE` (m/Tommy som leder–daglig drift), `STYRE` (leder,
  nestleder, sekretær, ungdomsledelse + styremedlemmer m/klubb), `UNGDOMSUTVALG`
  + `UNGDOMSSEKRETAR` (mørkt «region»-kort, ikke valgt/ansatt i avdelingen),
  `REPRESENTANTSKAP` (uten varamedlemmer), `KONTROLLKOMITE`, `VALGKOMITE`.
- **Header**: to-rads header m/topbar (Om avdelingen · Tillitsvalgte · Min Side ↗
  + språk), flerkolonne-megameny (Medlem · Avdelingen · Hytteutleie), ikke-sticky.
  Avdelingsnavn-lockup «Helgeland Avd. 143» under logoen (profilhåndbok 2.1).
- **Brødsmuler** «Forsiden / [side]» på undersider; navy på mørke hero-sider.
- **Ekstern-lenke-varsel**: modal bekrefter før man forlater avdelingens side.
- **Sirkelmotiv** («punktet»): ulik håndbok-godkjent primærfarge-dominans per side.
- **Profilhåndbok 2.2**: versal «parole» kun på forsidens hero (maks 3 linjer);
  undersidenes hero-overskrifter i vanlig setningsform.
- **Typografi**: hovedfont er Monument Grotesk (profilhåndbok). På web brukes
  **Space Grotesk** som fri erstatningsfont — visuelt nær Monument, siden Monument
  krever lisens/tilgang fra kommunikasjonsavdelingen (Franklin Gothic er håndbokas
  Office-erstatning, men passer dårligere på web).
- **Umbukta**: eget satellittkart for naustet med båt (i tillegg til hyttekartet).
  Båtdrivstoff: 98 oktan, helst alkylatbensin (4-takt).
- **Forsiden**: «Vi har ryggen din»-boksene er klikkbare; medlemssitat fra
  Mathias Tustervatn.
- **Merkevare-lockup**: logo + «Helgeland Avd. 143» som én inline-SVG
  ([BrandLockup.astro](src/components/BrandLockup.astro)) med fast geometri —
  identisk i header/footer på alle størrelser.
- **Integrasjon 4 — Arrangementer (auto-henting)**: planlagt GitHub-jobb
  ([.github/workflows/update-arrangementer.yml](.github/workflows/update-arrangementer.yml))
  kjører [scripts/update-arrangementer.mjs](scripts/update-arrangementer.mjs) daglig.
  Scriptet henter Fellesforbundets kurs + konferanser for Nordland (strukturert
  JSON innebygd i kildesidens HTML), skriver `src/data/arrangementer.json`, og
  committer. Vises på /aktuelt («Kommende kurs og konferanser i Nordland»),
  bygges statisk. Facebook-arrangementer kan IKKE hentes automatisk (innloggings-
  vegg / krever Graph API-token) — derfor kun Fellesforbundet-kilden.

---

*Godkjenn denne SPEC.md, så begynner vi å bygge fase for fase.*
