/* Central site config (adult branch). The shown name lives HERE ONLY: SITE_NAME is the name; SITE_TITLE (title / header name) is built from it.
   Static markup carries {N} in attributes listed by data-sn-attr, and <span data-sn></span> for text; filled at DOMContentLoaded.
   Scripts read window.SITE_NAME (or the <html data-who> it sets). */
window.SITE_NAME = 'Edgar';
window.SITE_TITLE = 'R+ ' + window.SITE_NAME;
/* Polite <-> Dirty dial: 0 = Polite, 1 = Dirty (continuous ratio; default 0.618 = phi ratio, leaning dirty; nothing reads it yet).
   Dirty max stays implied only: no explicit nudity at any setting. */
window.DIAL_POLITE_DIRTY = { value: 0.618, min: 0, max: 1, labels: { 0: 'Polite', 1: 'Dirty' } };
(function (d) {
  var N = window.SITE_NAME, T = window.SITE_TITLE;
  d.title = T;   // set at once, so the locked gate page carries the title too
  d.documentElement.setAttribute('data-who', N);
  function fill(root) {
    root = root || d;
    var a = root.querySelectorAll('[data-sn]'), i;
    for (i = 0; i < a.length; i++) a[i].textContent = N;
    var b = root.querySelectorAll('[data-sn-attr]');
    for (i = 0; i < b.length; i++) {
      var names = b[i].getAttribute('data-sn-attr').split(',');
      for (var j = 0; j < names.length; j++) { var v = b[i].getAttribute(names[j]); if (v) b[i].setAttribute(names[j], v.split('{N}').join(N)); }
    }
    var a2 = root.querySelectorAll('[data-st]');
    for (i = 0; i < a2.length; i++) a2[i].textContent = T;
    if (/\{[TN]\}/.test(d.title)) d.title = d.title.split('{T}').join(T).split('{N}').join(N);
  }
  window.SiteName = { name: N, title: T, fill: fill, t: function (s) { return String(s).split('{N}').join(N); } };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', function () { fill(); }); else fill();
})(document);
