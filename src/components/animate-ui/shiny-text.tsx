"use client";

import * as React from "react";
import { cn } from "@/utils/lib/utils";

type ShinyTextProps = {
  text?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  /** Animation duration in seconds. */
  speed?: number;
  /** Opacity of the shine sweep. */
  shininess?: number;
  className?: string;
};

/**
 * SHINY TEXT (from animate-ui): a subtle sheen sweeps across the glyphs,
 * clipped to the text. Uses currentColor for the base fill, so a single white
 * highlight rides over white OR accent type — no extra accent added.
 */
export function ShinyText({
  text,
  children,
  disabled = false,
  speed = 5,
  shininess = 0.8,
  className,
}: ShinyTextProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block bg-clip-text [-webkit-background-clip:text]",
        !disabled && "animate-shiny",
        className,
      )}
      style={
        {
          backgroundImage: `linear-gradient(120deg, currentColor 40%, rgba(255,255,255,${shininess}) 50%, currentColor 60%)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "250% 100%",
          backgroundPosition: "200% 0",
          // Keep `color` (=> currentColor) as the inherited fill so the shine's
          // base band matches the text; mask the glyphs so only the gradient shows.
          WebkitTextFillColor: "transparent",
          color: "inherit",
          animationDuration: `${speed}s`,
        } as React.CSSProperties
      }
    >
      {text}
      {children}
    </span>
  );
}

export default ShinyText;
