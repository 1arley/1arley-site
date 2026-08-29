"use client";

import { useEffect, useRef, useState } from "react";
import { isBrowser, prefersReducedMotion } from "@/lib/webgl/utils";

/**
 * CUSTOM CURSOR — clean inverting dot.
 * A single smooth circle (mix-blend-mode: difference) that trails the
 * pointer with a light ease. Inverts over any background (white on black,
 * black on white). Slightly grows over interactive elements.
 */
export function CustomCursor() {
  const [active, setActive] = useState(false);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const raf = useRef(0);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });

  // Gate activation: fine pointer + no reduced motion
  useEffect(() => {
    if (!isBrowser()) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setActive(true);
    document.documentElement.classList.add("custom-cursor-on");
    return () => {
      document.documentElement.classList.remove("custom-cursor-on");
    };
  }, []);

  // Wire listeners once the cursor element is actually rendered
  useEffect(() => {
    if (!active) return;
    const dot = dotRef.current;
    if (!dot) return;

    const onMove = (e: PointerEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!raf.current) {
        raf.current = requestAnimationFrame(frame);
      }
    };

    const onOver = (e: PointerEvent) => {
      const interactive = (e.target as Element | null)?.closest(
        "a, button, [role='button'], input, textarea, select",
      );
      dot.classList.toggle("cursor-dot-active", !!interactive);
    };

    let running = false;
    const frame = () => {
      raf.current = 0;
      if (!running) {
        dot.style.opacity = "1";
        running = true;
      }
      const ease = 0.18;
      target.current.x += (pos.current.x - target.current.x) * ease;
      target.current.y += (pos.current.y - target.current.y) * ease;
      dot.style.transform = `translate(${target.current.x}px, ${target.current.y}px) translate(-50%, -50%)`;
    };

    const show = () => {
      dot.style.opacity = "1";
      running = false;
      raf.current = requestAnimationFrame(frame);
    };
    const hide = () => {
      dot.style.opacity = "0";
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", hide, {
      passive: true,
    });
    document.documentElement.addEventListener("mouseenter", show, {
      passive: true,
    });

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("mouseleave", hide);
      document.documentElement.removeEventListener("mouseenter", show);
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[60] h-[14px] w-[14px] opacity-0 transition-opacity duration-200 mix-blend-difference"
    >
      <div className="cursor-dot h-full w-full rounded-full bg-white" />
    </div>
  );
}
