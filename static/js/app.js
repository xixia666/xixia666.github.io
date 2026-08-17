/* ============================================================
   app.js — SKY·紫罗兰 主页核心运行时
   ============================================================ */

(function () {
  'use strict';

  var ICONS = {
    qq: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C7.6 2 5 5.3 5 9.2c0 1.4.3 2.7.8 3.8-.5 1-1.2 2.6-1.2 3.4 0 .5.3.8.8.8.7 0 1.8-.5 2.6-1 .4.5 1 .9 1.6 1.2-.2.4-.4.9-.4 1.4 0 .4.3.6.7.6.6 0 1.4-.3 2.1-.7.4.1.8.1 1.2.1s.8 0 1.2-.1c.7.4 1.5.7 2.1.7.4 0 .7-.2.7-.6 0-.5-.2-1-.4-1.4.6-.3 1.2-.7 1.6-1.2.8.5 1.9 1 2.6 1 .5 0 .8-.3.8-.8 0-.8-.7-2.4-1.2-3.4.5-1.1.8-2.4.8-3.8C19 5.3 16.4 2 12 2zm-2 7c-.6 0-1-.6-1-1.4s.4-1.4 1-1.4 1 .6 1 1.4-.4 1.4-1 1.4zm4 0c-.6 0-1-.6-1-1.4s.4-1.4 1-1.4 1 .6 1 1.4-.4 1.4-1 1.4z"/></svg>',
    github: '<svg viewBox="0 0 16 16"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>'
  };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }
  function fetchText(url) { return fetch(url).then(function (r) { if (!r.ok) throw new Error(url); return r.text(); }); }

  function loadConfig() {
    return fetchText('contents/config.yml').then(function (text) { return jsyaml.load(text); });
  }

  function renderIntro(config) {
    $('#intro-title').textContent = config.title || '';
    $('#intro-subtitle').textContent = config.subtitle || '';
  }

  function renderCard(config) {
    $('#card-avatar').src = config.avatar || '';
    $('#card-name').textContent = config.name || '';
    $('#card-signature').textContent = config.signature || '';
    $('#nav-brand').textContent = config.name || '';
    var ul = $('#card-links');
    var links = config.links || [];
    links.forEach(function (link, i) {
      var li = document.createElement('li');
      if (i === 0) {
        // 前两个放进同一个 li 横向并排
        li.className = 'row-pair';
        var a1 = document.createElement('a');
        a1.href = links[0].href;
        if (links[0].target) a1.target = links[0].target;
        a1.setAttribute('aria-label', links[0].text);
        a1.innerHTML = (ICONS[links[0].icon] || ICONS.info) + '<span>' + links[0].text + '</span>';
        li.appendChild(a1);
        if (links[1]) {
          var a2 = document.createElement('a');
          a2.href = links[1].href;
          if (links[1].target) a2.target = links[1].target;
          a2.setAttribute('aria-label', links[1].text);
          a2.innerHTML = (ICONS[links[1].icon] || ICONS.info) + '<span>' + links[1].text + '</span>';
          li.appendChild(a2);
        }
        ul.appendChild(li);
      } else if (i >= 2) {
        var a = document.createElement('a');
        a.href = link.href;
        if (link.target) a.target = link.target;
        a.setAttribute('aria-label', link.text);
        var iconKey = link.icon || 'info';
        if (link.text.indexOf('打赏') !== -1) iconKey = 'heart';
        if (link.text.indexOf('下载') !== -1) iconKey = 'download';
        if (link.text.indexOf('电报') !== -1) iconKey = 'send';
        if (link.text.indexOf('Q群') !== -1 || link.text.indexOf('QQ') !== -1) iconKey = 'qq';
        if (link.text.indexOf('频道') !== -1) iconKey = 'send';
        a.innerHTML = (ICONS[iconKey] || ICONS.info) + '<span>' + link.text + '</span>';
        li.appendChild(a);
        ul.appendChild(li);
      }
    });
  }

  function renderNav(config) {
    var nav = $('#nav-links');
    (config.sections || []).forEach(function (sec) {
      var a = document.createElement('a');
      a.href = '#' + sec.id;
      a.textContent = sec.nav || sec.title || sec.id;
      nav.appendChild(a);
    });
  }

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

  function playIntroAnimation() {
    var fadeElements = $$('.content-inner .fade');
    setTimeout(function () {
      anime.timeline({ easing: 'easeOutQuart' })
        .add({ targets: fadeElements, opacity: [0, 1], duration: 600 })
        .add({ targets: '.content-title', opacity: [0, 1], translateY: [20, 0], duration: 800 }, '-=400')
        .add({ targets: '.content-subtitle', opacity: [0, 1], translateY: [20, 0], duration: 800 }, '-=600')
        .add({ targets: '.enter', opacity: [0, 1], translateY: [20, 0], duration: 800 }, '-=600');
    }, 300);
  }

  function setupEnterTransition() {
    var enterBtn = $('#enterBtn');
    var intro = $('#intro');
    var main = $('#main');
    enterBtn.addEventListener('click', function () {
      anime({
        targets: intro.querySelector('.content-inner'),
        opacity: 0, duration: 400, easing: 'easeOutQuad'
      });
      var bgCanvas = document.getElementById('background');
      if (bgCanvas) {
        bgCanvas.style.transition = 'opacity 0.6s ease';
        bgCanvas.style.opacity = '0';
        setTimeout(function () { bgCanvas.style.display = 'none'; }, 600);
      }
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
          playMainAnimation();
        }
      });
    });
  }

  function playMainAnimation() {
    anime.timeline({ easing: 'easeOutQuart' })
      .add({ targets: '#card', opacity: [0, 1], translateY: [30, 0], duration: 800 })
      .add({ targets: '#card img', opacity: [0, 1], scale: [0.5, 1], duration: 600 }, '-=600')
      .add({ targets: '#card h1', opacity: [0, 1], translateY: [20, 0], duration: 500 }, '-=400')
      .add({ targets: '#card h2', opacity: [0, 1], translateY: [20, 0], duration: 500 }, '-=400')
      .add({ targets: '#card li', opacity: [0, 1], translateY: [20, 0], duration: 500, delay: anime.stagger(80) }, '-=400');
  }

  function setupNavToggle() {
    var toggle = $('#navToggle');
    var links = $('#nav-links');
    if (toggle) toggle.addEventListener('click', function () { links.classList.toggle('open'); });
  }

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
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
