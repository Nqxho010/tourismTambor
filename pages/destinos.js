/* ============================
   CURSOR
   ============================ */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function animFollower() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(animFollower);
})();

/* ============================
   NAVBAR SCROLL
   ============================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ============================
   MOBILE MENU
   ============================ */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');
navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('mobile-open');
});

/* ============================
   FILTER TABS
   ============================ */
const filterTabs = document.getElementById('filterTabs');
const destCount  = document.getElementById('destCount');
const dgrid      = document.getElementById('dgrid');

function getVisibleCards() {
  return [...dgrid.querySelectorAll('.dgc:not(.hidden)')];
}

function updateCount() {
  const n = getVisibleCards().length;
  destCount.innerHTML = `Mostrando <strong>${n}</strong> destino${n !== 1 ? 's' : ''}`;
}

filterTabs?.addEventListener('click', e => {
  const btn = e.target.closest('.ftab');
  if (!btn) return;

  [...filterTabs.querySelectorAll('.ftab')].forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  const filter = btn.dataset.filter;
  [...dgrid.querySelectorAll('.dgc')].forEach(card => {
    const match = filter === 'todos' || card.dataset.region === filter;
    card.classList.toggle('hidden', !match);
  });

  updateCount();
  applySort(document.getElementById('sortSelect')?.value ?? 'popular');
});

/* ============================
   SORT
   ============================ */
function applySort(value) {
  const cards = [...dgrid.querySelectorAll('.dgc:not(.hidden)')];

  cards.sort((a, b) => {
    const priceA  = parseInt(a.dataset.price);
    const priceB  = parseInt(b.dataset.price);
    const ratingA = parseFloat(a.dataset.rating);
    const ratingB = parseFloat(b.dataset.rating);
    const orderA  = parseInt(a.dataset.order);
    const orderB  = parseInt(b.dataset.order);

    if (value === 'precio-asc')  return priceA - priceB;
    if (value === 'precio-desc') return priceB - priceA;
    if (value === 'rating')      return ratingB - ratingA;
    return orderA - orderB; // popular = original order
  });

  cards.forEach(card => dgrid.appendChild(card));
}

document.getElementById('sortSelect')?.addEventListener('change', e => {
  applySort(e.target.value);
});

/* ============================
   SCROLL REVEAL
   ============================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================
   NEWSLETTER TOAST
   ============================ */
function handleNewsletter(e) {
  e.preventDefault();
  const toast = document.getElementById('toast');
  toast.textContent = '¡Suscrito! Pronto recibirás ofertas exclusivas.';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3800);
  e.target.reset();
}
