# Oppdatere styre og utvalg etter årsmøtet

Alt som vises av navn på nettsida — styret, ansatte, utvalgene og
representantskapet — ligger i **én fil**:

```
src/data/tillitsvalgte.json
```

Du trenger ikke kunne programmere for å endre den. Du trenger ikke installere
noe. Alt gjøres i nettleseren på github.com.

---

## Slik gjør du det

1. Åpne fila:
   <https://github.com/t-event/fellesforbundet-helgeland-avd143/blob/main/src/data/tillitsvalgte.json>
2. Trykk **blyant-ikonet** (✏️) oppe til høyre for å redigere.
3. Gjør endringene (se oppskriftene under).
4. Sett **`sist_bekreftet`** til datoen for årsmøtet, på formen `"2027-03-14"`.
5. Bla ned, skriv en kort beskjed i «Commit changes»-boksen — for eksempel
   *«Styre og utvalg etter årsmøtet 14. mars 2027»* — og trykk grønn knapp.

Nettsida bygges og oppdaterer seg selv i løpet av et par minutter.

### Hvis du gjør en skrivefeil

Det går bra. En automatisk kontroll kjører før siden legges ut, og **stopper
utrullingen hvis noe er galt**. Den gamle siden blir stående uendret til feilen
er rettet — du kan ikke ødelegge noe.

Du ser resultatet under fanen **Actions** på github.com: grønn hake = lagt ut,
rødt kryss = feil. Trykk på det røde krysset for å lese hva som er galt. Feil-
meldingene er på norsk og peker på hvilken linje det gjelder.

---

## Oppskrifter

### Bytte ut en person

Finn linja og endre navnet. Alt annet på linja blir stående:

```json
{ "navn": "Erik Rauø", "rolle": "Styremedlem", "rolle_en": "Board member", "klubb": "Vega Havbruk" }
```

blir til

```json
{ "navn": "Benny Fjelldalselv", "rolle": "Styremedlem", "rolle_en": "Board member", "klubb": "Grytåga Settefisk" }
```

### Legge til en person

Kopier hele linja over, lim den inn under, og endre navnet.
**Husk komma på slutten av alle linjer unntatt den siste i gruppa.**

### Fjerne en person

Slett hele linja. Pass på at linja over den siste ikke får et komma til overs.

### Endre en rolle

Bytt teksten i `"rolle"`. Bytt samtidig `"rolle_en"` — den brukes når en
besøkende velger engelsk. Vanlige par:

| `rolle`            | `rolle_en`              |
| ------------------ | ----------------------- |
| Leder              | Leader                  |
| Nestleder          | Deputy leader           |
| Sekretær           | Secretary               |
| Styremedlem        | Board member            |
| Ungdomsleder       | Youth leader            |
| Nestungdomsleder   | Deputy youth leader     |
| Medlem             | Member                  |

---

## Regler kontrollen håndhever

Disse **stopper** utrullingen:

- Fila må være gyldig JSON (riktige komma og anførselstegn).
- **Lederen må stå først** i `styre` og ha `"rolle": "Leder"` — siden viser den
  første oppføringen i en egen, større boks som avdelingens leder.
- Lederen må ha `epost`. Telefon skrives som 8 siffer i `tlf`
  (`"90158622"`), og slik det skal vises i `tlfFormatert` (`"901 58 622"`).
- Alle må ha de feltene gruppa krever — styret trenger `navn`, `rolle`,
  `rolle_en` og `klubb`; ansatte trenger i tillegg `sted` og `stilling`.
- `stilling` skrives som `"100 %"` eller `"50 %"`.
- Ingen kan stå oppført to ganger i samme gruppe.
- Bare én person kan ha rollen Leder, Nestleder eller Sekretær.
- `sist_bekreftet` må være en dato på formen `ÅÅÅÅ-MM-DD`, og ikke fram i tid.

Disse gir bare en **advarsel** (siden legges ut):

- `sist_bekreftet` er mer enn 15 måneder gammel — altså at det trolig har vært
  et årsmøte uten at fila ble oppdatert.
- Et felt er stavet feil, slik at innholdet ikke vises noe sted.

---

## Sjekkliste etter årsmøtet

- [ ] Styret oppdatert — leder først
- [ ] Ungdomsutvalget oppdatert
- [ ] Kontrollkomiteen oppdatert (husk `vara`)
- [ ] Studieutvalget oppdatert
- [ ] Valgkomiteen oppdatert
- [ ] Representantskapet oppdatert
- [ ] Ansatte oppdatert hvis noen har byttet stilling
- [ ] `sist_bekreftet` satt til årsmøtedatoen
- [ ] Grønn hake under **Actions** på github.com
- [ ] Sjekket <https://ffh143.no/tillitsvalgte/> med egne øyne

Datoen i `sist_bekreftet` vises nederst på tillitsvalgt-sida, slik at både
medlemmer og styret ser hvor ferske opplysningene er.

---

## For utviklere

- Dataene leses av `src/config.ts`, som re-eksporterer dem som `STYRE`,
  `ANSATTE`, `REPRESENTANTSKAP` osv. Sidene er uendret.
- Kontrollen ligger i `scripts/valider-tillitsvalgte.mjs` og kjøres av
  `npm run valider`, som `npm run build` kaller først — så den kjører både
  lokalt, i bygg-sjekken og i deployen.
- Den er streng på struktur og mild på innhold: den kan avsløre at et navn
  mangler, ikke at det er feil person. Årsmøteprotokollen er fasit.
