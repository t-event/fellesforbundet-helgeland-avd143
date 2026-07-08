# Bidra til prosjektet

Takk for at du vil bidra til nettsiden til **Fellesforbundet Helgeland avd. 143**!

Dette er nettsiden og hyttebookingen til avdelingen, utviklet og vedlikeholdt av
**T-Event**. Repoet er primært for teknisk vedlikehold, men forslag og
feilmeldinger er velkomne.

Ved deltakelse forventer vi at du følger våre
[regler for god oppførsel](CODE_OF_CONDUCT.md).

## Melde feil eller foreslå endringer

- **Feil på nettsiden** (noe som ikke virker, feil innhold): opprett en *issue*,
  eller kontakt avdelingskontoret: `avd143@fellesforbundet.org` · 75 15 12 28.
- **Sikkerhetssvakheter:** IKKE opprett en offentlig issue — se
  [SECURITY.md](SECURITY.md) for privat rapportering.
- **Innholdsendringer** (priser, tekst, personer, arrangement): meld fra til
  kontoret, så oppdaterer T-Event.

## Teknisk oppsett

Se [README.md](README.md) for full oppskrift. Kort fortalt:

```bash
npm install
cp .env.example .env          # fyll inn PUBLIC_WEB3FORMS_KEY
npm run dev                    # utviklingsserver
npm run build                 # produksjonsbygg
```

- **Stack:** Astro (statisk side), TypeScript, deployes til GitHub Pages.
- **Arkitektur og innhold:** se [SPEC.md](SPEC.md).
- Mye innhold styres fra [src/config.ts](src/config.ts) og datafiler under `src/data/`.

## Retningslinjer for endringer

- **Bygg lokalt** (`npm run build`) og sjekk at alt kompilerer før du sender inn.
- Følg eksisterende kodestil, komponentmønster og designprofil
  (Fellesforbundets profilhåndbok — ikke fjern merkefarger på smaksbasis).
- Hold endringer fokuserte, og beskriv hva og hvorfor i commit/PR.
- Ikke legg hemmeligheter (kalender-URL, nøkler, dørkoder) i koden — de hører
  hjemme som GitHub Actions-secrets.

## Pull requests

1. Lag en branch fra `main`.
2. Gjør endringene og bygg lokalt.
3. `build-check.yml` kjører automatisk på PR-er og validerer at koden bygger.
4. Beskriv endringen kort. En vedlikeholder ser over og merger.

Har du spørsmål? Ta kontakt med T-Event v/ Mathias — `mathias@t-event.no`.
