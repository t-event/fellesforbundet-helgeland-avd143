# Plassholdere

Oversikt over midlertidig innhold som skal byttes ut med ekte materiale når
avdelingen leverer det. Hold denne fila oppdatert når plassholdere legges til
eller fjernes.

| # | Hva | Hvor | Hva mangler | Slik fjerner du plassholderen |
|---|-----|------|-------------|-------------------------------|
| 1 | **Turbilder på turtips** | [src/pages/turtips.astro](src/pages/turtips.astro) (`.tur-img.placeholder`), stil i [src/styles/global.css](src/styles/global.css) | Egne foto fra de 6 turene mangler. Alle kortene viser «Foto kommer» med fjell-ikon. | Legg bildene i `public/images/turtips/`, bytt placeholder-`<div>` med `<img>` i kortet, og fjern `.placeholder`-blokken hvis ingen kort lenger bruker den. |
| 2 | **Navn/bilder på ansatte/styret** | Data i [src/config.ts](src/config.ts) (kommentert `PLASSHOLDER` ved ansatt-lista), vist på [src/pages/tillitsvalgte.astro](src/pages/tillitsvalgte.astro) | Navn/bilder er ikke bekreftet av avdelingen; siden viser kun oppsettet. | Bekreft navn/roller, legg til bilder, fjern «Plassholder»-merkingen i tillitsvalgte.astro og kommentaren i config.ts. |
| 3 | **Medlemssitat på forsiden** | [src/pages/index.astro](src/pages/index.astro) (`testimonial-flag`) | Ekte medlemssitat mangler; boksen er tydelig merket «Plassholder». | Sett inn ekte sitat + navn og fjern `testimonial-flag`-merkingen. |

## Ikke plassholdere (bevisste tilstander)

- **Facebook-innbygging på aktuelt** ([src/pages/aktuelt.astro](src/pages/aktuelt.astro), `.fb-placeholder`) er en samtykke-tilstand, ikke midlertidig innhold — den vises til brukeren godtar informasjonskapsler. Skal ikke fjernes.
