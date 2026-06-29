# Sikkerhetspolicy

Takk for at du bidrar til å holde nettsiden til **Fellesforbundet Helgeland avd. 143** (avdelingens hjemmeside og hyttebooking) trygg.

## Rapportere en sårbarhet

Har du funnet en sikkerhetssvakhet på nettsiden? Meld den **privat** til teknisk ansvarlig før du deler den offentlig:

- **T-Event v/ Mathias** — teknisk ansvarlig for nettsiden
  - E-post: mathias@t-event.no
  - Telefon: 929 63 907

Ta gjerne med:

- Hva slags svakhet det gjelder, og hvor (URL/side).
- Hvordan den kan reproduseres (steg, gjerne skjermbilde).
- Mulig konsekvens.

Vi bekrefter mottak så raskt vi kan (normalt innen noen virkedager) og holder deg oppdatert til saken er løst. Vi ber om at du **ikke offentliggjør** detaljer før svakheten er rettet.

Spørsmål om booking, betaling eller drift (ikke sikkerhet) går til kontoret: avd143@fellesforbundet.org · 75 15 12 28.

## Omfang

**I omfang:**

- Selve nettsiden (kildekoden i dette repoet) og oppsettet på GitHub Pages.
- Booking- og kontaktskjemaene på nettsiden.

**Utenfor omfang** (rapporter til den aktuelle leverandøren):

- Tredjepartstjenester vi kun lenker til eller bruker: inatur.no, Web3Forms, GitHub Pages, yr.no, Statens vegvesen (webkamera) og OpenStreetMap.
- Svakheter som krever fysisk tilgang, manipulasjon av ansatte (social engineering), eller tjenestenekt/last-testing (DoS).

## Om løsningen (kontekst for vurdering)

Nettsiden er en **statisk side** uten egen server, database eller innlogging:

- **Ingen betaling** skjer på nettsiden. Betaling er manuell bankoverføring som kontoret bekrefter.
- **Ingen dørkoder** finnes i koden, skjemaene eller e-postene fra nettsiden — de sendes manuelt av avdelingen.
- **Hemmeligheter** (kalender-URL m.m.) ligger kun som GitHub Actions-secrets, aldri i kildekoden.
- Skjemaene bruker **Web3Forms**. «Access key» til Web3Forms er offentlig per design — den er en innsendingsnøkkel beskyttet av rate-limiting og spamfilter, ikke en hemmelighet.
- Vi lagrer **ingen sensitive personopplysninger**. Skjemainnsendinger sendes som e-post til kontoret. Se personvernerklæringen på nettsiden for detaljer.

Takk for at du melder fra på en ansvarlig måte.
