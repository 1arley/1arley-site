"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale } from "@/lib/i18n";

/**
 * PRELOADER — "rec" boot curtain.
 * A fast, self-aware tape boot: giant name slams in, counter runs, then the
 * curtain slides up to reveal the stage. ~1.1s. Skipped entirely under
 * reduced motion (no jank, no blocking).
 */
export default function Preloader() {
  const { t } = useLocale();
  const [done, setDone] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setDone(true), 1050);
    return () => clearTimeout(t);
  }, [reduce]);

  if (reduce) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="preloader fixed inset-0 z-[80] flex flex-col justify-between bg-black px-5 py-4 sm:px-8"
          aria-hidden="true"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
        >
          {/* top strip */}
          <motion.div
            className="flex items-center justify-between border-b border-white/15 pb-3 font-mono text-[11px] tracking-[0.2em] text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 animate-pulse bg-white" />
              INIT · 01
            </span>
            <span>{t.preloader.loading}</span>
          </motion.div>

          {/* giant name */}
          <div className="flex flex-col items-center justify-center -translate-y-6">
            <motion.span
              className="font-display text-[clamp(2.25rem,10vw,9rem)] font-black uppercase leading-[0.85] tracking-[-0.02em] text-white"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              Arthur Iarley
            </motion.span>
            <motion.span
              className="mt-4 font-mono text-[11px] tracking-[0.4em] text-white/60 uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              {t.preloader.loadingTag}
            </motion.span>
          </div>

          {/* bottom strip */}
          <motion.div
            className="flex items-end justify-between gap-3 border-t border-white/15 pt-3 font-mono text-[11px] text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Counter />
            <span className="min-w-0 truncate">{t.preloader.tagline}</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

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
