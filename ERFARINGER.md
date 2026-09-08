# Erfaringer — feil som er gjort, og hva de lærte oss

Ærlig logg over ting som gikk galt under arbeidet, ført så neste person
(inkludert meg selv) slipper å gjøre dem om igjen. De fleste ble oppdaget av
avdelingen, ikke av meg — det sier noe om hvor verifiseringen sviktet.

Feilene faller i tre grupper: **verifisering som ikke målte det den skulle**,
**verktøy som ga falsk trygghet**, og **antakelser jeg ikke sjekket**.

Kortversjonen av alt under: *grønt bygg betyr ikke at det virker, og 100 %
dekning betyr ikke at det er komplett.*

---

## 1. Verifisering som målte feil ting

### «100 % oversatt» målte bare det som var merket for oversettelse

**Hva skjedde:** Polsk viste `pl 100 % 792/792`, og jeg meldte språket ferdig.
Avdelingen fant umiddelbart at overenskomstene, «Utviklet av T-Event», «Mange
fag», bildetekstene i galleriet, værteksten, kompassretningene og hele
kontaktskjemaet sto på norsk.

**Hvorfor:** Dekningstallet teller *nøkler som finnes i ordboka*. Tekst uten
`data-en` finnes ikke som nøkkel, og telles derfor ikke som mangel. Målingen
kunne per definisjon ikke oppdage problemet.

**Metoden som virker:** rendre hver side på norsk og på det nye språket, og
sammenligne. Alt som er identisk er enten uoversatt eller et egennavn.

### Sammenligningen så bare synlig tekst, ikke attributter

**Hva skjedde:** Etter første runde meldte jeg igjen at det var komplett.
Avdelingen fant at hele kontaktskjemaet fortsatt var norsk.

**Hvorfor:** `placeholder`, `aria-label`, `title` og `alt` er ikke tekstnoder.
En diff av synlig tekst kan aldri finne dem. Skjermlesere leste norsk til
polske brukere i 18 tilfeller uten at noe utslag ga seg.

**Metoden som virker:** sjekken må lese attributtene direkte. Se
«Sjekk at ALT faktisk er oversettbart» i [SPRÅK.md](SPRÅK.md).

### Falske treff i min egen sjekk

`\bplaceholder="` traff også `data-i18n-placeholder="`, fordi `\b` matcher
etter bindestreken. Det ga meldinger om «uoversatt» tekst som faktisk var
oversatt. Bruk `(?<![-\w])placeholder=` i stedet.

Motsatt vei: «Kontakt» og «Telefon» ble rapportert som uoversatte, men er
identiske ord på polsk. En diff finner likhet, ikke feil — resultatet må leses.

### Testriggen skrev til feil localStorage-nøkkel

**Hva skjedde:** Regresjonssveipet lastet hver side i en iframe og satte
språket med `localStorage.setItem('ffh-sprak', …)`. Siden lagrer under `lang`.
Alle sider ble derfor stående på norsk, og riggen rapporterte 90 «feil» —
`html lang="no"` på hver side og uoversatt tekst overalt.

**Hvorfor kontrollen ikke fanget det:** riggen sjekket aldri at oppsettet
virket. Den antok at et vellykket `setItem` betydde at siden hadde lest verdien.

**Hva som avslørte det:** resultatlistene var *identiske* for engelsk, spansk,
litauisk og rumensk. Ekte oversettelseshull ville variert mellom språk.

**Hva som gjøres i stedet:** en testrigg som setter opp en tilstand må først
bekrefte at tilstanden traff — her: at `document.documentElement.lang` faktisk
endret seg — og avbryte hvis ikke. Ellers måler den bare seg selv. Slå alltid
opp nøkkelnavnet i kildekoden framfor å skrive det etter hukommelsen.

### Mellomrom som forsvant i oversettelsen

**Hva skjedde:** På polsk sto det «Zadzwoń do nas pod75 15 12 28» — telefon og
e-post klistret seg inntil teksten foran.

**Hvorfor:** Setninger deles opp rundt lenker: `Ring oss på ` + `<a>tlf</a>` +
` eller send e-post til ` + `<a>e-post</a>`. Mellomrommet i start og slutt bærer
avstanden. Ordboknøkkelen trimmes — med rett, ellers ville innrykk i HTML-en
gjort oppslaget avhengig av formatering — men den oversatte **verdien** ble satt
inn trimmet også. 20 tekster var rammet, på tvers av seks sider.

**Løsningen:** kjøretiden setter tilbake originalens ytre mellomrom rundt den
oversatte teksten. Da kan heller ikke en oversetter miste dem ved et uhell.

**Lærdom:** når en nøkkel normaliseres for oppslag, må det vurderes om noe av
det som normaliseres bort er *betydningsbærende* i utdataen.

### Ny mekanikk, glemt å ta den i bruk

**Hva skjedde:** `<Bilde>` fikk støtte for `altEn`, men bare de to
illustrasjonene fikk den satt. Ni andre bilder sto igjen med norsk alt-tekst i
alle språk — tekst som leses av skjermlesere.

**Hvorfor:** Å legge til en mekanisme og å bruke den overalt er to jobber. Den
første føles som om den løser problemet.

**Etter dette:** når et nytt attributt eller en ny prop innføres, søkes det opp
alle stedene som *burde* bruke den — ikke bare de som utløste endringen.

### Sendte 410 KB til alle uten å måle

**Hva skjedde:** Avdelingen meldte at sida var treg på eldre maskiner. Målingen
viste at `klient.js` var **410 KB**. Alle sju ordbøkene ble importert i
`sprak.ts`, så de havnet i JS-bunten og ble lastet — og parset — på hver eneste
sidevisning. Også for norske brukere, som aldri trenger en eneste av dem.

**Hvorfor:** En vanlig `import` ser uskyldig ut. Jeg hadde aldri sett på hvor
stor bunten var blitt mens jeg la til språk ett for ett.

**Løsningen:** ordbøkene ligger nå i `public/i18n/` og hentes med `fetch`, kun
for det språket den besøkende faktisk velger. Dekningstallene bakes inn som
tall, ikke som tekst. 437 KB → 29 KB, og norske brukere henter ingenting.

I samme slengen: språkskriptet skrev `innerHTML` på over hundre elementer ved
hver sidelasting, også når sida allerede var norsk og ingenting skulle endres.
Det passet hoppes nå over.

**Lærdom:** mål størrelsen på det som sendes ut, ikke bare at det virker. En
funksjon som er riktig kan likevel være dyr.

### Avkodet HTML-entiteter i feil rekkefølge

**Hva skjedde:** CodeQL meldte `js/double-escaping` i `hent-tekster.mjs`.
Normaliseringen avkodet `&amp;` → `&` **først**, deretter `&shy;` og `&nbsp;`.

**Hvorfor det er en ekte feil, ikke bare en advarsel:** teksten `&amp;shy;`
(altså det som skal vises som «&shy;») ble først til `&shy;` og deretter
strippet som myk bindestrek. Kjørt gjennom:

    riktig rekkefølge: "Vis &shy; i teksten"
    gammel rekkefølge: "Vis  i teksten"   ← teksten forsvant

Nøkkelen ville i tillegg ikke lenger matche kjøretiden, så oversettelsen av det
avsnittet ville stille falt tilbake til norsk.

**Regelen:** `&amp;` avkodes ALLTID sist. Den kan lage nye entiteter av tekst
som ikke var ment som entiteter. Samme rekkefølge er nå brukt i alle tre
normaliseringene.

**Lærdom:** en statisk analyse som melder noe i egen verktøykode er verdt å
lese, ikke bare kvittere ut. Denne fant en reell feil jeg hadde skrevet.

---

## 2. Verktøy som ga falsk trygghet

### Grønt bygg, ødelagt side

**Hva skjedde:** Kalenderen forsvant fra /umbukta. Jeg hadde byttet
månedstabellene mot `Intl`, men latt én referanse til `MÅNEDER` stå igjen i
`aria-label`. Det ga `ReferenceError` midt i `renderCalendar()`. Markupen var
der, rutenettet var tomt. **Bygget var grønt, og feilen gikk live.**

**Hvorfor:** Astro typesjekker ikke `<script>`-blokker i `.astro`-filer.

**Etter dette:** hver skriptendring kontrolleres i headless Chrome, og det
kjøres en konsollsjekk på alle sider.

### Grønt bygg, forvrengte bilder

**Hva skjedde:** Miniatyrene i galleriet ble strukket til uleselige striper da
de gikk fra `<img>` til `<Bilde>`.

**Hvorfor:** Astro-scopet CSS treffer ikke elementer som kommer fra en
underkomponent. `.thumb img` sluttet å matche. Bygget og konsollen var rene —
bare et skjermbilde avslørte det.

**Etter dette:** visuell kontroll av alt som endrer markup, ikke bare bygg.

### Skjermbilder som ikke viste sannheten

Headless Chrome legger ut bredere enn `--window-size` og klipper bildet. Første
«mobilkontroll» viste en side som så ødelagt ut over alt, ikke bare i notisen.
Ekte mobilvisning krever at sida rendres i en `<iframe>` med fast bredde.

### `rm` med et glob uten treff

`rm -f dist/_t-*.html dist/_e-*.html` — zsh avbryter hele kommandoen når ett
glob ikke treffer, så **ingen** av filene ble slettet. `npm run tekster` leste
dem som ekte sider og meldte «21 sider».

Jeg gikk i den samme fella igjen senere, og da avbrøt den en kommandokjede som
også skulle skrive til denne fila — så endringen forsvant stille. Bruk
`find dist -maxdepth 1 -name '_*.html' -delete`, som ikke bryr seg om treff.

---

## 3. Antakelser jeg ikke sjekket

### Ikonet var teknisk riktig og likevel feil

Lette regnbyger fikk `cloud-drizzle`, som er korrekt. Men Lucides
`cloud-drizzle` er seks korte dasher, og ved 26 px leser det som snøfnugg — i
september, på 11 grader. Jeg hadde valgt ikonet ut fra navnet, ikke ut fra
hvordan det ser ut.

**Etter dette:** ikonene ble rendret side om side i faktisk størrelse og
vurdert visuelt. Regn bruker nå alltid `cloud-rain`.

### Dokumenterte noe som ikke skjedde

Jeg åpnet CSP-en for Cloudflare Web Analytics og skrev inn på /personvern og
/cookies at siden samler besøksstatistikk — uten å sjekke at beaconen faktisk
ble injisert. Det ble den aldri. Personvernerklæringen beskrev dermed en
innsamling som ikke fant sted, og motsa setningen «Vi bruker ingen analyse»
lenger nede på samme side. Alt ble rullet tilbake.

**Lærdom:** verifiser at en integrasjon faktisk kjører før den beskrives i et
juridisk dokument.

### …og lot en negativ observasjon bli en varig antakelse

**Hva skjedde:** Etter tilbakerullingen over ble CSP-en stående uten
cloudflareinsights.com, med kommentaren «Cloudflare injiserte aldri beaconen».
Dagen etter meldte PageSpeed konsollfeil på hver eneste sidelast: beaconen ble
injisert likevel, og CSP-en blokkerte den.

**Hvorfor:** «beaconen kom ikke nå» ble lest som «beaconen kommer ikke». Men
injeksjonen skjer ved Cloudflares kant, ikke i dette repoet — den kan slås av
og på i et dashbord, uten at noe her endrer seg og uten at noen deployer. Én
observasjon av noe tredjeparts sier ingenting om i morgen.

**Verdt å merke:** feilmeldingen nevnte bare `script-src`. Beaconen POSTer til
`cloudflareinsights.com/cdn-cgi/rum`, så en fiks av bare det feilmeldingen
pekte på ville gitt et `connect-src`-brudd rett etterpå. Kontrolltesten mot den
gamle CSP-en fanget begge.

**Etter dette:** begge kildene står åpne, uavhengig av om beaconen kjører — en
åpen CSP-kilde for et script som ikke lastes koster ingenting, mens en manglende
kilde gir feil på hver sidelast. Personvernteksten er *ikke* skrevet tilbake;
den venter på at det bekreftes at analysen faktisk er på.

**Lærdom:** når noe utenfor repoet kan endre seg uten en deploy, skal
konfigurasjonen tåle begge tilstander framfor å anta den ene.

### Gjettet en URL

Lenka til minstelønnssatsene ble gjettet ut fra hvordan Arbeidstilsynet pleier
å strukturere adresser. Den svarte 301 videre til den riktige. Avdelingen ga
den korrekte. **Sjekk lenker, ikke utled dem.**

### Leste ikke prosjektnotatene først

Jeg flagget Cloudflare Access som en kritisk blokker foran en demo. Notatene
sa allerede at gaten var bevisst, i påvente av lederens godkjenning. Fem
minutters lesing hadde spart en unødig alarm.

---

## 4. Nesten-tabber, fanget i tide

- **`data-astro-cid` i ordboknøklene.** Oppdaget rett før 3 300 oversettelser
  skulle skrives. Hashen endres ved enhver CSS-endring i komponenten, så en ren
  stilendring ville stille ugyldiggjort alle oversettelsene på den sida.
- **Regex mot HTML.** Første uttrekk brukte ikke-grådig regex og stoppet på
  første sluttagg — feil så snart et element av samme type lå inni. Erstattet
  med en dybdeteller. Første forsøk på den startet dybden på 0 i stedet for 1
  og fanget forbi elementgrensen, noe som ga 281 falske advarsler.
- **Attributtrekkefølge.** Uttrekket krevde `data-en-ph` før `placeholder`.
  Markupen hadde motsatt rekkefølge, og ingenting ble funnet.
- **Nedtrekksmenyen brøt fem komponenter.** De lyttet på klikk i `.lang button`
  for å tegne seg på nytt. Selektoren slutter å matche når velgeren blir en
  nedtrekksmeny. Erstattet med hendelsen `sprakendret`.

---

## 5. Rene slurvefeil

- Skrev `border: 1px solid #cbb versionless;` — ugyldig CSS-verdi.
- Lot notisens mobilvisning bruke `flex-wrap`, som la lukkekrysset inntil
  ikonet på en halvtom første rad.
- Plukket opp interne i18n-nøkkelnavn (`hjelp_melding_ph`) som oversettbar
  tekst, fordi de står som plassholderverdi i HTML-en.

---

## Sjekklista dette gir

Før noe meldes ferdig:

1. **Bygget er grønt** — nødvendig, ikke tilstrekkelig.
2. **Åpnet i en nettleser**, med konsollen sjekket. Gjelder alltid ved
   skriptendringer.
3. **Sett på med øynene** hvis markup eller CSS er endret. Skjermbilde i ekte
   bredde, i iframe hvis mobil.
4. **Målt det som faktisk betyr noe**, ikke en indikator som ligner. Spør:
   *kan denne målingen i det hele tatt oppdage feilen jeg leter etter?*
   Bruker målingen et oppsett — innlogging, et språkvalg, en lagret verdi —
   skal riggen bekrefte at oppsettet traff før den rapporterer noe.
5. **Sjekket eksterne fakta** — lenker, at integrasjoner kjører, hva notatene
   allerede sier.
6. **Sagt hva som ikke er verifisert.** Den polske oversettelsen er ikke lest
   av noen med polsk som morsmål, og det står både her, i
   [PLACEHOLDERS.md](PLACEHOLDERS.md) og som notis til besøkende.
