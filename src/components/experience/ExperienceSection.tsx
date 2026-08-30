"use client";

import { Reveal } from "@/components/ui/Reveal";
import { ParticleScroll } from "@/components/canvasui/ParticleScroll";

const TIMELINE = [
  {
    year: "ATUAL",
    title: "Analista de Projetos — Seed a Bit Tecnologia",
    body: "Atuação profissional com foco em desenvolvimento e apoio a soluções reais em produção.",
    tag: "PROJETOS · PROD",
  },
  {
    year: "ATUAL",
    title: "CTO — SmartRU",
    body: "Responsável pelas decisões de arquitetura de software e pela evolução técnica da plataforma.",
    tag: "ARQUITETURA · PRODUTO",
  },
  {
    year: "FORMAÇÃO",
    title: "Sistemas de Informação — UFRPE",
    body: "Base acadêmica em computação aplicada, engenharia de software e sistemas de informação.",
    tag: "UFRPE",
  },
  {
    year: "FOCO",
    title: "Backend, APIs e segurança",
    body: "Trabalho com autenticação, autorização, modelagem de dados, módulos backend e integrações REST.",
    tag: "NODE · NEST · SQL",
  },
];

/**
 * EXPERIENCE — "TRACK 03: THE BUILD LOG".
 * The timeline lives inside a ParticleScroll stage: content below the
 * formation line dissolves into fine sand and reassembles as the page
 * scrolls — a build log that assembles itself while you read.
 */
export default function ExperienceSection() {
  return (
    <section
      className="relative border-t border-white/10 bg-black-4"
      aria-labelledby="experience-title"
    >
      <div className="mx-auto max-w-[1400px] px-5 pb-8 pt-[10vh] sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/15 pb-4">
            <div>
              <p className="mono-label text-white/50">// TRAJETÓRIA · PERFIL</p>
              <h2
                id="experience-title"
                className="mt-2 font-headline text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl"
              >
                Experiência e formação
              </h2>
            </div>
            <p className="font-mono text-xs text-white/60">
              [ BUILD_LOG · scroll ]
            </p>
          </div>
        </Reveal>
      </div>

      {/* ParticleScroll stage — dissolves/reassembles on scroll */}
      <ParticleScroll
        className="relative h-[150vh]"
        point={0.68}
        band={460}
        density={2}
        size={1.25}
        spread={240}
        gravity={0.25}
        drift={0.15}
        swirl={60}
        stagger={0.4}
        fade={0.55}
        settle={0.9}
        smoothing={0.12}
      >
        <div className="mx-auto max-w-[1400px] px-5 py-4 sm:px-8">
          <ol className="mt-0">
            {TIMELINE.map((item, i) => (
              <li key={item.year} className="group">
                <div className="grid grid-cols-1 gap-3 border-b border-white/10 py-8 transition-colors hover:bg-black-8 sm:grid-cols-12 sm:items-baseline sm:px-3">
                  <div className="sm:col-span-3">
                    <span className="font-mono text-xs tracking-[0.2em] text-white/50">
                      {item.year}
                    </span>
                  </div>
                  <div className="sm:col-span-6">
                    <h3 className="font-headline text-xl font-bold uppercase tracking-tight text-white transition-colors sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-gray-80">
                      {item.body}
                    </p>
                  </div>
                  <div className="sm:col-span-3 sm:text-right">
                    <span className="inline-block border border-white/20 px-3 py-1 font-mono text-[10px] tracking-[0.15em] text-white/60">
                      {item.tag}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </ParticleScroll>
    </section>
  );
}