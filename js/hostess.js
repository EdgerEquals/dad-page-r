/* hostess.js: the hostess loop (media/hostess-loop.webm|mp4, 8 s, black satin on pure black) for the gate and the home preview card.
   Hostess.mount(box): adds a muted, inline, looping, control-less <video> to box. Poster first (tiny JPG); the clip itself is only
   requested after first paint + idle (preload=none, then play). Seam: opacity dips to 0 over L x PHI^-6 either side of the loop point
   (L = clip length), so the jump back to frame 0 is never seen. Opacity = PHI^-1 + (1 - PHI^-1) x DIAL_POLITE_DIRTY (js/site-config.js).
   prefers-reduced-motion: poster only, never plays. Off-screen or hidden tab: paused. About 2 KB. */
(function (w, d) {
  'use strict';
  var PHI = (1 + Math.sqrt(5)) / 2, V = '?v=1';
  function dial() { var D = w.DIAL_POLITE_DIRTY || {}, x = +D.value || 0; return Math.max(0, Math.min(1, x)); }
  function base() { return 1 / PHI + (1 - 1 / PHI) * dial(); }
  function idle(fn) { requestAnimationFrame(function () { setTimeout(function () { (w.requestIdleCallback || function (f) { setTimeout(f, 1); })(fn, { timeout: Math.round(1000 * PHI) }); }, Math.round(1000 / PHI / PHI)); }); }
  function mount(box) {
    var reduce = w.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var v = d.createElement('video');
    v.className = 'hv'; v.muted = true; v.defaultMuted = true; v.setAttribute('muted', ''); v.playsInline = true; v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', ''); v.loop = true; v.preload = 'none'; v.controls = false; v.setAttribute('aria-hidden', 'true');
    v.setAttribute('disablepictureinpicture', ''); v.setAttribute('disableremoteplayback', ''); v.tabIndex = -1;
    v.poster = 'media/hostess-poster.jpg' + V; v.style.opacity = base().toFixed(3);
    box.appendChild(v);
    if (reduce) return v;
    var started = false, wrapped = false, lastT = 0, vis = true;
    function play() { if (!started || !vis || d.hidden) return; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    function tick() {
      var L = v.duration, t = v.currentTime;
      if (L && isFinite(L)) {
        if (t < lastT) wrapped = true; lastT = t;
        var f = L * Math.pow(PHI, -6), k = Math.min(1, (L - t) / f, wrapped ? t / f : 1);
        v.style.opacity = (base() * Math.max(0, k)).toFixed(3);
      }
      requestAnimationFrame(tick);
    }
    idle(function () {
      ['webm', 'mp4'].forEach(function (x) { var s = d.createElement('source'); s.src = 'media/hostess-loop.' + x + V; s.type = 'video/' + x; v.appendChild(s); });
      v.autoplay = true; started = true; v.load(); play(); requestAnimationFrame(tick);
    });
    d.addEventListener('visibilitychange', function () { if (d.hidden) v.pause(); else play(); });
    if (w.IntersectionObserver) new IntersectionObserver(function (es) { vis = es[es.length - 1].isIntersecting; if (vis) play(); else v.pause(); }).observe(box);
    return v;
  }
  w.Hostess = { mount: mount };
})(window, document);
