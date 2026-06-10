/**
 * ZIAUL HASAN — SENIOR SECRETARY (RETIRED)
 * Executive Portfolio Website — script.js
 * Government of Bangladesh
 *
 * Features:
 *  - Dark / Light Mode Toggle (localStorage persistent)
 *  - Sticky Navbar with active-link highlighting
 *  - Scroll Progress Indicator
 *  - Scroll Reveal Animations (IntersectionObserver)
 *  - Animated Counters
 *  - Typing Effect (Hero Name)
 *  - Hero Particle Canvas
 *  - Gallery Masonry Filter + Lightbox
 *  - Publications Tab Switcher
 *  - Testimonial Auto-Slider with dots
 *  - Contact Form Validation (front-end)
 *  - Back-to-Top Button
 *  - Mobile Hamburger Menu
 *  - Footer Year
 */

/* ============================================================
   UTILITY HELPERS
   ============================================================ */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

/* ============================================================
   1. THEME TOGGLE (Dark / Light Mode)
   ============================================================ */
(function initTheme() {
  const html   = document.documentElement;
  const btn    = $('#theme-toggle');
  const stored = localStorage.getItem('zh-theme');
  const prefer = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const theme  = stored || prefer;

  html.setAttribute('data-theme', theme);

  on(btn, 'click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('zh-theme', next);
  });
})();

/* ============================================================
   2. SCROLL PROGRESS INDICATOR
   ============================================================ */
(function initScrollProgress() {
  const bar = $('#scroll-progress');
  on(window, 'scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.body.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? `${(scrolled / total) * 100}%` : '0%';
  }, { passive: true });
})();

/* ============================================================
   3. STICKY NAVBAR + ACTIVE LINK HIGHLIGHT
   ============================================================ */
(function initNavbar() {
  const navbar    = $('#navbar');
  const navLinks  = $$('.nav-link');
  const sections  = $$('section[id]');
  const hamburger = $('#hamburger');
  const navLinksWrap = $('#nav-links');

  // Sticky behaviour
  on(window, 'scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
  }, { passive: true });

  // Active link based on scroll position
  function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(a => {
      const href = a.getAttribute('href').replace('#', '');
      a.classList.toggle('active', href === current);
    });
  }

  // Hamburger toggle
  on(hamburger, 'click', () => {
    const open = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    navLinksWrap.classList.toggle('open', open);
  });

  // Close mobile menu on link click
  navLinks.forEach(a => {
    on(a, 'click', () => {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      navLinksWrap.classList.remove('open');
    });
  });

  // Close menu on outside click
  on(document, 'click', e => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      navLinksWrap.classList.remove('open');
    }
  });
})();

/* ============================================================
   4. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
   ============================================================ */
(function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  $$('.reveal').forEach(el => observer.observe(el));
})();

/* ============================================================
   5. ANIMATED COUNTERS
   ============================================================ */
(function initCounters() {
  function animateCount(el) {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  $$('[data-count]').forEach(el => obs.observe(el));
})();

/* ============================================================
   6. TYPING EFFECT (Hero Name)
   ============================================================ */
(function initTypingEffect() {
  const el = $('#typing-name');
  if (!el) return;

  const text    = el.textContent.trim();
  const delay   = 900; // ms before typing starts
  const speed   = 80;  // ms per character

  el.textContent = '';
  el.style.borderRight = '3px solid #D4AF37';
  el.style.paddingRight = '4px';

  let i = 0;
  setTimeout(() => {
    const interval = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        // Remove cursor after 2s
        setTimeout(() => { el.style.borderRight = 'none'; el.style.paddingRight = '0'; }, 2000);
      }
    }, speed);
  }, delay);
})();

/* ============================================================
   7. HERO PARTICLES (Canvas)
   ============================================================ */
(function initParticles() {
  const container = $('#hero-particles');
  if (!container) return;

  const canvas  = document.createElement('canvas');
  const ctx     = canvas.getContext('2d');
  container.appendChild(canvas);

  let W, H, particles = [];
  const PARTICLE_COUNT = 55;
  const gold = [212, 175, 55];

  function resize() {
    W = canvas.width  = container.offsetWidth;
    H = canvas.height = container.offsetHeight;
  }

  function createParticle() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.8 + 0.4,
      vx:    (Math.random() - 0.5) * 0.35,
      vy:    (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.1,
      pulse: Math.random() * Math.PI * 2,
    };
  }

  resize();
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());

  on(window, 'resize', resize, { passive: true });

  let lastTime = 0;
  function draw(ts) {
    const dt = Math.min(ts - lastTime, 50);
    lastTime = ts;

    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.x     += p.vx * (dt / 16);
      p.y     += p.vy * (dt / 16);
      p.pulse += 0.02;

      // Wrap at edges
      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;
      if (p.y < -5) p.y = H + 5;
      if (p.y > H + 5) p.y = -5;

      const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${gold[0]},${gold[1]},${gold[2]},${a})`;
      ctx.fill();
    });

    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          const a = (1 - dist / 90) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${gold[0]},${gold[1]},${gold[2]},${a})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  // Pause when tab is hidden
  on(document, 'visibilitychange', () => {
    if (!document.hidden) { lastTime = performance.now(); requestAnimationFrame(draw); }
  });
})();

/* ============================================================
   8. PUBLICATIONS TAB SWITCHER
   ============================================================ */
(function initPubTabs() {
  const tabs   = $$('.pub-tab');
  const panels = $$('.pub-tab-panel');

  tabs.forEach(tab => {
    on(tab, 'click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = $(`[data-panel="${target}"]`);
      if (panel) panel.classList.add('active');
    });
  });
})();

/* ============================================================
   9. GALLERY FILTER + LIGHTBOX
   ============================================================ */
(function initGallery() {
  // ── Filter ──
  const filterBtns = $$('.gal-btn');
  const galleryItems = $$('.gallery-item');

  filterBtns.forEach(btn => {
    on(btn, 'click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      galleryItems.forEach(item => {
        const cat = item.dataset.category;
        const show = filter === 'all' || cat === filter;
        item.classList.toggle('hidden', !show);
      });
    });
  });

  // ── Lightbox ──
  const lightbox = $('#lightbox');
  const lbImg    = $('#lb-img');
  const lbCap    = $('#lb-caption');
  const lbClose  = $('#lb-close');
  const lbPrev   = $('#lb-prev');
  const lbNext   = $('#lb-next');

  let currentIndex = 0;
  let visibleItems = [];

  function openLightbox(item, items) {
    visibleItems = items;
    currentIndex = visibleItems.indexOf(item);
    showSlide(currentIndex);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function showSlide(index) {
    const item  = visibleItems[index];
    const title = item.dataset.title || 'Photo';

    // Use the placeholder element as the lightbox display
    lbImg.innerHTML = `<div style="width:100%;min-height:300px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1rem;padding:2rem;background:var(--clr-surface);border-radius:var(--radius-lg);">
      <div style="font-size:4rem;">${item.querySelector('.gal-label').textContent.split(' ')[0]}</div>
      <p style="font-size:0.9rem;color:var(--clr-text-muted);text-align:center;line-height:1.5;max-width:400px;">${title}</p>
      <p style="font-size:0.72rem;color:var(--clr-text-light);text-transform:uppercase;letter-spacing:0.1em;">Replace with actual photograph</p>
    </div>`;
    lbCap.textContent = title;
    currentIndex = index;
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  galleryItems.forEach(item => {
    on(item, 'click', () => {
      const visible = galleryItems.filter(i => !i.classList.contains('hidden'));
      openLightbox(item, visible);
    });
  });

  on(lbClose, 'click', closeLightbox);
  on(lbPrev, 'click', () => {
    const prev = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    showSlide(prev);
  });
  on(lbNext, 'click', () => {
    const next = (currentIndex + 1) % visibleItems.length;
    showSlide(next);
  });

  // Close on overlay click
  on(lightbox, 'click', e => { if (e.target === lightbox) closeLightbox(); });

  // Keyboard nav
  on(document, 'keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape')   closeLightbox();
    if (e.key === 'ArrowLeft')  lbPrev.click();
    if (e.key === 'ArrowRight') lbNext.click();
  });
})();

/* ============================================================
   10. TESTIMONIAL CAROUSEL
   ============================================================ */
(function initTestimonials() {
  const track   = $('#testimonial-track');
  const dotsWrap = $('#tl-dots');
  const prevBtn  = $('#tl-prev');
  const nextBtn  = $('#tl-next');

  if (!track) return;

  const slides = $$('.testimonial-slide', track);
  const total  = slides.length;
  let current  = 0;
  let autoplay;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'tl-dot-btn' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    on(dot, 'click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    $$('.tl-dot-btn', dotsWrap).forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAutoplay() {
    autoplay = setInterval(() => goTo(current + 1), 5500);
  }
  function stopAutoplay() { clearInterval(autoplay); }

  on(prevBtn, 'click', () => { stopAutoplay(); goTo(current - 1); startAutoplay(); });
  on(nextBtn, 'click', () => { stopAutoplay(); goTo(current + 1); startAutoplay(); });

  // Touch/swipe support
  let touchStartX = 0;
  on(track, 'touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  on(track, 'touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 40) {
      stopAutoplay();
      goTo(diff > 0 ? current + 1 : current - 1);
      startAutoplay();
    }
  }, { passive: true });

  startAutoplay();
})();

/* ============================================================
   11. CONTACT FORM (Front-End Validation)
   ============================================================ */
(function initContactForm() {
  const form   = $('#contact-form');
  const status = $('#form-status');
  if (!form) return;

  function showStatus(msg, type) {
    status.textContent = msg;
    status.className   = `form-status ${type}`;
    status.style.display = 'block';
    setTimeout(() => { status.style.display = 'none'; }, 6000);
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  on(form, 'submit', e => {
    e.preventDefault();

    const name    = $('#cf-name').value.trim();
    const email   = $('#cf-email').value.trim();
    const subject = $('#cf-subject').value.trim();
    const message = $('#cf-message').value.trim();

    if (!name)                   return showStatus('Please enter your full name.', 'error');
    if (!email)                  return showStatus('Please enter your email address.', 'error');
    if (!validateEmail(email))   return showStatus('Please enter a valid email address.', 'error');
    if (!subject)                return showStatus('Please enter a subject.', 'error');
    if (!message || message.length < 10) return showStatus('Please enter a message (at least 10 characters).', 'error');

    // Simulate form submission (replace with actual backend/EmailJS integration)
    const submitBtn = form.querySelector('.form-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span style="display:inline-block;animation:spin 0.6s linear infinite;">⟳</span> Sending…`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message`;
      form.reset();
      showStatus('✓ Thank you! Your message has been received. A reply will follow shortly.', 'success');
    }, 1600);
  });
})();

/* Spin animation for submit button */
const spinStyle = document.createElement('style');
spinStyle.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(spinStyle);

/* ============================================================
   12. BACK TO TOP BUTTON
   ============================================================ */
(function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;

  on(window, 'scroll', () => {
    if (window.scrollY > 400) {
      btn.hidden = false;
    } else {
      btn.hidden = true;
    }
  }, { passive: true });

  on(btn, 'click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   13. FOOTER YEAR
   ============================================================ */
(function initFooterYear() {
  const el = $('#footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ============================================================
   14. SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */
(function initSmoothScroll() {
  on(document, 'click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();

/* ============================================================
   15. ACCESSIBILITY: ESC closes mobile menu
   ============================================================ */
on(document, 'keydown', e => {
  if (e.key === 'Escape') {
    const hamburger = $('#hamburger');
    const navLinks  = $('#nav-links');
    if (navLinks && navLinks.classList.contains('open')) {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      navLinks.classList.remove('open');
      hamburger.focus();
    }
  }
});

/* ============================================================
   16. PERFORMANCE: Defer non-critical tasks after load
   ============================================================ */
window.addEventListener('load', () => {
  // Add loaded class for any CSS post-load transitions
  document.body.classList.add('loaded');

  // Lazy-load Google Fonts if not already loaded
  const links = document.querySelectorAll('link[rel="stylesheet"][href*="fonts.googleapis"]');
  links.forEach(link => { link.media = 'all'; });
});
