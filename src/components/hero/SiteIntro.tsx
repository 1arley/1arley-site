"use client";

import { useEffect, useRef } from "react";

/** Manim draws the mark; the browser owns its responsive journey to the header. */
export default function SiteIntro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const mark = markRef.current!;
    const video = videoRef.current!;
    const target = document.querySelector<HTMLElement>("[data-header-mark]");
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (!target || preference.matches || window.scrollY > 0 || location.hash) return;

    let disposed = false;
    let started = false;
    let departing = false;
    const animations: Animation[] = [];
    const finish = () => {
      if (disposed) return;
      disposed = true;
      root.hidden = true;
      target.style.opacity = "";
      animations.forEach((animation) => animation.cancel());
    };
    const depart = () => {
      if (disposed || departing) return;
      departing = true;
      const from = mark.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const travel = mark.animate([
        { transform: "translate3d(0,0,0) scale(1)" },
        { transform: `translate3d(${to.x + to.width / 2 - from.x - from.width / 2}px,${to.y + to.height / 2 - from.y - from.height / 2}px,0) scale(${to.width / from.width})` },
      ], { duration: 800, easing: "cubic-bezier(0.77, 0, 0.175, 1)", fill: "forwards" });
      animations.push(travel, root.querySelector("[data-intro-veil]")!.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 800, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "forwards" },
      ));
      // Replace the rendered glyph with the exact header typography before landing.
      animations.push(video.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 300, fill: "forwards",
      }));
      travel.finished.then(finish, finish);
    };
    const start = () => {
      if (disposed || started) return;
      started = true;
      root.hidden = false;
      target.style.opacity = "0";
    };
    video.addEventListener("playing", start);
    video.addEventListener("ended", depart);
    video.addEventListener("error", finish);
    preference.addEventListener("change", finish);
    window.addEventListener("resize", finish);
    window.addEventListener("scroll", finish, { passive: true });
    window.addEventListener("pointerdown", finish);
    window.addEventListener("keydown", finish);
    // Failed/slow media must never leave an intro covering the portfolio.
    const timeout = window.setTimeout(finish, 3500);
    video.src = "/animations/terminal-intro.mp4";
    void video.play().catch(finish);
    return () => {
      finish();
      clearTimeout(timeout);
      video.pause();
      video.removeAttribute("src");
      video.load();
      video.removeEventListener("playing", start);
      video.removeEventListener("ended", depart);
      video.removeEventListener("error", finish);
      preference.removeEventListener("change", finish);
      window.removeEventListener("resize", finish);
      window.removeEventListener("scroll", finish);
      window.removeEventListener("pointerdown", finish);
      window.removeEventListener("keydown", finish);
    };
  }, []);

  return (
    <div ref={rootRef} hidden aria-hidden="true" data-site-intro className="pointer-events-none fixed inset-0 z-40">
      <div data-intro-veil className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 grid place-items-center">
        <div ref={markRef} className="relative grid h-32 w-32 place-items-center bg-white font-mono text-5xl font-bold text-black">
          &gt;_
          <video ref={videoRef} muted playsInline preload="none" className="absolute inset-0 h-full w-full" />
        </div>
      </div>
    </div>
  );
}
