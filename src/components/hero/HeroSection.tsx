"use client";

import { useRef, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import SiteIntro from "./SiteIntro";
import IdentityObject from "./IdentityObject";
import { useLocale } from "@/lib/i18n";

export default function HeroSection() {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const photoX = useMotionValue(0);
  const photoY = useMotionValue(0);
  const titleX = useMotionValue(0);
  const titleY = useMotionValue(0);
  const spring = { stiffness: 100, damping: 20, mass: 1 };
  const photoSpringX = useSpring(photoX, spring);
  const photoSpringY = useSpring(photoY, spring);
  const titleSpringX = useSpring(titleX, spring);
  const titleSpringY = useSpring(titleY, spring);
  const photoPointerTransform = useMotionTemplate`translate3d(${photoSpringX}px, ${photoSpringY}px, 0)`;
  const titlePointerTransform = useMotionTemplate`translate3d(${titleSpringX}px, ${titleSpringY}px, 0)`;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const photoTransform = useTransform(
    scrollYProgress,
    [0, 1],
    reduce
      ? ["scale(1) translate3d(0,0,0)", "scale(1) translate3d(0,0,0)"]
      : [
          "scale(1.01) translate3d(0,0,0)",
          "scale(1.09) translate3d(0,5%,0)",
        ],
  );
  const titleTransform = useTransform(
    scrollYProgress,
    [0, 1],
    reduce
      ? ["translate3d(0,0,0)", "translate3d(0,0,0)"]
      : ["translate3d(0,0,0)", "translate3d(0,-10%,0)"],
  );

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduce || event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

    photoX.set(x * 8);
    photoY.set(y * 6);
    titleX.set(x * -5);
    titleY.set(y * -4);
  };

  const handlePointerLeave = () => {
    photoX.set(0);
    photoY.set(0);
    titleX.set(0);
    titleY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="hero-stage relative min-h-[92dvh] overflow-hidden bg-black pt-16"
      aria-label={t.hero.ariaLabel}
    >
      <SiteIntro />
      <motion.div
        className="absolute inset-0 z-0"
        style={{ transform: photoTransform }}
        aria-hidden="true"
      >
        <motion.div
          className="absolute inset-[-1rem]"
          style={{ transform: photoPointerTransform }}
        >
          <Image
            src="/hero-guitar-wide.webp"
            alt=""
            fill
            priority
            fetchPriority="high"
            className="object-cover object-[64%_center] grayscale"
            sizes="100vw"
          />
        </motion.div>
      </motion.div>

      <IdentityObject />

      <div className="absolute inset-0 z-[2] bg-black/25" aria-hidden="true" />

      <div
        className="pointer-events-none absolute inset-0 z-[4] border-x border-white/10"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid min-h-[calc(92dvh-4rem)] max-w-[1600px] grid-cols-4 grid-rows-[1fr_auto] px-5 pb-6 pt-7 sm:px-8 lg:grid-cols-12 lg:pb-8 lg:pt-9">
        <motion.h1
          style={{ transform: titleTransform }}
          className="hero-title col-span-4 self-center font-display uppercase text-white lg:col-span-10"
        >
          <motion.span
            className="block"
            style={{ transform: titlePointerTransform }}
          >
            <span className="block">Arthur</span>
            <span className="block pl-[9vw] lg:pl-[16vw]">Iarley</span>
          </motion.span>
        </motion.h1>

        <div className="col-span-4 -mx-5 grid gap-6 border-t border-white/30 bg-black/75 px-5 py-5 sm:-mx-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:px-8 lg:col-span-12 lg:mx-0 lg:grid-cols-12 lg:px-5">
          <p className="prose-read max-w-lg text-sm leading-relaxed text-white sm:text-base lg:col-span-5">
            {t.hero.subtitle}
          </p>

          <Link
            href="#projetos"
            // Three columns, not two: `sm:min-w-52` is 208px, and at the lg
            // breakpoint two of twelve columns inside this bar are only ~137px.
            // The minimum wins over the track and pushed the arrow past the
            // viewport edge between 1024px and ~1200px. Three columns clears it
            // at the breakpoint; `justify-self-end` keeps the button at its own
            // 208px instead of stretching it across the wider track.
            className="hero-cta group inline-flex min-h-12 items-center justify-between gap-8 border border-white bg-white px-5 font-mono text-xs font-bold uppercase text-black sm:min-w-52 lg:col-span-3 lg:col-start-10 lg:justify-self-end"
          >
            {t.hero.ctaProjects}
            <ArrowDownRight
              size={17}
              className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
