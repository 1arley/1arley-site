/**
 * Shared contract for the opening frame.
 *
 * The intro is a curtain, not a loader: the site must not be visible — or
 * clickable — for a single frame before it. That has to be decided *before the
 * first paint*, so the verdict lives in a tiny blocking script in <head> that
 * writes one attribute on <html>. CSS reads that attribute, and the client
 * component re-checks the same conditions before it plays anything.
 *
 * Both sides must agree. If they disagree, a visitor gets one frame of
 * something they did not ask for — exactly what this gate exists to prevent.
 */

/** The clip itself: 320x320, 1.03s, ~4.8 KB. */
export const INTRO_SRC = "/animations/terminal-intro.mp4";

/**
 * Conditions that mean "this visitor is not getting an intro". Kept in one
 * place because the <head> boot script (runs before first paint) and the client
 * component (owns the animation) must agree — a disagreement shows one frame of
 * something the visitor shouldn't see.
 *
 * Mobile is a first-class target and gets the intro exactly like desktop.
 * Touch, coarse pointer and narrow viewports are deliberately NOT here: the
 * mark flies to the header with plain transform math, so it lands correctly at
 * any size, and a phone visitor gets the same opening as everyone else. Don't
 * "optimise" a skip in here — the only real reasons to skip are motion
 * sensitivity and arriving on a deep link or a restored scroll position.
 */
export const INTRO_SKIP_QUERY = "(prefers-reduced-motion: reduce)";

/** Attribute on <html> that turns the server-rendered curtain on. */
export const INTRO_FLAG = "data-intro-curtain";

/**
 * Backstop, not the normal path. The component lifts the curtain well inside
 * this (START_GRACE_MS + travel ≈ 3.3s); this only fires if the bundle never
 * hydrates at all.
 *
 * That case is real and this script is what makes it survivable: it is inline,
 * so it runs even when the React chunks 404 or the network drops — it would
 * raise the curtain with nothing left to lower it, leaving a black page with no
 * way out. Failing open (drop the flag, show the site) is the only safe
 * direction for an unrecoverable state.
 */
const FAILSAFE_MS = 6000;

/**
 * Runs in <head>, before the body is parsed, so the curtain's visibility is
 * settled before the first paint. Kept as a string (not a component) because a
 * React effect would be far too late: the site would already have been painted.
 *
 * window.scrollY is absent on purpose — it is always 0 at this point. The
 * component re-checks it after hydration, which is where a restored scroll
 * position can actually be seen.
 */
export const INTRO_BOOT = `!function(){try{var d=document.documentElement,F=${JSON.stringify(
  INTRO_FLAG,
)};if(matchMedia(${JSON.stringify(
  INTRO_SKIP_QUERY,
)}).matches||location.hash)return;d.setAttribute(F,"on");setTimeout(function(){d.removeAttribute(F)},${FAILSAFE_MS})}catch(e){}}()`;
