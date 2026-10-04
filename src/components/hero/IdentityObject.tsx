"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import {
  createParticleObject,
  type ParticleObjectInstance,
} from "@/components/canvasui/ParticleObject";
import { useLocale } from "@/lib/i18n";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { observeLifecycle, webglSupported } from "@/lib/webgl/utils";

/**
 * The identity mark: the Ibanez JEM (`public/models/guitar.glb`, CC-BY-4.0,
 * abazibiz on Sketchfab) rebuilt as a particle cloud that breathes between the
 * guitar and the name it belongs to.
 *
 * Everything here is a decision with a reason attached, because the hero is the
 * one screen that cannot afford to be merely decorative:
 *
 *  - **The morph target is generated in the browser, not shipped.** The name is
 *    rasterised from the very font the h1 uses (`--font-anton`, a generated
 *    next/font family name) into an offscreen canvas and handed to
 *    ParticleObject as a PNG data URL. That keeps the lockup in sync with the
 *    real typography forever, costs one synchronous canvas draw, and adds no
 *    asset that can drift from the font.
 *  - **No WebGL below `MOUNT_QUERY`.** `architecture.md` and `acceptance.json`
 *    both require the particle guitar to be *absent* on mobile — not hidden,
 *    absent: no canvas, no GL context, no gestures captured. A `hidden` class
 *    would still create the context behind the curtain.
 *  - **Nothing is mounted for reduced motion.** A frozen particle cloud is not
 *    motion, but it is still a 4 MB download and a live GL context for a
 *    visitor who asked for none of it. The hero is already complete without it.
 *  - **The layer is `pointer-events-none`.** `architecture.md` is explicit that
 *    the mark must not intercept gestures where it stays visible. It also keeps
 *    OrbitControls — which ParticleObject attaches to the canvas and which eats
 *    the context menu and the wheel — away from the page entirely. The hero
 *    already has its own pointer parallax, and that is the gesture budget.
 *  - **The pause control is real, not decorative.** The loop runs for as long as
 *    the tab is open; WCAG 2.2.2 wants a mechanism to stop it, and the strings
 *    for it already existed in the dictionary. Pausing also zeroes the idle
 *    float and drift, so "paused" means no motion at all rather than a frozen
 *    morph over a still-drifting cloud.
 */

const GUITAR_SRC = "/models/guitar.glb";

/** Desktop breakpoint. Matches the tailwind `lg` the hero composition is built on. */
const MOUNT_QUERY = "(min-width: 1024px)";

const PARTICLE_COUNT = 20000;

/* Point size in CSS pixels at the model's distance. Above the ParticleObject
 * default: the mark sits over the brightest part of the hero photograph, and
 * sparse points over a bright field read as noise rather than as a shape. */
const MARK_SIZE = 3;

/* Placement, in scene units, on a frame roughly 7.8 units wide at 1024px and
 * 9.3 at 1440. Both assets arrive normalised to their longest side, so the
 * guitar stands about half the hero's height and the name lockup about a third
 * of its width.
 *
 * X is not a taste knob, it is a collision budget: the h1 is oversized and
 * left-anchored, and at the 1024px mount threshold the lockup has to start to
 * the right of the solid type or the hero ends up saying the name twice, in two
 * sizes, on top of each other. These three numbers are the whole composition. */
const MARK_SCALE = 2.7;
const MARK_X = 1.7;
const MARK_Y = 0.1;

/* Idle life. Deliberately below the ParticleObject defaults: this sits behind a
 * photograph and under a black scrim, so it should read as a slow current. */
const MARK_DRIFT = 0.5;
const MARK_FLOAT = 1.4;
const MARK_ROCK = 0.7;

/* One breath: hold the guitar, cross to the name, hold it, cross back. */
const HOLD_MS = 1500;
const TRAVEL_MS = 1900;
const CYCLE_MS = (HOLD_MS + TRAVEL_MS) * 2;

/* Rasterised lockup. Two lines, like the h1, and small enough that
 * ParticleObject's 420px sample grid still resolves the counters. */
const NAME_LINES = ["ARTHUR", "IARLEY"];
const TARGET_W = 1200;
const TARGET_H = 760;
const TARGET_FILL = 0.9;
const LINE_RATIO = 0.8;
const PROBE_PX = 100;

/** `requestIdleCallback` is not in every lib.dom; feature-detect it honestly. */
type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

/**
 * Rasterises the name into a transparent PNG and returns it as a data URL.
 *
 * ParticleObject sniffs the first bytes of whatever it is handed, so a PNG lands
 * on its existing image path: alpha-weighted pixel sampling. No new code, no
 * mesh, no second 3D asset to author or licence.
 */
async function buildNameTarget(): Promise<string | null> {
  // next/font serves Anton under a generated family name and exposes it through
  // a CSS variable. Reading the variable is the only way to ask for the exact
  // face the h1 is already rendering with.
  //
  // The variable is declared by whichever element layout.tsx puts the font
  // classes on, which is <body> today — not <html>. Both are read because that
  // is a one-line change in the layout and this should not care which one it
  // was. The heading is the last resort: its computed family is the resolved
  // stack, so it answers the same question without depending on the variable.
  const family =
    getComputedStyle(document.body).getPropertyValue("--font-anton").trim() ||
    getComputedStyle(document.documentElement)
      .getPropertyValue("--font-anton")
      .trim() ||
    getComputedStyle(document.querySelector(".hero-title") ?? document.body)
      .fontFamily;
  if (!family) return null;

  const spec = (size: number) => `400 ${size}px ${family}`;

  try {
    // Measuring before the face is ready measures the fallback, and every later
    // frame would keep that wrong fit.
    await document.fonts.load(spec(PROBE_PX), NAME_LINES.join(""));
  } catch {
    /* The fallback stack still rasterises. A looser name beats no name. */
  }

  const canvas = document.createElement("canvas");
  canvas.width = TARGET_W;
  canvas.height = TARGET_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.font = spec(PROBE_PX);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  // Anton is a condensed face and wants closing up, like the h1 does. Ignored
  // where the property is unknown, which costs tracking, not accuracy.
  (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing =
    "-0.02em";

  const widest = Math.max(
    ...NAME_LINES.map((line) => ctx.measureText(line).width),
  );
  const block = LINE_RATIO * PROBE_PX * NAME_LINES.length;
  const size = Math.min(
    (TARGET_W * TARGET_FILL) / (widest / PROBE_PX),
    (TARGET_H * TARGET_FILL) / (block / PROBE_PX),
  );

  ctx.font = spec(size);
  const step = size * LINE_RATIO;
  const first = TARGET_H / 2 - (step * (NAME_LINES.length - 1)) / 2;
  NAME_LINES.forEach((line, index) => {
    ctx.fillText(line, TARGET_W / 2, first + index * step);
  });

  return canvas.toDataURL("image/png");
}

/** The cloud springs toward its target on its own; this only has to be gentle. */
function smoothstep(x: number) {
  const t = Math.min(Math.max(x, 0), 1);
  return t * t * (3 - 2 * t);
}

/** Where in the breath a given elapsed time lands. 0 is the guitar, 1 the name. */
function morphAt(elapsed: number) {
  const t = elapsed % CYCLE_MS;
  if (t < HOLD_MS) return 0;
  if (t < HOLD_MS + TRAVEL_MS) return smoothstep((t - HOLD_MS) / TRAVEL_MS);
  if (t < HOLD_MS + TRAVEL_MS + HOLD_MS) return 1;
  return 1 - smoothstep((t - (HOLD_MS + TRAVEL_MS + HOLD_MS)) / TRAVEL_MS);
}

export default function IdentityObject() {
  const { t } = useLocale();
  const reduce = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);
  const [armed, setArmed] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const controlRef = useRef<{ setPaused: (value: boolean) => void } | null>(null);

  /* Whether this visitor gets the mark at all: desktop, WebGL, motion allowed.
   * Resolved after mount so the server-rendered HTML and the first client render
   * agree — reading matchMedia in an initialiser would hydrate two different
   * trees for exactly the visitors who need the smaller one. */
  useEffect(() => {
    if (reduce) {
      setArmed(false);
      return;
    }
    const query = window.matchMedia(MOUNT_QUERY);
    const sync = () => setArmed(query.matches && webglSupported());
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [reduce]);

  /* Pause is routed through the imperative handle rather than the boot effect:
   * as a dependency it would tear down the GL context and refetch 4 MB every
   * time the visitor pressed the button. */
  useEffect(() => {
    pausedRef.current = paused;
    controlRef.current?.setPaused(paused);
  }, [paused]);

  useEffect(() => {
    if (!armed) return;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    let cancelled = false;
    let instance: ParticleObjectInstance | null = null;
    let frame = 0;
    let held = false;
    let current = 0;
    let release = () => {};

    const halt = () => {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const run = () => {
      if (frame) return;
      const started = performance.now();
      const step = (now: number) => {
        current = morphAt(now - started);
        instance?.setOptions({ morph: current });
        frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    const boot = async () => {
      const morphSrc = await buildNameTarget();
      // No target, no morph. The guitar on its own is not the identity mark, and
      // a half-built state would leave the visitor watching a cloud that never
      // resolves — so the layer stays empty instead.
      if (cancelled || !morphSrc) return;

      instance = createParticleObject(
        { canvas },
        {
          src: GUITAR_SRC,
          morphSrc,
          // The hero is monochrome on purpose. Tinting keeps the form readable
          // through the shade term and drops the guitar's own colour.
          color: "#ffffff",
          count: PARTICLE_COUNT,
          size: MARK_SIZE,
          scale: MARK_SCALE,
          xOffset: MARK_X,
          yOffset: MARK_Y,
          drift: MARK_DRIFT,
          floatIntensity: MARK_FLOAT,
          rotationIntensity: MARK_ROCK,
          // The hero owns its own pointer parallax; an orbiting camera would
          // fight it and would swallow the wheel on the way down the page.
          orbit: false,
          zoom: false,
          autoRotate: false,
        },
      );
      if (cancelled || !instance) {
        instance?.destroy();
        return;
      }

      // One authority over motion: the breath stops the moment the hero leaves
      // the viewport or the tab goes to the background.
      release = observeLifecycle(canvas, {
        onVisible: () => {
          if (!held) run();
        },
        onHidden: halt,
      });

      controlRef.current = {
        setPaused: (value) => {
          held = value;
          if (value) {
            halt();
            instance?.setOptions({
              // The shape the cloud is actually in, not one recomputed from an
              // unrelated clock — that would teleport the particles on pause.
              morph: current,
              drift: 0,
              floatIntensity: 0,
              rotationIntensity: 0,
            });
            return;
          }
          instance?.setOptions({
            drift: MARK_DRIFT,
            floatIntensity: MARK_FLOAT,
            rotationIntensity: MARK_ROCK,
          });
          current = 0;
          run();
        },
      };

      if (pausedRef.current) controlRef.current.setPaused(true);
    };

    /* The mark is worth 4 MB of GLB, but not worth competing with the curtain
     * and the hero photograph for the connection. Idle first, with a ceiling so
     * a busy main thread cannot postpone it indefinitely. */
    const idleWindow = window as IdleWindow;
    let cancelIdle = () => {};
    if (idleWindow.requestIdleCallback) {
      const handle = idleWindow.requestIdleCallback(() => void boot(), {
        timeout: 2000,
      });
      cancelIdle = () => idleWindow.cancelIdleCallback?.(handle);
    } else {
      const handle = window.setTimeout(() => void boot(), 600);
      cancelIdle = () => window.clearTimeout(handle);
    }

    return () => {
      cancelled = true;
      cancelIdle();
      halt();
      release();
      controlRef.current = null;
      instance?.destroy();
      instance = null;
    };
  }, [armed]);

  return (
    <>
      <div
        ref={stageRef}
        data-identity-object
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
      >
        {armed ? (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 block h-full w-full"
          />
        ) : null}
      </div>

      {armed ? (
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
          aria-label={
            paused ? t.hero.resumeIdentityMotion : t.hero.pauseIdentityMotion
          }
          title={paused ? t.hero.resumeIdentityMotion : t.hero.pauseIdentityMotion}
          // Above the hero's z-10 content layer: that layer's grid box covers the
          // whole section, so anything decorative placed under it is unclickable
          // no matter how empty the corner looks. Still below the z-30 navbar.
          className="absolute right-5 top-20 z-20 grid h-11 w-11 place-items-center border border-white/30 bg-black/75 font-mono text-white/80 transition-colors hover:border-white hover:bg-white hover:text-black lg:right-8"
        >
          {paused ? (
            <Play size={13} aria-hidden="true" />
          ) : (
            <Pause size={13} aria-hidden="true" />
          )}
        </button>
      ) : null}
    </>
  );
}