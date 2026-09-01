"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/utils/lib/utils";

type MagnetProps = React.PropsWithChildren<{
  /** How far (px) the magnet field reaches beyond the element. */
  padding?: number;
  /** Strength of the pull (0 is off). */
  magnetStrength?: number;
  /** Fraction of the pull (0–1) applied to the child. */
  magnetStrengthInner?: number;
  /** Disable the effect (e.g. on reduced-motion). */
  disabled?: boolean;
  className?: string;
}>;

/**
 * MAGNET (from animate-ui): the wrapped child is pulled toward the cursor
 * while it's inside the field and springs back on leave. Reduced-motion safe.
 */
export function Magnet({
  children,
  padding = 60,
  magnetStrength = 2,
  magnetStrengthInner = 0.4,
  disabled = false,
  className,
}: MagnetProps) {
  const btnRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  React.useEffect(() => {
    if (disabled) return;
    const btn = btnRef.current;
    const inner = innerRef.current;
    if (!btn || !inner) return;

    const handleMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const half = rect.width / 2 || 1;
      const halfH = rect.height / 2 || 1;
      const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / half));
      const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / halfH));
      const max = magnetStrength * magnetStrengthInner * 40;
      x.set(nx * max);
      y.set(ny * max);
    };
    const handleLeave = () => {
      x.set(0);
      y.set(0);
    };

    btn.addEventListener("mousemove", handleMove);
    btn.addEventListener("mouseleave", handleLeave);
    return () => {
      btn.removeEventListener("mousemove", handleMove);
      btn.removeEventListener("mouseleave", handleLeave);
    };
  }, [disabled, magnetStrength, magnetStrengthInner, x, y]);

  return (
    <div
      ref={btnRef}
      className={cn("inline-block", className)}
      style={{
        padding: `${padding}px`,
        margin: `${-padding}px`,
      }}
    >
      <motion.div
        ref={innerRef}
        style={{ x: springX, y: springY }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default Magnet;
