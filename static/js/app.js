/* ============================================================
   app.js — SKY·紫罗兰 主页交互（零依赖）
   首屏 WebGL 流体背景由 background.js 负责；
   本脚本只负责首屏→主屏的过渡。
   ============================================================ */

(function () {
  'use strict';

  var intro = document.getElementById('intro');
  var main = document.getElementById('main');
  var enterBtn = document.getElementById('enterBtn');

  document.body.style.overflow = 'hidden';

  var inner = intro ? intro.querySelector('.content-inner') : null;
  if (inner) {
    inner.style.opacity = '0';
    inner.style.transition = 'opacity .8s ease';
    requestAnimationFrame(function () {
      inner.style.opacity = '1';
    });
  }

  function enterMain() {
    if (!intro || !main) return;

    // 通知 background.js 停止响应鼠标/触摸事件
    if (window.switchPage) window.switchPage.switched = true;

    // 首屏内容淡出
    if (inner) {
      inner.style.transition = 'opacity .3s ease';
      inner.style.opacity = '0';
    }

    // 流体画布淡出
    var bgCanvas = document.getElementById('background');
    if (bgCanvas) {
      bgCanvas.style.transition = 'opacity .6s ease';
      bgCanvas.style.opacity = '0';
      setTimeout(function () { bgCanvas.style.display = 'none'; }, 650);
    }

    // 首屏上滑
    intro.style.transition = 'transform .9s cubic-bezier(.76,0,.24,1), opacity .9s cubic-bezier(.76,0,.24,1)';
    requestAnimationFrame(function () {
      intro.style.transform = 'translateY(-100%)';
      intro.style.opacity = '0';
    });

    // 主屏淡入
    main.classList.add('visible');
    document.body.style.overflow = 'auto';

    setTimeout(function () {
      intro.style.display = 'none';
    }, 950);
  }

  if (enterBtn) {
    enterBtn.addEventListener('click', function (e) {
      e.preventDefault();
      enterMain();
    });
  }

  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && intro && intro.style.display !== 'none') {
      e.preventDefault();
      enterMain();
    }
  });
})();
