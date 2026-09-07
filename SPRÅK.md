# Legge til et nytt språk

Nettsida er i dag på **norsk og engelsk**. Mekanikken håndterer i tillegg
**rumensk, spansk, polsk, litauisk og latvisk** — de er bygd inn, men vises
ikke før noen har oversatt dem.

## Hvorfor de ikke vises ennå

Et språk dukker opp i språkvelgeren først når **85 % av tekstene er oversatt**
(`MIN_DEKNING` i `src/i18n/sprak.ts`). Et halvoversatt språk er verre enn
ingenting: medlemmet får en blanding av norsk og sitt eget språk, uten å vite
hva som mangler — på en side som forklarer lønn, oppsigelse og rettigheter.

## Slik gjør du det

```bash
npm run build     # bygger siden
npm run tekster   # skriver src/i18n/ordbok/_mal.json
```

`_mal.json` inneholder alle tekstene på nettstedet, med norsk som nøkkel:

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

## For utviklere

- Norsk ligger i HTML-en. Engelsk ligger ved siden av, i `data-en`-attributter.
  Alle andre språk slås opp i ordboka på den **norske teksten**, slik at vi
  slipper ett attributt per språk på hvert element (det ville blitt over 4 000).
- Faller et oppslag gjennom, vises norsk. Ingen tom tekst kan oppstå.
- `npm run tekster` advarer om `data-en` inni et annet `data-en`. Slike blir
  aldri oversatt — forelderens `innerHTML` byttes før barnet rekker å bli
  oppdatert. Det er i dag 3 slike, på `/personvern`, `/umbukta` og `/vilkar`.
- `ANTALL_TEKSTER` i `sprak.ts` oppdateres automatisk av `npm run tekster`.
  Kjør den etter at du har lagt til eller endret tekst, ellers blir dekningen
  regnet ut mot et gammelt tall.
