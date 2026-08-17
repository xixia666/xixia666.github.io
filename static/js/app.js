/* ============================================================
   app.js — Core runtime
   Markdown-driven homepage engine
   Architecture inspired by senli1073/academic-homepage-template
   Visual style inspired by SimonAKing/HomePage
   ============================================================ */

(function () {
  'use strict';

  // ---- Icon SVGs ----
  var ICONS = {
    github: '<svg viewBox="0 0 16 16"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>'
  };

  // ---- Helpers ----
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }
  function fetchText(url) { return fetch(url).then(function (r) { if (!r.ok) throw new Error(url); return r.text(); }); }

  // ---- Load config ----
  function loadConfig() {
    return fetchText('contents/config.yml').then(function (text) {
      return jsyaml.load(text);
    });
  }

  // ---- Render intro ----
  function renderIntro(config) {
    $('#intro-title').textContent = config.title || '';
    $('#intro-subtitle').textContent = config.subtitle || '';
  }

  // ---- Render card ----
  function renderCard(config) {
    $('#card-avatar').src = config.avatar || '';
    $('#card-name').textContent = config.name || '';
    $('#card-signature').textContent = config.signature || '';
    $('#nav-brand').textContent = config.name || '';
    var ul = $('#card-links');
    (config.links || []).forEach(function (link) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = link.href;
      if (link.target) a.target = link.target;
      a.setAttribute('aria-label', link.text);
      a.innerHTML = (ICONS[link.icon] || ICONS.info) + '<span>' + link.text + '</span>';
      li.appendChild(a);
      ul.appendChild(li);
    });
  }

  // ---- Render nav ----
  function renderNav(config) {
    var nav = $('#nav-links');
    (config.sections || []).forEach(function (sec) {
      var a = document.createElement('a');
      a.href = '#' + sec.id;
      a.textContent = sec.nav || sec.title || sec.id;
      nav.appendChild(a);
    });
  }

  // ---- Render footer ----
  function renderFooter(config) {
    $('#copyright').textContent = config.copyright || '';
    var fl = $('#footer-links');
    (config['footer-links'] || []).forEach(function (link) {
      var a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.text;
      fl.appendChild(a);
    });
  }

  // ---- Render markdown sections ----
  function renderSections(config) {
    var container = $('#sections');
    var promises = (config.sections || []).map(function (sec) {
      return fetchText('contents/' + sec.id + '.md')
        .then(function (md) {
          var section = document.createElement('section');
          section.id = sec.id;
          var h2 = document.createElement('h2');
          h2.textContent = sec.title || sec.id;
          section.appendChild(h2);
          var body = document.createElement('div');
          body.className = 'section-body';
          body.innerHTML = marked.parse(md);
          section.appendChild(body);
          container.appendChild(section);
        })
        .catch(function (e) { console.warn('Failed to load section:', sec.id, e); });
    });
    return Promise.all(promises);
  }

  // ---- Intro entrance animation ----
  function playIntroAnimation() {
    var fadeElements = $$('.content-inner .fade');
    setTimeout(function () {
      anime.timeline({ easing: 'easeOutQuart' })
        .add({ targets: fadeElements, opacity: [0, 1], duration: 600 })
        .add({ targets: '.content-title', opacity: [0, 1], translateY: [20, 0], duration: 800 }, '-=400')
        .add({ targets: '.content-subtitle', opacity: [0, 1], translateY: [20, 0], duration: 800 }, '-=600')
        .add({ targets: '.enter', opacity: [0, 1], translateY: [20, 0], duration: 800 }, '-=600')
        .add({ targets: '.github-corner', opacity: [0, 1], duration: 600 }, '-=800');
    }, 300);
  }

  // ---- Enter transition ----
  function setupEnterTransition() {
    var enterBtn = $('#enterBtn');
    var intro = $('#intro');
    var main = $('#main');
    enterBtn.addEventListener('click', function () {
      // Fade out intro content
      anime({
        targets: [intro.querySelector('.content-inner'), intro.querySelector('.github-corner')],
        opacity: 0, duration: 400, easing: 'easeOutQuad'
      });
      // Stop WebGL fluid to free GPU
      var bgCanvas = document.getElementById('background');
      if (bgCanvas) {
        bgCanvas.style.transition = 'opacity 0.6s ease';
        bgCanvas.style.opacity = '0';
        setTimeout(function () { bgCanvas.style.display = 'none'; }, 600);
      }
      // Slide intro up
      anime({
        targets: { val: 0 }, val: 1, duration: 1000, easing: 'easeInQuart',
        update: function (anim) {
          var p = anim.animations[0].currentValue;
          intro.style.transform = 'translateY(' + (-p * 100) + '%)';
          intro.style.opacity = String(1 - p);
        },
        complete: function () {
          intro.style.display = 'none';
          main.classList.add('visible');
          document.body.classList.remove('site-loading');
          document.body.style.overflow = 'auto';
          // Show aurora background
          var mainBg = document.getElementById('mainBg');
          if (mainBg) mainBg.classList.add('visible');
          playMainAnimation();
        }
      });
    });
  }

  // ---- Main screen animation ----
  function playMainAnimation() {
    anime.timeline({ easing: 'easeOutQuart' })
      .add({ targets: '#card', opacity: [0, 1], translateY: [30, 0], duration: 800 })
      .add({ targets: '#card img', opacity: [0, 1], scale: [0.5, 1], duration: 600 }, '-=600')
      .add({ targets: '#card h1', opacity: [0, 1], translateY: [20, 0], duration: 500 }, '-=400')
      .add({ targets: '#card h2', opacity: [0, 1], translateY: [20, 0], duration: 500 }, '-=400')
      .add({ targets: '#card li', opacity: [0, 1], translateY: [20, 0], duration: 500, delay: anime.stagger(80) }, '-=400');
    // Grid background
    var canvas = $('#gridCanvas');
    if (canvas) { canvas.classList.add('visible'); drawGrid(canvas); }
  }

  // ---- Grid background ----
  function drawGrid(canvas) {
    var ctx = canvas.getContext('2d');
    var W, H;
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    var offset = 0;
    function animate() {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      var gap = 50;
      offset = (offset + 0.2) % gap;
      for (var x = -gap + offset; x < W + gap; x += gap) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (var y = -gap + offset; y < H + gap; y += gap) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ---- Nav toggle (mobile) ----
  function setupNavToggle() {
    var toggle = $('#navToggle');
    var links = $('#nav-links');
    if (toggle) toggle.addEventListener('click', function () { links.classList.toggle('open'); });
  }

  // ---- Init ----
  function init() {
    document.body.style.overflow = 'hidden';
    loadConfig()
      .then(function (config) {
        renderIntro(config);
        renderCard(config);
        renderNav(config);
        renderFooter(config);
        return renderSections(config);
      })
      .then(function () {
        playIntroAnimation();
        setupEnterTransition();
        setupNavToggle();
      })
      .catch(function (err) {
        console.error('Init failed:', err);
        var intro = $('#intro');
        var main = $('#main');
        if (intro) intro.style.display = 'none';
        if (main) main.classList.add('visible');
        document.body.classList.remove('site-loading');
        document.body.style.overflow = 'auto';
        var mainBg = document.getElementById('mainBg');
        if (mainBg) mainBg.classList.add('visible');
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
