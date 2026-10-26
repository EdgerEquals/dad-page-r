# dad-page-r (18+ branch)

Adult (18+) branch of the dashboard, live at https://edgerequals.github.io/dad-page-r/ . Not indexed (`noindex,nofollow` + `robots.txt`).

- Engine, layout and layers copied from the dashboard's main tree; same tiered loading (`js/load-tiers.js`), slim header mark,
  fixed header/footer, black backdrop with no overscroll, portrait iPhone fit and palette.
- **18+ gate**: `js/gate.js` runs first in `<head>` of every page. Until unlocked it shows an age confirmation + passcode form and
  stops the rest of the page loading. It compares SHA-256(passcode) with `js/gate-config.js` (hash only; the passcode is never in
  this repo) and remembers success in localStorage, tied to the hash (a new hash re-locks every device).
- **Shown name**: `js/site-config.js` `SITE_NAME` is the one place the name lives. Static markup uses `{N}` in attributes listed by
  `data-sn-attr` and `<span data-sn></span>` for text; scripts read `window.SITE_NAME`.
- Fact ticker reads the local snapshot `data/facts.json` (each fact cites its source).
- Heavy parts load on tap only: the logo zoom, its sound engine (`js/logo-sound.js`, `js/logo-sound-dad.js`) and Tone.js (`vendor/tone/`, MIT).
- `dials.html` is the dial sandbox (also gated).
- Page guard: run `bash tools/install_page_guard.sh` once per clone. Rollback tag at the parent commit before every push.
