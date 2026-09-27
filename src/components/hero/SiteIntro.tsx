"use client";

import { useEffect, useRef } from "react";
import { INTRO_FLAG, INTRO_SKIP_QUERY, INTRO_SRC } from "@/lib/site-intro";

/** How long the file gets to reach a play state before we leave anyway. */
const START_GRACE_MS = 2500;

/** Playing, but somehow still running. Same exit, generous ceiling. */
const PLAYING_GRACE_MS = 4000;

const TRAVEL_MS = 800;

/** Manim draws the mark; the browser owns its responsive journey to the header. */
export default function SiteIntro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const mark = markRef.current;
    const video = videoRef.current;
    if (!root || !mark || !video) return;

    const veil = root.querySelector<HTMLElement>("[data-intro-veil]");
    const target = document.querySelector<HTMLElement>("[data-header-mark]");
    // Same query the <head> script used, not a second copy that can drift.
    const preference = matchMedia(INTRO_SKIP_QUERY);
    const flag = document.documentElement;

    /* ---------- the gate ---------- *
     * The <head> script already turned the curtain on before the first paint.
     * Re-checked here because a setting can change between that script and
     * hydration, and a frame of curtain nobody asked for is the exact thing
     * this gate exists to prevent. */
    if (
      flag.getAttribute(INTRO_FLAG) !== "on" ||
      preference.matches ||
      window.scrollY > 0 ||
      location.hash
    ) {
      return;
    }

    let disposed = false;
    let started = false;
    let departing = false;
    const animations: Animation[] = [];
    let startTimer = 0;
    let graceTimer = 0;

    /** Undo everything this effect owns. Safe to run twice. */
    const stop = () => {
      clearTimeout(startTimer);
      clearTimeout(graceTimer);
      // Must always run: leaving the header mark at opacity 0 would erase the
      // logo for good if the component ever unmounted mid-intro.
      if (target) target.style.opacity = "";
      animations.forEach((animation) => animation.cancel());
      video.pause();
    };

    /**
     * Lift the curtain. The only path that ever reveals the site — and the only
     * place the flag is removed, so StrictMode's double-invoke re-arms the intro
     * instead of cancelling it.
     */
    const reveal = () => {
      if (disposed) return;
      disposed = true;
      flag.removeAttribute(INTRO_FLAG);
      stop();
    };

    const depart = () => {
      if (disposed || departing || !target) return;
      departing = true;
      clearTimeout(startTimer);
      const from = mark.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const travel = mark.animate(
        [
          { transform: "translate3d(0,0,0) scale(1)" },
          {
            transform: `translate3d(${to.x + to.width / 2 - from.x - from.width / 2}px,${to.y + to.height / 2 - from.y - from.height / 2}px,0) scale(${to.width / from.width})`,
          },
        ],
        {
          duration: TRAVEL_MS,
          easing: "cubic-bezier(0.77, 0, 0.175, 1)",
          fill: "forwards",
        },
      );
      animations.push(travel);
      if (veil) {
        animations.push(
          veil.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: TRAVEL_MS,
            easing: "cubic-bezier(0.23, 1, 0.32, 1)",
            fill: "forwards",
          }),
        );
      }
      // Replace the rendered glyph with the exact header typography before landing.
      animations.push(
        video.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 300,
          fill: "forwards",
        }),
      );
      travel.finished.then(reveal, reveal);
    };

    const start = () => {
      if (disposed || started) return;
      started = true;
      clearTimeout(startTimer);
      mark.style.visibility = "visible";
      // Hidden until the flying mark lands, or the header shows two at once.
      if (target) target.style.opacity = "0";
      graceTimer = window.setTimeout(depart, PLAYING_GRACE_MS);
    };

    video.addEventListener("playing", start);
    video.addEventListener("ended", depart);
    video.addEventListener("error", reveal);
    preference.addEventListener("change", reveal);
    window.addEventListener("resize", reveal);
    window.addEventListener("scroll", reveal, { passive: true });
    // Any deliberate input is a request to skip. Keyboard users get the same
    // escape as mouse users, which is also why focus never gets stuck behind
    // the opaque veil.
    window.addEventListener("pointerdown", reveal);
    window.addEventListener("keydown", reveal);

    // A file that never reaches "playing" must not leave the visitor staring at
    // a black page: leave through the same designed exit, mark and all.
    startTimer = window.setTimeout(depart, START_GRACE_MS);

    void video.play().catch(reveal);

    return () => {
      // Deliberately not reveal(): the curtain is a page-level decision owned
      // by the <head> script, so a remount has to find it still armed. reveal()
      // is for real exits only. The src stays for the same reason — dropping it
      // here would throw away the buffer a remount needs and re-fetch a file we
      // already hold. 4.8 KB, and navigating away drops the element anyway.
      disposed = true;
      stop();
      video.removeEventListener("playing", start);
      video.removeEventListener("ended", depart);
      video.removeEventListener("error", reveal);
      preference.removeEventListener("change", reveal);
      window.removeEventListener("resize", reveal);
      window.removeEventListener("scroll", reveal);
      window.removeEventListener("pointerdown", reveal);
      window.removeEventListener("keydown", reveal);
    };
  }, []);

  return (
    // Not `hidden`: the curtain is server-rendered on purpose. globals.css keeps
    // it display:none until the <head> boot script sets INTRO_FLAG, which is
    // what makes the black frame land on the very first paint instead of
    // after hydration. Blocks pointer events while it is up — the site is not
    // interactive before the intro, by request and by default.
    <div
      ref={rootRef}
      aria-hidden="true"
      data-site-intro
      className="fixed inset-0 z-40"
    >
      <div data-intro-veil className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 grid place-items-center">
        <div
          ref={markRef}
          className="relative grid h-32 w-32 place-items-center bg-white font-mono text-5xl font-bold text-black"
          style={{ visibility: "hidden" }}
        >
          &gt;_
          <video
            ref={videoRef}
            src={INTRO_SRC}
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}
