(() => {
  'use strict';
  const data = window.SITE_DATA || { publications: [], journey: [], gallery: [] };
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const esc = (text) => String(text ?? '').replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const safeUrl = (url) => /^(https:\/\/|mailto:|assets\/)/i.test(url || '') ? url : '#';

  // Header and color scheme.
  const header = $('#site-header');
  const progress = $('#page-progress');
  const onScroll = () => {
    header.classList.toggle('scrolled', scrollY > 24);
    const limit = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, scrollY / limit))})`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  $('#theme-toggle').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('jl-theme', next); } catch(e) { /* private mode */ }
    document.querySelector('meta[name="theme-color"]').content = next === 'dark' ? '#111b1a' : '#f6f7f5';
  });

  // Mobile menu.
  const menuButton = $('#menu-toggle');
  const mainNav = $('#main-nav');
  const closeMenu = () => { mainNav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open menu'); };
  menuButton.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  $$('.main-nav a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => { if (!header.contains(e.target)) closeMenu(); });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
    }, { threshold: .07, rootMargin: '0px 0px 30px 0px' });
    $$('.reveal').forEach(el => observer.observe(el));
    const sections = $$('main section[id]');
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) $$('.main-nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-25% 0px -55% 0px' });
    sections.forEach(section => navObserver.observe(section));
  } else { $$('.reveal').forEach(el => el.classList.add('visible')); }

  // Publications: editable data, search, and filtering.
  const pubList = $('#publication-list');
  const pubCount = $('#publication-count');
  let pubFilter = 'all';
  let pubQuery = '';
  const highlightAuthor = str => esc(str).replace(/Jianzhi Leng/gi, '<strong>Jianzhi Leng</strong>');
  const drawPublications = () => {
    const items = (data.publications || []).filter(p => {
      const matchesType = pubFilter === 'all' || p.type === pubFilter;
      const text = `${p.title} ${p.authors} ${p.venue} ${(p.keywords || []).join(' ')}`.toLowerCase();
      return matchesType && text.includes(pubQuery);
    });
    pubList.innerHTML = items.length ? items.map(p => `
      <article class="publication">
        <div class="pub-meta"><span class="pub-year">${esc(p.year)}</span><span class="pub-type">${p.type === 'journal' ? 'JOURNAL' : 'PREPRINT'}</span></div>
        <div class="pub-info"><h3 class="pub-title">${esc(p.title)}</h3><p class="pub-authors">${highlightAuthor(p.authors)}</p><p class="pub-venue">${esc(p.venue)}</p><p class="pub-description">${esc(p.description)}</p><div class="pub-keywords">${(p.keywords || []).map(k => `<span>${esc(k)}</span>`).join('')}</div></div>
        <div class="pub-links">${(p.links || []).map(l => `<a class="pub-link" href="${esc(safeUrl(l.url))}" target="_blank" rel="noopener noreferrer">${esc(l.label)} <span aria-hidden="true">↗</span></a>`).join('')}</div>
      </article>`).join('') : '<div class="empty-state">No papers match this search. Try another keyword or category.</div>';
    pubCount.textContent = `${items.length} of ${(data.publications || []).length} works shown`;
  };
  $$('#publication-filters .filter').forEach(button => button.addEventListener('click', () => {
    pubFilter = button.dataset.filter;
    $$('#publication-filters .filter').forEach(b => { const active = b === button; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
    drawPublications();
  }));
  $('#publication-search').addEventListener('input', e => { pubQuery = e.target.value.trim().toLowerCase(); drawPublications(); });
  drawPublications();

  // Journey timeline.
  $('#journey-timeline').innerHTML = (data.journey || []).map(item => `
    <article class="timeline-item reveal"><div class="timeline-year">${esc(item.year)}</div><div class="timeline-place">${esc(item.place)}</div><h3 class="timeline-title">${esc(item.title)}</h3><p class="timeline-detail">${esc(item.detail)}</p><span class="timeline-marker">${esc(item.marker)}</span></article>`).join('');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); } }), {threshold:.06});
    $$('.timeline-item.reveal').forEach(el => obs.observe(el));
  } else { $$('.timeline-item.reveal').forEach(el => el.classList.add('visible')); }

  // Photo wall and accessible dialog lightbox.
  const galleryGrid = $('#gallery-grid');
  const galleryCount = $('#gallery-count');
  const dialog = $('#lightbox');
  const photos = data.gallery || [];
  let galleryFilter = 'all';
  let visiblePhotos = photos.slice();
  let currentPhoto = 0;
  const updateLightbox = () => {
    const item = visiblePhotos[currentPhoto];
    if (!item) return;
    $('#lightbox-image').src = safeUrl(item.src);
    $('#lightbox-image').alt = item.alt || item.title;
    $('#lightbox-title').textContent = item.title;
    $('#lightbox-subtitle').textContent = item.subtitle;
    $('#lightbox-position').textContent = `${String(currentPhoto + 1).padStart(2, '0')} / ${String(visiblePhotos.length).padStart(2, '0')}`;
  };
  const openLightbox = (index) => {
    if (!dialog.showModal) return;
    currentPhoto = index;
    updateLightbox();
    dialog.showModal();
  };
  const movePhoto = delta => { currentPhoto = (currentPhoto + delta + visiblePhotos.length) % visiblePhotos.length; updateLightbox(); };
  const drawGallery = () => {
    visiblePhotos = photos.filter(photo => galleryFilter === 'all' || photo.category === galleryFilter);
    galleryCount.textContent = `${String(visiblePhotos.length).padStart(2,'0')} MOMENTS`;
    galleryGrid.innerHTML = visiblePhotos.map((p,index) => `
      <button type="button" class="gallery-item" data-index="${index}" aria-label="Open photo: ${esc(p.title)}">
        <img loading="lazy" decoding="async" src="${esc(safeUrl(p.src))}" alt="${esc(p.alt || p.title)}">
        <span class="gallery-overlay"><span><strong>${esc(p.title)}</strong><small>${esc(p.subtitle)}</small></span><span class="gallery-plus" aria-hidden="true">+</span></span>
      </button>`).join('');
    $$('.gallery-item', galleryGrid).forEach(b => b.addEventListener('click', () => openLightbox(Number(b.dataset.index))));
  };
  $$('#gallery-filters .filter').forEach(button => button.addEventListener('click', () => {
    galleryFilter = button.dataset.filter;
    $$('#gallery-filters .filter').forEach(b => { const active = b === button; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
    drawGallery();
  }));
  $('#lightbox-prev').addEventListener('click', () => movePhoto(-1));
  $('#lightbox-next').addEventListener('click', () => movePhoto(1));
  $('#lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  document.addEventListener('keydown', e => { if (!dialog.open) return; if (e.key === 'ArrowRight') movePhoto(1); if (e.key === 'ArrowLeft') movePhoto(-1); });
  drawGallery();

  // Connect without inventing an email address. If an email is provided in data.js, activate mailto + copy.
  if (data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    const primary = $('#contact-primary');
    primary.href = `mailto:${data.email}`;
    primary.removeAttribute('target');
    primary.textContent = 'Send me an email ↗';
    const copy = $('#copy-email');
    copy.classList.remove('hidden');
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(data.email); copy.textContent = 'Email copied ✓'; setTimeout(() => copy.textContent = 'Copy email ⧉', 1800); }
      catch(e) { window.location.href = `mailto:${data.email}`; }
    });
  }
  $('#year').textContent = new Date().getFullYear();
})();
