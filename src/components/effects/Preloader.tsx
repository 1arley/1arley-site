"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale } from "@/lib/i18n";
import { preloaderPaths, PRELOADER_VIEWBOX } from "@/data/preloader-paths";

/**
 * PRELOADER — SVG stroke-draw boot curtain.
 *
 * "ARTHUR IARLEY" wordmark drawn via per-letter SVG path strokes (actual
 * Anton glyph outlines), mixed with the existing rec-boot language (counter,
 * INIT·01 strip, tagline). ~1.8s + 0.7s exit.
 *
 * - Reduced motion / touch / narrow viewport: skips entirely (CSS + JS).
 * - No-JS: CSS display:none (globals.css).
 * - aria-hidden: true (decorative).
 */
export default function Preloader() {
  const { t } = useLocale();
  const [done, setDone] = useState(false);
  const [fillOpacity, setFillOpacity] = useState(0);
  const reduce = useReducedMotion();

  /* ---------- skip logic ---------- */
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
    const timer = setTimeout(() => setDone(true), 1800);
    return () => clearTimeout(timer);
  }, [reduce]);

  /* ---------- fill reveal after strokes ---------- */
  useEffect(() => {
    if (reduce || done) return;
    const timer = setTimeout(() => setFillOpacity(1), 1000);
    return () => clearTimeout(timer);
  }, [reduce, done]);

  if (reduce) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="preloader fixed inset-0 z-[80] flex flex-col justify-between overflow-hidden bg-black px-5 py-4 sm:px-8"
          aria-hidden="true"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
        >
          {/* ---- top strip ---- */}
          <motion.div
            className="flex items-center justify-between border-b border-white/15 pb-3 font-mono text-[11px] tracking-[0.2em] text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 animate-pulse bg-white" />
              INIT · 01
            </span>
            <span>{t.preloader.loading}</span>
          </motion.div>

          {/* ---- wordmark + loading tag ---- */}
          <div className="flex flex-col items-center justify-center gap-6 px-2">
            <motion.svg
              viewBox={PRELOADER_VIEWBOX}
              className="w-full max-w-[900px]"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              {preloaderPaths.map((path, i) => (
                <motion.path
                  key={path.id}
                  d={path.d}
                  fill="white"
                  stroke="white"
                  strokeWidth={12}
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  vectorEffect="non-scaling-stroke"
                  pathLength={1}
                  strokeDasharray="1 1"
                  style={{ fillOpacity, transition: "fill-opacity 0.3s ease" }}
                  initial={{ strokeDashoffset: 1 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{
                    duration: 0.65,
                    delay: 0.15 + i * 0.055,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              ))}
            </motion.svg>

            <motion.span
              className="font-mono text-[11px] tracking-[0.4em] text-white/60 uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.9, ease: "linear" }}
            >
              {t.preloader.loadingTag}
            </motion.span>
          </div>

          {/* ---- bottom strip ---- */}
          <motion.div
            className="flex items-end justify-between gap-3 border-t border-white/15 pt-3 font-mono text-[11px] text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Counter />
            <span className="min-w-0 truncate">{t.preloader.tagline}</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------ counter (as-is, preserved from original) ------ */
function Counter() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((p) => (p >= 100 ? 100 : p + 2.5)), 24);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="tabular-nums">
      {String(Math.floor(t)).padStart(2, "0")} : 00 / 01 : 00
    </span>
  );
}