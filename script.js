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

// ===== Semua Produk grid (category + search filtering) =====
const produkGridEl = document.getElementById('produkGrid');
if (produkGridEl) {
  const catSideLinks = document.querySelectorAll('.cat-side-list a[data-filter], .produk-cat-carousel a[data-filter]');
  let produkFilter = 'all';
  let produkSearch = '';

  const refreshProdukGrid = () => {
    const q = produkSearch.trim().toLowerCase();
    produkGridEl.querySelectorAll('.prod-card').forEach((card) => {
      const matchesCategory = produkFilter === 'all' || card.dataset.category === produkFilter;
      const name = card.querySelector('.prod-name')?.textContent.toLowerCase() || '';
      const matchesSearch = !q || name.includes(q);
      card.hidden = !(matchesCategory && matchesSearch);
    });
  };

  const applyProdukFilter = (filter) => {
    produkFilter = filter;
    catSideLinks.forEach((l) => {
      const isActive = l.dataset.filter === filter;
      l.classList.toggle('active', isActive);
      if (isActive && l.classList.contains('cat-tile')) {
        const track = l.parentElement;
        track.scrollTo({ left: l.offsetLeft - (track.clientWidth - l.offsetWidth) / 2, behavior: 'smooth' });
      }
    });
    refreshProdukGrid();
  };
  catSideLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      applyProdukFilter(link.dataset.filter);
    });
  });

  const urlParams = new URLSearchParams(location.search);
  produkSearch = urlParams.get('search') || '';
  const urlFilter = urlParams.get('filter');
  if (urlFilter) {
    applyProdukFilter(urlFilter);
  } else {
    refreshProdukGrid();
  }
}

// ===== Header search (desktop + mobile) =====
const searchProducts = [
  { name: 'Voucher', href: 'produk-voucher.html', category: 'voucher', img: 'images/produk-voucher-standar-thumbnail.png', keywords: ['kupon'] },
  { name: 'Voucher HVS / Tiket', href: 'produk-voucher-hvs-tiket.html', category: 'voucher', img: 'images/produk-voucher-tiket-thumbnail.png', keywords: ['tiket', 'karcis', 'hvs', 'ticket'] },
  { name: 'Voucher Buku', href: 'produk-voucher-buku.html', category: 'voucher', img: 'images/produk-voucher-buku-thumbnail.png', keywords: ['kupon', 'buku'] },
  { name: 'Packaging Box', href: 'produk-packaging-box.html', category: 'packaging', img: 'images/produk-box-thumbnail.png', keywords: ['kotak', 'dus', 'box'] },
  { name: 'Brosur DL', href: 'produk-brosur-dl.html', category: 'brochures', img: 'images/produk-brosurdl-thumbnail.png', keywords: ['brochure', 'flyer'] },
  { name: 'Trifold Brochure', href: 'produk-trifold.html', category: 'brochures', img: 'images/produk-trifold-thumbnail.png', keywords: ['brosur'] },
  { name: 'Loyalty Card', href: 'produk-loyalty-card.html', category: 'cards', img: 'images/produk-LoyaltyCard-thumbnail.png', keywords: ['kartu', 'member'] },
  { name: 'Booklet', href: 'produk-booklet.html', category: 'booklet', img: 'images/produk-CompanyProfile-thumbnail.png', keywords: ['company profile', 'buku'] },
  { name: 'Kalender Perusahaan', href: 'produk-kalender.html', category: 'calendars', img: 'images/produk-calendar-thumbnail.png', keywords: ['kalender', 'calendar', 'corporate calendar'] },
  { name: 'Totebag Custom', href: 'produk-totebag.html', category: 'apparel', img: 'images/produk-ToteBag-thumbnail.png', keywords: ['tote bag', 'tas', 'totebag'] },
  { name: 'Gantungan Kunci Custom', href: 'produk-gantungan-kunci.html', category: 'merchandise', img: 'images/produk-GantunganKunci-thumbnail.png', keywords: ['keychain', 'gantungan kunci', 'kunci'] },
];

function matchSearchProducts(term) {
  const q = term.trim().toLowerCase();
  if (!q) return [];
  return searchProducts.filter((p) => {
    const haystack = [p.name, p.category, ...(p.keywords || [])].join(' ').toLowerCase();
    return haystack.includes(q);
  }).slice(0, 6);
}

document.querySelectorAll('form.search-bar').forEach((form) => {
  const input = form.querySelector('input[type="text"]');
  if (!input) return;

  const dropdown = document.createElement('div');
  dropdown.className = 'search-suggest';
  form.appendChild(dropdown);

  let activeIndex = -1;

  const goToResults = () => {
    const q = input.value.trim();
    if (!q) return;
    const items = matchSearchProducts(q);
    window.location.href = items.length === 1
      ? items[0].href
      : `semua-produk.html?search=${encodeURIComponent(q)}`;
  };

  const renderSuggestions = (items) => {
    activeIndex = -1;
    if (!items.length) {
      dropdown.classList.remove('open');
      dropdown.innerHTML = '';
      return;
    }
    dropdown.innerHTML = items.map((p) => `
      <a class="search-suggest-item" href="${p.href}">
        <img src="${p.img}" alt="">
        <span>${p.name}</span>
      </a>
    `).join('');
    dropdown.classList.add('open');
  };

  input.addEventListener('input', () => {
    renderSuggestions(matchSearchProducts(input.value));
  });

  input.addEventListener('focus', () => {
    if (input.value.trim()) renderSuggestions(matchSearchProducts(input.value));
  });

  input.addEventListener('keydown', (e) => {
    const items = dropdown.querySelectorAll('.search-suggest-item');
    if (e.key === 'ArrowDown' && items.length) {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % items.length;
      items.forEach((it, i) => it.classList.toggle('active', i === activeIndex));
    } else if (e.key === 'ArrowUp' && items.length) {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + items.length) % items.length;
      items.forEach((it, i) => it.classList.toggle('active', i === activeIndex));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && items[activeIndex]) {
        window.location.href = items[activeIndex].getAttribute('href');
      } else {
        goToResults();
      }
    } else if (e.key === 'Escape') {
      dropdown.classList.remove('open');
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    goToResults();
  });

  document.addEventListener('click', (e) => {
    if (!form.contains(e.target)) dropdown.classList.remove('open');
  });
});

const searchQueryFromUrl = new URLSearchParams(location.search).get('search');
if (searchQueryFromUrl) {
  document.querySelectorAll('form.search-bar input[type="text"]').forEach((el) => {
    el.value = searchQueryFromUrl;
  });
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
