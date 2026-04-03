/* ==========================================================================
   SUSHICODEE PORTFOLIO — Interactions & Animations
   Pure vanilla JS, no dependencies
   ========================================================================== */

(function () {
  'use strict';

  var REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var IS_TOUCH = window.matchMedia('(hover: none)').matches;

  /* --------------------------------------------------------------------------
     1. Scroll Animation Observer
     -------------------------------------------------------------------------- */
  function initScrollAnimations() {
    var elements = document.querySelectorAll('[data-animate]');
    if (!elements.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* --------------------------------------------------------------------------
     2. Parallax Engine
     -------------------------------------------------------------------------- */
  function initParallax() {
    if (REDUCED_MOTION) return;

    var elements = document.querySelectorAll('[data-parallax]');
    if (!elements.length) return;

    var ticking = false;

    function updateParallax() {
      var scrollY = window.scrollY;
      elements.forEach(function (el) {
        var speed = parseFloat(el.dataset.parallax) || 0.3;
        var rect = el.parentElement.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          el.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
        }
      });
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     3. Navigation Controller
     -------------------------------------------------------------------------- */
  function initNav() {
    var nav = document.getElementById('nav');
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('nav-links');
    var links = document.querySelectorAll('.nav__link');
    var sections = document.querySelectorAll('section[id]');

    if (!nav) return;

    var ticking = false;

    function onScroll() {
      var scrollY = window.scrollY;
      if (scrollY > 50) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }

      var current = '';
      sections.forEach(function (section) {
        var top = section.offsetTop - 120;
        if (scrollY >= top) current = section.getAttribute('id');
      });
      links.forEach(function (link) {
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('nav__link--active');
        } else {
          link.classList.remove('nav__link--active');
        }
      });

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });

    // Hamburger
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', function () {
        var isOpen = navLinks.classList.toggle('nav__links--open');
        hamburger.classList.toggle('hamburger--active', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
      });

      links.forEach(function (link) {
        link.addEventListener('click', function () {
          navLinks.classList.remove('nav__links--open');
          hamburger.classList.remove('hamburger--active');
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Smooth scroll with offset
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = anchor.getAttribute('href');
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var offset = nav.offsetHeight + 20;
          var top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. Theme Toggle
     -------------------------------------------------------------------------- */
  function initThemeToggle() {
    var toggle = document.getElementById('theme-toggle');
    var icon = toggle ? toggle.querySelector('.theme-toggle__icon') : null;
    if (!toggle) return;

    var STORAGE_KEY = 'sushicodee-theme';

    function setTheme(isDark) {
      if (isDark) {
        document.body.classList.remove('light-theme');
      } else {
        document.body.classList.add('light-theme');
      }
      if (icon) icon.textContent = isDark ? '\u263E' : '\u2600';
      try { localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light'); } catch (e) {}
    }

    var saved;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}

    if (saved) {
      setTheme(saved === 'dark');
    } else {
      setTheme(!window.matchMedia('(prefers-color-scheme: light)').matches);
    }

    toggle.addEventListener('click', function () {
      setTheme(document.body.classList.contains('light-theme'));
    });
  }

  /* --------------------------------------------------------------------------
     5. Typing Animation
     -------------------------------------------------------------------------- */
  function initTypingAnimation() {
    var el = document.querySelector('.typing-text');
    if (!el) return;

    var phrases = [
      'Tech Lead at PortPro',
      'AI Automation Builder',
      'EDI Integration Specialist',
      'MERN Stack Engineer',
      'Claude Code Hacker'
    ];

    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;

    function type() {
      var current = phrases[phraseIndex];

      if (!isDeleting) {
        el.textContent = current.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(type, 2000);
          return;
        }
        setTimeout(type, 80);
      } else {
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 40);
      }
    }

    setTimeout(type, 1000);
  }

  /* --------------------------------------------------------------------------
     6. Counter Animation
     -------------------------------------------------------------------------- */
  function initCounters() {
    var counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function animateCounter(el) {
      var target = parseInt(el.dataset.target, 10);
      var duration = 2000;
      var start = performance.now();

      function update(now) {
        var elapsed = now - start;
        var progress = Math.min(elapsed / duration, 1);
        var value = Math.round(easeOutExpo(progress) * target);
        el.textContent = value;

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (c) { observer.observe(c); });
  }

  /* --------------------------------------------------------------------------
     7. Glitch Setup
     -------------------------------------------------------------------------- */
  function initGlitch() {
    document.querySelectorAll('.glitch').forEach(function (el) {
      el.setAttribute('data-text', el.textContent);
    });
  }

  /* --------------------------------------------------------------------------
     8. Tilt Effect
     -------------------------------------------------------------------------- */
  function initTilt() {
    if (REDUCED_MOTION || IS_TOUCH) return;

    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;

        var rotateX = ((y - centerY) / centerY) * -8;
        var rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform =
          'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateZ(10px)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        card.style.transition = 'transform 0.5s ease-out';
        setTimeout(function () {
          card.style.transition = '';
        }, 500);
      });
    });
  }

  /* --------------------------------------------------------------------------
     9. Timeline Controller
     -------------------------------------------------------------------------- */
  function initTimeline() {
    var track = document.getElementById('timeline-track');
    var leftBtn = document.querySelector('.timeline__arrow--left');
    var rightBtn = document.querySelector('.timeline__arrow--right');
    var nodes = document.querySelectorAll('.timeline-node');

    if (!track) return;

    var scrollAmount = 340;

    if (leftBtn) {
      leftBtn.addEventListener('click', function () {
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });
    }

    if (rightBtn) {
      rightBtn.addEventListener('click', function () {
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });
    }

    nodes.forEach(function (node) {
      node.addEventListener('click', function () {
        var wasActive = node.classList.contains('timeline-node--active');
        nodes.forEach(function (n) { n.classList.remove('timeline-node--active'); });
        if (!wasActive) node.classList.add('timeline-node--active');
      });
    });
  }

  /* --------------------------------------------------------------------------
     10. Hero Particles (Canvas)
     -------------------------------------------------------------------------- */
  function initHeroParticles() {
    var canvas = document.getElementById('hero-particles');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = REDUCED_MOTION ? 30 : 80;
    var CONNECT_DISTANCE = 120;

    function resize() {
      var parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
        opacity: Math.random() * 0.4 + 0.1
      };
    }

    function init() {
      resize();
      particles.length = 0;
      for (var i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle());
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DISTANCE) {
            var alpha = (1 - dist / CONNECT_DISTANCE) * 0.15;
            ctx.strokeStyle = 'rgba(0, 212, 255, ' + alpha + ')';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach(function (p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 212, 255, ' + p.opacity + ')';
        ctx.fill();
      });
    }

    function update() {
      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }

    init();

    if (REDUCED_MOTION) {
      draw();
    } else {
      loop();
    }

    window.addEventListener('resize', function () {
      resize();
      if (REDUCED_MOTION) draw();
    });
  }

  /* --------------------------------------------------------------------------
     11. Constellation Canvas (Connect Section)
     -------------------------------------------------------------------------- */
  function initConstellation() {
    var canvas = document.getElementById('connect-constellation');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = 40;
    var MOUSE_DISTANCE = 200;
    var mouse = { x: -1000, y: -1000 };

    function resize() {
      var parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.1
      };
    }

    function init() {
      resize();
      particles.length = 0;
      for (var i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle());
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      var canvasRect = canvas.getBoundingClientRect();
      var mx = mouse.x - canvasRect.left;
      var my = mouse.y - canvasRect.top;

      particles.forEach(function (p) {
        var dx = p.x - mx;
        var dy = p.y - my;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_DISTANCE) {
          var alpha = (1 - dist / MOUSE_DISTANCE) * 0.3;
          ctx.strokeStyle = 'rgba(124, 58, 237, ' + alpha + ')';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mx, my);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(124, 58, 237, ' + p.opacity + ')';
        ctx.fill();
      });
    }

    function update() {
      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }

    init();

    if (!REDUCED_MOTION) {
      loop();
      document.addEventListener('mousemove', function (e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      }, { passive: true });
    } else {
      draw();
    }

    window.addEventListener('resize', function () {
      resize();
      if (REDUCED_MOTION) draw();
    });
  }

  /* --------------------------------------------------------------------------
     12. Cursor Trail (Desktop Only)
     -------------------------------------------------------------------------- */
  function initCursorTrail() {
    if (REDUCED_MOTION || IS_TOUCH) return;

    var TRAIL_LENGTH = 10;
    var trail = [];

    for (var i = 0; i < TRAIL_LENGTH; i++) {
      var dot = document.createElement('div');
      dot.style.cssText =
        'position:fixed;width:' + (6 - i * 0.4) + 'px;height:' + (6 - i * 0.4) +
        'px;background:var(--accent-primary);border-radius:50%;pointer-events:none;' +
        'z-index:9998;opacity:' + (1 - i * 0.09) +
        ';transition:transform ' + (50 + i * 30) + 'ms ease-out;will-change:transform;';
      document.body.appendChild(dot);
      trail.push({ el: dot, x: 0, y: 0 });
    }

    document.addEventListener('mousemove', function (e) {
      trail[0].x = e.clientX;
      trail[0].y = e.clientY;
    }, { passive: true });

    function updateTrail() {
      for (var i = trail.length - 1; i > 0; i--) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * 0.35;
        trail[i].y += (trail[i - 1].y - trail[i].y) * 0.35;
      }

      trail.forEach(function (d) {
        d.el.style.transform = 'translate(' + (d.x - 3) + 'px, ' + (d.y - 3) + 'px)';
      });

      requestAnimationFrame(updateTrail);
    }

    updateTrail();
  }

  /* --------------------------------------------------------------------------
     13. Favicon SVG Generator
     -------------------------------------------------------------------------- */
  function initFavicon() {
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
      '<rect width="100" height="100" rx="20" fill="#0a0a0a"/>' +
      '<text x="50" y="68" font-family="system-ui" font-size="50" font-weight="900" ' +
      'fill="url(#g)" text-anchor="middle">S</text>' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#00d4ff"/>' +
      '<stop offset="100%" stop-color="#7c3aed"/>' +
      '</linearGradient></defs></svg>';

    var existing = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
    if (existing) {
      existing.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
    }
  }

  /* --------------------------------------------------------------------------
     INIT
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initGlitch();
    initScrollAnimations();
    initParallax();
    initNav();
    initThemeToggle();
    initTypingAnimation();
    initCounters();
    initTilt();
    initTimeline();
    initHeroParticles();
    initConstellation();
    initCursorTrail();
    initFavicon();
  });
})();
