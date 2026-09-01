"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/utils/lib/utils";

type Spark = {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
};

type ClickSparkProps = React.PropsWithChildren<{
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  className?: string;
  disabled?: boolean;
}>;

/**
 * CLICK SPARK (from animate-ui): a small burst of particles flies out from the
 * click point. DOM-only (no WebGL budget), disabled on touch and reduced
 * motion. Wraps any content and listens for clicks on it.
 */
export function ClickSpark({
  children,
  sparkColor = "#ffffff",
  sparkSize = 3,
  sparkRadius = 18,
  sparkCount = 8,
  duration = 0.5,
  className,
  disabled = false,
}: ClickSparkProps) {
  const [sparks, setSparks] = React.useState<Spark[]>([]);
  const idRef = React.useRef(0);
  const reduce = React.useRef(false);
  const buildTimeout = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reduce.current = true;
    }
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled || reduce.current) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const batch: Spark[] = Array.from({ length: sparkCount }, () => ({
      id: idRef.current++,
      x,
      y,
      angle: Math.random() * Math.PI * 2,
      distance: sparkRadius * (0.5 + Math.random() * 0.5),
    }));
    setSparks((prev) => [...prev, ...batch]);
    // Prune older bursts.
    buildTimeout.current = window.setTimeout(() => {
      setSparks((prev) => prev.filter((s) => !batch.includes(s)));
    }, duration * 1000);
  };

  React.useEffect(() => () => window.clearTimeout(buildTimeout.current), []);

  return (
    <div className={cn("relative", className)} onClick={handleClick}>
      {children}
      <AnimatePresence>
        {sparks.map((s) => {
          const dx = Math.cos(s.angle) * s.distance;
          const dy = Math.sin(s.angle) * s.distance;
          return (
            <motion.span
              key={s.id}
              aria-hidden="true"
              className="pointer-events-none absolute z-[60] rounded-full"
              style={{ width: sparkSize, height: sparkSize, background: sparkColor }}
              initial={{ left: s.x, top: s.y, opacity: 1, scale: 1 }}
              animate={{ left: s.x + dx, top: s.y + dy, opacity: 0, scale: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration, ease: "easeOut" }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default ClickSpark;
