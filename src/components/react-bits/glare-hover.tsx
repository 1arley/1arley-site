"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlareHoverProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
};

const toRgba = (hex: string, alpha: number) => {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length !== 6) return hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export function GlareHover({
  children,
  className,
  style,
  glareColor = "#ffffff",
  glareOpacity = 0.5,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 650,
}: GlareHoverProps) {
  const vars = {
    "--gh-angle": `${glareAngle}deg`,
    "--gh-duration": `${transitionDuration}ms`,
    "--gh-size": `${glareSize}%`,
    "--gh-rgba": toRgba(glareColor, glareOpacity),
  } as CSSProperties;

  return (
    <div
      className={cn("gh-glare relative overflow-hidden", className)}
      style={{ ...vars, ...style }}
    >
      {children}
    </div>
  );
}