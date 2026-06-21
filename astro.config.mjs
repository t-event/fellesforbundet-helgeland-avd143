import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// Sett SITE og BASE via env-variabler i GitHub Actions.
// Standard er GitHub Pages URL uten eget domene.
const SITE = process.env.SITE || 'https://t-event.github.io/fellesforbundet-helgeland-avd143';
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
