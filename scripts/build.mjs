// Genera el sitio listo para publicar en dist/:
//   dist/index.html     → español, con URLs absolutas y datos estructurados
//   dist/en/index.html  → inglés (textos de i18n/en.json)
//   dist/robots.txt y dist/sitemap.xml
//
// Netlify lo ejecuta en cada deploy (ver netlify.toml) y usa la variable URL,
// que es el dominio principal del sitio. En local: node scripts/build.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from 'node:fs';

const SITE_URL = (process.env.SITE_URL || process.env.URL || 'http://localhost:5173').replace(/\/$/, '');
const TODAY = new Date().toISOString().slice(0, 10);

const src = readFileSync('index.html', 'utf8');
const EN = JSON.parse(readFileSync('i18n/en.json', 'utf8'));
const phone = '+' + readFileSync('app.js', 'utf8').match(/whatsapp:\s*'(\d+)'/)[1];

const unescape = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const escText = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const escAttr = s => escText(s).replace(/"/g, '&quot;');

// Lee los textos en español directamente del HTML
function readDict(html) {
  const d = {};
  for (const m of html.matchAll(/data-i18n="([^"]+)"[^>]*>([^<]*)</g)) d[m[1]] ??= unescape(m[2]);
  for (const m of html.matchAll(/data-i18n-content="([^"]+)" content="([^"]*)"/g)) d[m[1]] ??= unescape(m[2]);
  return d;
}

function translate(html, dict) {
  const miss = new Set();
  const get = k => (k in dict ? dict[k] : (miss.add(k), null));
  html = html
    .replace(/(data-i18n="([^"]+)"[^>]*>)([^<]*)</g, (m, open, k, txt) => { const t = get(k); return t == null ? m : open + escText(t) + '<'; })
    .replace(/<[^>]+data-i18n-(alt|content|aria)="[^"]+"[^>]*>/g, tag => {
      for (const [, kind, k] of tag.matchAll(/data-i18n-(alt|content|aria)="([^"]+)"/g)) {
        const attr = { alt: 'alt', content: 'content', aria: 'aria-label' }[kind];
        const t = get(k);
        if (t != null) tag = tag.replace(new RegExp(`\\b${attr}="[^"]*"`), `${attr}="${escAttr(t)}"`);
      }
      return tag;
    });
  if (miss.size) throw new Error('Faltan traducciones en i18n/en.json: ' + [...miss].join(', '));
  return html;
}

function jsonLd(dict, lang, pageUrl) {
  const faq = [1, 2, 3, 4, 5].map(i => ({
    '@type': 'Question',
    name: dict[`faq.q${i}`],
    acceptedAnswer: { '@type': 'Answer', text: dict[`faq.a${i}`] },
  }));
  const tour = (key, img) => ({
    '@type': 'TouristTrip',
    name: dict[key],
    description: dict[key.replace(/\.title$/, '.desc')],
    ...(img && { image: `${SITE_URL}/images/tours/${img}` }),
    provider: { '@id': `${SITE_URL}/#negocio` },
  });
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['TravelAgency', 'LocalBusiness'],
        '@id': `${SITE_URL}/#negocio`,
        name: 'Tambor Adventures CR',
        alternateName: ['Tambor Tours Costa Rica', 'Tambor Adventures'],
        description: dict['meta.desc'],
        url: `${SITE_URL}/`,
        image: `${SITE_URL}/images/og-cover.jpg`,
        logo: `${SITE_URL}/apple-touch-icon.png`,
        telephone: phone,
        address: { '@type': 'PostalAddress', addressLocality: 'Tambor', addressRegion: 'Puntarenas', addressCountry: 'CR' },
        geo: { '@type': 'GeoCoordinates', latitude: 9.7186, longitude: -85.0158 },
        areaServed: ['Tambor', 'Isla Tortuga', 'Península de Nicoya', 'Puntarenas'],
        knowsLanguage: ['es', 'en'],
        contactPoint: { '@type': 'ContactPoint', telephone: phone, contactType: 'reservations', availableLanguage: ['Spanish', 'English'] },
        makesOffer: [
          tour('t1.title', 'tour-isla-tortuga-lancha-playa.webp'),
          tour('t2.title', 'tour-cuadraciclo-tambor.webp'),
          tour('t3.title'),
        ].map(itemOffered => ({ '@type': 'Offer', itemOffered })),
      },
      { '@type': 'WebSite', '@id': `${SITE_URL}/#web`, url: `${SITE_URL}/`, name: 'Tambor Adventures CR', inLanguage: ['es', 'en'] },
      { '@type': 'FAQPage', '@id': `${pageUrl}#preguntas`, inLanguage: lang, mainEntity: faq },
    ],
  };
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

function page(html, dict, lang, path) {
  const pageUrl = SITE_URL + path;
  return html
    .replaceAll('{{PAGE_URL}}', pageUrl)
    .replaceAll('{{SITE_URL}}', SITE_URL)
    .replace('<!--JSONLD-->', jsonLd(dict, lang, pageUrl));
}

const ES = readDict(src);

let en = translate(src, EN)
  .replace('<html lang="es">', '<html lang="en">')
  .replace('hreflang="es" lang="es" aria-current="page"', 'hreflang="es" lang="es"')
  .replace('hreflang="en" lang="en">', 'hreflang="en" lang="en" aria-current="page">');

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist/en', { recursive: true });

writeFileSync('dist/index.html', page(src, ES, 'es', '/'));
writeFileSync('dist/en/index.html', page(en, EN, 'en', '/en/'));

for (const f of ['style.css', 'app.js', 'favicon.svg', 'favicon-48.png', 'apple-touch-icon.png']) cpSync(f, `dist/${f}`);
cpSync('images/tours', 'dist/images/tours', { recursive: true });
cpSync('images/og-cover.jpg', 'dist/images/og-cover.jpg');

writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

const alt = `
    <xhtml:link rel="alternate" hreflang="es" href="${SITE_URL}/" />
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/en/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/" />`;
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${TODAY}</lastmod>${alt}
  </url>
  <url>
    <loc>${SITE_URL}/en/</loc>
    <lastmod>${TODAY}</lastmod>${alt}
  </url>
</urlset>
`);

console.log(`Sitio generado en dist/ para ${SITE_URL}`);
