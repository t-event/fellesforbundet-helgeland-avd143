# Vedlikehold

Alt som må gjøres på nettsida over tid, samlet på ett sted. Sjekk denne fila
først når du lurer på «må noen gjøre noe med dette?».

Det aller meste går av seg selv. Kolonnen **Hvem** sier om det er avdelingen
eller utvikler (T-Event) som gjør jobben.

---

## Går automatisk — ingen skal gjøre noe

| Hva | Hvordan | Hvis det ryker |
|-----|---------|----------------|
| Ledige hyttedatoer | `update-availability.yml`, hver time. Leser avdelingens Outlook-kalender. | Kalenderen på sida fryser på gamle datoer. Se **Actions** på github.com. |
| Kurs og konferanser | `update-arrangementer.yml`, daglig 06:00 UTC (kjører i praksis 09:30–10:00). Henter fra fellesforbundet.no. | /aktuelt viser gamle arrangementer. Scriptet skriver ikke noe hvis kilden endrer seg — da beholdes forrige gode data med vilje. |
| Påskeseksjonen | Datoen regnes ut for alle år (Meeus/Jones/Butcher). Vises 1. okt. → 2. påskedag. | — |
| Årstall i bunnteksten | Settes av JavaScript. | — |
| Vær og webkamera | Hentes live fra MET og Statens vegvesen. | Widgeten viser «Vær ikke tilgjengelig». Som regel forbigående hos kilden. |
| Utrulling | Hver push til `main` bygger og legger ut på 30–40 sekunder. | Rødt kryss under **Actions**. |

**Én ting å vite:** bygget kjører `npm run valider` først. Er navnelistene
ugyldige, stopper utrullingen og den gamle sida blir stående. Det er meningen.

---

## Fast, med kalender

| Når | Hva | Hvem |
|-----|-----|------|
| **Etter hvert årsmøte** | Styre, utvalg, representantskap og ansatte. Full oppskrift i **[ÅRSMØTE.md](ÅRSMØTE.md)**. Husk `sist_bekreftet` — datoen vises nederst på /tillitsvalgte. | Avdelingen |
| **Ved lønnsoppgjør** | Kontingentsatsen på /bli-medlem hvis den endres (i dag 1,5 % + 0,1 % lokalt = 1,6 %). | Utvikler |
| **Når hytteprisene endres** | `PRISER` i `src/config.ts`. Slår igjennom på alle sider, i skjemaet og i `llms.txt`. | Utvikler |
| **Ved bytte av tillitsvalgt med kontaktinfo** | Lederens telefon og e-post ligger i `src/data/tillitsvalgte.json`. | Avdelingen |
| **Årlig** | Les gjennom /personvern, /cookies og /tilgjengelighet. Stemmer de fortsatt? Datoen «Sist oppdatert» skal justeres. | Utvikler |
| **Årlig** | Sjekk at eksterne lenker lever (Lovdata, Arbeidstilsynet, UT.no, inatur). | Utvikler |

---

## Når du endrer innhold

| Du endrer | Da må du også |
|-----------|---------------|
| Legger til eller endrer **tekst** på en side | Skriv den engelske versjonen i `data-en` samtidig. Kjør så `npm run build && npm run tekster` — de nye tekstene havner i `_mal.json` og mangler i ordbøkene til de blir oversatt. Se **[SPRÅK.md](SPRÅK.md)**. |
| Legger inn et **nytt bilde** | Legg originalen i `public/images/…` og kjør `npm run bilder`. Bruk `<Bilde>`-komponenten, ikke `<img>`. |
| Bytter **logo eller favicon** | `npm run ikoner` og `npm run og`. |
| Bytter et **foto som brukes i deling** | `npm run og`. |
| Legger til en **ny side** | Legg den inn i `SIDER` i `src/pages/llms.txt.ts`, og gi `<Layout>` både `title` og `titleEn`. |
| Legger til en **ny ekstern tjeneste** | Åpne for den i CSP-en i `src/layouts/Layout.astro`, og beskriv den på /personvern og /cookies. |

De fire kommandoene lager filer som **sjekkes inn i repoet**. De kjøres manuelt
ved behov, ikke som del av bygget.

---

## Kjente fallgruver

Ting som har gått galt før, og som ikke fanges av bygget. Bakgrunnen for hver
av dem — hva som skjedde og hvorfor det ikke ble oppdaget — står i
**[ERFARINGER.md](ERFARINGER.md)**.

- **Astro-scopet CSS treffer ikke elementer fra en underkomponent.** `.thumb img`
  sluttet å virke da miniatyrene ble `<Bilde>`, og bildene ble strukket. Bruk
  `:global(img)` i scopet CSS som skal treffe innhold fra en komponent.
- **Bygget typesjekker ikke `<script>`-blokker i .astro-filer.** En `ReferenceError`
  der gir grønt bygg og ødelagt side. Kalenderen forsvant slik. Åpne sida i en
  nettleser etter endringer i skript.
- **`define:vars`-skript kan ikke `import`-ere.** De blir klassiske inline-skript.
  Bruker `window.ffhI18n`, satt av Layout. Gjelder BookingForm, WeatherWidget og takk.
- **`import.meta.env` virker ikke i `define:vars`-skript.** Les env i frontmatter
  og send verdien inn.
- **`data-en` inni et annet `data-en`** blir aldri oversatt — forelderen bytter ut
  hele innholdet. Har en setning en lenke, skal lenka ligge i forelderens `data-en`.
  `npm run tekster` advarer om dette.
- **Verdier som varierer må sendes som plassholdere**, ikke limes inn i strengen:
  `oversett('{antall} døgn', '{antall} nights', { antall })`. Ellers blir hver verdi
  sin egen ordboknøkkel.
- **Repo-rulesetet kan blokkere bot-pushen.** Feilen er `GH013: Repository rule
  violations`. Det er rulesetet, ikke scriptet. Skjedde 30.08.–03.09.2026.
- **Dekningstallet lyver om innhold som ikke er merket for oversettelse.** 100 %
  betyr at alle *kjente* nøkler er fylt, ikke at all tekst er oversettbar. Ved
  hvert nytt språk: rendre hver side på norsk og på det nye språket og
  sammenlign synlig tekst. Se «Sjekk at ALT faktisk er oversettbart» i
  [SPRÅK.md](SPRÅK.md).
- **Ordbøkene skal ALDRI importeres i `sprak.ts`.** Da havner alle i JS-bunten
  og lastes på hver sidevisning — det var 410 KB. De ligger i `public/i18n/` og
  hentes med `fetch` kun for valgt språk. `npm run tekster` kopierer dem dit og
  baker inn dekningstallene.
- **Attributter er ikke tekstnoder.** `placeholder`, `aria-label`, `title` og
  `alt` må merkes med `data-en-ph` / `-aria` / `-title` / `-alt`. En diff av
  synlig tekst finner dem aldri — sjekken må lese attributtene.
- **Tekst som settes av JavaScript må tegnes på nytt ved språkbytte** med
  `paSprakendring()`. Ellers henger den igjen på forrige språk.
- **Tekst fra tabeller i koden fanges ikke av uttrekket.** `oversett(TABELL[i])`
  er ikke en literal. Værtekstene og kompassretningene er derfor listet
  eksplisitt i `hent-tekster.mjs` — endrer du tabellene, må lista følge med.
- **`&amp;` avkodes alltid SIST.** Gjøres den først, kan «&amp;shy;» bli til
  «&shy;» og så strippes som myk bindestrek. CodeQL fanget dette som
  `js/double-escaping`.
- **HTML-entiteter må normaliseres likt tre steder.** `&`, `&shy;` og `&nbsp;`
  ser ulike ut i kilden og i `innerHTML`. Normaliseringen ligger i
  `Layout.astro`, `klient.ts` og `hent-tekster.mjs` — endrer du én, må alle med.
- **`frame-ancestors` virker ikke i meta-CSP.** Sida kan rammes inn av andre. Krever
  en HTTP-header, som GitHub Pages ikke kan sette — bevisst valg per 7. sep. 2026.
- **Cloudflare kan legge til scripts uten at vi deployer.** Web Analytics-beaconen
  dukket opp ved kanten og ble blokkert av CSP-en, med konsollfeil på hver
  sidelast. Ser du en CSP-feil for en host vi ikke har lagt inn: sjekk hva
  Cloudflare injiserer før du leter i koden. En ekstern host kan trenge **to**
  direktiver — beaconen krevde både `script-src` og `connect-src`.

---

## Overvåking — hva du bør se etter

**Månedlig, tar to minutter:**

1. **Actions** på github.com — er det røde kryss den siste måneden?
2. Åpne <https://ffh143.no/umbukta/> — viser kalenderen riktig måned og ledige datoer?
3. Sjekk at datoen nederst på <https://ffh143.no/tillitsvalgte/> ikke er mer enn
   et år gammel. `npm run valider` advarer selv etter 15 måneder.

**Dependabot** foreslår sikkerhetsoppdateringer automatisk som pull requests.
De skal ses over og merges — bygg-sjekken kjører på hver PR.

---

## Ligger utenfor repoet

Disse styres i andres kontrollpanel og kan ikke fikses i koden.

| Hva | Hvor | Status |
|-----|------|--------|
| DNS, proxy, cache | Cloudflare | Buffer-TTL står på 4 t. Kan trygt være 1 år for `/_astro/`, som har hash i filnavnet. |
| `email-decode.min.js` | Cloudflare → Scrape Shield | Blokkerer opptegning ~450 ms på mobil. Ikke slått av. |
| Sikkerhetsheadere (HSTS, X-Frame-Options m.m.) | Cloudflare → Transform Rules | **Bevisst utelatt** per 7. sep. 2026. |
| Web Analytics | Cloudflare | Beaconen injiseres ved kanten, ustabilt — den var borte 7. sep. 2026 og blokkert av CSP 8. sep. CSP-en er nå åpen for den uansett. **Personvernsidene beskriver den ikke.** Er analysen faktisk på i dashbordet, må /personvern og /cookies oppdateres. |
| Mottaker for skjema-e-post | Web3Forms-dashbordet | `avd143@fellesforbundet.no`. **Ikke det samme** som den offentlige adressen på sida, `avd143@fellesforbundet.org` — forskjellen er tilsiktet. |
| Outlook-kalenderen | Avdelingens Microsoft-konto | ICS-lenka ligger som GitHub-secret `CALENDAR_ICS_URL`. Aldri i koden. |
| Søkeindeksering | Google Search Console | Domenet verifiseres via DNS TXT; sitemap er `https://ffh143.no/sitemap-index.xml`. |

---

## Hvis noe haster

- **Sida er nede:** sjekk **Actions** først, deretter Cloudflare, deretter
  GitHub Pages-status. Sida er statisk — det er sjelden koden.
- **Feil innhold ute:** `git revert` på siste commit og push. Ny utrulling tar
  under ett minutt.
- **Teknisk kontakt:** T-Event v/ Mathias — mathias@t-event.no · 929 63 907.
