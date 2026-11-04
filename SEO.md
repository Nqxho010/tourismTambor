# Guía SEO — Tambor Adventures CR (Netlify)

Palabras clave principales: **"tours Tambor"**, **"Tambor viajes"** e **"Isla Tortuga tours"** (en inglés: *Tambor tours, Tortuga Island tours*). Secundarias: *tour en cuadraciclo Tambor, Tambor ATV tour, tour a caballo Tambor, Tambor tours Costa Rica*.

---

## 1. Cómo funciona ahora el sitio

El código fuente sigue en la raíz (`index.html`, `style.css`, `app.js`). Al publicar, Netlify ejecuta `node scripts/build.mjs` (configurado en `netlify.toml`) y genera la carpeta `dist/` con:

| Archivo | Para qué sirve |
|---------|----------------|
| `dist/index.html` | Página en español (`/`) |
| `dist/en/index.html` | Página en inglés (`/en/`), con los textos de `i18n/en.json` |
| `dist/robots.txt` | Permite a Google rastrear el sitio y le indica dónde está el sitemap |
| `dist/sitemap.xml` | Lista las dos páginas con su `hreflang` |

**El dominio se pone solo.** Netlify le pasa al build la variable `URL`, que es tu dominio principal. Con ese valor se escriben el `canonical`, `og:url`, `og:image`, el sitemap y el Schema. No hay que escribir el dominio en ningún archivo.

### Para editar textos
- **Español:** edita `index.html`.
- **Inglés:** edita `i18n/en.json`, usando la misma clave que tiene el `data-i18n="..."` del HTML.
- Si agregas un texto nuevo con `data-i18n`, agrega también su traducción en `en.json`. Si falta, el build falla y te dice qué clave es, para que nunca se publique una página a medio traducir.

### Para verlo en tu computadora
```bash
node scripts/build.mjs
```
```bash
python -m http.server 5173 --directory dist
```
Luego abre http://localhost:5173 y http://localhost:5173/en/.

---

## 2. Lo que ya está configurado

- **Título y descripción** con "Tambor Tours Costa Rica", en español y en inglés.
- **H1 y H2** con "Tambor" (por ejemplo: "Nuestros tours en Tambor", "Tour a Isla Tortuga desde Tambor").
- **Página en inglés real (`/en/`)** con `hreflang` es/en/x-default. Antes el inglés solo existía por JavaScript y Google no lo veía.
- **Canonical** en cada página.
- **Open Graph y Twitter Card** con `images/og-cover.jpg` (1200×630), para que el enlace se vea bien en WhatsApp y Facebook.
- **Datos estructurados (JSON-LD)**: `TravelAgency` con teléfono, ubicación, idiomas y los 3 tours, más `WebSite` y `FAQPage`.
- **Sección de preguntas frecuentes** en las dos páginas. Puede aparecer en Google como resultado enriquecido.
- **Imágenes en WebP** con nombres que incluyen palabras clave (`images/tours/`): pasaron de unos 3,7 MB a menos de 1 MB en total. Tienen versiones de 800 px para el celular, `width`/`height` para que la página no salte al cargar, y `fetchpriority="high"` en la imagen principal.
- **`alt` descriptivos** en todas las imágenes. Se corrigió el del cuadraciclo, que antes describía una vista aérea.
- **Teléfono escrito en el HTML**, para que Google lo lea aunque no ejecute JavaScript.
- **Favicon** (`favicon.svg`, `favicon-48.png`, `apple-touch-icon.png`).
- **Caché de 30 días** para las imágenes (`netlify.toml`).

---

## 3. Pasos en Netlify (los haces tú)

1. **Revisa que el sitio esté conectado a GitHub** (Site configuration → Build & deploy). `netlify.toml` define el comando de build (`node scripts/build.mjs`) y la carpeta de publicación (`dist`), así que no hace falta escribirlos a mano.
   - Si hoy subes el sitio arrastrando la carpeta, tienes que ejecutar `node scripts/build.mjs` y arrastrar **`dist/`**, no la raíz.
2. **Dominio:** en *Domain management*, marca tu dominio propio como **Primary domain**. Netlify redirige solo `tusitio.netlify.app` y `www`/sin `www` al dominio principal, así Google no ve el sitio duplicado.
3. **HTTPS:** en *Domain management → HTTPS*, revisa que el certificado de Let's Encrypt esté activo.
4. Después del primer deploy, abre `https://TU-DOMINIO/sitemap.xml` y confirma que aparece tu dominio real, no `localhost`.

---

## 4. Google (los haces tú, es lo que más ayuda)

1. **Google Search Console** (https://search.google.com/search-console)
   - Agrega una propiedad de tipo **Dominio** y verifícala con el registro TXT. Si el DNS lo maneja Netlify, el registro se agrega en *Domain management → DNS records*.
   - En *Sitemaps*, envía `sitemap.xml`.
   - En *Inspección de URLs*, pide la indexación de `/` y de `/en/`.
2. **Perfil de Empresa de Google** (https://business.google.com): esto es lo que te hace aparecer en Google Maps y en el recuadro local al buscar "Tambor tours".
   - Nombre: **Tambor Adventures CR**. Categoría: *Operador turístico* o *Agencia de tours*.
   - El mismo teléfono que aparece en la página (+506 8506 6459), el enlace al sitio y fotos reales.
3. **Reseñas:** pide a cada cliente una reseña en Google. Es el factor que más pesa en las búsquedas locales.
4. **TripAdvisor / Facebook / Instagram:** crea o completa los perfiles, enlaza al sitio y usa siempre el mismo nombre y teléfono.
5. Revisa los resultados en https://search.google.com/test/rich-results (Schema) y https://pagespeed.web.dev (velocidad).

---

## 5. Mejoras pendientes de contenido

Google posiciona mejor las páginas con información concreta. Cuando tengas estos datos, agrégalos en `index.html` y en `i18n/en.json`:

- **Precio, duración y horario** de cada tour. Después se puede agregar `offers.price` en `scripts/build.mjs`.
- **Fotos del tour a caballo**. Ahora dice "Fotos próximamente".
- **Reseñas o testimonios reales** en la página.
- **Facebook / Instagram:** cuando tengas los enlaces, agrégalos como `sameAs` en el Schema de `scripts/build.mjs`.
- Más preguntas frecuentes (por ejemplo, si recogen en el hotel o si es apto para niños), solo con información verdadera.

Tiempo esperado: Google suele tardar **de 2 a 8 semanas** en reflejar los cambios. El Perfil de Empresa y las reseñas suelen dar resultados más rápido en búsquedas locales.
