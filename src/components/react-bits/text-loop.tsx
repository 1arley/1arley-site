"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type TextLoopProps = {
  words: string[];
  interval?: number;
  className?: string;
};

export function TextLoop({ words, interval = 2600, className }: TextLoopProps) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length < 2) return;
    if (reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval, reduce]);

  return (
    <span className={cn("relative inline-block overflow-hidden align-baseline", className)} aria-live="off">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className="inline-block"
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: "0.6em", filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: "-0.6em", filter: "blur(4px)" }}
          transition={{ duration: reduce ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}