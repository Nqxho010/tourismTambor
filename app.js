'use strict';

// ============================
// DATOS DE CONTACTO
// Cambia estos valores por los reales. Se usan en toda la página.
// ============================
const CONTACT = {
  whatsapp: '50657030613',        // solo números, con código de país (506)
  phoneDisplay: '+506 5703 0613', // como se muestra en pantalla
  email: '',                      // déjalo vacío para ocultar el correo
};

// Mensajes que se prellenan en WhatsApp
const WA_MSG = {
  es: {
    general: 'Hola, quiero información sobre los tours.',
    isla: 'Hola, quiero reservar el tour a Isla Tortuga.',
    quad: 'Hola, quiero información sobre el tour en cuadraciclo.',
    horse: 'Hola, quiero información sobre el tour a caballo.',
    promo: 'Hola, quiero aprovechar el 20% de descuento de noviembre y diciembre en los tours.',
  },
  en: {
    general: 'Hi, I would like information about your tours.',
    isla: 'Hi, I would like to book the Tortuga Island tour.',
    quad: 'Hi, I would like information about the ATV tour.',
    horse: 'Hi, I would like information about the horseback riding tour.',
    promo: 'Hi, I would like to take advantage of the 20% November and December discount on your tours.',
  },
};

// Promoción: la barra y las etiquetas -20% solo se muestran entre estas fechas (incluidas).
// Pasada la fecha "end" se ocultan solas.
const PROMO = { start: '2026-11-01', end: '2026-12-31' };

const FORM_TXT = {
  es: { hi: 'Hola, soy', tour: 'Tour', date: 'Fecha', people: 'Personas' },
  en: { hi: 'Hi, I am', tour: 'Tour', date: 'Date', people: 'People' },
};

// ============================
// IDIOMA
// Cada idioma tiene su propia página (/ y /en/), generada por scripts/build.mjs.
// ============================
const lang = document.documentElement.lang === 'en' ? 'en' : 'es';

function waLink(text) {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}

document.querySelectorAll('[data-wa]').forEach(el => {
  el.href = waLink(WA_MSG[lang][el.dataset.wa]);
});

// ============================
// PROMOCIÓN
// ============================
(() => {
  const d = new Date();
  const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  if (todayStr < PROMO.start || todayStr > PROMO.end) return;

  document.querySelectorAll('[data-promo]').forEach(el => { el.hidden = false; });

  const bar = document.getElementById('promoBar');
  const key = `promoClosed-${PROMO.end}`;
  let closed = false;
  try { closed = localStorage.getItem(key) === '1'; } catch {}
  if (closed) return;

  bar.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => bar.classList.add('show')));
  document.getElementById('promoClose').addEventListener('click', () => {
    bar.classList.remove('show');
    bar.addEventListener('transitionend', () => { bar.hidden = true; }, { once: true });
    setTimeout(() => { bar.hidden = true; }, 600);
    try { localStorage.setItem(key, '1'); } catch {}
  });
})();

// ============================
// CONTACTO
// ============================
document.querySelectorAll('[data-contact="phone"]').forEach(el => { el.textContent = CONTACT.phoneDisplay; });
document.querySelector('[data-contact-link="phone"]').href = `tel:+${CONTACT.whatsapp}`;

if (CONTACT.email) {
  const emailLink = document.querySelector('[data-contact-link="email"]');
  emailLink.href = `mailto:${CONTACT.email}`;
  emailLink.hidden = false;
  document.querySelector('[data-contact="email"]').textContent = CONTACT.email;
}

document.getElementById('year').textContent = new Date().getFullYear();

// ============================
// MENÚ MÓVIL
// ============================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
navLinks.addEventListener('click', e => {
  if (e.target.closest('a')) {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

// ============================
// GALERÍA
// ============================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

document.getElementById('gallery').addEventListener('click', e => {
  const img = e.target.closest('.gallery-item')?.querySelector('img');
  if (!img) return;
  lightboxImg.src = img.dataset.full || img.src;
  lightboxImg.alt = img.alt;
  lightbox.showModal();
});
document.getElementById('lightboxClose').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });

// ============================
// FORMULARIO → WHATSAPP
// ============================
const fDate = document.getElementById('fDate');
const today = new Date();
fDate.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const t = FORM_TXT[lang];
  const tourSelect = document.getElementById('fTour');
  const lines = [
    `${t.hi} ${document.getElementById('fName').value.trim()}.`,
    `${t.tour}: ${tourSelect.options[tourSelect.selectedIndex].textContent}`,
  ];
  if (fDate.value) lines.push(`${t.date}: ${fDate.value}`);
  lines.push(`${t.people}: ${document.getElementById('fPeople').value}`);
  const msg = document.getElementById('fMsg').value.trim();
  if (msg) lines.push(msg);

  window.open(waLink(lines.join('\n')), '_blank', 'noopener');
});

// ============================
// SCROLL REVEAL
// ============================
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.tour-card, .step, .gallery-item').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});
