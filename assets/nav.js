document.addEventListener('DOMContentLoaded', function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header + mobile nav ---------- */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');

  function closeMenu() {
    if (nav) nav.classList.remove('open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        document.body.classList.add('menu-open');
        document.body.style.overflow = 'hidden';
      } else {
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
      }
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Hero slider ---------- */
  var slider = document.querySelector('[data-slider]');
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-slider-dot]'));
    var prevBtn = slider.querySelector('[data-slider-prev]');
    var nextBtn = slider.querySelector('[data-slider-next]');
    var progressBar = slider.querySelector('[data-slider-progress-bar]');
    var duration = 2000;
    var current = 0;
    var timer = null;
    var touchX = 0;

    function renderProgress() {
      if (!progressBar || reduceMotion) return;
      progressBar.classList.remove('running');
      void progressBar.offsetWidth;
      progressBar.style.setProperty('--slide-duration', duration + 'ms');
      progressBar.classList.add('running');
    }

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
      renderProgress();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAutoplay() {
      if (reduceMotion) return;
      if (document.hidden) return;
      stopAutoplay();
      timer = setInterval(next, duration);
    }
    function stopAutoplay() {
      if (timer) clearInterval(timer);
      timer = null;
    }
    function restartAutoplay() {
      startAutoplay();
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); restartAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restartAutoplay(); });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); restartAutoplay(); });
    });

    slider.addEventListener('touchstart', function (e) {
      touchX = e.touches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', function (e) {
      var delta = e.changedTouches[0].clientX - touchX;
      if (Math.abs(delta) > 40) {
        if (delta < 0) {
          next();
        } else {
          prev();
        }
        restartAutoplay();
      }
    }, { passive: true });

    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    slider.addEventListener('focusin', stopAutoplay);
    slider.addEventListener('focusout', startAutoplay);

    goTo(0);
    startAutoplay();
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (revealEls.length) {
    if ('IntersectionObserver' in window && !reduceMotion) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealEls.forEach(function (el) { observer.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('in-view'); });
    }
  }

  /* ---------- Subtle parallax on the story visual ---------- */
  var parallaxEl = document.querySelector('.story-visual');
  if (parallaxEl && !reduceMotion) {
    window.addEventListener('scroll', function () {
      var rect = parallaxEl.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var progress = (vh - rect.top) / (vh + rect.height);
      var shift = Math.max(-1, Math.min(1, progress - 0.5)) * 24;
      parallaxEl.style.transform = 'translateY(' + shift + 'px)';
    }, { passive: true });
  }

  /* ---------- Marquee infinite loop - pixel exact ---------- */
  var marquee = document.querySelector('[data-marquee]');
  if (marquee && !reduceMotion) {
    var inner = marquee.querySelector('.marquee-inner');
    var track = marquee.querySelector('.marquee-track');

    function setLoop() {
      if (!track) return;
      var w = track.scrollWidth;
      inner.style.setProperty('--marquee-w', w + 'px');
      inner.classList.add('is-ready');
    }

    setLoop();

    if (window.ResizeObserver) {
      var ro = new ResizeObserver(function () {
        setLoop();
      });
      ro.observe(track);
    }

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setLoop, 200);
    });

    marquee.addEventListener('mouseleave', function () {
      var currentAnimation = inner.style.animation;
      inner.style.animation = 'none';
      void inner.offsetWidth;
      inner.style.animation = currentAnimation;
    });
  }
});
