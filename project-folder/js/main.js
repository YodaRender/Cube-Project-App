/* Mobile menu */
(() => {
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;

  const closeButtons = menu.querySelectorAll('[data-menu-close]');

  function openMenu() {
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    if (expanded) closeMenu();
    else openMenu();
  });

  closeButtons.forEach((btn) => btn.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) closeMenu();
  });
})();

/* Gallery */
(() => {
  const stageImg = document.querySelector('.gallery__main');
  const prevBtn = document.querySelector('.gallery__arrow--prev');
  const nextBtn = document.querySelector('.gallery__arrow--next');
  const dotsWrap = document.querySelector('.gallery__dots');
  const thumbButtons = Array.from(document.querySelectorAll('[data-gallery-thumb]'));

  if (!stageImg || !prevBtn || !nextBtn || !dotsWrap || thumbButtons.length === 0) return;

  const images = [
    { src: './assets/product-gallery-main.png', alt: 'Perfume bottle on stand' },
    { src: './assets/thumb-1.jpg', alt: 'Gallery image 2' },
    { src: './assets/thumb-2.jpg', alt: 'Gallery image 3' },
    { src: './assets/thumb-3.jpg', alt: 'Gallery image 4' },
  ];

  let index = 0;

  function renderDots() {
    dotsWrap.innerHTML = '';
    images.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `dot${i === index ? ' is-active' : ''}`;
      b.setAttribute('aria-label', `Go to image ${i + 1}`);
      b.addEventListener('click', () => setIndex(i));
      dotsWrap.appendChild(b);
    });
  }

  function updateThumbs() {
    thumbButtons.forEach((btn) => {
      const i = Number(btn.getAttribute('data-gallery-thumb'));
      btn.classList.toggle('is-active', i === index);
    });
  }

  function setIndex(next) {
    index = (next + images.length) % images.length;
    const img = images[index];
    stageImg.src = img.src;
    stageImg.alt = img.alt;
    renderDots();
    updateThumbs();
  }

  prevBtn.addEventListener('click', () => setIndex(index - 1));
  nextBtn.addEventListener('click', () => setIndex(index + 1));
  thumbButtons.forEach((btn) => btn.addEventListener('click', () => setIndex(Number(btn.dataset.galleryThumb))));

  renderDots();
  updateThumbs();
})();

/* Navbar search popover */
(() => {
  const root = document.querySelector('[data-nav-search]');
  if (!root) return;
  const btn = root.querySelector('[data-nav-search-btn]');
  const pop = root.querySelector('.nav-search__popover');
  const input = root.querySelector('input');
  if (!btn || !pop || !input) return;

  function open() {
    pop.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    input.focus();
  }

  function close() {
    pop.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (pop.hidden) open();
    else close();
  });

  document.addEventListener('click', (e) => {
    if (!root.contains(e.target)) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();

/* Bundle radios -> Add to Cart link + expandable subscription panels */
(() => {
  const form = document.getElementById('bundleForm');
  const addToCart = document.getElementById('addToCart');
  if (!form || !addToCart) return;

  const fragranceCards = Array.from(document.querySelectorAll('[data-fragrance-card]'));
  const purchaseCards = Array.from(document.querySelectorAll('.purchase-card'));
  const includedCards = Array.from(document.querySelectorAll('.included-card'));

  function getSelected(name) {
    const el = form.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : '';
  }

  function updateLink() {
    const fragrance = getSelected('fragrance');
    const purchase = getSelected('purchaseType');
    const subscription = getSelected('subscription');

    const href = `https://example.com/cart?fragrance=${encodeURIComponent(fragrance)}&purchase=${encodeURIComponent(purchase)}&subscription=${encodeURIComponent(subscription)}`;
    addToCart.href = href;
  }

  function updateCardStates() {
    fragranceCards.forEach((card) => {
      const input = card.querySelector('input[type="radio"]');
      card.classList.toggle('opt-card--active', Boolean(input && input.checked));
    });
    purchaseCards.forEach((card) => {
      const input = card.querySelector('input[type="radio"]');
      card.classList.toggle('purchase-card--active', Boolean(input && input.checked));
    });
    includedCards.forEach((card) => {
      const input = card.querySelector('input[type="radio"]');
      card.classList.toggle('included-card--active', Boolean(input && input.checked));
    });
  }

  function updateSubscriptionDetails() {
    const sub = getSelected('subscription'); // 'single' | 'double'
    const single = document.querySelector('[data-subscription-details="single"]');
    const double = document.querySelector('[data-subscription-details="double"]');
    if (!single || !double) return;

    const singleOpen = sub === 'single';
    single.classList.toggle('bundle__details--collapsed', !singleOpen);
    double.classList.toggle('bundle__details--collapsed', singleOpen);
  }

  form.addEventListener('change', () => {
    updateCardStates();
    updateSubscriptionDetails();
    updateLink();
  });

  updateCardStates();
  updateSubscriptionDetails();
  updateLink();
})();

/* Accordion */
(() => {
  const root = document.querySelector('[data-accordion]');
  if (!root) return;

  root.addEventListener('click', (e) => {
    const btn = e.target.closest('.acc-btn');
    if (!btn) return;

    const item = btn.closest('.acc-item');
    const panel = item ? item.querySelector('.acc-panel') : null;
    const icon = btn.querySelector('.acc-icon');
    if (!item || !panel || !icon) return;

    const isOpen = item.classList.contains('is-open');

    root.querySelectorAll('.acc-item').forEach((it) => {
      it.classList.remove('is-open');
      const b = it.querySelector('.acc-btn');
      const p = it.querySelector('.acc-panel');
      const i = it.querySelector('.acc-icon');
      if (b) b.setAttribute('aria-expanded', 'false');
      if (p) p.hidden = true;
      if (i) i.src = './assets/icon-plus.svg';
    });

    if (!isOpen) {
      item.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      panel.hidden = false;
      icon.src = './assets/icon-minus.svg';
    }
  });
})();

/* Count up on view */
(() => {
  const section = document.getElementById('statsSection');
  if (!section) return;

  const values = Array.from(section.querySelectorAll('[data-countup]'));
  if (values.length === 0) return;

  let played = false;

  function animate() {
    if (played) return;
    played = true;

    const duration = 900;
    const start = performance.now();
    const targets = values.map((el) => Number(el.getAttribute('data-countup') || '0'));

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      values.forEach((el, i) => {
        const v = Math.round(targets[i] * eased);
        el.textContent = `${v}%`;
      });
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((en) => en.isIntersecting)) animate();
    },
    { threshold: 0.25 }
  );

  io.observe(section);
})();

