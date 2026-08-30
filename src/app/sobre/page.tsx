"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { useLocale } from "@/lib/i18n";

/**
 * SOBRE — apresentação pessoal de Arthur Iarley.
 * Editorial monochrome: hero com nome em display, manifesto, stack real,
 * trajetória em timeline, projetos em produção e CTA de contato direto.
 * Sem WebGL — apenas tipografia, bordas e grain.
 */
export default function SobrePage() {
  const { t } = useLocale();

  return (
    <main className="bg-black-2">
      {/* ===== 1. HERO EDITORIAL ===== */}
      <section
        className="relative overflow-hidden border-b border-white/10 bg-black-2"
        aria-labelledby="sobre-title"
      >
        {/* Decorative blueprint grid */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="blueprint-grid absolute inset-0 opacity-60" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-5 pb-[10vh] pt-[18vh] sm:px-8">
          <Reveal>
            <p className="mono-label flex items-center gap-3 text-white/60">
              <span className="h-px w-10 bg-white/40" aria-hidden="true" />
              <span>{t.sobre.label}</span>
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h1
              id="sobre-title"
              className="mt-6 font-display text-[clamp(3rem,14vw,11rem)] font-black uppercase leading-[0.82] tracking-[-0.03em] text-white"
            >
              <span className="block">{t.sobre.title1}</span>
              <span className="block text-outline-white">{t.sobre.title2}</span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 font-mono text-xs tracking-[0.2em] text-white/50">
              {t.hero.label}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== 2. INTRODUÇÃO PESSOAL ===== */}
      <section
        className="relative border-t border-white/10 bg-black-4"
        aria-labelledby="intro-title"
      >
        <div className="mx-auto max-w-[1400px] px-5 py-[12vh] sm:px-8">
          <Reveal>
            <p className="mono-label text-white/60">{t.sobre.introLabel}</p>
            <h2
              id="intro-title"
              className="mt-2 max-w-2xl font-headline text-3xl font-bold uppercase leading-[1.02] tracking-tight text-white sm:text-5xl"
            >
              {t.sobre.introTitle}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 max-w-2xl space-y-4 hard-border-l pl-6">
              <p className="text-base leading-relaxed text-gray-80">
                {t.about.p1Before}{" "}
                <strong className="text-white">Arthur Iarley</strong>
                {t.about.p1After}
              </p>
              <p className="text-base leading-relaxed text-gray-53">
                {t.about.p2}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== 3. STACK TÉCNICA ===== */}
      <section
        className="relative border-t border-white/10 bg-black-2"
        aria-labelledby="stack-title"
      >
        <div className="mx-auto max-w-[1400px] px-5 py-[12vh] sm:px-8">
          <Reveal>
            <h2
              id="stack-title"
              className="font-headline text-3xl font-bold uppercase tracking-tight text-white sm:text-5xl"
            >
              {t.about.stackLabel}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {t.about.stack.map((tech) => (
                <li
                  key={tech.name}
                  className="group flex items-start justify-between gap-4 hard-border cut-corner-sm bg-black-4 px-4 py-5 transition-colors hover:bg-black-8"
                >
                  <div>
                    <h3 className="font-semibold uppercase text-white">
                      {tech.name}
                    </h3>
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
        </div>
      </section>

      {/* ===== 4. EXPERIÊNCIA / TRAJETÓRIA ===== */}
      <section
        className="relative border-t border-white/10 bg-black-4"
        aria-labelledby="experience-title"
      >
        <div className="mx-auto max-w-[1400px] px-5 py-[12vh] sm:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/15 pb-4">
              <div>
                <p className="mono-label text-white/50">
                  {t.experience.label}
                </p>
                <h2
                  id="experience-title"
                  className="mt-2 font-headline text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl"
                >
                  {t.experience.title}
                </h2>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ol className="mt-6">
              {t.experience.timeline.map((item, i) => (
                <li key={`${item.year}-${i}`} className="group">
                  <div className="grid grid-cols-1 gap-3 hard-border-b py-6 transition-colors hover:bg-black-8 sm:grid-cols-12 sm:items-baseline sm:px-3 sm:py-8">
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
          </Reveal>
        </div>
      </section>

      {/* ===== 5. PROJETOS REAIS ===== */}
      <section
        className="relative border-t border-white/10 bg-black-2"
        aria-labelledby="projects-title"
      >
        <div className="mx-auto max-w-[1400px] px-5 py-[12vh] sm:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/15 pb-4">
              <div>
                <p className="mono-label text-white/50">{t.projects.label}</p>
                <h2
                  id="projects-title"
                  className="mt-2 font-headline text-4xl font-bold uppercase tracking-tight text-white sm:text-6xl"
                >
                  {t.projects.title}
                </h2>
              </div>
              <p className="font-mono text-xs text-white/60">
                {t.projects.count}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
              {t.projects.projects.map((proj) => (
                <li key={proj.id}>
                  <a
                    href={proj.href}
                    target="_blank"
                    rel="noopener noreferrer"
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
                      <div
                        className="halftone absolute inset-0 opacity-25 mix-blend-overlay"
                        aria-hidden="true"
                      />
                      <div
                        className="scanlines absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 to-transparent"
                        aria-hidden="true"
                      />

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

                    <div className="flex items-center justify-between gap-3 border border-t-0 border-white/15 bg-black-4 px-4 py-3">
                      <p className="min-w-0 max-w-md text-sm text-gray-53">
                        {proj.body}
                      </p>
                      <span className="ml-4 hidden shrink-0 items-center gap-2 font-mono text-[10px] tracking-[0.15em] text-white/60 sm:flex">
                        {proj.tags.join(" · ")}
                      </span>
                      <span
                        className="ml-4 shrink-0 font-mono text-lg text-white/50 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ===== 6. CTA CONTATO ===== */}
      <section
        className="relative border-t border-white/10 bg-black-2"
        aria-labelledby="contact-title"
      >
        <div className="mx-auto max-w-[1400px] px-5 py-[14vh] sm:px-8">
          <Reveal>
            <div className="flex items-center gap-3 mono-label text-white/50">
              <span className="h-px w-10 bg-white/40" aria-hidden="true" />
              <span>{t.contact.label}</span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h2
              id="contact-title"
              className="mt-6 font-display text-[clamp(2.75rem,14vw,12rem)] font-black uppercase leading-[0.82] tracking-[-0.03em] text-white"
            >
              {t.contact.title1}
              <br />
              <span className="text-outline-white">{t.contact.title2}</span>
              <br />
              {t.contact.title3}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-gray-80">
              {t.contact.subtitle}
            </p>
          </Reveal>

          <div className="mt-10 flex flex-wrap items-start gap-8 sm:gap-16">
            <Reveal delay={0.15}>
              <a
                href="mailto:arthuriarleydev@gmail.com?subject=Contato%20via%20portfolio"
                className="btn-brutal"
              >
                {t.contact.cta}
              </a>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="hard-border break-words bg-black-4 px-5 py-4 font-mono text-xs leading-loose text-white/70">
                <p>
                  <span className="text-white/60">$ </span>
                  <a
                    href="mailto:arthuriarleydev@gmail.com?subject=Contato%20via%20portfolio"
                    className="transition-colors hover:text-white"
                  >
                    mail &lt;arthuriarleydev@gmail.com&gt;
                  </a>
                </p>
                <p>
                  <span className="text-white/60">$ </span>
                  <a
                    href="https://github.com/1arley"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-white"
                  >
                    github &lt;github.com/1arley&gt;
                  </a>
                </p>
                <p>
                  <span className="text-white/60">$ </span>
                  <a
                    href="https://www.linkedin.com/in/arthuriarley"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-white"
                  >
                    linkedin &lt;linkedin.com/in/arthuriarley&gt;
                  </a>
                </p>
                <p>
                  <span className="text-white/60">$ </span>status
                  &lt;{t.contact.status}&gt;
                  <span
                    className="ml-2 inline-block h-2 w-2 animate-pulse bg-white"
                    aria-hidden="true"
                  />
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
