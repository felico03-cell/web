// Product carousel cards use the ready-made Calendar A6 product shot
// (logo + photo + label already composed in the image itself).
function buildCarousel(id, count, imgSrc, name) {
  const el = document.getElementById(id);
  if (!el) return;
  let html = "";
  for (let i = 0; i < count; i++) {
    html += `
      <div class="card">
        <img src="${imgSrc}" alt="${name}" loading="lazy">
      </div>
    `;
  }
  el.innerHTML = html;
}

buildCarousel('produk', 6, 'images/calendar-a6.png', 'Calendar A6');
buildCarousel('stickers', 6, 'images/calendar-a6.png', 'Calendar A6');

function scrollCarousel(id, dir) {
  const el = document.getElementById(id);
  const card = el.querySelector('.card');
  const step = card ? card.getBoundingClientRect().width + 18 : 220;
  el.scrollBy({ left: dir * step * 2, behavior: 'smooth' });
}

// ===== Hero banner slider =====
let heroIndex = 0;
const heroTrackEl = document.getElementById('heroTrack');
const heroSlideCount = heroTrackEl ? heroTrackEl.children.length : 0;
const heroDotsEl = document.getElementById('heroDots');

function buildHeroDots() {
  if (!heroDotsEl) return;
  let html = '';
  for (let i = 0; i < heroSlideCount; i++) {
    html += `<span class="dot${i === 0 ? ' active' : ''}" onclick="heroGoTo(${i})"></span>`;
  }
  heroDotsEl.innerHTML = html;
}

function updateHero() {
  if (!heroTrackEl) return;
  heroTrackEl.style.transform = `translateX(-${heroIndex * 100}%)`;
  if (heroDotsEl) {
    Array.prototype.forEach.call(heroDotsEl.children, function (dot, i) {
      dot.classList.toggle('active', i === heroIndex);
    });
  }
}

function heroNext() {
  heroIndex = (heroIndex + 1) % heroSlideCount;
  updateHero();
}

function heroPrev() {
  heroIndex = (heroIndex - 1 + heroSlideCount) % heroSlideCount;
  updateHero();
}

function heroGoTo(i) {
  heroIndex = i;
  updateHero();
}

buildHeroDots();



// ===== Semua Produk grid (placeholder cards) =====
const produkGridEl = document.getElementById('produkGrid');
if (produkGridEl) {
  const tmpIcon = `
    <svg viewBox="0 0 100 120" fill="none" stroke="#1b2d69" stroke-width="4">
      <path d="M15 8h50l20 20v84a4 4 0 0 1-4 4H15a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4z" stroke-linejoin="round"/>
      <path d="M65 8v20h20" stroke-linejoin="round"/>
      <text x="50" y="80" font-family="Poppins, sans-serif" font-size="22" font-weight="800" text-anchor="middle" fill="#1b2d69" stroke="none">TMP</text>
    </svg>`;
  let html = '';
  for (let i = 0; i < 11; i++) {
    html += `
      <div class="prod-card">
        <div class="prod-thumb prod-thumb-placeholder">${tmpIcon}</div>
        <div class="prod-body">
          <h3 class="prod-name">Produk</h3>
          <div class="prod-rating"><span class="stars">★★★★★</span> <span class="count">(5)</span></div>
          <div class="prod-price">Rp -</div>
        </div>
      </div>
    `;
  }
  produkGridEl.insertAdjacentHTML('beforeend', html);
}

// ===== Category dropdown =====
const categoryToggleBtn = document.getElementById('categoryToggle');
const categoryDropdownEl = document.getElementById('categoryDropdown');

if (categoryToggleBtn && categoryDropdownEl) {
  categoryToggleBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = categoryDropdownEl.classList.toggle('open');
    categoryToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.addEventListener('click', function (e) {
    if (!categoryDropdownEl.contains(e.target) && e.target !== categoryToggleBtn) {
      categoryDropdownEl.classList.remove('open');
      categoryToggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      categoryDropdownEl.classList.remove('open');
      categoryToggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}
