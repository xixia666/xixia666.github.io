/* ============================================================
   app.js — SKY·紫罗兰 主页交互（零依赖）
   1) 首屏 → 主屏过渡
   2) 平滑滚动到网盘下载区块（带落地高亮）
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

    if (window.switchPage) window.switchPage.switched = true;

    if (inner) {
      inner.style.transition = 'opacity .3s ease';
      inner.style.opacity = '0';
    }

    var bgCanvas = document.getElementById('background');
    if (bgCanvas) {
      bgCanvas.style.transition = 'opacity .6s ease';
      bgCanvas.style.opacity = '0';
      setTimeout(function () { bgCanvas.style.display = 'none'; }, 650);
    }

    intro.style.transition = 'transform .9s cubic-bezier(.76,0,.24,1), opacity .9s cubic-bezier(.76,0,.24,1)';
    requestAnimationFrame(function () {
      intro.style.transform = 'translateY(-100%)';
      intro.style.opacity = '0';
    });

    main.classList.add('visible');
    document.body.style.overflow = 'auto';

    setTimeout(function () {
      intro.style.display = 'none';
    }, 950);
  }

  function scrollToDownloads(behavior) {
    var target = document.getElementById('downloads');
    var scroller = document.getElementById('main');
    if (!target) return;

    if (scroller) {
      var top = target.getBoundingClientRect().top -
                scroller.getBoundingClientRect().top +
                scroller.scrollTop - 24;
      try {
        scroller.scrollTo({ top: top, behavior: behavior || 'smooth' });
      } catch (e) {
        scroller.scrollTop = top;
      }
    } else {
      target.scrollIntoView({ behavior: behavior || 'smooth', block: 'start' });
    }

    target.classList.remove('flash');
    void target.offsetWidth;
    target.classList.add('flash');
    setTimeout(function () { target.classList.remove('flash'); }, 1800);
  }

  if (enterBtn) {
    enterBtn.addEventListener('click', function (e) {
      e.preventDefault();
      enterMain();
    });
  }

  Array.prototype.forEach.call(
    document.querySelectorAll('.scroll-to-downloads'),
    function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        if (intro && intro.style.display !== 'none') {
          enterMain();
          setTimeout(function () { scrollToDownloads('smooth'); }, 1000);
        } else {
          scrollToDownloads('smooth');
        }
      });
    }
  );

  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && intro && intro.style.display !== 'none') {
      e.preventDefault();
      enterMain();
    }
  });
})();
