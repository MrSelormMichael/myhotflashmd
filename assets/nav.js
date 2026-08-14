document.addEventListener('DOMContentLoaded', function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header + mobile nav ---------- */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');

  function closeMenu() {
    if (nav) nav.classList.remove('open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
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
    var duration = 6500;
    var current = 0;
    var timer = null;

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
        var img = slide.querySelector('.slide-bg img');
        if (img) {
          img.style.animation = 'none';
          void img.offsetWidth;
          img.style.animation = 'sliderZoom 12s ease-in-out infinite alternate';
        }
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

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); restartAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restartAutoplay(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); restartAutoplay(); });
    });

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

  /* ---------- Marquee infinite loop fix ---------- */
  var marquee = document.querySelector('[data-marquee]');
  if (marquee && !reduceMotion) {
    var inner = marquee.querySelector('.marquee-inner');
    var tracks = marquee.querySelectorAll('.marquee-track');
    
    // Ensure we have exactly 3 tracks for seamless infinite scroll
    if (tracks.length < 3) {
      var originalHTML = tracks[0].outerHTML;
      for (var i = tracks.length; i < 3; i++) {
        var clone = document.createElement('div');
        clone.className = 'marquee-track';
        clone.setAttribute('aria-hidden', 'true');
        clone.innerHTML = tracks[0].innerHTML;
        inner.appendChild(clone);
      }
    }
    
    // Reset animation on hover end to prevent stutter
    marquee.addEventListener('mouseleave', function() {
      var currentAnimation = inner.style.animation;
      inner.style.animation = 'none';
      void inner.offsetWidth;
      inner.style.animation = currentAnimation;
    });
  }
});