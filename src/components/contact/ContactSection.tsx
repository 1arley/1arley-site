"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Ripple } from "@/components/canvasui/Ripple";
import { GravityStarsBackground } from "@/components/animate-ui/gravity-stars";
import { LiquidButton } from "@/components/animate-ui/liquid-button";

/**
 * CONTACT — "TRACK 06: THE FINALE".
 * A gravity dust field glows behind the colossal headline; water ripples
 * spread from every click; the mailto CTA is a LiquidButton. The peak-and-end
 * moment. WebGL budget: 1 context (Ripple).
 */
export default function ContactSection() {
  return (
    <section
      className="relative border-t border-white/10 bg-black-2"
      aria-labelledby="contact-title"
    >
      <Ripple
        amplitude={0.7}
        speed={0.65}
        wavelength={90}
        rings={2}
        decay={1}
        refraction={90}
        dispersion={0.3}
        shine={0.5}
        trigger="click"
        interval={3}
        className=""
      >
        <div className="relative mx-auto max-w-[1400px] px-5 py-[16vh] sm:px-8">
          {/* Gravity dust field behind the content */}
          <div className="pointer-events-none absolute inset-0 text-white" aria-hidden="true">
            <GravityStarsBackground
              starsCount={70}
              starsSize={2.2}
              starsOpacity={0.7}
              glowIntensity={14}
              movementSpeed={0.35}
              mouseInfluence={120}
              mouseGravity="attract"
              gravityStrength={80}
            />
          </div>

          <div className="relative z-10">
          {/* Editorial label */}
          <Reveal>
            <div className="flex items-center gap-3 mono-label text-white/50">
              <span className="h-px w-10 bg-white/40" aria-hidden="true" />
              <span>CONTATO · TRACK 06</span>
            </div>
          </Reveal>

          {/* Colossal headline */}
          <Reveal delay={0.05}>
            <h2
              id="contact-title"
              className="mt-6 font-display text-[clamp(3.6rem,14vw,12rem)] font-black uppercase leading-[0.82] tracking-[-0.03em] text-white"
            >
              Vamos
              <br />
              <span className="text-outline-white">tocar</span>
              <br />
              juntos.
            </h2>
          </Reveal>

          {/* Editorial subtitle */}
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-gray-80">
              Tem um projeto, uma ideia, ou só quer trocar uma ideia sobre
              música, código e design? Manda um sinal.
            </p>
          </Reveal>

          {/* CTAs + contact info */}
          <div className="mt-10 flex flex-wrap items-start gap-8 sm:gap-16">
            {/* Liquid CTA — hover fills with ink */}
            <Reveal delay={0.15}>
              <div className="flex flex-col gap-4">
                <LiquidButton
                  variant="solid"
                  size="lg"
                  onClick={() => {
                    window.location.href =
                      "mailto:contato@seu-dominio.com?subject=Contato%20via%201arley";
                  }}
                >
                  ENVIAR SINAL
                </LiquidButton>
                <Link
                  href="/faq"
                  className="btn-outline text-sm"
                >
                  FAQ
                </Link>
              </div>
            </Reveal>

            {/* Terminal-style contact info */}
            <Reveal delay={0.2}>
              <div className="hard-border bg-black-4 px-5 py-4 font-mono text-xs leading-loose text-white/70">
                <p>
                  <span className="text-white/60">$ </span>mail
                  &lt;contato@seu-dominio.com&gt;
                </p>
                <p>
                  <span className="text-white/60">$ </span>site &lt;1arley.dev&gt;
                </p>
                <p>
                  <span className="text-white/60">$ </span>status &lt;aberto a
                  projetos&gt;
                  <span
                    className="ml-2 inline-block h-2 w-2 animate-pulse bg-white"
                    aria-hidden="true"
                  />
                </p>
              </div>
            </Reveal>
          </div>

          {/* Footer bar */}
          <Reveal delay={0.25}>
            <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 font-mono text-[10px] tracking-[0.2em] text-white/60">
              <span>© 2026 ARTHUR IARLEY</span>
              <span className="hidden sm:inline">
                MADE WITH GRAIN · BRUTAL · MONOCHROME
              </span>
              <span>END OF SESSION</span>
            </div>
          </Reveal>
          </div>
        </div>
      </Ripple>
    </section>
  );
}