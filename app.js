'use strict';

// ============================
// DATOS DE CONTACTO
// Cambia estos valores por los reales. Se usan en toda la página.
// ============================
const CONTACT = {
  whatsapp: '50685066459',        // solo números, con código de país (506)
  phoneDisplay: '+506 8506 6459', // como se muestra en pantalla
  email: '',                      // déjalo vacío para ocultar el correo
};

// ============================
// TRADUCCIONES
// El español vive en el HTML; aquí solo va el inglés.
// ============================
const EN = {
  'skip': 'Skip to content',
  'meta.title': 'Tambor Adventures CR — Tours in Tambor, Costa Rica',
  'meta.desc': 'Tours in Tambor, Costa Rica: boat trip to Tortuga Island, ATV tour and horseback riding tour. Easy booking on WhatsApp.',

  'nav.tours': 'Tours',
  'nav.isla': 'Tortuga Island',
  'nav.gallery': 'Photos',
  'nav.how': 'How to book',
  'nav.contact': 'Contact',

  'hero.eyebrow': 'Tambor · Nicoya Peninsula · Costa Rica',
  'hero.title': 'Tours in Tambor: sea, beach and adventure',
  'hero.sub': 'Take a boat to Tortuga Island, explore the area by ATV or go horseback riding. You pick the tour and we take care of the rest.',
  'hero.cta1': 'See the tours',
  'hero.cta2': 'Message us on WhatsApp',

  'tours.tag': 'Choose your adventure',
  'tours.title': 'Our tours',
  'tours.sub': 'Three ways to discover Tambor and its surroundings.',
  't1.badge': 'By boat',
  't1.name': 'Tortuga Island',
  't1.desc': 'Boat trip to an island with white sand and turquoise water. Snorkeling, beach time and fresh fruit.',
  't1.btn': 'See details and photos',
  't2.name': 'ATV tour',
  't2.desc': 'ATV adventure around Tambor. Message us and we will share routes, schedules and price.',
  't3.name': 'Horseback riding tour',
  't3.desc': 'A relaxed horseback ride to enjoy the local nature. Message us and we will share routes, schedules and price.',
  'soon': 'Photos coming soon',
  'ask': 'Ask on WhatsApp',

  'isla.tag': 'Featured tour',
  'isla.title': 'Tortuga Island tour',
  'isla.p1': 'We leave Tambor by boat for Tortuga Island, one of the most beautiful beaches in the Gulf of Nicoya: white sand, palm trees and turquoise water.',
  'isla.listTitle': 'What you will enjoy',
  'isla.li1': 'Boat ride along the coast',
  'isla.li2': 'Snorkeling in calm, clear water',
  'isla.li3': 'Free time on the beach to swim and relax',
  'isla.li4': 'Fresh fruit: pineapple and watermelon',
  'isla.li5': 'With some luck, dolphins along the way',
  'isla.bringTitle': 'What to bring',
  'isla.bring': 'Swimsuit, towel, sunscreen, water and a good mood.',
  'isla.note': 'Price, departure time and details: message us and we will reply on WhatsApp.',
  'isla.cta': 'Book Tortuga Island',

  'gal.tag': 'Gallery',
  'gal.title': 'Photos from the Tortuga Island tour',
  'gal.sub': 'Real photos from our trips. Tap a photo to see it larger.',
  'alt.hero': 'Boat in front of the beach at Tortuga Island, Costa Rica',
  'alt.aerial': 'Aerial view of the coast and turquoise sea',
  'alt.beach': 'Quiet beach with clear water at Tortuga Island',
  'alt.snorkel': 'Group snorkeling in the sea',
  'alt.fruit': 'Pineapple and watermelon served on the beach',
  'alt.group': 'Group of travelers on the boat',
  'alt.dolphins': 'Dolphins swimming next to the boat',
  'alt.palms': 'Palm trees and beach at Tortuga Island',
  'alt.swim': 'Travelers swimming in turquoise water',

  'how.tag': 'Quick and simple',
  'how.title': 'How to book',
  'how.s1t': 'Choose your tour',
  'how.s1d': 'Tortuga Island, ATV or horseback riding.',
  'how.s2t': 'Message us on WhatsApp',
  'how.s2d': 'Tell us the date and how many people are coming.',
  'how.s3t': 'Get your confirmation',
  'how.s3d': 'We confirm availability, price and meeting point.',

  'contact.tag': 'Contact',
  'contact.title': 'Book or ask a question',
  'contact.sub': 'We reply in English and Spanish.',
  'contact.call': 'Call',
  'contact.email': 'Email',
  'contact.where': 'Location',
  'contact.place': 'Tambor, Puntarenas, Costa Rica',

  'form.title': 'Send us your request',
  'form.name': 'Your name',
  'form.tour': 'Tour',
  'form.date': 'Date',
  'form.people': 'People',
  'form.msg': 'Message (optional)',
  'form.submit': 'Send on WhatsApp',
  'form.note': 'WhatsApp will open with your message ready to send.',

  'footer.tagline': 'Tours in Tambor, Puntarenas, Costa Rica.',
};

// Mensajes que se prellenan en WhatsApp
const WA_MSG = {
  es: {
    general: 'Hola, quiero información sobre los tours.',
    isla: 'Hola, quiero reservar el tour a Isla Tortuga.',
    quad: 'Hola, quiero información sobre el tour en cuadraciclo.',
    horse: 'Hola, quiero información sobre el tour a caballo.',
  },
  en: {
    general: 'Hi, I would like information about your tours.',
    isla: 'Hi, I would like to book the Tortuga Island tour.',
    quad: 'Hi, I would like information about the ATV tour.',
    horse: 'Hi, I would like information about the horseback riding tour.',
  },
};

const FORM_TXT = {
  es: { hi: 'Hola, soy', tour: 'Tour', date: 'Fecha', people: 'Personas' },
  en: { hi: 'Hi, I am', tour: 'Tour', date: 'Date', people: 'People' },
};

// ============================
// IDIOMA
// ============================
const ES = { 'meta.title': document.title, 'meta.desc': document.querySelector('meta[name="description"]').content };
document.querySelectorAll('[data-i18n]').forEach(el => { ES[el.dataset.i18n] = el.textContent; });
document.querySelectorAll('[data-i18n-alt]').forEach(el => { ES[el.dataset.i18nAlt] = el.alt; });

let lang = 'es';

function waLink(text) {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}

function setLang(next) {
  lang = next === 'en' ? 'en' : 'es';
  const dict = lang === 'en' ? EN : ES;

  document.documentElement.lang = lang;
  document.title = dict['meta.title'];
  document.querySelector('meta[name="description"]').content = dict['meta.desc'];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const txt = dict[el.dataset.i18n];
    if (txt) el.textContent = txt;
  });
  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const txt = dict[el.dataset.i18nAlt];
    if (txt) el.alt = txt;
  });
  document.querySelectorAll('[data-wa]').forEach(el => {
    el.href = waLink(WA_MSG[lang][el.dataset.wa]);
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
  });

  try { localStorage.setItem('lang', lang); } catch (_) { /* almacenamiento bloqueado */ }
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

let savedLang = null;
try { savedLang = localStorage.getItem('lang'); } catch (_) { /* almacenamiento bloqueado */ }
setLang(savedLang || (navigator.language || 'es').slice(0, 2));

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
  lightboxImg.src = img.src;
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
