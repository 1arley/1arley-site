"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/utils/lib/utils";

type LiquidButtonProps = HTMLMotionProps<"button"> & {
  delay?: string;
  fillHeight?: string;
  hoverScale?: number;
  tapScale?: number;
  /** "solid" fills white over black; "outline" fills black over transparent. */
  variant?: "solid" | "outline";
  size?: "default" | "lg";
};

/**
 * LIQUID BUTTON (from animate-ui, adapted for the brutal P&B theme).
 * A button that fills from the bottom with liquid on hover. Zero radius,
 * mono type. Reduced-motion safe (motion library handles it).
 */
function LiquidButton({
  delay = "0.35s",
  fillHeight = "4px",
  hoverScale = 1.02,
  tapScale = 0.97,
  variant = "solid",
  size = "default",
  className,
  children,
  ...props
}: LiquidButtonProps) {
  const isSolid = variant === "solid";
  return (
    <motion.button
      whileTap={{ scale: tapScale }}
      whileHover={{
        scale: hoverScale,
        "--liquid-fill-width": "100%",
        "--liquid-fill-height": "100%",
        "--liquid-delay": delay,
        transition: {
          "--liquid-fill-width": { duration: 0 },
          "--liquid-fill-height": { duration: 0 },
          "--liquid-delay": { duration: 0 },
        },
      }}
      style={
        {
          "--liquid-color": isSolid ? "#000000" : "#ffffff",
          "--liquid-bg": isSolid ? "#ffffff" : "transparent",
          "--liquid-fill-width": "-1%",
          "--liquid-fill-height": fillHeight,
          "--liquid-delay": "0s",
          background: `linear-gradient(var(--liquid-color) 0 0) no-repeat calc(200% - var(--liquid-fill-width, -1%)) 100% / 200% var(--liquid-fill-height, 0.2em)`,
          backgroundColor: "var(--liquid-bg)",
          color: isSolid ? "#000000" : "#f4f4f4",
          transition: `background ${delay} var(--liquid-delay, 0s), color ${delay} ${delay}, background-position ${delay} calc(${delay} - var(--liquid-delay, 0s))`,
        } as React.CSSProperties
      }
      className={cn(
        "inline-flex items-center justify-center gap-2 border border-white font-mono font-bold uppercase tracking-[0.08em] text-[0.8125rem] leading-none",
        size === "lg" ? "min-h-[56px] px-8" : "min-h-[44px] px-6",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export { LiquidButton, type LiquidButtonProps };