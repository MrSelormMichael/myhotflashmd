// ============================================
// NAV.JS v2.1 - With Loaded Flag
// ============================================

// CRITICAL: Set this flag immediately so the HTML knows the script loaded
window.__navJsLoaded = true;
window.__navJsVersion = 'v2.1';

console.log('%c ✅ nav.js v2.1 LOADED SUCCESSFULLY ', 'background:#2ecc71;color:#fff;padding:8px 16px;border-radius:4px;font-weight:bold;font-size:14px;');

// Check for duplicate execution
window.__navJsRuns = (window.__navJsRuns || 0) + 1;
console.log('📊 nav.js execution count:', window.__navJsRuns);

if (window.__navJsRuns > 1) {
  console.warn('⚠️ DUPLICATE nav.js INCLUDE detected! Check your HTML.');
}

// ============================================
// safeInit - wraps each feature so one failure
// doesn't kill the rest
// ============================================
function safeInit(label, fn) {
  try {
    fn();
    console.log('✅ [nav.js] ' + label + ' initialized successfully');
  } catch (err) {
    console.error('❌ [nav.js] ' + label + ' failed:', err);
  }
}

// ============================================
// MAIN - DOM CONTENT LOADED
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  console.log('🔥 DOMContentLoaded fired');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  console.log('🎯 reduceMotion:', reduceMotion);

  // ---- HEADER + MOBILE NAV ----
  safeInit('header/nav', function () {
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.main-nav');

    console.log('📌 header:', header);
    console.log('📌 toggle:', toggle);
    console.log('📌 nav:', nav);

    function closeMenu() {
      if (nav) nav.classList.remove('open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
    }

    if (toggle && nav) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
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
  });

  // ---- HERO SLIDER ----
  safeInit('hero slider', function () {
    var slider = document.querySelector('[data-slider]');
    console.log('🎠 slider element found:', slider);

    if (!slider) {
      console.warn('⚠️ No slider found - skipping');
      return;
    }

    var slides = slider.querySelectorAll('[data-slide]');
    var dots = slider.querySelectorAll('[data-slider-dot]');
    var prevBtn = slider.querySelector('[data-slider-prev]');
    var nextBtn = slider.querySelector('[data-slider-next]');
    var progressBar = slider.querySelector('[data-slider-progress-bar]');

    console.log('📊 slides:', slides.length);
    console.log('📊 dots:', dots.length);
    console.log('📊 prevBtn:', prevBtn);
    console.log('📊 nextBtn:', nextBtn);
    console.log('📊 progressBar:', progressBar);

    if (slides.length === 0) {
      console.warn('⚠️ No slides found - skipping slider');
      return;
    }

    var duration = 2000;
    var current = 0;
    var timer = null;
    var isTransitioning = false;
    var touchStartX = 0;

    function goTo(index) {
      console.log('🔄 goTo called with index:', index);
      if (isTransitioning) {
        console.log('⏳ isTransitioning true - skipping');
        return;
      }
      isTransitioning = true;

      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      current = index;

      for (var i = 0; i < slides.length; i++) {
        slides[i].classList.toggle('is-active', i === current);
      }
      for (var i = 0; i < dots.length; i++) {
        dots[i].classList.toggle('is-active', i === current);
      }

      if (progressBar) {
        if (!reduceMotion) {
          progressBar.style.display = 'block';
          progressBar.classList.remove('running');
          void progressBar.offsetWidth;
          progressBar.style.setProperty('--slide-duration', duration + 'ms');
          progressBar.classList.add('running');
        } else {
          progressBar.style.display = 'none';
        }
      }

      setTimeout(function () {
        isTransitioning = false;
        console.log('✅ isTransitioning reset to false');
      }, 100);
    }

    function next() {
      console.log('▶️ next() called');
      if (!isTransitioning) goTo(current + 1);
    }

    function prev() {
      console.log('◀️ prev() called');
      if (!isTransitioning) goTo(current - 1);
    }

    function startAutoplay() {
      console.log('▶️ startAutoplay called');
      if (reduceMotion) {
        console.log('⏸️ reduceMotion true - skipping autoplay');
        return;
      }
      if (document.hidden) {
        console.log('⏸️ document hidden - skipping autoplay');
        return;
      }
      stopAutoplay();
      console.log('⏱️ setting interval with duration:', duration, 'ms');
      timer = setInterval(function() {
        console.log('⏰ [INTERVAL TICK] calling next()');
        next();
      }, duration);
      console.log('✅ Autoplay started, timer ID:', timer);
    }

    function stopAutoplay() {
      if (timer) {
        console.log('⏹️ clearing interval ID:', timer);
        clearInterval(timer);
        timer = null;
      }
    }

    function restartAutoplay() {
      console.log('🔄 restartAutoplay called');
      stopAutoplay();
      startAutoplay();
    }

    // Visibility change
    document.addEventListener('visibilitychange', function () {
      console.log('👁️ visibilitychange:', document.hidden ? 'hidden' : 'visible');
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });

    // Next button
    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.preventDefault();
        console.log('👆 Next button clicked');
        next();
        restartAutoplay();
      });
      console.log('✅ Next button listener attached');
    }

    // Prev button
    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        console.log('👆 Prev button clicked');
        prev();
        restartAutoplay();
      });
      console.log('✅ Prev button listener attached');
    }

    // Dots
    for (var i = 0; i < dots.length; i++) {
      (function (index) {
        dots[index].addEventListener('click', function () {
          console.log('👆 Dot ' + index + ' clicked');
          goTo(index);
          restartAutoplay();
        });
      })(i);
    }
    console.log('✅ Dot listeners attached:', dots.length);

    // Touch / Swipe
    slider.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', function (e) {
      var delta = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(delta) > 40) {
        console.log('👆 Swipe detected, delta:', delta);
        if (delta < 0) {
          next();
        } else {
          prev();
        }
        restartAutoplay();
      }
    }, { passive: true });

    // Keyboard
    slider.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        console.log('⌨️ Keyboard ArrowRight');
        next();
        restartAutoplay();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        console.log('⌨️ Keyboard ArrowLeft');
        prev();
        restartAutoplay();
      }
    });

    // Hover
    slider.addEventListener('mouseenter', function() {
      console.log('🐭 mouseenter - pausing');
      stopAutoplay();
    });
    slider.addEventListener('mouseleave', function() {
      console.log('🐭 mouseleave - resuming');
      startAutoplay();
    });
    slider.addEventListener('focusin', stopAutoplay);
    slider.addEventListener('focusout', startAutoplay);

    // Initialize
    console.log('🎬 Initializing slider - goTo(0)');
    goTo(0);

    // Start after delay
    console.log('⏳ Scheduling autoplay start in 500ms');
    setTimeout(function () {
      console.log('🚀 Starting autoplay after delay');
      startAutoplay();
    }, 500);
  });

  // ---- SCROLL REVEAL ----
  safeInit('scroll reveal', function () {
    var revealEls = document.querySelectorAll('.reveal');
    console.log('📊 reveal elements:', revealEls.length);

    if (revealEls.length) {
      if ('IntersectionObserver' in window && !reduceMotion) {
        var observer = new IntersectionObserver(function (entries) {
          for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
              entries[i].target.classList.add('in-view');
              observer.unobserve(entries[i].target);
            }
          }
        }, { threshold: 0.15 });
        for (var i = 0; i < revealEls.length; i++) {
          observer.observe(revealEls[i]);
        }
        console.log('✅ IntersectionObserver set up');
      } else {
        for (var i = 0; i < revealEls.length; i++) {
          revealEls[i].classList.add('in-view');
        }
        console.log('✅ Fallback: all reveal elements shown');
      }
    }
  });

  // ---- PARALLAX ----
  safeInit('parallax', function () {
    var parallaxEl = document.querySelector('.story-visual');
    if (parallaxEl && !reduceMotion) {
      window.addEventListener('scroll', function () {
        var rect = parallaxEl.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var progress = (vh - rect.top) / (vh + rect.height);
        var shift = Math.max(-1, Math.min(1, progress - 0.5)) * 24;
        parallaxEl.style.transform = 'translateY(' + shift + 'px)';
      }, { passive: true });
      console.log('✅ Parallax set up');
    }
  });

  // ---- MARQUEE ----
  safeInit('marquee', function () {
    var marquee = document.querySelector('[data-marquee]');
    console.log('📊 marquee element:', marquee);

    if (!marquee) {
      console.warn('⚠️ No marquee found - skipping');
      return;
    }

    var inner = marquee.querySelector('.marquee-inner');
    var track = marquee.querySelector('.marquee-track');
    console.log('📊 marquee inner:', inner);
    console.log('📊 marquee track:', track);

    if (reduceMotion) {
      console.log('⏸️ reduceMotion true - disabling marquee animation');
      if (inner) {
        inner.style.animation = 'none';
        inner.style.opacity = '1';
        inner.style.width = 'auto';
        inner.style.flexWrap = 'wrap';
      }
      return;
    }

    function setupMarquee() {
      console.log('🔧 setupMarquee called');
      if (!track || !inner) {
        console.warn('⚠️ track or inner missing');
        return;
      }
      var trackWidth = track.scrollWidth;
      console.log('📏 trackWidth:', trackWidth);
      if (trackWidth > 0) {
        inner.style.setProperty('--marquee-w', trackWidth + 'px');
        inner.style.width = (trackWidth * 2) + 'px';
        inner.classList.add('is-ready');
        inner.style.animation = 'marqueeScroll 25s linear infinite';
        console.log('✅ Marquee set up with width:', trackWidth);
      } else {
        console.log('⏳ trackWidth = 0 - retrying in 100ms');
        setTimeout(setupMarquee, 100);
      }
    }

    setTimeout(setupMarquee, 50);

    if (window.ResizeObserver) {
      var ro = new ResizeObserver(function () {
        console.log('📐 ResizeObserver fired');
        setupMarquee();
      });
      ro.observe(track);
      console.log('✅ ResizeObserver set up');
    }

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        console.log('📐 Window resize - setting up marquee');
        setupMarquee();
      }, 100);
    });

    if (document.fonts) {
      document.fonts.ready.then(function() {
        console.log('🔤 Fonts ready - setting up marquee');
        setupMarquee();
      });
    }

    marquee.addEventListener('mouseenter', function () {
      if (inner) {
        console.log('🐭 marquee mouseenter - pausing');
        inner.style.animationPlayState = 'paused';
      }
    });

    marquee.addEventListener('mouseleave', function () {
      if (inner) {
        console.log('🐭 marquee mouseleave - resuming');
        inner.style.animationPlayState = 'running';
      }
    });
  });

  console.log('%c ✅ nav.js initialization complete ', 'background:#4C6A73;color:#fff;padding:8px 16px;border-radius:4px;font-weight:bold;');
});

// ---- WINDOW LOAD FALLBACK ----
window.addEventListener('load', function () {
  console.log('🔄 window.load fired - running marquee fallback');
  var marquee = document.querySelector('[data-marquee]');
  if (marquee) {
    var inner = marquee.querySelector('.marquee-inner');
    var track = marquee.querySelector('.marquee-track');
    if (inner && track && !inner.classList.contains('is-ready')) {
      var trackWidth = track.scrollWidth;
      console.log('📏 Fallback trackWidth:', trackWidth);
      if (trackWidth > 0) {
        inner.style.setProperty('--marquee-w', trackWidth + 'px');
        inner.style.width = (trackWidth * 2) + 'px';
        inner.classList.add('is-ready');
        inner.style.animation = 'marqueeScroll 25s linear infinite';
        console.log('✅ Marquee set up via fallback');
      }
    }
  }
});

// ============================================
// CONSOLE HELPERS FOR DEBUGGING
// ============================================
console.log('💡 To debug slider manually, type: window.__debugSlider()');
window.__debugSlider = function() {
  var slider = document.querySelector('[data-slider]');
  if (!slider) { console.log('❌ No slider found'); return; }
  var slides = slider.querySelectorAll('[data-slide]');
  console.log('📊 Slides:', slides.length);
  for (var i = 0; i < slides.length; i++) {
    console.log('  Slide ' + i + ' is-active:', slides[i].classList.contains('is-active'));
  }
  var active = document.querySelector('.slide.is-active');
  console.log('🎯 Current active slide:', active ? active.dataset.slide : 'none');
};

console.log('💡 To debug marquee manually, type: window.__debugMarquee()');
window.__debugMarquee = function() {
  var marquee = document.querySelector('[data-marquee]');
  if (!marquee) { console.log('❌ No marquee found'); return; }
  var inner = marquee.querySelector('.marquee-inner');
  var track = marquee.querySelector('.marquee-track');
  console.log('📊 inner:', inner);
  console.log('📊 track:', track);
  console.log('📏 track.scrollWidth:', track ? track.scrollWidth : 'N/A');
  console.log('📏 --marquee-w:', inner ? inner.style.getPropertyValue('--marquee-w') : 'N/A');
  console.log('📊 is-ready:', inner ? inner.classList.contains('is-ready') : 'N/A');
};

console.log('💡 To check reduceMotion: window.__checkReduceMotion()');
window.__checkReduceMotion = function() {
  var result = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  console.log('🎯 prefers-reduced-motion:', result);
  return result;
};
