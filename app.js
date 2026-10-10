'use strict';

// ============================
// CUSTOM CURSOR
// ============================
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = -100, my = -100, fx = -100, fy = -100;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function animFollower() {
  fx += (mx - fx) * 0.1;
  fy += (my - fy) * 0.1;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(animFollower);
})();

document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  follower.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  follower.style.opacity = '1';
});

// ============================
// NAVBAR
// ============================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

document.getElementById('navToggle').addEventListener('click', () => {
  const links = document.querySelector('.nav-links');
  links.classList.toggle('mobile-open');
});

// ============================
// HERO SLIDER
// ============================
const slides = document.querySelectorAll('.hero-slide');
const dots   = document.querySelectorAll('.progress-dot');
let current = 0;
let sliderTimer;

function goToSlide(idx) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = idx;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

function nextSlide() { goToSlide((current + 1) % slides.length); }
function prevSlide() { goToSlide((current - 1 + slides.length) % slides.length); }

sliderTimer = setInterval(nextSlide, 6000);

document.getElementById('slideNext').addEventListener('click', () => {
  clearInterval(sliderTimer);
  nextSlide();
  sliderTimer = setInterval(nextSlide, 6000);
});
document.getElementById('slidePrev').addEventListener('click', () => {
  clearInterval(sliderTimer);
  prevSlide();
  sliderTimer = setInterval(nextSlide, 6000);
});
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    clearInterval(sliderTimer);
    goToSlide(i);
    sliderTimer = setInterval(nextSlide, 6000);
  });
});

// ============================
// COUNTDOWN TIMER
// ============================
let totalSecs = 23 * 3600 + 59 * 60 + 47;

function updateTimer() {
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  const pad = n => String(n).padStart(2, '0');

  const tH = document.getElementById('t-h');
  const tM = document.getElementById('t-m');
  const tS = document.getElementById('t-s');
  if (tH) tH.textContent = pad(h);
  if (tM) tM.textContent = pad(m);
  if (tS) tS.textContent = pad(s);

  if (totalSecs > 0) totalSecs--;
}
updateTimer();
setInterval(updateTimer, 1000);

// ============================
// HERO STAT COUNTERS
// ============================
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    el.textContent = target === 49 ? (value / 10).toFixed(1) : value.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number[data-target]').forEach(animateCounter);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) statObserver.observe(statsEl);

// ============================
// SEARCH
// ============================
function handleSearch(e) {
  e.preventDefault();
  const dest = document.getElementById('searchDestino').value || 'nuestros destinos';
  showToast(`Buscando viajes a ${dest}...`);
  setTimeout(() => {
    document.getElementById('paquetes')?.scrollIntoView({ behavior: 'smooth' });
  }, 800);
}

// ============================
// DESTINATION MODAL
// ============================
const destData = {
  Paris: {
    name: 'París, Francia',
    price: '$899',
    desc: 'Sumérgete en la magia de la Ciudad Luz. Arte, gastronomía, moda y romance en el destino más visitado del mundo.',
    features: ['7 noches en hotel 4★ en el centro', 'Vuelos de ida y vuelta', 'Visita al Louvre y Torre Eiffel', 'Crucero por el Sena', 'Desayunos incluidos'],
  },
  Cancun: {
    name: 'Cancún, México',
    price: '$650',
    desc: 'Aguas turquesas, arena blanca y diversión sin límites. El destino de playa más popular del Caribe mexicano.',
    features: ['7 noches all-inclusive', 'Vuelos incluidos', 'Hotel con frente al mar', 'Snorkel en arrecife de coral', 'Visita a ruinas mayas'],
  },
  Roma: {
    name: 'Roma, Italia',
    price: '$799',
    desc: 'Camina por la historia en cada calle. El Coliseo, el Vaticano, la Fontana di Trevi y la gastronomía italiana te esperan.',
    features: ['6 noches en hotel boutique', 'Vuelos incluidos', 'Tour guiado al Vaticano', 'Visita al Coliseo sin colas', 'Clases de cocina italiana'],
  },
  Bali: {
    name: 'Bali, Indonesia',
    price: '$1,100',
    desc: 'La isla de los dioses te conquistará con sus templos, arrozales escalonados, playas exóticas y espiritualidad única.',
    features: ['10 noches en villa privada', 'Vuelos incluidos', 'Retiro de yoga y spa', 'Tour por templos sagrados', 'Surf lessons incluidas'],
  },
  NYC: {
    name: 'Nueva York, EE.UU.',
    price: '$750',
    desc: 'La ciudad que nunca duerme. Broadway, Central Park, el skyline más icónico y la energía inconfundible de Manhattan.',
    features: ['5 noches en hotel Manhattan', 'Vuelos incluidos', 'NYC Explorer Pass', 'Show de Broadway', 'Tour por los 5 boroughs'],
  },
};

function openModal(dest) {
  const d = destData[dest];
  if (!d) return;
  document.getElementById('modalContent').innerHTML = `
    <p class="modal-dest-name">${d.name}</p>
    <p class="modal-dest-price">${d.price} <small>/ persona</small></p>
    <p class="modal-desc">${d.desc}</p>
    <ul class="modal-features">
      ${d.features.map(f => `<li>${f}</li>`).join('')}
    </ul>
    <a href="#contacto" class="btn-gold btn-form-submit" onclick="closeModal()" style="display:flex;justify-content:center;width:100%">
      Reservar este destino →
    </a>
  `;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ============================
// FORMS
// ============================
function handleNewsletter(e) {
  e.preventDefault();
  showToast('Suscripción confirmada. Revisa tu correo.');
  e.target.reset();
}
function handleContact(e) {
  e.preventDefault();
  showToast('Recibido. Te contactamos en menos de 2 horas.');
  e.target.reset();
}

// ============================
// TOAST
// ============================
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 4200);
}

// ============================
// SOCIAL PROOF TOASTS
// ============================
const proofMsgs = [
  'Ana de São Paulo acaba de reservar Cancún',
  'Carlos de CDMX está viendo el paquete París',
  'Familia Rodríguez reservó Bali para julio',
  'Miguel de Buenos Aires compró el paquete NYC',
  'Laura de Santiago reservó Roma para diciembre',
  'Roberto de Lima acaba de cotizar Caribe',
];
let proofIdx = 0;
setTimeout(() => {
  showToast(proofMsgs[proofIdx++ % proofMsgs.length]);
  setInterval(() => showToast(proofMsgs[proofIdx++ % proofMsgs.length]), 13000);
}, 6000);

// ============================
// SPOTS URGENCY
// ============================
const spotsEl = document.getElementById('spots');
if (spotsEl) {
  let spots = 7;
  setInterval(() => {
    if (spots > 2 && Math.random() > 0.82) {
      spotsEl.textContent = --spots;
    }
  }, 35000);
}

// ============================
// SCROLL REVEAL
// ============================
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

function addReveal(selector, delayStep = 0) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    if (delayStep) el.dataset.delay = i * delayStep;
    revealObserver.observe(el);
  });
}

addReveal('.dest-card', 80);
addReveal('.pkg-card', 100);
addReveal('.step-card', 120);
addReveal('.testimonial-card', 80);
addReveal('.trust-item', 60);
addReveal('.channel', 60);
