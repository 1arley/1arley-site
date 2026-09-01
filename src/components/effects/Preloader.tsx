"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale } from "@/lib/i18n";

/** Minimum hold so the frame never flashes and the wordmark + strap actually
 *  register before the exit. The exit still resolves faster than the entrance. */
const MIN_HOLD_MS = 1400;

/** Hard ceiling: the curtain always lifts, even if a heavy asset hangs. */
const MAX_HOLD_MS = 3200;

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * SINAL — the site doesn't load, it switches on.
 *
 * A single opening frame (no fake counter, no progress line, no "loading"
 * copy). The wordmark clicks on via a bottom-up mask wipe while one hard-edged
 * light slash sweeps past — a "signal" cue, not a loader. Honest mono metadata
 * sits below it. Once the page is actually ready (fonts + the hero LCP asset)
 * and a minimum floor elapses, the whole frame tears upward (clip-path wipe)
 * straight into the hero; the exit resolves faster than the entrance.
 *
 * - Reduced motion / touch / narrow viewport: skipped entirely (CSS + JS).
 * - No-JS: CSS display:none (globals.css).
 * - Plays on every visit (no persisted skip) so the moment always lands.
 * - aria-hidden: true (decorative).
 */
export default function Preloader() {
  const { t } = useLocale();
  const [done, setDone] = useState(false);
  const reduce = useReducedMotion();

  /* ---------- skip + readiness gate ---------- */
  useEffect(() => {
    if (reduce) return;
    if (
      window.matchMedia(
        "(hover: none), (pointer: coarse), (max-width: 767px)",
      ).matches
    ) {
      setDone(true);
      return;
    }

    let cancelled = false;
    const release = () => {
      if (!cancelled) setDone(true);
    };

    // Never block: hard cap keeps the lift snappy even on a slow connection.
    const cap = setTimeout(release, MAX_HOLD_MS);

    // Honest readiness gate — fonts (next/font is self-hosted) + the hero LCP
    // image. If either is undefined or the browser can't probe it, resolve
    // immediately and lean on the min floor.
    const fontsReady =
      (document as Document & { fonts?: FontFaceSet }).fonts?.ready ??
      Promise.resolve();

    let imageReady: Promise<unknown> = Promise.resolve();
    if (typeof Image !== "undefined") {
      const img = new Image();
      img.src = "/header-guitar.jpg";
      imageReady =
        typeof img.decode === "function"
          ? img.decode().catch(() => {})
          : new Promise((res) => {
              img.onload = res;
              img.onerror = res;
            });
    }

    const minWait = new Promise((res) => setTimeout(res, MIN_HOLD_MS));

    Promise.all([fontsReady, imageReady, minWait]).then(() => {
      clearTimeout(cap);
      release();
    });

    return () => {
      cancelled = true;
      clearTimeout(cap);
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="preloader fixed inset-0 z-[90] overflow-hidden bg-black"
          aria-hidden="true"
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{
            clipPath: "inset(0 0 100% 0)",
            transition: { duration: 0.5, ease: [0.83, 0, 0.17, 1] },
          }}
        >
          {/* ---- one hard-edged light slash, a signal not a loader ---- */}
          <motion.div
            className="pointer-events-none absolute inset-y-[-12%] w-[2px] bg-white/60"
            style={{ transform: "rotate(10deg)", transformOrigin: "center" }}
            initial={{ left: "-4%", opacity: 0 }}
            animate={{
              left: "104%",
              opacity: [0, 0.75, 0.75, 0],
            }}
            transition={{
              duration: 0.5,
              delay: 0.12,
              ease: [0.5, 0, 0.2, 1],
              times: [0, 0.25, 0.7, 1],
            }}
          />

          <div className="flex h-full w-full flex-col items-center justify-center gap-6 px-6">
            {/* ---- wordmark: bottom-up mask wipe ---- */}
            <motion.div
              className="overflow-hidden"
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0 0 0 0)" }}
              transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            >
              <motion.div
                className="font-display font-black uppercase leading-[0.86] tracking-[-0.02em] text-white"
                initial={{ y: 26 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
              >
                <span className="block text-[clamp(2.5rem,9vw,9rem)]">Arthur</span>
                <span className="block text-[clamp(2.5rem,9vw,9rem)]">Iarley</span>
              </motion.div>
            </motion.div>

            {/* ---- honest mono strap (never a header, always below) ---- */}
            <motion.p
              className="font-mono text-[11px] uppercase tracking-[0.4em] text-white/60"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8, ease: EASE }}
            >
              {t.preloader.strap}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
