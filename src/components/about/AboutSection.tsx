"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Peel } from "@/components/canvasui/Peel";

const STACK = [
  { name: "Next.js 16", desc: "App Router · SSR · RSC" },
  { name: "React 19", desc: "Hooks · Context · Suspense" },
  { name: "TypeScript 5", desc: "Tipagem estrita" },
  { name: "Tailwind CSS 3", desc: "Design system utilitário" },
  { name: "Radix / shadcn", desc: "Componentes acessíveis" },
  { name: "Framer Motion", desc: "Animações fluidas" },
  { name: "Axios", desc: "HTTP client com proxy" },
  { name: "Three.js", desc: "WebGL / 3D no browser" },
];

/**
 * ABOUT — "TRACK 01: THE ARTIST".
 * The portrait peels back on hover revealing an inverted doppelgänger (the
 * "other side of the tape"). Editorial manifesto. WebGL budget: 1 context.
 */
export default function AboutSection() {
  return (
    <section
      id="sobre"
      className="relative border-t border-white/10 bg-black-4 py-[12vh]"
      aria-labelledby="about-title"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-12">
        {/* ===== Portrait column ===== */}
        <div className="lg:col-span-5">
          <Reveal>
            {/* Peel wrapper: portrait peels to reveal inverted version */}
            <Peel
              side="right"
              mode="hover"
              reveal={300}
              zone={40}
              curl={8}
              bow={4}
              shade={0.6}
              shine={0.4}
              shineDistance={0}
              shineColor="auto"
              bulge={6}
              perspective={1200}
              smoothing={0.3}
              under={
                <div className="relative aspect-[4/5] overflow-hidden cut-corner bg-black-8">
                  <Image
                    src="/icon-portrait.jpg"
                    alt=""
                    fill
                    className="object-cover object-top grayscale invert contrast-[1.6]"
                    sizes="(min-width: 1024px) 40vw, 90vw"
                  />
                  <div className="halftone absolute inset-0 opacity-20 mix-blend-overlay" aria-hidden="true" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" aria-hidden="true" />
                  <div className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.2em] text-white/80">
                    FIG.02 — NEGATIVO
                  </div>
                </div>
              }
            >
              <div className="relative aspect-[4/5] overflow-hidden cut-corner">
                <Image
                  src="/icon-portrait.jpg"
                  alt="Retrato preto e branco com estética rock"
                  fill
                  className="object-cover object-top grayscale contrast-[1.3]"
                  sizes="(min-width: 1024px) 40vw, 90vw"
                />
                <div className="halftone absolute inset-0 opacity-30 mix-blend-overlay" aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden="true" />
              </div>
            </Peel>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mt-4 flex items-center justify-between border border-white/15 bg-black px-4 py-3">
              <span className="font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase">
                ARTHUR IARLEY
              </span>
              <span className="font-mono text-[10px] text-white/60">
                P&B · 735×727
              </span>
            </div>
          </Reveal>
        </div>

        {/* ===== Manifesto column ===== */}
        <div className="lg:col-span-7 lg:pl-6">
          <Reveal>
            <p className="mono-label mb-4 text-white/60">// INTRODUÇÃO</p>
            <h2
              id="about-title"
              className="font-headline text-4xl font-bold uppercase leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Interface é
              <br />
              <span className="text-outline">performance.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-6 max-w-2xl space-y-4">
              <p className="text-base leading-relaxed text-gray-80">
                Sou <strong className="text-white">Arthur Iarley</strong> —
                desenvolvedor full-stack. Este é o meu palco: um template
                multi-domínio construído sobre{" "}
                <span className="text-white">Next.js 16</span>,{" "}
                <span className="text-white">React 19</span>,{" "}
                <span className="text-white">TypeScript</span> e{" "}
                <span className="text-white">Tailwind</span>, onde cada tela é
                tratada como uma capa de disco — P&B, bruta, cinematográfica.
              </p>
              <p className="text-base leading-relaxed text-gray-53">
                Do contraste ao motion, do grid ao grain: nada aqui é
                decorativo por acaso. A identidade carrega a mensagem antes do
                texto. E o texto, quando chega, tem peso.
              </p>
            </div>
          </Reveal>

          {/* Stack grid */}
          <Reveal delay={0.15}>
            <h3 className="mt-10 font-mono text-[11px] tracking-[0.25em] text-white/50 uppercase">
              STACK — O QUE EU TOCo
            </h3>
            <ul className="mt-4 grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2">
              {STACK.map((tech) => (
                <li
                  key={tech.name}
                  className="group flex items-start justify-between gap-4 bg-black-4 px-4 py-4 transition-colors hover:bg-black-8"
                >
                  <div>
                    <span className="font-semibold text-white">
                      {tech.name}
                    </span>
                    <p className="mt-0.5 text-xs text-gray-53">{tech.desc}</p>
                  </div>
                  <span
                    className="mt-1 font-mono text-xs text-white/40 group-hover:text-white"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-10">
              <Link
                href="/sobre"
                className="btn-outline"
              >
                LEIA O MANIFESTO COMPLETO
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}