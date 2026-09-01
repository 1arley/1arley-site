"use client";

import * as React from "react";
import { animate, useInView, useMotionValue } from "framer-motion";
import { cn } from "@/utils/lib/utils";

type CounterProps = {
  from?: number;
  to: number;
  /** Seconds for the increment. */
  duration?: number;
  delay?: number;
  className?: string;
  startOn?: "visible" | "mount";
  prefix?: string;
  suffix?: string;
  decimals?: number;
  useGrouping?: boolean;
};

/**
 * COUNTER (from animate-ui): increments to `to` when it scrolls into view.
 * Reduced-motion safe — snaps straight to the target value.
 */
export function Counter({
  from = 0,
  to,
  duration = 1.8,
  delay = 0,
  className,
  startOn = "visible",
  prefix = "",
  suffix = "",
  decimals = 0,
  useGrouping = true,
}: CounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const mv = useMotionValue(from);
  const [display, setDisplay] = React.useState(from);

  React.useEffect(() => {
    if (startOn === "visible" && !inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(to);
      return;
    }
    const controls = animate(mv, to, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
    });
    const unsub = mv.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [startOn, inView, to, duration, delay, mv]);

  const formatted = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping,
  }).format(display);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export default Counter;
