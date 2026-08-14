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

  /* ---------- Hero slider - FIXED FOR ALL DEVICES ---------- */
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
    var isTransitioning = false;

    function renderProgress() {
      if (!progressBar) return;
      if (reduceMotion) {
        progressBar.style.display = 'none';
        return;
      }
      progressBar.style.display = 'block';
      progressBar.classList.remove('running');
      void progressBar.offsetWidth;
      progressBar.style.setProperty('--slide-duration', duration + 'ms');
      progressBar.classList.add('running');
    }

    function goTo(index) {
      if (isTransitioning) return;
      isTransitioning = true;
      
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
      
      renderProgress();
      
      setTimeout(function() {
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

    // Pause when tab isn't visible
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });

    // Button controls
    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.preventDefault();
        next();
        restartAutoplay();
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        prev();
        restartAutoplay();
      });
    }

    // Dot controls
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goTo(i);
        restartAutoplay();
      });
    });

    // Swipe support on all touch devices
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

    // Keyboard support for accessibility
    slider.addEventListener('keydown', function (e) {
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

    // Hover pause
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    slider.addEventListener('focusin', stopAutoplay);
    slider.addEventListener('focusout', startAutoplay);

    // Initialize
    goTo(0);
    
    // Start autoplay after a brief delay to ensure everything is ready
    setTimeout(function() {
      startAutoplay();
    }, 300);
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

  /* ---------- Marquee infinite loop - FIXED FOR ALL DEVICES ---------- */
  var marquee = document.querySelector('[data-marquee]');
  if (marquee) {
    var inner = marquee.querySelector('.marquee-inner');
    var track = marquee.querySelector('.marquee-track');
    
    // If reduce motion, just show static
    if (reduceMotion) {
      if (inner) {
        inner.style.animation = 'none';
        inner.style.opacity = '1';
      }
      return;
    }

    function setLoop() {
      if (!track || !inner) return;
      var w = track.scrollWidth;
      if (w > 0) {
        inner.style.setProperty('--marquee-w', w + 'px');
        inner.classList.add('is-ready');
        // Ensure animation is running
        inner.style.animation = 'marqueeScroll 25s linear infinite';
      }
    }

    // Set initial width with a small delay to ensure rendering
    setTimeout(setLoop, 100);

    // Use ResizeObserver to handle font loading / content changes
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(function () {
        setLoop();
      });
      ro.observe(track);
    }

    // Also recalc on window resize
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setLoop, 200);
    });

    // Also recalc on font loading
    if (document.fonts) {
      document.fonts.ready.then(function() {
        setLoop();
      });
    }

    // Reset animation on hover end to prevent stutter
    marquee.addEventListener('mouseleave', function () {
      if (!inner) return;
      var currentAnimation = inner.style.animation;
      inner.style.animation = 'none';
      void inner.offsetWidth;
      inner.style.animation = currentAnimation;
    });
  }
});