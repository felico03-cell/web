// Homepage product carousels show the same product cards as Semua Produk,
// using the lightweight "-web" thumbnails.
const carouselProducts = [
  { name: 'Voucher', href: 'produk-voucher.html', img: 'images/produk-voucher-standar-thumbnail-web.png' },
  { name: 'Packaging Box', href: 'produk-packaging-box.html', img: 'images/produk-box-thumbnail-web.png' },
  { name: 'Trifold Brochure', href: 'produk-trifold.html', img: 'images/produk-trifold-thumbnail-web.png' },
  { name: 'Booklet', href: 'produk-booklet.html', img: 'images/produk-CompanyProfile-thumbnail-web.png' },
];

function buildCarousel(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = carouselProducts.map((p) => `
    <a class="prod-card" href="${p.href}">
      <div class="prod-thumb"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
      <div class="prod-body">
        <h3 class="prod-name">${p.name}</h3>
        <div class="prod-rating"><span class="stars">★★★★★</span> <span class="count">(5)</span></div>
        <div class="prod-price">Rp -</div>
      </div>
    </a>
  `).join('');
}

buildCarousel('produk');
buildCarousel('stickers');

function scrollCarousel(id, dir) {
  const el = document.getElementById(id);
  const card = el.firstElementChild;
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



// ===== Product detail gallery =====
const galleryImgEl = document.getElementById('galleryImg');
let showGallerySlideBySrc = null;
if (galleryImgEl) {
  const gallerySlides = (galleryImgEl.dataset.gallery || '').split(',').map(s => s.trim()).filter(Boolean);
  if (gallerySlides.length) {
    let gallerySlideIndex = 0;
    const showGallerySlide = (i) => {
      gallerySlideIndex = (i + gallerySlides.length) % gallerySlides.length;
      galleryImgEl.src = gallerySlides[gallerySlideIndex];
    };
    document.querySelector('.gallery-hit.prev')?.addEventListener('click', () => showGallerySlide(gallerySlideIndex - 1));
    document.querySelector('.gallery-hit.next')?.addEventListener('click', () => showGallerySlide(gallerySlideIndex + 1));
    showGallerySlideBySrc = (src) => {
      const i = gallerySlides.indexOf(src);
      showGallerySlide(i === -1 ? gallerySlideIndex : i);
    };
  }
}

// ===== Product detail variant picker =====
document.querySelectorAll('.variant-btns').forEach((group) => {
  group.addEventListener('click', (e) => {
    const btn = e.target.closest('.variant-btn');
    if (!btn) return;
    group.querySelectorAll('.variant-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    if (btn.dataset.image) showGallerySlideBySrc?.(btn.dataset.image);
  });
});

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

  const catSideLinks = document.querySelectorAll('.cat-side-list a[data-filter], .produk-cat-carousel a[data-filter]');
  const applyProdukFilter = (filter) => {
    catSideLinks.forEach((l) => {
      const isActive = l.dataset.filter === filter;
      l.classList.toggle('active', isActive);
      if (isActive && l.classList.contains('cat-tile')) {
        const track = l.parentElement;
        track.scrollTo({ left: l.offsetLeft - (track.clientWidth - l.offsetWidth) / 2, behavior: 'smooth' });
      }
    });
    produkGridEl.querySelectorAll('.prod-card').forEach((card) => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.hidden = !match;
    });
  };
  catSideLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      applyProdukFilter(link.dataset.filter);
    });
  });

  const urlFilter = new URLSearchParams(location.search).get('filter');
  if (urlFilter) applyProdukFilter(urlFilter);
}

// ===== Mobile off-canvas menu =====
const mobileMenuEl = document.getElementById('mobileMenu');
const mobileMenuToggleBtn = document.getElementById('mobileMenuToggle');
const mobileMenuCloseBtn = document.getElementById('mobileMenuClose');
const mobileMenuBackdropEl = document.getElementById('mobileMenuBackdrop');

if (mobileMenuEl && mobileMenuToggleBtn) {
  const openMobileMenu = () => {
    mobileMenuEl.classList.add('open');
    mobileMenuToggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const closeMobileMenu = () => {
    mobileMenuEl.classList.remove('open');
    mobileMenuToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  mobileMenuToggleBtn.addEventListener('click', openMobileMenu);
  mobileMenuCloseBtn?.addEventListener('click', closeMobileMenu);
  mobileMenuBackdropEl?.addEventListener('click', closeMobileMenu);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileMenu();
  });
}

// ===== Jam Operasional popup =====
const jamModalEl = document.getElementById('jamModal');
const jamModalBackdropEl = document.getElementById('jamModalBackdrop');
const jamModalCloseBtn = document.getElementById('jamModalClose');
const jamTriggerEls = document.querySelectorAll('.jam-trigger');

if (jamModalEl && jamModalBackdropEl && jamTriggerEls.length) {
  const openJamModal = () => {
    jamModalEl.classList.add('open');
    jamModalBackdropEl.classList.add('open');
  };
  const closeJamModal = () => {
    jamModalEl.classList.remove('open');
    jamModalBackdropEl.classList.remove('open');
  };
  jamTriggerEls.forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openJamModal();
    });
  });
  jamModalCloseBtn?.addEventListener('click', closeJamModal);
  jamModalBackdropEl.addEventListener('click', closeJamModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeJamModal();
  });
}

// ===== Karir popup =====
const karirModalEl = document.getElementById('karirModal');
const karirModalBackdropEl = document.getElementById('karirModalBackdrop');
const karirModalCloseBtn = document.getElementById('karirModalClose');
const karirTriggerEls = document.querySelectorAll('.karir-trigger');

if (karirModalEl && karirModalBackdropEl && karirTriggerEls.length) {
  const openKarirModal = () => {
    karirModalEl.classList.add('open');
    karirModalBackdropEl.classList.add('open');
  };
  const closeKarirModal = () => {
    karirModalEl.classList.remove('open');
    karirModalBackdropEl.classList.remove('open');
  };
  karirTriggerEls.forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openKarirModal();
    });
  });
  karirModalCloseBtn?.addEventListener('click', closeKarirModal);
  karirModalBackdropEl.addEventListener('click', closeKarirModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeKarirModal();
  });
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

// ===== Hubungi Kami: Dapatkan Penawaran form (Web3Forms) =====
const kontakFormEl = document.getElementById('kontakForm');
const kontakStatusEl = document.getElementById('kontakStatus');

if (kontakFormEl && kontakStatusEl) {
  kontakFormEl.addEventListener('submit', function (e) {
    e.preventDefault();
    const submitBtn = kontakFormEl.querySelector('.kontak-submit');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Mengirim...';
    kontakStatusEl.hidden = true;

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(kontakFormEl))),
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        kontakStatusEl.hidden = false;
        if (data.success) {
          kontakStatusEl.textContent = 'Pesan Anda berhasil terkirim. Tim CALSPRINT akan segera menghubungi Anda.';
          kontakStatusEl.className = 'kontak-status success';
          kontakFormEl.reset();
        } else {
          kontakStatusEl.textContent = 'Gagal mengirim pesan. Silakan coba lagi.';
          kontakStatusEl.className = 'kontak-status error';
        }
      })
      .catch(function () {
        kontakStatusEl.hidden = false;
        kontakStatusEl.textContent = 'Gagal mengirim pesan. Periksa koneksi Anda dan coba lagi.';
        kontakStatusEl.className = 'kontak-status error';
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      });
  });
}
