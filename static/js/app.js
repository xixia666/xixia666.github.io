/* ============================================================
   app.js — SKY·紫罗兰 主页核心运行时
   ============================================================ */

(function () {
  'use strict';

  var ICONS = {
    qq: '<svg viewBox="0 0 32 32" fill="currentColor"><path d="M28.527 20.047c-0.329-1.016-0.683-2.025-1.068-3.020l-1.443-3.595c0.005-0.041 0.020-0.744 0.020-1.115 0-6.14-2.9-12.317-10.036-12.317s-10.036 6.177-10.036 12.323c0 0.365 0.020 1.073 0.020 1.115l-1.443 3.593c-0.385 0.996-0.739 2-1.068 3.016-1.359 4.38-0.921 6.193-0.583 6.235 0.719 0.083 2.803-3.297 2.803-3.297 0 1.959 1.009 4.516 3.192 6.36-0.812 0.249-1.817 0.64-2.459 1.115-0.577 0.427-0.505 0.859-0.4 1.036 0.457 0.771 7.843 0.489 9.973 0.251 2.136 0.239 9.521 0.52 9.979-0.251 0.104-0.177 0.177-0.609-0.4-1.036-0.647-0.475-1.647-0.865-2.464-1.115 2.183-1.849 3.192-4.407 3.192-6.365 0 0 2.084 3.385 2.803 3.297 0.339-0.036 0.776-1.855-0.583-6.229zM16.88 6.464c0.052-1.407 0.88-2.505 1.849-2.464 0.968 0.041 1.708 1.213 1.656 2.62-0.052 1.401-0.88 2.505-1.849 2.459-0.963-0.043-1.708-1.215-1.656-2.615zM13.271 4c0.969-0.041 1.797 1.057 1.849 2.464 0.052 1.4-0.693 2.572-1.656 2.615-0.969 0.047-1.797-1.057-1.849-2.459-0.052-1.407 0.688-2.579 1.656-2.62zM9.896 11.057c0.255-0.573 2.859-1.208 6.088-1.208h0.032c3.224 0 5.833 0.635 6.088 1.208 0.016 0.025 0.021 0.052 0.021 0.083 0 0.043-0.016 0.079-0.037 0.111-0.219 0.317-3.109 1.889-6.067 1.889h-0.037c-2.963 0-5.853-1.572-6.072-1.889-0.043-0.053-0.048-0.131-0.016-0.193zM23.792 22.552c-0.297 4.907-3.204 7.984-7.699 8.032h-0.181c-4.496-0.048-7.407-3.125-7.699-8.032-0.109-1.797 0-3.323 0.193-4.573 0.427 0.089 0.853 0.167 1.281 0.235v4.677c0 0 2.208 0.448 4.421 0.136v-4.297c0.651 0.036 1.281 0.052 1.875 0.041h0.032c2.239 0.032 4.953-0.271 7.577-0.792 0.199 1.251 0.303 2.776 0.199 4.573zM13.973 7.74c0.417-0.057 0.724-0.547 0.677-1.1-0.047-0.557-0.416-0.963-0.839-0.905-0.416 0.052-0.724 0.547-0.676 1.099 0.047 0.552 0.416 0.959 0.837 0.907zM19.307 6.875c0.105 0.047 0.292 0.057 0.387-0.192 0.047-0.131 0.031-0.224-0.016-0.287-0.032-0.047-0.177-0.156-0.495-0.235-1.204-0.297-1.787 0.511-1.871 0.661-0.057 0.099-0.015 0.24 0.073 0.308 0.088 0.067 0.188 0.047 0.24-0.011 0.771-0.839 1.615-0.276 1.681-0.245z"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
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
        if (link.text.indexOf('频道') !== -1) iconKey = 'grid';
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
