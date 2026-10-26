/* first-content.js: the first content item on Dad's home screen (owner 15:24 AWST 26 Oct: "create the first piece of content for my
   website and just have it be my logo page so if I press on that it goes to where I add my logo").
   ONE card in the content layer (#home-main): the hostess loop preview window (js/character.js + data/characters.js; was the big equals mark until 26 Oct
   17:23 AWST) with the label SITE_TITLE.
   TAP (Danny 17:38 AWST 26 Oct): opens HER enlarged view (js/character.js: full-screen black, evolves through her stages while left
   open, close control / tap-out). It no longer opens the logo zoom; the header mini mark still does that.
   LAYERS: the card sits in the normal flow (z-index 1): the space loop, matrix rain, emoji scene, Sun/Earth and ping layers (fixed,
   z-index -1, pointer-events none) move behind it; the front orbit layer (z-index 4, pointer-events none) passes in front of it without
   taking taps. Transparent over black (footer principle: no dark-blue box), only a hairline and a soft cyan glow on hover/focus.
   Every size, alpha and time is a power of phi of a measured anchor (the viewport's short side) or of the page's PHI ladder.
   Loaded at tier 1 (after first paint), about 3 KB. Usage: a tap counts as a 'dad-mark' tap in PhiAdapt (on-device only). */
(function (root, doc) {
  'use strict';
  var PHI = (1 + Math.sqrt(5)) / 2, IP = 1 / PHI;
  function p(n) { return Math.pow(PHI, n); }                                          // phi rung n
  function r(n) { return +p(n).toFixed(4); }                                          // rung as a CSS number
  var main = doc.getElementById('home-main'), hb = doc.querySelector('.q-head .dad-zoom'), hi = hb && hb.querySelector('.dad-mark');
  if (!main || !hb || !hi || doc.querySelector('.fc')) return;
  var U = 'var(--fc-u,var(--hw-u,min(100vw,100svh * ' + r(-1) + ')))';   // fit: js/home-windows.js measures the header-to-footer box and sets --hw-u / --fc-u                                       // anchor: the viewport's short side (height x PHI^-1 so wide screens stay calm)
  var T = r(-2) + 's';                                                                // PHI^-2 s: the zoom's own open time
  var css =
    '.fc{position:relative;z-index:1;display:flex;justify-content:center;margin-top:calc(' + U + ' * ' + r(-5) + ');pointer-events:none}' +
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
  var st = doc.createElement('style'); st.textContent = css; doc.head.appendChild(st);
  var sec = doc.createElement('section'); sec.className = 'fc'; sec.setAttribute('aria-label', 'Content');
  var b = doc.createElement('button'); b.type = 'button'; b.className = 'fc-card'; b.setAttribute('aria-haspopup', 'dialog');
  b.setAttribute('aria-label', 'Open the hostess');
  var hvw = doc.createElement('span'); hvw.className = 'fc-hvw'; hvw.setAttribute('aria-hidden', 'true'); hvw.setAttribute('data-character', 'hostess');
  var t = doc.createElement('span'); t.className = 'fc-t'; t.textContent = (window.SITE_TITLE||window.SITE_NAME||'');
  b.appendChild(hvw); b.appendChild(t); sec.appendChild(b); main.insertBefore(sec, main.querySelector('.hw'));   // first, above the home windows (js/home-windows.js) whichever loads first
  // hostess in the card (js/character.js mounts every [data-character]: poster first, clip after first paint + idle, seam fade, opacity by
  // DIAL_POLITE_DIRTY; it also wires the card button so a tap opens her enlarged view)
  if (root.Character) root.Character.scan(sec);
  else { var sc = doc.createElement('script'); sc.src = 'js/character.js?v=1'; sc.async = true; doc.head.appendChild(sc); }   // scans on load
})(window, document);
