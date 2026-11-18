import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Sett SITE og BASE via env-variabler i GitHub Actions.
// SITE = kun origin (scheme + vert), uten understi. Astro legger på BASE selv.
// Standard er GitHub Pages-origin med repo-stien som BASE.
const SITE = process.env.SITE || 'https://ffh143.no';
const BASE = process.env.BASE || '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  output: 'static',
  // Bygg CSS inn i HTML-en i stedet for en ekstern hashet fil. Da slipper vi
  // «uformatert side» (FOUC) når GitHub Pages sin CDN ikke har propagert den nye
  // CSS-fila ennå rett etter en deploy. CSS-en er liten (~12 KB / 4 KB gzip).
  build: { inlineStylesheets: 'always' },
  // Astro 7 bruker JSX-regler for mellomrom som standard og fjerner mellomrom
  // mellom tekst og lenker over linjeskift («hyttedøra —se turtips»). Det
  // endrer også de norske oppslagsnøklene i ordbøkene. `true` er den tapsfrie
  // komprimeringen Astro 6 brukte.
  compressHTML: true,
  integrations: [
    sitemap({
      // /takk er kvitteringssiden etter en bookingforespørsel — den har ingen
      // verdi i søk, og innholdet bygges fra URL-parametere. Den er merket
      // noindex, og skal derfor heller ikke ligge i sitemapet. (404-siden
      // kommer uansett ikke med, siden Astro ikke regner den som en rute.)
      filter: (side) => !side.endsWith('/takk/'),
    }),
  ],
  // Vite 8 (Astro 7) løftet standard byggemål til «baseline widely available»
  // og skrev om media-spørringer til range-syntaks `(width>=560px)`, som iOS
  // før 16.4 ikke forstår — da faller hele mobiloppsettet bort. Hold samme mål
  // som Vite 7 brukte (CSS og JS), så eldre telefoner får det samme som før.
  vite: {
    build: {
      target: ['edge88', 'firefox78', 'chrome87', 'safari14'], // es2020 er allerede med — dobbel oppføring gir byggefeil
      cssTarget: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    },
  },
  image: {
    // Astro-bildeoptimasjon bruker sharp (installert som dep)
    remotePatterns: [],
  },
});
