// ============================================
// NAV.JS v3.0 - Production Ready
// ============================================

document.addEventListener('DOMContentLoaded', function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- HEADER + MOBILE NAV ----
  function initHeader() {
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.main-nav');

    if (!header || !toggle || !nav) return;

    function closeMenu() {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('menu-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

    function onScroll() {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- HERO SLIDER ----
  function initSlider() {
    const slider = document.querySelector('[data-slider]');
    if (!slider) return;

    const slides = slider.querySelectorAll('[data-slide]');
    const dots = slider.querySelectorAll('[data-slider-dot]');
    const prevBtn = slider.querySelector('[data-slider-prev]');
    const nextBtn = slider.querySelector('[data-slider-next]');
    const progressBar = slider.querySelector('[data-slider-progress-bar]');
    
    if (slides.length === 0) return;

    const duration = reduceMotion ? 6000 : 3000;
    let current = 0;
    let timer = null;
    let isTransitioning = false;
    let touchStartX = 0;

    function goTo(index) {
      if (isTransitioning) return;
      isTransitioning = true;

      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      current = index;

      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === current);
      });

      if (progressBar && !reduceMotion) {
        progressBar.style.display = 'block';
        progressBar.classList.remove('running');
        void progressBar.offsetWidth;
        progressBar.style.setProperty('--slide-duration', duration + 'ms');
        progressBar.classList.add('running');
      } else if (progressBar) {
        progressBar.style.display = 'none';
      }

      setTimeout(() => {
        isTransitioning = false;
      }, 100);
    }

    function next() {
      if (!isTransitioning) goTo(current + 1);
    }

    function prev() {
      if (!isTransitioning) goTo(current - 1);
    }

    function startAutoplay() {
      if (document.hidden) return;
      stopAutoplay();
      timer = setInterval(next, duration);
    }

    function stopAutoplay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        next();
        restartAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prev();
        restartAutoplay();
      });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goTo(index);
        restartAutoplay();
      });
    });

    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      const delta = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(delta) > 40) {
        if (delta < 0) next();
        else prev();
        restartAutoplay();
      }
    }, { passive: true });

    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
        restartAutoplay();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
        restartAutoplay();
      }
    });

    if (!reduceMotion) {
      slider.addEventListener('mouseenter', stopAutoplay);
      slider.addEventListener('mouseleave', startAutoplay);
      slider.addEventListener('focusin', stopAutoplay);
      slider.addEventListener('focusout', startAutoplay);
    }

    goTo(0);
    setTimeout(startAutoplay, 500);

    // Pulse CTA on load
    const cta = document.querySelector('.cta-glass .btn');
    if (cta) {
      setTimeout(() => cta.classList.add('pulse'), 1500);
    }
  }

  // ---- SCROLL REVEAL ----
  function initReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length === 0) return;

    if ('IntersectionObserver' in window && !reduceMotion) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealEls.forEach(el => observer.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('in-view'));
    }
  }

  // ---- PARALLAX ----
  function initParallax() {
    const parallaxEl = document.querySelector('.story-visual');
    if (!parallaxEl || reduceMotion) return;

    window.addEventListener('scroll', () => {
      const rect = parallaxEl.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (vh - rect.top) / (vh + rect.height);
      const shift = Math.max(-1, Math.min(1, progress - 0.5)) * 24;
      parallaxEl.style.transform = 'translateY(' + shift + 'px)';
    }, { passive: true });
  }

  // ---- MARQUEE ----
  function initMarquee() {
    const marquee = document.querySelector('[data-marquee]');
    if (!marquee) return;

    const inner = marquee.querySelector('.marquee-inner');
    const track = marquee.querySelector('.marquee-track');
    if (!inner || !track) return;

    // If reduce motion, just show static marquee (no animation)
    if (reduceMotion) {
      inner.style.animation = 'none';
      inner.style.opacity = '1';
      inner.style.flexWrap = 'nowrap';
      inner.style.width = 'auto';
      return;
    }

    function setupMarquee() {
      const trackWidth = track.scrollWidth;
      if (trackWidth > 0) {
        inner.style.setProperty('--marquee-w', trackWidth + 'px');
        inner.style.width = (trackWidth * 2) + 'px';
        inner.classList.add('is-ready');
        inner.style.animation = 'marqueeScroll 25s linear infinite';
        inner.style.animationPlayState = 'running';
      } else {
        setTimeout(setupMarquee, 100);
      }
    }

    // Initial setup with delay to ensure DOM is painted
    setTimeout(setupMarquee, 100);

    // Also run after fonts load
    if (document.fonts) {
      document.fonts.ready.then(() => {
        setTimeout(setupMarquee, 50);
      });
    }

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setupMarquee, 200);
    });

    // Pause on hover
    marquee.addEventListener('mouseenter', () => {
      inner.style.animationPlayState = 'paused';
    });

    marquee.addEventListener('mouseleave', () => {
      inner.style.animationPlayState = 'running';
    });
  }

  // Initialize everything
  initHeader();
  initSlider();
  initReveal();
  initParallax();
  initMarquee();
});