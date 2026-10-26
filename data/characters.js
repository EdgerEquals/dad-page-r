/* characters.js: the manifest for js/character.js (Danny 17:38 AWST 26 Oct: "Will use her again elsewhere within the site so let's build
   the architecture for that. If I press on her she goes to a bigger view and then if you leave her on there the animation evolves overtime
   and she slowly reveals more parts of herself in a sexy and seductive way, but all these things other extra animation layers will slowly
   load in the background during idle time as they weren't all be needed at once.")
   CONTENT RULE (every character, every stage): cheeky, seductive, IMPLIED ONLY. No explicit nudity, ever (GitHub Pages terms + Danny's
   standing rule): no bare breasts, nipples or genitals; reveals are suggested (a turn, a slipping strap, a hand or shadow covering).
   SCHEMA (one entry per character id; paths are relative to the site root):
     id        same as the key; used as data-character="<id>" on any element.
     poster    tiny still shown first (JPG/WebP, aim <= 8 KB). Also the whole view under prefers-reduced-motion.
     loop      { webm, mp4 } the base idle loop (muted, no audio track). Aim <= 400 KB each, 480 px wide.
     aspect    width / height of the media (the enlarged view fits it to the screen with this).
     stages    ordered list, may be EMPTY. Each stage, once loaded, takes over in the enlarged view after its dwell:
       { id,
         kind:  'clip'    a new loop that cross-fades in and replaces the one below it (webm + mp4), or
                'overlay' a layer drawn on top of the current loop (transparent webm with alpha, or a PNG/WebP still: src),
         webm, mp4 | src,
         dwell: how long the PREVIOUS layer is held before this stage arrives, as a ratio of the base loop's length
                (1 = one loop; use phi steps: 0.618, 1, 1.618, 2.618 ...). js/character.js scales it by the Polite/Dirty dial.
         kb:    approximate transfer size (budget check; stages load in order, one per idle slot) }
   Stage media is never requested up front: only after the enlarged view has been opened, one file per idle slot. */
window.CHARACTERS = {
  hostess: {
    id: 'hostess',
    name: 'Hostess',
    poster: 'media/hostess-poster.jpg',
    loop: { webm: 'media/hostess-loop.webm', mp4: 'media/hostess-loop.mp4' },
    aspect: 480 / 848,
    v: 2,  // 2 = no-point loop (Danny 26 Oct: "I don't like it when you points so just drop that part")
    // no stage media yet (placeholders only, nothing is fetched while this is empty). Next girl's stages go here, e.g.:
    // { id: 'turn',  kind: 'clip',    webm: 'media/hostess-s1-turn.webm',  mp4: 'media/hostess-s1-turn.mp4',  dwell: 1.618, kb: 350 },
    // { id: 'strap', kind: 'clip',    webm: 'media/hostess-s2-strap.webm', mp4: 'media/hostess-s2-strap.mp4', dwell: 2.618, kb: 350 },
    // { id: 'wink',  kind: 'overlay', webm: 'media/hostess-s3-wink.webm',                                     dwell: 1,     kb: 120 }
    stages: []
  }
};
