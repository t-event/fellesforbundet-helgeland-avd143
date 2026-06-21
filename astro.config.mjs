import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// Sett SITE og BASE via env-variabler i GitHub Actions.
// SITE = kun origin (scheme + vert), uten understi. Astro legger på BASE selv.
// Standard er GitHub Pages-origin med repo-stien som BASE.
const SITE = process.env.SITE || 'https://t-event.github.io';
const BASE = process.env.BASE || '/fellesforbundet-helgeland-avd143';

export default defineConfig({
  site: SITE,
  base: BASE,
  output: 'static',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
  image: {
    // Astro-bildeoptimasjon bruker sharp (installert som dep)
    remotePatterns: [],
  },
});
