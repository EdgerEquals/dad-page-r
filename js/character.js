/* character.js: reusable animated characters (Danny 17:38 AWST 26 Oct: "Will use her again elsewhere within the site so let's build the
   architecture for that. If I press on her she goes to a bigger view and then if you leave her on there the animation evolves overtime ...
   all these things other extra animation layers will slowly load in the background during idle time").
   CONTENT RULE: cheeky, seductive, IMPLIED ONLY. No explicit nudity in any character or stage (GitHub Pages terms + Danny's standing rule).
   MANIFEST: data/characters.js (window.CHARACTERS; loaded on demand if missing, ~2 KB). Schema documented there.
   PLACEMENT: any element with data-character="<id>" becomes an instance (Character.scan(root) mounts new ones; runs once at load).
     data-character-enlarge="off"  no tap-to-enlarge (the gate uses this: her layer never takes taps, the passcode box stays free).
     Instance = the old js/hostess.js behaviour: poster first (tiny still), the base loop only after first paint + idle (preload none),
     muted/inline/looping/no controls, seam opacity dip over L x PHI^-6 either side of the loop point (L = clip length), opacity
     PHI^-1 + (1 - PHI^-1) x DIAL_POLITE_DIRTY, prefers-reduced-motion = poster only, paused off-screen / hidden tab / while enlarged.
     Fires 'character:mount' on the element once its poster is in.
   TAP (enlarge on): the element itself, or its closest button / link / [data-character-hit], opens the ENLARGED VIEW: a fixed full-screen
     black layer, her media fitted to the screen (iPhone portrait: full width), no page scroll or overscroll behind it, a close (x) control,
     a tap anywhere (she fills nearly a whole phone screen; ignored for PHI^-1 s after opening), or Escape, closes it. Focus returns to what opened it.
   EVOLUTION: left open, the view walks the character's ordered stages. Stage k arrives after the layer below it has been held for
     L x dwell_k x PHI^(1/2 - dial): dirtier = sooner, politer = longer (a ratio only; L = the current clip's length). A 'clip' stage
     cross-fades in over L x PHI^-4 and replaces the clip below; an 'overlay' stage fades in on top. Free-wheel: if a stage is not loaded
     yet when it is due, the current loop just keeps playing and the stage fades in the moment it arrives (no stall, no dead stop).
     Zero stages = the base loop, full size. Closing resets; reopening starts from the base loop again (loaded stages stay cached).
   LOADING: stage media is NEVER requested up front. Only once the enlarged view has been opened, one file per idle slot
     (requestIdleCallback, the js/load-tiers.js convention: >= 8 ms left, PHI^-2 s gap), fetched into memory (blob) so later opens are
     instant; skipped on Save-Data / 2g (she stays on the base loop). Sizes, alphas and times are phi ratios only. About 5 KB. */
(function (w, d) {
  'use strict';
  var PHI = (1 + Math.sqrt(5)) / 2, MS = 1000, MAN = 'data/characters.js?v=1';
  function P(n) { return Math.pow(PHI, n); }
  function f3(n) { return (+n).toFixed(3); }
  var RM = w.matchMedia ? w.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  function dial() { var D = w.DIAL_POLITE_DIRTY || {}, x = +D.value || 0; return Math.max(0, Math.min(1, x)); }
  function base() { return 1 / PHI + (1 - 1 / PHI) * dial(); }
  var ric = w.requestIdleCallback || function (f) { return setTimeout(function () { f({ timeRemaining: function () { return 8; }, didTimeout: false }); }, MS * P(-3)); };
  function idle(fn) { requestAnimationFrame(function () { setTimeout(function () { ric(fn, { timeout: Math.round(MS * PHI) }); }, Math.round(MS * P(-2))); }); }
  function slow() { var c = navigator.connection || {}; return !!c.saveData || /(^|-)2g$/.test(c.effectiveType || ''); }
  function ver(c) { return '?v=' + (c.v || 1); }

  // ---------- manifest ----------
  var manQ = null;
  function manifest(cb) {
    if (w.CHARACTERS) return cb(w.CHARACTERS);
    if (manQ) return manQ.push(cb);
    manQ = [cb];
    var s = d.createElement('script'); s.src = MAN; s.async = true;
    s.onload = s.onerror = function () { var q = manQ; manQ = null; q.forEach(function (f) { try { f(w.CHARACTERS || {}); } catch (e) {} }); };
    d.head.appendChild(s);
  }

  // ---------- shared video bits ----------
  function video(poster) {
    var v = d.createElement('video');
    v.className = 'hv'; v.muted = true; v.defaultMuted = true; v.setAttribute('muted', ''); v.playsInline = true; v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', ''); v.loop = true; v.preload = 'none'; v.controls = false; v.setAttribute('aria-hidden', 'true');
    v.setAttribute('disablepictureinpicture', ''); v.setAttribute('disableremoteplayback', ''); v.tabIndex = -1;
    if (poster) v.poster = poster;
    return v;
  }
  function sources(v, m, q) { ['webm', 'mp4'].forEach(function (x) { if (!m[x]) return; var s = d.createElement('source'); s.src = m[x] + q; s.type = 'video/' + x; v.appendChild(s); }); }
  function kick(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  // seam: opacity dips to 0 over L x PHI^-6 either side of the loop point; runs only while the clip plays
  function seam(v, top) {
    var run = false, wrapped = false, lastT = 0;
    function tick() {
      if (v.paused || !v.isConnected) { run = false; return; }
      var L = v.duration, t = v.currentTime;
      if (L && isFinite(L)) {
        if (t < lastT) wrapped = true; lastT = t;
        var f = L * P(-6), k = Math.min(1, (L - t) / f, wrapped ? t / f : 1);
        v.style.opacity = f3(top() * Math.max(0, k));
      }
      requestAnimationFrame(tick);
    }
    v.addEventListener('playing', function () { if (!run) { run = true; requestAnimationFrame(tick); } });
  }

  // ---------- instances ----------
  var inst = [], bigOpen = false;
  function mount(el, id) {
    if (!el || el.__chr) return el && el.__chr;
    id = id || el.getAttribute('data-character');
    var c = (w.CHARACTERS || {})[id]; if (!c) return null;
    var q = ver(c), v = video(c.poster + q), vis = true, started = false;
    v.style.opacity = f3(base());
    el.appendChild(v);
    var I = { el: el, id: id, v: v, play: function () { if (!started || !vis || d.hidden || bigOpen) return; kick(v); }, pause: function () { v.pause(); } };
    el.__chr = I; inst.push(I);
    if (el.getAttribute('data-character-enlarge') !== 'off') wire(el, id);
    try { el.dispatchEvent(new CustomEvent('character:mount', { detail: { id: id } })); } catch (e) {}
    if (RM.matches) return I;
    seam(v, base);
    idle(function () { sources(v, c.loop, q); v.autoplay = true; started = true; v.load(); I.play(); });
    d.addEventListener('visibilitychange', function () { if (d.hidden) v.pause(); else I.play(); });
    if (w.IntersectionObserver) new IntersectionObserver(function (es) { vis = es[es.length - 1].isIntersecting; if (vis) I.play(); else v.pause(); }).observe(el);
    return I;
  }
  function wire(el, id) {
    var hit = (el.closest && el.closest('button,a,[data-character-hit]')) || el;
    if (hit === el) { el.setAttribute('role', 'button'); el.tabIndex = 0; el.style.cursor = 'pointer'; if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', 'Open ' + ((w.CHARACTERS[id] || {}).name || id)); }
    if (hit.__chrHit) return; hit.__chrHit = 1;
    hit.setAttribute('aria-haspopup', 'dialog');
    hit.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); open(id, hit); });
    if (hit === el) el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(id, el); } });
  }
  function scan(root, cb) {
    manifest(function () {
      var list = (root || d).querySelectorAll ? (root || d).querySelectorAll('[data-character]') : [];
      for (var i = 0; i < list.length; i++) mount(list[i]);
      if (cb) cb();
    });
  }

  // ---------- stage cache: idle-only, one file per idle slot, kept as blobs ----------
  var cache = {};   // id -> [ {url, kind} | promise-ish ]
  function pick(s) {
    if (s.src) return s.src;
    var t = d.createElement('video');
    if (s.webm && t.canPlayType && t.canPlayType('video/webm; codecs="vp9"')) return s.webm;
    return s.mp4 || s.webm;
  }
  function loadStages(c, q) {
    var C = cache[c.id] || (cache[c.id] = { got: [], waiters: [], busy: false, next: 0 });
    if (C.busy || slow()) return C;
    var st = c.stages || [];
    function step() {
      if (C.next >= st.length) { C.busy = false; return; }
      C.busy = true;
      ric(function (dl) {
        if (dl && !dl.didTimeout && dl.timeRemaining() < 8) return step();
        var k = C.next, s = st[k], u = pick(s);
        function fin(url) { C.got[k] = url || null; C.next++; var ws = C.waiters[k]; C.waiters[k] = null; if (ws) ws.forEach(function (f) { f(); }); setTimeout(step, Math.round(MS * P(-2))); }
        if (!u || !w.fetch) return fin(u ? u + q : null);
        fetch(u + q, { priority: 'low' }).then(function (r) { if (!r.ok) throw 0; return r.blob(); })
          .then(function (b) { fin(URL.createObjectURL(b)); }, function () { fin(null); });
      }, { timeout: Math.round(MS * P(4)) });
    }
    step();
    return C;
  }
  function whenStage(c, k, fn) {
    var C = cache[c.id];
    if (C && C.next > k) return fn(C.got[k]);
    if (!C) return;
    (C.waiters[k] || (C.waiters[k] = [])).push(fn);
  }

  // ---------- enlarged view ----------
  var styled = false, cur = null;
  function style() {
    if (styled) return; styled = true;
    var T = f3(P(-2)) + 's';
    var css = 'html.chx-lock,html.chx-lock body{overflow:hidden!important;overscroll-behavior:none}' +
      '#chx{position:fixed;inset:0;z-index:2147483646;background:#000;display:flex;align-items:center;justify-content:center;' +
        'overscroll-behavior:none;touch-action:none;-webkit-user-select:none;user-select:none;opacity:0;transition:opacity ' + T + ' ease;-webkit-tap-highlight-color:transparent}' +
      '#chx.on{opacity:1}' +
      '#chx .chx-st{position:relative;overflow:hidden;background:#000;max-width:100vw;max-height:100vh;max-height:100dvh}' +
      '#chx .chx-l{position:absolute;inset:0;opacity:0;transition:opacity var(--chx-x,' + f3(P(0)) + 's) ease-in-out}#chx .chx-l.on{opacity:1}' +
      '#chx .chx-l video,#chx .chx-l img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;background:transparent}' +
      '#chx .chx-x{position:fixed;z-index:1;top:max(env(safe-area-inset-top),' + f3(P(-1)) + 'em);right:max(env(safe-area-inset-right),' + f3(P(-1)) + 'em);' +
        'width:' + f3(P(1.5)) + 'em;height:' + f3(P(1.5)) + 'em;padding:0;margin:0;border-radius:50%;border:1px solid #1F5478;background:rgba(0,0,0,' + f3(P(-1)) + ');' +
        'color:#9DBCCE;font:normal ' + f3(P(0.5)) + 'em/1 system-ui,-apple-system,sans-serif;cursor:pointer;-webkit-appearance:none;appearance:none}' +
      '#chx .chx-x:focus{outline:none}#chx .chx-x:focus-visible,#chx .chx-x:hover{border-color:#0AF2FF;color:#0AF2FF}' +
      '@media (prefers-reduced-motion:reduce){#chx,#chx .chx-l{transition:none}}';
    var s = d.createElement('style'); s.textContent = css; d.head.appendChild(s);
  }
  function fit(st, a) {   // her media fitted inside the screen at its own aspect (portrait phone: full width)
    var W = w.innerWidth, H = w.innerHeight, wd = Math.min(W, H * a);
    st.style.width = Math.round(wd) + 'px'; st.style.height = Math.round(wd / a) + 'px';
  }
  function open(id, from) {
    manifest(function (M) {
      var c = M[id]; if (!c || cur) return;
      style();
      try { w.PhiAdapt && w.PhiAdapt.signal('character', 't'); } catch (e) {}
      var q = ver(c), a = +c.aspect || P(-1);
      var o = d.createElement('div'); o.id = 'chx'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true'); o.setAttribute('aria-label', c.name || id);
      var st = d.createElement('div'); st.className = 'chx-st';
      var x = d.createElement('button'); x.type = 'button'; x.className = 'chx-x'; x.setAttribute('aria-label', 'Close'); x.innerHTML = '&times;';
      o.appendChild(st); o.appendChild(x); d.body.appendChild(o);
      d.documentElement.classList.add('chx-lock');
      fit(st, a);
      var S = cur = { c: c, o: o, st: st, from: from, timers: [], dead: false, layers: [], onResize: function () { fit(st, a); } };
      w.addEventListener('resize', S.onResize);
      bigOpen = true; inst.forEach(function (I) { I.pause(); });
      var t0 = Date.now();   // any tap closes (on a phone she fills nearly the whole screen, so tap-out = tap anywhere), not within PHI^-1 s of opening
      o.addEventListener('click', function (e) { if (e.target === x || Date.now() - t0 > MS / PHI) close(); });
      o.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });   // no rubber-band scroll behind her
      S.onKey = function (e) { if (e.key === 'Escape') close(); };
      d.addEventListener('keydown', S.onKey);
      requestAnimationFrame(function () { o.classList.add('on'); });
      try { x.focus({ preventScroll: true }); } catch (e) {}
      if (RM.matches) {   // reduced motion: her still, nothing plays or evolves
        var im = d.createElement('img'); im.src = c.poster + q; im.alt = '';
        var l0 = d.createElement('div'); l0.className = 'chx-l on'; l0.appendChild(im); st.appendChild(l0);
        return;
      }
      var v = video(c.poster + q); v.preload = 'auto'; sources(v, c.loop, q);
      layer(S, v, 'clip', true);
      kick(v);
      var stages = c.stages || [];
      if (!stages.length) return;   // zero stages: the base loop, full size
      idle(function () { if (!S.dead) loadStages(c, q); });
      schedule(S, 0, v);
    });
  }
  function layer(S, el, kind, first) {
    var l = d.createElement('div'); l.className = 'chx-l'; l.appendChild(el); S.st.appendChild(l);
    if (el.tagName === 'VIDEO') seam(el, function () { return 1; });
    var on = function () { requestAnimationFrame(function () { l.classList.add('on'); }); };
    if (first || el.tagName !== 'VIDEO') on(); else el.addEventListener('playing', on, { once: true });
    S.layers.push({ l: l, el: el, kind: kind });
    return l;
  }
  function lenOf(v) { var L = v && v.duration; return (L && isFinite(L)) ? L : P(4); }   // fallback before metadata: PHI^4 s
  function schedule(S, k, below) {
    var c = S.c, s = c.stages[k]; if (!s || S.dead) return;
    var dwell = lenOf(below) * (+s.dwell || 1) * P(1 / 2 - dial());
    S.timers.push(setTimeout(function () {
      whenStage(c, k, function (url) {
        if (S.dead) return;
        if (!url) return schedule(S, k + 1, below);   // missing file: skip it, keep evolving
        var el, kind = s.kind === 'overlay' ? 'overlay' : 'clip', X = lenOf(below) * P(-4);
        S.st.style.setProperty('--chx-x', f3(X) + 's');
        if (/\.(png|webp|jpe?g|gif|avif)(\?|$)/i.test(pick(s)) && s.src) { el = d.createElement('img'); el.alt = ''; el.src = url; }
        else { el = video(''); el.preload = 'auto'; el.src = url; }
        var prev = S.layers.filter(function (L) { return L.kind === 'clip'; }).pop();
        layer(S, el, kind);
        if (el.tagName === 'VIDEO') kick(el);
        if (kind === 'clip' && prev) S.timers.push(setTimeout(function () { prev.l.classList.remove('on'); S.timers.push(setTimeout(function () { try { prev.el.pause(); } catch (e) {} if (prev.l.parentNode) prev.l.parentNode.removeChild(prev.l); }, X * MS)); }, X * MS));
        var nb = el.tagName === 'VIDEO' && kind === 'clip' ? el : below;
        var go = function () { schedule(S, k + 1, nb); };
        if (nb !== below && !(nb.duration && isFinite(nb.duration))) nb.addEventListener('loadedmetadata', go, { once: true }); else go();
      });
      loadStages(c, ver(c));   // nudge the idle queue in case it was paused
    }, dwell * MS));
  }
  function close() {
    var S = cur; if (!S) return; cur = null; S.dead = true;
    S.timers.forEach(clearTimeout);
    w.removeEventListener('resize', S.onResize); d.removeEventListener('keydown', S.onKey);
    S.layers.forEach(function (L) { try { L.el.pause && L.el.pause(); } catch (e) {} });
    S.o.classList.remove('on');
    d.documentElement.classList.remove('chx-lock');
    bigOpen = false; inst.forEach(function (I) { I.play(); });
    setTimeout(function () { if (S.o.parentNode) S.o.parentNode.removeChild(S.o); }, RM.matches ? 0 : MS * P(-2));
    try { S.from && S.from.focus && S.from.focus({ preventScroll: true }); } catch (e) {}
  }

  w.Character = { scan: scan, mount: mount, open: open, close: close, manifest: manifest, isOpen: function () { return !!cur; } };
  w.Hostess = { mount: function (el) { var r = null; manifest(function () { r = mount(el, 'hostess'); }); return r; } };   // old js/hostess.js entry point
  scan(d);
})(window, document);
