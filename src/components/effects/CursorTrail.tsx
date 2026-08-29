"use client";

import { useEffect, useRef } from "react";
import { isBrowser, prefersReducedMotion } from "@/lib/webgl/utils";

/**
 * CURSOR TRAIL — dust kicked up behind the pointer.
 * A lightweight rAF particle trail: each tick drops a tiny white square that
 * shrinks and fades. Fine pointer only, disabled under reduced motion.
 */
export function CursorTrail({ max = 26 }: { max?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isBrowser()) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    const pts: { x: number; y: number; life: number; max: number; s: number }[] = [];
    let px = -100;
    let py = -100;
    let last = performance.now();

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      pts.push({
        x: px + (Math.random() - 0.5) * 6,
        y: py + (Math.random() - 0.5) * 6,
        life: 0,
        max: 0.5 + Math.random() * 0.45,
        s: 1 + Math.random() * 2.4,
      });
      if (pts.length > max) pts.shift();

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        p.life += dt;
        if (p.life >= p.max) {
          pts.splice(i, 1);
          continue;
        }
        const k = 1 - p.life / p.max;
        ctx.globalAlpha = k * 0.85;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(p.x, p.y, p.s * k, p.s * k);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, [max]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[46]"
    />
  );
}