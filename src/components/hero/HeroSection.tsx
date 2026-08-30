"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useLocale } from "@/lib/i18n";

import { Displacement } from "@/components/canvasui/Displacement";

const ParticleObject = dynamic(
  () => import("@/components/canvasui/ParticleObject"),
  { ssr: false },
);

/**
 * HERO — the stage.
 * A full-screen rock concert opener: Displacement ripples the entire viewport,
 * a grain-treated guitar photo fills the background, and a static particle-
 * rendered 3D guitar floats mid-air. Particles scatter from the cursor and
 * spring back.
 *
 * WebGL budget: 2 contexts (Displacement + ParticleObject) to stay under the
 * browser's 16-context limit so every section effect actually renders.
 */
export default function HeroSection() {
  const { t } = useLocale();
  const containerRef = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end start"],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.15]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-black"
      aria-label={t.hero.ariaLabel}
    >
      {/* ===== Displacement — whole hero ripples away from cursor ===== */}
      <Displacement
        grid={40}
        cellAspect={1}
        radius={0.15}
        strength={0.1}
        threshold={600}
        relaxation={0.92}
        shift={1.8}
        aberration={0.6}
        grain={0.08}
        grainSize={1.5}
        grainSpeed={1.2}
        scramble={0.6}
        className="absolute inset-0"
      >
        <div className="relative min-h-screen w-full">
          {/* ===== Background — guitar photo, CSS tape treatment ===== */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/header-guitar.jpg"
              alt=""
              fill
              priority
              fetchPriority="high"
              className="object-cover object-center grayscale contrast-[1.4] brightness-[0.45]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" aria-hidden="true" />
            <div className="scanlines absolute inset-0 z-[5]" aria-hidden="true" />
          </div>

          {/* ===== Top micro-UI strip ===== */}
          <motion.div
            className="relative z-20 flex items-center justify-between border-b border-white/15 px-5 py-3 font-mono text-[11px] tracking-[0.2em] text-white/70"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <span>01</span>
            </div>
            <div className="hidden items-center gap-6 sm:flex">
              <span>{t.hero.coords}</span>
              <span className="hidden md:inline">{t.hero.place}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">[ INDEX ]</span>
              <Link
                href="/sobre"
                className="border border-white/30 px-3 py-1 font-mono text-[11px] tracking-[0.15em] text-white/80 transition-colors hover:bg-white hover:text-black"
              >
                {t.hero.aboutLink}
              </Link>
            </div>
          </motion.div>

          {/* ===== Main content ===== */}
          <div className="relative z-10 flex min-h-[82vh] flex-col justify-center px-5 pb-12 sm:px-8">
            {/* Editorial label */}
            <motion.div
              className="mono-label mb-4 flex items-center gap-3 text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <span className="h-px w-10 bg-white/40" aria-hidden="true" />
              <span>{t.hero.label}</span>
            </motion.div>

            {/* ===== Giant title ===== */}
            <motion.h1
              style={{ y: reduce ? 0 : titleY, opacity: titleOpacity }}
              className="max-w-4xl font-display font-black uppercase leading-[0.82] tracking-[-0.03em] text-white"
            >
              <span className="block text-[clamp(3.6rem,14vw,12rem)]">
                Arthur
              </span>
              <span className="block text-[clamp(3.6rem,14vw,12rem)]">
                Iarley
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="mt-6 max-w-md text-sm leading-relaxed text-gray-80 sm:text-base"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
            >
              {t.hero.subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="mt-8 flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Link
                href="#projetos"
                className="btn-brutal"
              >
                {t.hero.ctaProjects}
              </Link>
              <Link
                href="/sobre"
                className="btn-outline"
              >
                {t.hero.ctaAbout}
              </Link>
            </motion.div>
          </div>

        </div>
      </Displacement>

      {/* ===== 3D Particle Guitar — OUTSIDE Displacement so the canvas
          is a real DOM node that receives pointer events (html-in-canvas would
          swallow the subtree as a texture, killing the particle scatter).
          z-[20] keeps it above the content layer so the cursor reaches it.
          Slow autoRotate turntable so the front is shown; particles still
          scatter from the cursor and spring back. ===== */}
      <div
        className="absolute bottom-[4vh] right-0 z-[20] h-[78vh] w-[50vw] sm:h-[82vh] sm:w-[42vw]"
        aria-hidden="true"
      >
        <ParticleObject
          className="h-full w-full"
          src="/models/guitar.glb"
          count={12000}
          size={3.2}
          sizeVariance={0.5}
          color=""
          radius={160}
          strength={1.2}
          swirl={0.4}
          spring={0.8}
          damping={0.3}
          drift={0.4}
          scale={2.4}
          fov={44}
          cameraDistance={4.6}
          floatIntensity={0.6}
          rotationIntensity={0.3}
          floatSpeed={1}
          autoRotate
          autoRotateSpeed={2}
          orbit={false}
          zoom={false}
        />
      </div>
    </section>
  );
}
