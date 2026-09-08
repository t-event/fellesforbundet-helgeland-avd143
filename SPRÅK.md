# Legge til et nytt språk

Nettsida er i dag på **sju språk**: norsk, engelsk, polsk, rumensk, spansk,
litauisk og latvisk. Alle fem tilleggsspråkene er komplette og aktive i
velgeren. Denne fila beskriver hvordan du legger til det åttende.

> **Om oversettelsene:** alle fem er laget av Claude, ikke av mennesker med
> språket som morsmål. Besøkende ser en notis om at norsk er den offisielle
> versjonen. Før et språk markedsføres aktivt bør minst `/lonn-tariff` og
> `/vilkar` leses gjennom av noen som kan det — det er sidene som forklarer
> lønn, rettigheter og bindende vilkår, der en feil kan gi gale råd i en reell
> sak. Dette står også som åpent punkt i [PLACEHOLDERS.md](PLACEHOLDERS.md).

## Når et språk vises

Et språk dukker opp i språkvelgeren først når **85 % av tekstene er oversatt**
(`MIN_DEKNING` i `src/i18n/sprak.ts`). Et halvoversatt språk er verre enn
ingenting: medlemmet får en blanding av norsk og sitt eget språk, uten å vite
hva som mangler — på en side som forklarer lønn, oppsigelse og rettigheter.

## Slik gjør du det

```bash
npm run build     # bygger siden
npm run tekster   # skriver src/i18n/ordbok/_mal.json
```

`_mal.json` inneholder alle 678 tekstene på nettstedet, med norsk som nøkkel:

```json
{
  "Bli medlem": "",
  "Lønn & tariff": "",
  "Kontingenten er 1,5 % av bruttolønna": ""
}
```

1. Send fila til noen som kan språket. **Norsk til venstre skal ikke røres** —
   det er den som kobler oversettelsen til riktig sted på sida.
2. Fyll inn oversettelsen til høyre.
3. Lagre svaret som `src/i18n/ordbok/<kode>.json` —
   `ro` rumensk · `es` spansk · `pl` polsk · `lt` litauisk · `lv` latvisk.
   Bruk `pl.json` som fasit på formatet.
4. `npm run tekster` viser dekningen. Over 85 % → språket vises av seg selv
   ved neste bygg, og språkvelgeren blir automatisk en nedtrekksmeny.

### Noen tekster inneholder HTML

For eksempel:

```json
"Ring oss på <a href=\"tel:+4775151228\">75 15 12 28</a> i dag": ""
```

Oversett teksten rundt, men **la taggene stå som de er**. Er du usikker, hopp
over linja — den faller da tilbake til norsk.

## Om oversettelsen

Bruk folk, ikke maskin. Avdelingen står ansvarlig for det som står på sida, og
en feil i en maskinoversatt setning om oppsigelsesvern kan gi et medlem gale
råd i en reell sak. Aktuelle kilder: medlemmer som har språket som morsmål,
tolketjenesten i kommunen, eller LO/Fellesforbundet sentralt, som allerede har
mye materiell på flere språk.

## Sjekk at ALT faktisk er oversettbart

Ordboka dekker bare tekst som er merket for oversettelse. Ved den polske
runden viste det seg at en god del ikke var det i det hele tatt — og det
oppdages ikke av dekningstallet, som bare teller nøkler som finnes.

**Kjør denne testen etter hvert nytt språk.** Den rendrer hver side på norsk og
på det nye språket og viser alt som er likt:

```bash
npm run build
# Server dist/ og last hver side to ganger, med localStorage lang=nb og lang=<kode>,
# og sammenlign de synlige tekstnodene. Alt som er identisk er enten uoversatt
# eller et egennavn.
```

**Dette SKAL være likt** og er ikke feil: personnavn, stedsnavn og gateadresser,
navn på norske forbund (Fagforbundet, NTL, Parat …), klubbnavn, kursnavn hentet
fra fellesforbundet.no, organisasjonsnummer, telefon, e-post, tall og priser, og
språknavnene i velgeren (Norsk / English / Polski).

**Dette var derimot ekte hull, funnet og rettet 7. sep. 2026:**

| Hva | Hvorfor det glapp |
|-----|-------------------|
| «Utviklet av T-Event» i footeren | Manglet `data-en` |
| «Mange fag» på forsiden | `<b>` manglet `data-en`; bare `<span>` hadde det |
| Navn på overenskomstene | `navn` i datalista hadde ingen `navn_en` |
| «Kurs» / «Konferanse» på /aktuelt | Type-merkelappen manglet `data-en` |
| «Annet LO-forbund» i bookingskjemaet | Eneste post i forbundslista som ikke er et egennavn |
| Bildetekstene (alt) i galleriet | Byttet på `lang === 'en'`, ikke via `oversett()` |
| Værteksten | Settes sammen av en dekoder, så den finnes ikke som literal i koden. Kombinasjonene er nå listet eksplisitt i `hent-tekster.mjs` |
| To lange avsnitt med `&shy;` | Uttrekket leste entiteten, nettleseren ser tegnet — nøkkelen kunne aldri treffe |
| Alt med `&` i teksten | Astro skriver `&` rått, men `innerHTML` serialiserer tilbake til `&amp;` |

De tre siste var systematiske: entitetene normaliseres nå likt i
`Layout.astro`, `klient.ts` og `hent-tekster.mjs`. **Endrer du normaliseringen
ett sted, må alle tre følge med.**

### Attributter er ikke tekstnoder

Andre runde avdekket en hel klasse til. Å sammenligne synlig tekst finner dem
ikke, fordi de ikke *er* tekst — sjekken må lese attributtene direkte:

| Attributt | Merkes med | Hva som glapp |
|-----------|-----------|---------------|
| `placeholder` | `data-en-ph` | Alle fire feltene i alle fire skjemaene sto på norsk — også på engelsk |
| `aria-label` | `data-en-aria` | 18 stykker. Skjermlesere leste norsk til polske brukere |
| `title` | `data-en-title` | Hjelpetekst på webkameraet |
| `alt` | `data-en-alt` | Bildetekstene i galleriet |

Tekst som **settes av JavaScript** må i tillegg tegnes på nytt ved språkbytte,
via `paSprakendring()`. Det gjaldt lightbox-teksten, miniatyrenes `alt` og
«Vis bilde: …», og kalenderens `(opptatt)` / `(i dag)` / `(fortid)`.

### Mellomrom i start og slutt

Setninger som er delt opp rundt en lenke bærer avstanden i et mellomrom først
eller sist: `Ring oss på ` + `<a>75 15 12 28</a>`. Nøkkelen trimmes ved
oppslag, så **oversetteren skal ikke tenke på mellomrom** — kjøretiden setter
tilbake originalens ytre mellomrom rundt den oversatte teksten. 20 tekster er
av denne typen.

### Verdier fra tabeller i koden

Uttrekket finner bare `oversett('literal')`. Kommer teksten fra en tabell —
`oversett(TABELL[i], ...)` — ser den den ikke. To slike finnes, og begge er
listet **eksplisitt** i `hent-tekster.mjs`:

- **Værteksten** (46 kombinasjoner: nedbørtype × intensitet × byge × torden)
- **Kompassretningene** (16). Norsk bruker Ø/V; polsk og de fleste andre språk
  bruker de internasjonale N/E/S/W. `SØ` blir altså `SE`, ikke `SØ`.

Endrer du `symbolTekst()` eller `COMPASS` i WeatherWidget, **må lista i
`hent-tekster.mjs` følge med**.

### hCaptcha

Widgeten viser sin egen tekst («Jeg er ikke en robot») på det språket den får
ved rendring. Den settes fra `data-hl` av et lite inline-skript i `<head>`, som
må kjøre før Web3Forms-scriptet. Bytter man språk etter at widgeten er tegnet,
lastes sida på nytt — hCaptcha kan ikke bytte språk uten å rendres på nytt.

## Hvordan ordbøkene lastes

Ordbøkene ligger i to versjoner:

- `src/i18n/ordbok/<kode>.json` — kilden, det oversetteren fyller ut
- `public/i18n/<kode>.json` — kopien som sendes til nettleseren, laget av
  `npm run tekster`. Utdaterte nøkler renskes bort her.

Nettleseren henter **kun** ordboka for det språket som velges, og bare når det
velges. Norske og engelske brukere henter ingenting. Kjører du `npm run tekster`
etter å ha endret en ordbok, oppdateres kopien og dekningstallet automatisk.

## For utviklere

- Norsk ligger i HTML-en. Engelsk ligger ved siden av, i `data-en`-attributter.
  Alle andre språk slås opp i ordboka på den **norske teksten**, slik at vi
  slipper ett attributt per språk på hvert element (det ville blitt over 4 000).
- Faller et oppslag gjennom, vises norsk. Ingen tom tekst kan oppstå.
- `npm run tekster` advarer om `data-en` inni et annet `data-en`. Slike blir
  aldri oversatt — forelderens `innerHTML` byttes før barnet rekker å bli
  oppdatert. Det er ingen slike i dag.
- Nøklene strippes for Astros `data-astro-cid-…` før oppslag. Uten det ville en
  ren CSS-endring ugyldiggjort alle oversettelsene på den sida.
- Tekst som lages av JavaScript går gjennom `oversett()` i `src/i18n/klient.ts`.
  Verdier som varierer sendes som plassholdere: `oversett('{antall} døgn',
  '{antall} nights', { antall })`.
- Fanetitlene (`title` på `<Layout>`) er også med i ordboka.
- `ANTALL_TEKSTER` i `sprak.ts` oppdateres automatisk av `npm run tekster`.
  Kjør den etter at du har lagt til eller endret tekst, ellers blir dekningen
  regnet ut mot et gammelt tall.
