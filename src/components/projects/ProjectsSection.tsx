"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Shatter } from "@/components/canvasui/Shatter";

const PROJECTS = [
  {
    id: "01",
    title: "PALCO DIGITAL",
    kind: "WEBSITE · PORTFÓLIO",
    body: "O site que você está vendo. Reinvenção P&B brutal com WebGL, grain e ASCII.",
    img: "/header-guitar.jpg",
    alt: "Guitarra em movimento com motion blur, preto e branco",
    tags: ["NEXT.JS", "THREE.JS", "MOTION"],
    href: "/sobre",
  },
  {
    id: "02",
    title: "RETRATO / MONO",
    kind: "ESTUDO · IDENTIDADE",
    body: "Tratamento editorial do retrato: halftone, scanlines, recorte agressivo.",
    img: "/icon-portrait.jpg",
    alt: "Retrato em preto e branco com estética rock",
    tags: ["CSS", "TEXTURE", "EDITORIAL"],
    href: "/sobre",
  },
];

/**
 * PROJECTS — "TRACK 04: THE RECORDS".
 * The protagonists. The covers break into 3D glass shards that lift, float
 * and refract around the cursor. Zero color, pure glass-and-grain.
 */
export default function ProjectsSection() {
  return (
    <section
      id="projetos"
      className="relative border-t border-white/10 bg-black-2 py-[12vh]"
      aria-labelledby="projects-title"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        {/* Section header */}
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/15 pb-4">
            <div>
              <p className="mono-label text-white/50">// OBRAS · TRACK 04</p>
              <h2
                id="projects-title"
                className="mt-2 font-headline text-5xl font-bold uppercase tracking-tight text-white sm:text-6xl"
              >
                Projetos
              </h2>
            </div>
            <p className="font-mono text-xs text-white/60">
              [ 02 DISCOS ]
            </p>
          </div>
        </Reveal>

        {/* Shatter stage — covers break into glass shards under cursor */}
        <div className="mt-10">
          <Shatter
            radius={0.5}
            softness={0.4}
            tileSize={72}
            shards={0.35}
            corner={2}
            lift={110}
            tilt={1.4}
            scatter={60}
            perspective={900}
            gapColor={[0.02, 0.02, 0.02]}
            shadow={0.7}
            shading={0.6}
            refraction={0.7}
            dispersion={0.4}
            floatSpeed={1.2}
            strength={1}
            baseStrength={0}
            followSpeed={6}
          >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {PROJECTS.map((proj) => (
                <Link
                  key={proj.id}
                  href={proj.href}
                  className="group block"
                  aria-label={`${proj.title} — ${proj.kind}`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden hard-border bg-black-6">
                    <Image
                      src={proj.img}
                      alt={proj.alt}
                      fill
                      className="object-cover grayscale contrast-[1.25] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      sizes="(min-width: 1024px) 46vw, 92vw"
                    />
                    <div className="halftone absolute inset-0 opacity-25 mix-blend-overlay" aria-hidden="true" />
                    <div className="scanlines absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
                    <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 to-transparent" aria-hidden="true" />

                    <div className="absolute left-4 top-4 flex items-center gap-2">
                      <span className="bg-white px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.15em] text-black">
                        {proj.id}
                      </span>
                      <span className="border border-white/40 px-2 py-0.5 font-mono text-[10px] tracking-[0.15em] text-white/80">
                        {proj.kind}
                      </span>
                    </div>

                    <div className="absolute inset-x-4 bottom-4">
                      <h3 className="font-headline text-3xl font-bold uppercase leading-none tracking-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] sm:text-4xl">
                        {proj.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border border-t-0 border-white/15 bg-black-4 px-4 py-3">
                    <p className="max-w-md text-sm text-gray-53">{proj.body}</p>
                    <span className="ml-4 hidden shrink-0 items-center gap-2 font-mono text-[10px] tracking-[0.15em] text-white/60 sm:flex">
                      {proj.tags.join(" · ")}
                    </span>
                    <span
                      className="ml-4 font-mono text-lg text-white/50 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Shatter>
        </div>
      </div>
    </section>
  );
}