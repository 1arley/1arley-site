"use client";

import * as React from "react";
import { cn } from "@/utils/lib/utils";

type BorderTrailProps = {
  /** Border thickness (px). */
  size?: number;
  /** Threshold in the hue where the beam sits. */
  trail?: number;
  className?: string;
  /** Seconds for one full rotation. */
  duration?: number;
  delay?: number;
  reverse?: boolean;
  /** Beam colour. Defaults to the accent (the single signal colour). */
  color?: string;
};

/**
 * BORDER TRAIL (from animate-ui): a small bright arc travels around the
 * element's border — a "live signal" ring. Relies on @property --bt-angle,
 * which is a no-op (static arc) in engines that don't support it, so it's safe.
 */
export function BorderTrail({
  size = 1.25,
  trail = 120, // degrees wide
  className,
  duration = 5,
  delay = 0,
  reverse = false,
  color = "hsl(17 100% 54%)",
}: BorderTrailProps) {
  const [rad, setRad] = React.useState<string | null>(null);
  React.useEffect(() => {
    // @property is not supported in all browsers/JS-run contexts; fall back
    // to a static arc when it isn't.
    if (typeof CSS !== "undefined" && "registerProperty" in CSS) {
      setRad(`${trail}deg`);
      return;
    }
    setRad("60deg");
  }, [trail]);

  return (
    <div
      data-bt=""
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
        className,
      )}
      style={{
        padding: `${size}px`,
        background: `conic-gradient(from var(--bt-angle, 0deg), transparent 0 ${rad ?? "60deg"}, ${color} ${
          rad ?? "60deg"
        }, transparent 360deg)`,
        WebkitMask:
          "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        animation: `bt-rotate ${duration}s linear ${
          reverse ? "reverse" : "normal"
        } infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

export default BorderTrail;
