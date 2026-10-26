/* 18+ passcode gate (adult branch).
   index.html is ONLY the gate: a tiny page (this file + two small configs, no other assets), so the gate is instant and nothing
   heavy loads before unlock. The dashboard itself is site.html; dials.html is the sandbox.
   - Gate page, unlocked (remembered on this device with no expiry, until Log out): goes straight on to site.html.
   - Gate page, locked: draws the age confirmation + passcode form. Success = SHA-256(passcode) equals GATE_CONFIG.hash ->
     remembered in localStorage (tied to that hash, so a new passcode re-locks every device) -> site.html.
   - Any other page (site.html, dials.html) loaded while locked: stops loading and goes back to the gate.
   - Log out: any [data-gate-logout] control clears the unlock and returns to the gate.
   Sizes and timings are ratios of PHI only (adaptive-phi-principle / phi-timing-rules). Dad palette on pure black. */
(function (w, d) {
  var C = w.GATE_CONFIG || {}, KEY = C.key || 'dadR.gate.v1', H = String(C.hash || '');
  var PHI = (1 + Math.sqrt(5)) / 2, SITE = 'site.html', GATE = './';
  var isGate = d.documentElement.hasAttribute('data-gate-page');
  var open = false;
  try { open = !!H && w.localStorage.getItem(KEY) === H; } catch (e) {}
  w.GATE_OPEN = open;
  w.GateLogout = function () { try { w.localStorage.removeItem(KEY); } catch (e) {} w.location.replace(GATE); };
  d.addEventListener('click', function (e) { var t = e.target && e.target.closest && e.target.closest('[data-gate-logout]'); if (t) { e.preventDefault(); w.GateLogout(); } });
  function enter() { w.location.replace(SITE + w.location.search + w.location.hash); }
  if (!isGate) {
    if (open) return;
    try { w.stop(); } catch (e) {}
    d.documentElement.style.background = '#000';
    w.location.replace(GATE + w.location.search + w.location.hash);
    return;
  }
  if (open) { enter(); return; }
  var root = d.documentElement; root.className += ' gate-locked';
  var css = 'html,body{margin:0;background:#000;height:100%;overflow:hidden;overscroll-behavior:none;color:#9DBCCE;font:normal 1rem/' + PHI.toFixed(3) + ' system-ui,-apple-system,sans-serif}' +
    '#gate{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:max(env(safe-area-inset-top),' + PHI.toFixed(3) + 'em) ' + PHI.toFixed(3) + 'em max(env(safe-area-inset-bottom),' + PHI.toFixed(3) + 'em);box-sizing:border-box;background:#000}' +
    '#gate form{width:min(100%,' + Math.pow(PHI, 6).toFixed(2) + 'em);border:1px solid #1F5478;border-radius:' + (1 / PHI).toFixed(3) + 'em;padding:' + PHI.toFixed(3) + 'em;background:rgba(0,0,0,' + (1 - Math.pow(PHI, -4)).toFixed(3) + ');box-shadow:0 0 ' + PHI.toFixed(3) + 'em rgba(10,242,255,' + Math.pow(PHI, -4).toFixed(3) + ')}' +
        '#gate p{margin:0 0 ' + (1 / PHI).toFixed(3) + 'em;color:#85A6BB;font-size:' + Math.pow(PHI, -0.5).toFixed(3) + 'em}' +
    '#gate label{display:flex;gap:' + (1 / PHI).toFixed(3) + 'em;align-items:flex-start;margin:0}' +
    '#gate .ag{margin-bottom:' + (1 / PHI).toFixed(3) + 'em}' +
    '#gate input[type=password]{width:100%;box-sizing:border-box;font-size:16px;padding:' + (1 / PHI).toFixed(3) + 'em;background:#000;color:#9DBCCE;border:1px solid #143A57;border-radius:' + Math.pow(PHI, -2).toFixed(3) + 'em;margin:0 0 ' + (1 / PHI).toFixed(3) + 'em}' +
    '#gate input[type=password]:focus{outline:none;border-color:#0AF2FF}' +
    '#gate button{width:100%;font-size:1em;padding:' + (1 / PHI).toFixed(3) + 'em;background:#143A57;color:#0AF2FF;border:1px solid #1F5478;border-radius:' + Math.pow(PHI, -2).toFixed(3) + 'em}' +
    '#gate button:disabled{opacity:' + (1 / PHI).toFixed(3) + '}' +
    '#gate .msg{min-height:' + PHI.toFixed(3) + 'em;margin:' + (1 / PHI).toFixed(3) + 'em 0 0;color:#00FF41;font-family:ui-monospace,Menlo,monospace;font-size:' + Math.pow(PHI, -0.5).toFixed(3) + 'em}' +
    '#gate .msg.bad{color:#FF0033}';
  var P = function (n) { return Math.pow(PHI, n).toFixed(3); };
  css += '#gate .mk{display:flex;align-items:center;justify-content:center;gap:' + P(-1) + 'em;margin:0 0 ' + P(0) + 'em;color:#9DBCCE;font-weight:600;letter-spacing:' + P(-4) + 'em;font-size:' + P(0.5) + 'em}' +
    '#gate .mk svg{width:' + P(1.5) + 'em;height:' + P(1.5) + 'em;overflow:visible}' +
    '#gate .mk .o{transform-origin:32px 32px;animation:gOrb ' + P(7) + 's linear infinite}#gate .mk .o2{animation-duration:' + P(8) + 's;animation-direction:reverse}' +
    '#gate .mk .b{animation:gBar ' + P(3) + 's ease-in-out infinite alternate}#gate .mk .b2{animation-delay:-' + (Math.pow(PHI, 3) * 0.618).toFixed(3) + 's}' +
    '#gate .bg{position:fixed;inset:0;pointer-events:none;overflow:hidden;opacity:' + P(-4) + ';transition:opacity ' + P(2) + 's ease}' +
    '#gate.hv-on .bg{opacity:' + P(-6) + '}' +   // rings fade under the hostess
    '#gate .hvw{position:fixed;inset:0;pointer-events:none;overflow:hidden}' +
    '#gate .hvw .hv{position:absolute;top:0;height:100%;width:auto;max-width:none;left:50%;transform:translateX(-' + (100 / PHI / PHI).toFixed(1) + '%);background:#000}' +   // her body right of centre, the sweeping hand lands on the box
    '@media (orientation:portrait){#gate{align-items:flex-end;padding-bottom:max(env(safe-area-inset-bottom),' + (100 * Math.pow(PHI, -5)).toFixed(2) + 'svh)}}' +
    '#gate .bg i{position:absolute;left:50%;top:50%;width:' + P(6) + 'vmax;height:' + P(5) + 'vmax;margin:-' + (Math.pow(PHI, 5) / 2).toFixed(3) + 'vmax 0 0 -' + (Math.pow(PHI, 6) / 2).toFixed(3) + 'vmax;border:1px solid #0AF2FF;border-radius:50%;animation:gOrb ' + P(8) + 's linear infinite}' +
    '#gate .bg i:nth-child(2){border-color:#00C896;animation-duration:' + P(9) + 's;animation-direction:reverse;transform:rotate(' + (360 / PHI / PHI).toFixed(1) + 'deg)}' +
    '#gate .bg i:nth-child(3){border-color:#1F5478;width:' + P(5) + 'vmax;height:' + P(4) + 'vmax;margin:-' + (Math.pow(PHI, 4) / 2).toFixed(3) + 'vmax 0 0 -' + (Math.pow(PHI, 5) / 2).toFixed(3) + 'vmax;animation-duration:' + P(7) + 's}' +
    '#gate form{position:relative}#gate .sub{color:#0AF2FF;letter-spacing:' + P(-3) + 'em;text-transform:uppercase;font-size:' + P(-1) + 'em;margin:0 0 ' + P(-1) + 'em}' +
    '@keyframes gOrb{to{transform:rotate(360deg)}}@keyframes gBar{from{opacity:' + P(-1) + '}to{opacity:1}}' +
    '@media (prefers-reduced-motion:reduce){#gate *{animation:none!important}}';
  var st = d.createElement('style'); st.textContent = css; (d.head || root).appendChild(st);
  var body = d.body;
  var g = d.createElement('div'); g.id = 'gate';
  var T = String(w.SITE_TITLE || d.title || '').replace(/[&<>"]/g, '');
  var MK = '<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke="#5F86A0" stroke-opacity=".5"><ellipse class="o" cx="32" cy="32" rx="29" ry="11"/><ellipse class="o o2" cx="32" cy="32" rx="26" ry="14"/></g>' +
    '<g fill="#00C896"><rect class="b" x="16.9" y="19.6" width="30.2" height="11" rx="5.5"/><rect class="b b2" x="16.9" y="33.4" width="30.2" height="11" rx="5.5"/></g></svg>';
  g.innerHTML = '<div class="bg" aria-hidden="true"><i></i><i></i><i></i></div><form autocomplete="off" novalidate><h1 class="mk">' + MK + '<span>' + T + '</span></h1><p class="sub">18+ only</p><p>This site is for adults. Confirm your age and enter the passcode.</p>' +
    '<label class="ag"><input type="checkbox" id="g-age"> <span>I confirm I am 18 or older.</span></label>' +
    '<input type="password" id="g-pw" placeholder="passcode" aria-label="Passcode" autocomplete="off" autocapitalize="off" spellcheck="false">' +
    '<button type="submit" id="g-go">Enter</button><div class="msg" id="g-msg" role="status" aria-live="polite"></div></form>';
  body.appendChild(g);
  // hostess loop behind the box: after first paint + idle, never before the mark and box are drawn (js/hostess.js)
  var hvw = d.createElement('div'); hvw.className = 'hvw'; hvw.setAttribute('aria-hidden', 'true'); g.insertBefore(hvw, g.firstChild.nextSibling);
  w.requestAnimationFrame(function () { setTimeout(function () {
    var sc = d.createElement('script'); sc.src = 'js/hostess.js?v=1'; sc.async = true;
    sc.onload = function () { try { if (w.Hostess) { w.Hostess.mount(hvw); g.className = 'hv-on'; } } catch (e) {} };
    d.head.appendChild(sc);
  }, Math.round(1000 / PHI)); });
  var f = g.querySelector('form'), age = g.querySelector('#g-age'), pw = g.querySelector('#g-pw'), go = g.querySelector('#g-go'), msg = g.querySelector('#g-msg');
  function say(t, bad) { msg.textContent = t; msg.className = 'msg' + (bad ? ' bad' : ''); }
  function hex(buf) { var a = new Uint8Array(buf), s = ''; for (var i = 0; i < a.length; i++) s += (a[i] < 16 ? '0' : '') + a[i].toString(16); return s; }
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!age.checked) { say('confirm you are 18 or older first', true); return; }
    if (!pw.value) { say('enter the passcode', true); return; }
    if (!(w.crypto && w.crypto.subtle && w.TextEncoder)) { say('this browser cannot check the passcode', true); return; }
    go.disabled = true; say('checking\u2026');
    w.crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw.value)).then(function (b) {
      if (H && hex(b) === H) { try { w.localStorage.setItem(KEY, H); } catch (x) {} say('[ OK ] access granted'); enter(); }
      else { go.disabled = false; pw.value = ''; say('[ DENIED ] wrong passcode', true); setTimeout(function () { pw.focus(); }, 1000 / PHI); }
    }, function () { go.disabled = false; say('could not check the passcode', true); });
  });
})(window, document);
