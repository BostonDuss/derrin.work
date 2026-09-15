/* derrin.work — the only runtime behaviour the static site needs. */
(function () {
  'use strict';
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

  /* click-to-play in a modal: the embed is created on open and destroyed on close, so audio stops */
  Array.prototype.forEach.call(document.querySelectorAll('[data-video-modal]'), function (poster) {
    poster.addEventListener('click', function () {
      var prev = document.activeElement;
      var back = document.createElement('div');
      back.setAttribute('role', 'dialog');
      back.setAttribute('aria-modal', 'true');
      back.setAttribute('aria-label', poster.getAttribute('data-video-title') || 'Video');
      back.style.cssText = 'position:fixed; inset:0; z-index:90; background:rgba(0,0,0,.88); -webkit-backdrop-filter:blur(6px); backdrop-filter:blur(6px); display:grid; place-items:center; padding:clamp(16px,4vw,56px);';
      var inner = document.createElement('div');
      inner.style.cssText = 'width:min(1200px,100%);';
      var bar = document.createElement('div');
      bar.style.cssText = 'display:flex; justify-content:flex-end; margin-bottom:12px;';
      var close = document.createElement('button');
      close.type = 'button';
      close.setAttribute('aria-label', 'Close the video');
      close.textContent = 'Close ✕';
      close.style.cssText = "font-family:'Schibsted Grotesk',system-ui,sans-serif; font-size:13px; letter-spacing:.06em; text-transform:uppercase; color:#FFFFFF; background:none; border:1px solid rgba(255,255,255,.34); padding:9px 16px; cursor:pointer;";
      bar.appendChild(close);
      var frame = document.createElement('div');
      frame.style.cssText = 'position:relative; width:100%; aspect-ratio:16/9; background:#000000;';
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + poster.getAttribute('data-video-modal') + '?autoplay=1&cc_load_policy=1&rel=0&modestbranding=1';
      f.title = poster.getAttribute('data-video-title') || 'Video';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      f.allowFullscreen = true;
      f.style.cssText = 'position:absolute; inset:0; width:100%; height:100%; border:0; display:block;';
      frame.appendChild(f);
      inner.appendChild(bar);
      inner.appendChild(frame);
      back.appendChild(inner);
      function shut() {
        document.removeEventListener('keydown', onKey);
        document.documentElement.style.overflow = '';
        if (back.parentNode) back.parentNode.removeChild(back);
        if (prev && prev.focus) prev.focus();
      }
      function onKey(e) { if (e.key === 'Escape') shut(); }
      back.addEventListener('click', function (e) { if (e.target === back || e.target === inner) shut(); });
      close.addEventListener('click', shut);
      document.addEventListener('keydown', onKey);
      document.documentElement.style.overflow = 'hidden';
      document.body.appendChild(back);
      close.focus();
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
