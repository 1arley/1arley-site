"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { useLocale } from "@/lib/i18n";

/**
 * SOBRE — intimate editorial portrait.
 * Completely unique from the homepage: no WebGL, no ticker dividers,
 * no stack grid, no project cards. This is the personal story.
 *
 * Sections: Opening → Story → Philosophy → Now → Colophon → CTA
 */
export default function SobrePage() {
  const { t } = useLocale();

  return (
    <main className="bg-black-2">
      {/* ═══════════════════════════════════════════
          1. OPENING SPREAD — cinematic name treatment
         ═══════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden border-b border-white/10 bg-black"
        aria-labelledby="sobre-title"
      >
        {/* Decorative: film-strip top edge */}
        <div className="tape-edge" aria-hidden="true" />

        <div className="relative mx-auto max-w-[1400px] px-5 pb-[14vh] pt-[22vh] sm:px-8">
          <Reveal>
            <p className="mono-label flex items-center gap-3 text-white/70">
              <span className="h-px w-12 bg-white/40" aria-hidden="true" />
              <span>{t.sobre.label}</span>
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h1
              id="sobre-title"
              className="mt-8 font-display text-[clamp(3.5rem,16vw,14rem)] font-black uppercase leading-[0.78] tracking-[-0.04em] text-white"
            >
              Arthur
              <br />
              <span className="text-outline-white">Iarley.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="border border-white/50 bg-white px-4 py-2 font-mono text-[11px] font-bold tracking-[0.15em] text-black">
                {t.sobre.roleTag}
              </span>
              <span className="font-mono text-xs tracking-[0.2em] text-gray-53">
                {t.sobre.heroSubtitle}
              </span>
            </div>
          </Reveal>
        </div>

        {/* Decorative: bottom film-strip edge */}
        <div className="tape-edge" aria-hidden="true" />
      </section>

      {/* ═══════════════════════════════════════════
          2. ORIGIN STORY — asymmetric 2-column
         ═══════════════════════════════════════════ */}
      <section
        className="relative border-t border-white/10 bg-black-4"
        aria-labelledby="story-title"
      >
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 px-5 py-[14vh] sm:px-8 lg:grid-cols-12 lg:gap-12">
          {/* Portrait column */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="relative aspect-[3/4] overflow-hidden cut-corner bg-black-6">
                <Image
                  src="/icon-portrait.jpg"
                  alt="Arthur Iarley"
                  fill
                  className="object-cover object-top grayscale contrast-[1.3]"
                  sizes="(min-width: 1024px) 35vw, 85vw"
                  priority
                />
                <div
                  className="halftone absolute inset-0 opacity-25 mix-blend-overlay"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
                  aria-hidden="true"
                />
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="mt-3 flex items-center justify-between border border-white/15 bg-black px-4 py-3">
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase">
                  {t.sobre.storyFigLabel}
                </span>
                <span className="font-mono text-[10px] text-white/60">
                  {t.sobre.storyFigSpec}
                </span>
              </div>
            </Reveal>
          </div>

          {/* Narrative column */}
          <div className="lg:col-span-7 lg:pl-4">
            <Reveal>
              <p className="mono-label mb-4 text-white/70">
                {t.sobre.storyLabel}
              </p>
              <h2
                id="story-title"
                className="max-w-xl font-headline text-3xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-5xl"
              >
                {t.sobre.storyTitle}
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-10 max-w-2xl space-y-6 hard-border-l pl-6">
                <p className="prose-read text-base leading-relaxed text-gray-80">
                  {t.sobre.storyP1}
                </p>
                <p className="prose-read text-base leading-relaxed text-gray-53">
                  {t.sobre.storyP2}
                </p>
                <p className="prose-read text-base leading-relaxed text-gray-53">
                  {t.sobre.storyP3}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. PHILOSOPHY — pull-quotes
         ═══════════════════════════════════════════ */}
      <section
        className="relative border-t border-white/10 bg-black"
        aria-labelledby="phil-title"
      >
        <div className="mx-auto max-w-[1400px] px-5 py-[14vh] sm:px-8">
          <Reveal>
            <p className="mono-label text-white/70">{t.sobre.philLabel}</p>
            <h2
              id="phil-title"
              className="mt-3 max-w-xl font-headline text-3xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-5xl"
            >
              {t.sobre.philTitle}
            </h2>
          </Reveal>

          <div className="mt-12 space-y-px">
            {t.sobre.philQuotes.map((q, i) => (
              <Reveal key={i} delay={0.05 * (i + 1)}>
                <blockquote className="group border border-white/10 bg-black-4 px-6 py-8 transition-colors hover:bg-black-8 sm:px-10 sm:py-10">
                  <p className="font-headline text-xl font-bold uppercase leading-[1.1] tracking-tight text-white sm:text-3xl lg:text-4xl">
                    &ldquo;{q.text}&rdquo;
                  </p>
                  <footer className="mt-4 font-mono text-[11px] tracking-[0.15em] text-gray-53 uppercase">
                    — {q.note}
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4. NOW — live snapshot grid
         ═══════════════════════════════════════════ */}
      <section
        className="relative border-t border-white/10 bg-black-4"
        aria-labelledby="now-title"
      >
        <div className="mx-auto max-w-[1400px] px-5 py-[14vh] sm:px-8">
          <Reveal>
            <p className="mono-label text-white/70">{t.sobre.nowLabel}</p>
            <h2
              id="now-title"
              className="mt-3 font-headline text-3xl font-bold uppercase tracking-tight text-white sm:text-5xl"
            >
              {t.sobre.nowTitle}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10 grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
              {t.sobre.nowItems.map((item) => (
                <div
                  key={item.label}
                  className="bg-black-4 px-6 py-6 transition-colors hover:bg-black-8"
                >
                  <span className="font-mono text-[10px] tracking-[0.2em] text-gray-53 uppercase">
                    {item.label}
                  </span>
                  <p className="mt-2 font-headline text-lg font-bold uppercase tracking-tight text-white sm:text-xl">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5. COLOPHON — tech credits
         ═══════════════════════════════════════════ */}
      <section
        className="relative border-t border-white/10 bg-black"
        aria-labelledby="colophon-title"
      >
        <div className="mx-auto max-w-[1400px] px-5 py-[14vh] sm:px-8">
          <Reveal>
            <p className="mono-label text-white/70">{t.sobre.colophonLabel}</p>
            <h2
              id="colophon-title"
              className="mt-3 font-headline text-3xl font-bold uppercase tracking-tight text-white sm:text-5xl"
            >
              {t.sobre.colophonTitle}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {t.sobre.colophonItems.map((item) => (
                <li
                  key={item.label}
                  className="flex items-start justify-between gap-4 hard-border bg-black-4 px-5 py-5 transition-colors hover:bg-black-8"
                >
                  <div>
                    <span className="font-mono text-[10px] tracking-[0.2em] text-gray-53 uppercase">
                      {item.label}
                    </span>
                    <p className="mt-1 font-semibold uppercase text-white">
                      {item.value}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6. CTA — simple contact link
         ═══════════════════════════════════════════ */}
      <section
        className="relative border-t border-white/10 bg-black-2"
        aria-labelledby="cta-title"
      >
        <div className="mx-auto max-w-[1400px] px-5 py-[16vh] sm:px-8">
          <Reveal>
            <h2
              id="cta-title"
              className="font-display text-[clamp(2.5rem,10vw,8rem)] font-black uppercase leading-[0.85] tracking-[-0.03em] text-white"
            >
              {t.sobre.ctaContact}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link href={`mailto:arthuriarleydev@gmail.com?subject=${encodeURIComponent(t.sobre.emailSubject)}`} className="btn-brutal">
                {t.contact.cta}
              </Link>
              <Link href="/" className="btn-outline">
                {t.navbar.home}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
