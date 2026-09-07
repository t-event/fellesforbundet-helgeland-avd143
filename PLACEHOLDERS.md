# Plassholdere

Oversikt over midlertidig innhold som skal byttes ut med ekte materiale når
avdelingen leverer det. Hold denne fila oppdatert når plassholdere legges til
eller fjernes.

| # | Hva | Hvor | Hva mangler | Slik fjerner du plassholderen |
|---|-----|------|-------------|-------------------------------|
| 1 | **Portrettbilder av ansatte og styret** (valgfritt) | [src/data/tillitsvalgte.json](src/data/tillitsvalgte.json) (`ansatte`, `styre`), vist på [src/pages/tillitsvalgte.astro](src/pages/tillitsvalgte.astro) + forsiden | Navn, verv og klubb er på plass; portrettbilder mangler (vises som initialer i avatar — fungerer fint uten). | Legg portretter i `public/images/folk/` og bytt initial-avataren med `<img>` der det er ønskelig. |
| 2 | **Oversettelser til rumensk, spansk, polsk, litauisk og latvisk** | [src/i18n/ordbok/](src/i18n/ordbok/) | Mekanikken er på plass, men ordbøkene er tomme, så språkene vises ikke i velgeren ennå. | Se [SPRÅK.md](SPRÅK.md). Kort: `npm run tekster` → send `_mal.json` til oversetter → lagre svaret som `<kode>.json`. |

Alle øvrige plassholdere er nå fylt ut eller fjernet:

- ✅ **Turbilder på turtips** — avdelingen får ikke egne turbilder; bildeplassholderne er **fjernet**, kortene er rene tekstkort med UT.no-lenke.
- ✅ **Drivstofftype til båtmotor** — 98 oktan, helst alkylatbensin (4-takt).
- ✅ **Medlemssitat på forsiden** — sitat fra Mathias Tustervatn.
- ✅ **Naust: bilde + plassering** — foto i bildestrømmen + eget satellittkart som viser hvor naustet ligger.
- ✅ **Styre, ansatte, ungdomsutvalg, representantskap, kontroll- og valgkomité** — reelle navn og verv lagt inn. Oppdatert etter avdelingens gjennomgang 7. september 2026; vedlikeholdes nå via [ÅRSMØTE.md](ÅRSMØTE.md).
- ✅ **Lokal kontingentsats** — var ukjent, er nå bekreftet til 0,1 % (totalt 1,6 % i avd. 143).
- ✅ **Delingsbilder for Facebook o.l.** — alle sider delte tidligere ett beskåret hyttefoto; hver sidetype har nå sitt eget bilde i `public/images/og/`.

## Ikke plassholdere (bevisste tilstander)

- **Facebook-innbygging på aktuelt** ([src/pages/aktuelt.astro](src/pages/aktuelt.astro), `.fb-placeholder`) er en samtykke-tilstand, ikke midlertidig innhold — den vises til brukeren godtar informasjonskapsler. Skal ikke fjernes.
- **Kart (Google Maps) på kontakt og hytte-i-umbukta** er også samtykke-styrt — vises som «Godta og vis kart» til brukeren godtar informasjonskapsler.
- **Initial-avatarer** for personer (uten portrett) er en bevisst fallback, ikke en feil.
