/* derrin.work — the only runtime behaviour the static site needs. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* header height reserved by a spacer, so fixed chrome never covers content */
  var header = document.getElementById('siteheader'), spacer = document.getElementById('headerspacer');
  function syncHeader() { if (header && spacer) spacer.style.height = header.offsetHeight + 'px'; }
  syncHeader();
  window.addEventListener('resize', syncHeader);
  if (window.ResizeObserver && header) new ResizeObserver(syncHeader).observe(header);

  /* mobile menu */
  var btn = document.getElementById('menubtn'), menu = document.getElementById('mobilemenu');
  if (btn && menu) btn.addEventListener('click', function () {
    var open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    btn.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    menu.hidden = open;
    syncHeader();
  });

  /* parallax hero layers */
  Array.prototype.forEach.call(document.querySelectorAll('[data-parallax="stage"]'), function (stage) {
    var layer = stage.querySelector('[data-parallax="layer"]');
    if (!layer) return;
    var raf = 0;
    function apply() {
      raf = 0;
      var r = stage.getBoundingClientRect();
      var travel = Math.max(0, stage.offsetHeight - (window.innerHeight || 800));
      var y = Math.min(Math.max(-r.top, 0), travel);
      layer.style.transform = 'translate3d(0,' + (reduce ? 0 : y) + 'px,0)';
    }
    function tick() { if (!raf) raf = requestAnimationFrame(apply); }
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    apply();
  });

  /* click-to-play video: the poster is replaced by the embed, so nothing third-party loads first */
  Array.prototype.forEach.call(document.querySelectorAll('[data-video]'), function (poster) {
    poster.addEventListener('click', function () {
      var wrap = document.createElement('div');
      wrap.style.cssText = 'position:relative; aspect-ratio:16/9; background:#000000;';
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + poster.getAttribute('data-video') + '?autoplay=1&cc_load_policy=1&rel=0';
      f.title = poster.getAttribute('data-video-title') || 'Video';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      f.allowFullscreen = true;
      f.style.cssText = 'position:absolute; inset:0; width:100%; height:100%; border:0;';
      wrap.appendChild(f);
      poster.parentNode.replaceChild(wrap, poster);
    });
  });

  /* lookbook: CSS shows the active frame, JS only moves the index */
  var stageEl = document.querySelector('[data-helm]:not([data-helmthumbs])');
  var thumbs = document.querySelector('[data-helmthumbs]');
  var counter = document.querySelector('[data-helm-count]');
  var TOTAL = 14;
  function setHelm(n) {
    var i = ((n - 1) % TOTAL + TOTAL) % TOTAL + 1;
    if (stageEl) stageEl.setAttribute('data-helm', String(i));
    if (thumbs) thumbs.setAttribute('data-helm', String(i));
    if (counter) counter.textContent = i + ' / ' + TOTAL;
  }
  function current() { return parseInt((stageEl && stageEl.getAttribute('data-helm')) || '1', 10); }
  Array.prototype.forEach.call(document.querySelectorAll('[data-helm-step]'), function (b) {
    b.addEventListener('click', function () { setHelm(current() + parseInt(b.getAttribute('data-helm-step'), 10)); });
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-helm-go]'), function (b) {
    b.addEventListener('click', function () { setHelm(parseInt(b.getAttribute('data-helm-go'), 10)); });
  });
})();
