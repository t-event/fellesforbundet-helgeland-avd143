// Web app manifest. Genereres som endepunkt (ikke statisk fil i public/) slik at
// stiene følger BASE — ellers peker de på rot og brekker på github.io-adressen.
//
// Ikonene ligger i public/ og lages av `node scripts/gen-icons.mjs`.

import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');

  const manifest = {
    name: 'Fellesforbundet Helgeland avd. 143',
    short_name: 'FFH avd. 143',
    description:
      'Fagforening for arbeidsfolk på Helgeland — medlemskap, tariff, ' +
      'tillitsvalgtarbeid og hytteutleie i Umbukta.',
    lang: 'no',
    dir: 'ltr',
    start_url: `${base}/`,
    scope: `${base}/`,
    display: 'standalone',
    orientation: 'portrait-primary',
    // Samme navy som <meta name="theme-color"> i Layout.astro.
    theme_color: '#1A1836',
    background_color: '#FFFFFF',
    categories: ['business', 'education'],
    icons: [
      { src: `${base}/favicon.svg`, sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: `${base}/icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: `${base}/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: `${base}/icon-maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Hytteutleie', url: `${base}/hytter/` },
      { name: 'Bli medlem', url: `${base}/bli-medlem/` },
      { name: 'Kontakt', url: `${base}/kontakt/` },
    ],
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  });
};
