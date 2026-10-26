/* first-content.js: the first content item on Dad's home screen (owner 15:24 AWST 26 Oct: "create the first piece of content for my
   website and just have it be my logo page so if I press on that it goes to where I add my logo").
   SHOWCASE (Danny 17:45 AWST 26 Oct: "Just leave the girl at the moment and any new girls we create just put them on there or any other
   animations just put them on there so I can press them and see what happens"): the main area holds ONLY this showcase. One card per
   character in data/characters.js (js/character.js), in manifest order; the hostess is first, labelled SITE_TITLE (she replaced the big
   equals mark 26 Oct 17:23 AWST). The six home windows and the topic quiz are gone (restore from tag pre-cleanmain-2026-10-26).
   TAP (Danny 17:38 AWST 26 Oct): opens HER enlarged view (js/character.js: full-screen black, evolves through her stages while left
   open, close control / tap-out). It no longer opens the logo zoom; the header mini mark still does that.
   LAYERS: the card sits in the normal flow (z-index 1): the space loop, matrix rain, emoji scene, Sun/Earth and ping layers (fixed,
   z-index -1, pointer-events none) move behind it; the front orbit layer (z-index 4, pointer-events none) passes in front of it without
   taking taps. Transparent over black (footer principle: no dark-blue box), only a hairline and a soft cyan glow on hover/focus.
   Every size, alpha and time is a power of phi of a measured anchor (the viewport's short side) or of the page's PHI ladder.
   Loaded at tier 1 (after first paint), about 3 KB. Usage: a tap counts as a 'character' tap in PhiAdapt (on-device only). */
(function (root, doc) {
  'use strict';
  var PHI = (1 + Math.sqrt(5)) / 2, IP = 1 / PHI;
  function p(n) { return Math.pow(PHI, n); }                                          // phi rung n
  function r(n) { return +p(n).toFixed(4); }                                          // rung as a CSS number
  var main = doc.getElementById('home-main');
  if (!main || doc.querySelector('.fc')) return;
  var U = 'var(--fc-u,min(100vw,100svh * ' + r(-1) + '))';                                       // anchor: the viewport's short side (height x PHI^-1 so wide screens stay calm)
  var T = r(-2) + 's';                                                                // PHI^-2 s: the zoom's own open time
  var css =
    '.fc{position:relative;z-index:1;display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-start;gap:calc(' + U + ' * ' + r(-5) + ');margin-top:calc(' + U + ' * ' + r(-5) + ');pointer-events:none}' +   // showcase: cards wrap, phi gaps
    '.fc-card{flex:none;pointer-events:auto;-webkit-appearance:none;appearance:none;display:flex;flex-direction:column;align-items:center;' +
      'gap:calc(' + U + ' * ' + r(-8) + ');padding:calc(' + U + ' * ' + r(-6) + ') calc(' + U + ' * ' + r(-5) + ');margin:0;' +
      'background:transparent;border:1px solid rgba(31,84,120,' + r(-1) + ');border-radius:calc(' + U + ' * ' + r(-6) + ');' +
      'color:#9DBCCE;font:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent;' +
      'transition:border-color ' + T + ' ease,box-shadow ' + T + ' ease,transform ' + r(-5) + 's ease}' +   // press inside the 0.1 s tap rail (PHI^-5 s)
    '.fc-hvw{position:relative;display:block;width:calc(' + U + ' * ' + r(-2) + ');aspect-ratio:480/848;overflow:hidden;background:#000;' +
      'border-radius:calc(' + U + ' * ' + r(-8) + ')}' +   // hostess preview window (Danny 17:23 AWST 26 Oct): replaces the big mark; the header mini mark is unchanged
    '.fc-hvw .hv{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;background:#000}' +
    '.fc-t{display:block;font-size:1rem;letter-spacing:calc(1em * ' + r(-6) + ');color:#9DBCCE;line-height:' + r(1) + '}' +
    '.fc-s{display:block;font-size:calc(1rem * ' + r(-1 / 2) + ');letter-spacing:calc(1em * ' + r(-4) + ');text-transform:uppercase;color:#85A6BB}' +
    '@media (hover:hover){.fc-card:hover{border-color:#0AF2FF;box-shadow:0 0 calc(' + U + ' * ' + r(-6) + ') rgba(10,242,255,' + r(-2) + ')}}' +
    '.fc-card:active{transform:scale(' + (1 - r(-6)).toFixed(4) + ')}' +
    '.fc-card:focus{outline:none}.fc-card:focus-visible{border-color:#0AF2FF;box-shadow:0 0 0 calc(' + U + ' * ' + r(-9) + ') #0AF2FF}' +
    'html[data-theme="light"] .fc-card{border-color:rgba(31,84,120,' + r(-2) + ');color:#1F5478}' +
    'html[data-theme="light"] .fc-t{color:#1F5478}html[data-theme="light"] .fc-s{color:#143A57}' +
    '@media (prefers-reduced-motion:reduce){.fc-card{transition:none}.fc-card:active{transform:none}}';
  // SHOWCASE BOX (ported from the retired js/home-windows.js, owner 16:25 AWST 26 Oct fit + whiteline 3): #home-main is a fixed box from
  // the header's bottom to the footer's top (measured, safe areas included) and scrolls inside with its own bar hidden; html/body keep
  // overflow hidden; header and footer stay put. With more characters the cards wrap and the box scrolls.
  css += '#home-main{position:fixed;left:0;right:0;top:var(--hm-top,0px);height:var(--hm-h,100svh);max-width:none;margin:0;box-sizing:border-box;' +
      'padding:0 max(env(safe-area-inset-right,0px),calc((100% - min(100%,860px)) / 2 + 18px)) calc(' + U + ' * ' + r(-4) + ') max(env(safe-area-inset-left,0px),calc((100% - min(100%,860px)) / 2 + 18px));' +
      'overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;scrollbar-width:none;touch-action:pan-y}' +
    '#home-main::-webkit-scrollbar{display:none}';
  var st = doc.createElement('style'); st.textContent = css; doc.head.appendChild(st);
  var sec = doc.createElement('section'); sec.className = 'fc'; sec.setAttribute('aria-label', 'Showcase'); main.appendChild(sec);
  // one card per character in data/characters.js, in manifest order (a new girl = a new manifest entry; nothing to add here).
  // js/character.js mounts each [data-character] (poster first, clip after first paint + idle, seam fade, opacity by DIAL_POLITE_DIRTY)
  // and wires each card button so a tap opens her enlarged view.
  function cards() {
    root.Character.manifest(function (M) {
      Object.keys(M || {}).forEach(function (id, i) {
        var c = M[id], b = doc.createElement('button'); b.type = 'button'; b.className = 'fc-card'; b.setAttribute('aria-label', 'Open ' + (c.name || id));
        var hvw = doc.createElement('span'); hvw.className = 'fc-hvw'; hvw.setAttribute('aria-hidden', 'true'); hvw.setAttribute('data-character', id);
        if (c.aspect) hvw.style.aspectRatio = String(+c.aspect);
        var t = doc.createElement('span'); t.className = 'fc-t';
        t.textContent = c.label || (i === 0 ? (root.SITE_TITLE || root.SITE_NAME || '') : (c.name || id));   // the first card keeps the site title under her
        b.appendChild(hvw); b.appendChild(t); sec.appendChild(b);
      });
      root.Character.scan(sec);
    });
  }
  // the drifting code layer stays in the page's own z<0 stack, not inside the fixed scroll box
  var hc = main.querySelector('.home-code'); if (hc) main.parentNode.insertBefore(hc, main);
  // FIT: measure the box between header and footer; the card unit (--fc-u) starts at the box's short side (landscape: the larger of
  // height x PHI^-1 and width x PHI^-2) and steps down the phi ladder until the first card fits with PHI^-3 of the box free.
  var de = doc.documentElement, hd = doc.getElementById('q-head'), ft = doc.querySelector('.foot'), fq = 0;
  function fit() {
    fq = 0;
    var top = hd ? Math.max(0, hd.getBoundingClientRect().bottom) : 0, bot = ft ? ft.getBoundingClientRect().top : innerHeight;
    var cs = getComputedStyle(main), w = Math.max(0, main.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) || de.clientWidth;
    var h = Math.max(0, bot - top), uu = de.clientWidth > innerHeight ? Math.max(h / PHI, w * p(-2)) : Math.min(w, h);
    de.style.setProperty('--hm-top', top + 'px'); de.style.setProperty('--hm-h', h + 'px');
    var card = sec.querySelector('.fc-card'); if (!card) { de.style.setProperty('--fc-u', uu + 'px'); return; }
    var room = h * (1 - p(-3)), cu = uu, n, rem = parseFloat(getComputedStyle(de).fontSize), floor = rem * PHI * PHI / p(-3);
    for (n = 0; n < 8; n++) { de.style.setProperty('--fc-u', cu + 'px'); if (card.offsetHeight <= room && card.offsetWidth <= w * (1 - p(-3))) break; if (cu / PHI < floor) break; cu /= PHI; }   // unit: 8 rungs is ample
  }
  function soon() { if (!fq) fq = requestAnimationFrame(fit); }
  fit(); addEventListener('resize', soon); addEventListener('orientationchange', soon);
  if (root.visualViewport) visualViewport.addEventListener('resize', soon);
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(soon);
  if (root.ResizeObserver) { var ro = new ResizeObserver(soon); if (hd) ro.observe(hd); if (ft) ro.observe(ft); }
  if (root.MutationObserver) new MutationObserver(soon).observe(sec, { childList: true });   // cards arrive after the manifest
  if (root.Character) cards();
  else { var sc = doc.createElement('script'); sc.src = 'js/character.js?v=1'; sc.async = true; sc.onload = cards; doc.head.appendChild(sc); }
})(window, document);
