# Plassholdere

Oversikt over midlertidig innhold som skal byttes ut med ekte materiale når
avdelingen leverer det. Hold denne fila oppdatert når plassholdere legges til
eller fjernes.

| # | Hva | Hvor | Hva mangler | Slik fjerner du plassholderen |
|---|-----|------|-------------|-------------------------------|
| 1 | **Turbilder på turtips** | [src/pages/turtips.astro](src/pages/turtips.astro) (`.tur-img.placeholder`), stil i [src/styles/global.css](src/styles/global.css) | Egne foto fra de 6 turene mangler. Alle kortene viser «Foto kommer» med fjell-ikon. | Legg bildene i `public/images/turtips/`, bytt placeholder-`<div>` med `<img>` i kortet, og fjern `.placeholder`-blokken hvis ingen kort lenger bruker den. |
| 2 | **Navn/bilder på ansatte** | Data i [src/config.ts](src/config.ts) (`ANSATTE`, kommentert `PLASSHOLDER`), vist på [src/pages/tillitsvalgte.astro](src/pages/tillitsvalgte.astro) **og forsiden** [src/pages/index.astro](src/pages/index.astro) | Navn/bilder på de lønnede ansatte er ikke mottatt; vises som «Navn kommer». Begge steder har «Plassholder»-banner. | Fyll inn navn/bilder i config.ts, fjern «Plassholder»-banneret begge steder (tillitsvalgte + forside). |
| 3 | **Styrets sammensetning og verv** | Data i [src/config.ts](src/config.ts) (`STYRE`), vist på [src/pages/tillitsvalgte.astro](src/pages/tillitsvalgte.astro) | Styremedlemmene/vervene er ikke bekreftet — alle utenom leder står som «Styremedlem». Mangler nestleder, sekretær osv. Banner merker seksjonen. | Legg inn korrekt styre med verv i `STYRE`, fjern «Plassholder»-banneret i styre-seksjonen. |
| 4 | **Drivstofftype til båtmotor** | [src/pages/umbukta.astro](src/pages/umbukta.astro) (`fasiliteter` → «Naust med båt») | Hvilket drivstoff båtmotoren bruker er ikke bekreftet. Vist som «PLASSHOLDER: [drivstofftype bekreftes]». | Erstatt `[drivstofftype bekreftes]` med faktisk type i beskrivelsen (NO + EN). |
| 5 | **Medlemssitat på forsiden** | [src/pages/index.astro](src/pages/index.astro) (`testimonial-flag`) | Ekte medlemssitat mangler; boksen er tydelig merket «Plassholder». | Sett inn ekte sitat + navn og fjern `testimonial-flag`-merkingen. |
| 6 | **Naust-bilde + plassering** | Bildestrøm på [src/pages/umbukta.astro](src/pages/umbukta.astro) | Venter på foto fra Tommy av naustet og hvor det ligger. | Legg bildet i `public/images/umbukta/`, legg det inn i bildestrømmen. |

## Ikke plassholdere (bevisste tilstander)

- **Facebook-innbygging på aktuelt** ([src/pages/aktuelt.astro](src/pages/aktuelt.astro), `.fb-placeholder`) er en samtykke-tilstand, ikke midlertidig innhold — den vises til brukeren godtar informasjonskapsler. Skal ikke fjernes.
