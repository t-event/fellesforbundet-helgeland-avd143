# Plassholdere

Oversikt over midlertidig innhold som skal byttes ut med ekte materiale når
avdelingen leverer det. Hold denne fila oppdatert når plassholdere legges til
eller fjernes.

| # | Hva | Hvor | Hva mangler | Slik fjerner du plassholderen |
|---|-----|------|-------------|-------------------------------|
| 1 | **Turbilder på turtips** | [src/pages/turtips.astro](src/pages/turtips.astro) (`.tur-img.placeholder`), stil i [src/styles/global.css](src/styles/global.css) | Egne foto fra de 6 turene mangler. Alle kortene viser «Foto kommer» med fjell-ikon. | Legg bildene i `public/images/turtips/`, bytt placeholder-`<div>` med `<img>` i kortet, og fjern `.placeholder`-blokken hvis ingen kort lenger bruker den. |
| 2 | **Portrettbilder av ansatte og styret** | [src/config.ts](src/config.ts) (`ANSATTE`, `STYRE`), vist på [src/pages/tillitsvalgte.astro](src/pages/tillitsvalgte.astro) + forsiden | Navn, verv og klubb er på plass; portrettbilder mangler (vises som initialer i avatar). | Legg portretter i `public/images/folk/` og bytt initial-avataren med `<img>` der det er ønskelig. |
| 3 | **Drivstofftype til båtmotor** | [src/pages/umbukta.astro](src/pages/umbukta.astro) (`fasiliteter` → «Naust med båt») | Hvilket drivstoff båtmotoren bruker er ikke bekreftet. Vist som «PLASSHOLDER: [drivstofftype bekreftes]». | Erstatt `[drivstofftype bekreftes]` med faktisk type i beskrivelsen (NO + EN). |
| 4 | **Medlemssitat på forsiden** | [src/pages/index.astro](src/pages/index.astro) (`testimonial-flag`) | Ekte medlemssitat mangler; boksen er tydelig merket «Plassholder». | Sett inn ekte sitat + navn og fjern `testimonial-flag`-merkingen. |
| 5 | **Naust-bilde + plassering** | Bildestrøm på [src/pages/umbukta.astro](src/pages/umbukta.astro) | Venter på foto fra Tommy av naustet og hvor det ligger. | Legg bildet i `public/images/umbukta/`, legg det inn i bildestrømmen. |

## Ikke plassholdere (bevisste tilstander)

- **Facebook-innbygging på aktuelt** ([src/pages/aktuelt.astro](src/pages/aktuelt.astro), `.fb-placeholder`) er en samtykke-tilstand, ikke midlertidig innhold — den vises til brukeren godtar informasjonskapsler. Skal ikke fjernes.
