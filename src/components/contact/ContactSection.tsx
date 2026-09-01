"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Ripple } from "@/components/canvasui/Ripple";
import { GravityStarsBackground } from "@/components/animate-ui/gravity-stars";
import { LiquidButton } from "@/components/animate-ui/liquid-button";
import { Magnet } from "@/components/animate-ui/magnet";
import { ShinyText } from "@/components/animate-ui/shiny-text";
import { Counter } from "@/components/animate-ui/counter";
import { useLocale } from "@/lib/i18n";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * CONTACT — "TRACK 06: THE FINALE".
 * On fine pointers a gravity dust field glows behind the colossal headline;
 * water ripples spread from every click; the mailto CTA is a LiquidButton.
 * The peak-and-end moment. WebGL budget: 1 context (Ripple). On touch both
 * pointer-driven layers are skipped.
 */
export default function ContactSection() {
  const { t } = useLocale();
  const isMobile = useIsMobile();

  const content = (
    <div className="relative mx-auto max-w-[1400px] px-5 py-[16vh] sm:px-8">
      {/* Gravity dust field behind the content */}
      <div className="pointer-events-none absolute inset-0 text-white" aria-hidden="true">
        {!isMobile && (
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
        )}
      </div>

      <div className="relative z-10">
        {/* Editorial label */}
        <Reveal>
          <div className="flex items-center gap-3 mono-label text-white/70">
            <span className="h-px w-10 bg-white/40" aria-hidden="true" />
            <span>{t.contact.label}</span>
          </div>
        </Reveal>

        {/* Colossal headline */}
        <Reveal delay={0.05}>
          <h2
            id="contact-title"
            className="mt-6 font-display text-[clamp(2.75rem,14vw,12rem)] font-black uppercase leading-[0.82] tracking-[-0.03em] text-white"
          >
            <ShinyText speed={6}>{t.contact.title1}</ShinyText>
            <br />
            <span className="text-outline-white">{t.contact.title2}</span>
            <br />
            {t.contact.title3}
          </h2>
        </Reveal>

        {/* Editorial subtitle */}
        <Reveal delay={0.1}>
          <p className="prose-read mt-8 max-w-lg text-lg leading-relaxed text-gray-80">
            {t.contact.subtitle}
          </p>
        </Reveal>

        {/* Animated stats — real, data-driven counts */}
        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/70">
            <span className="flex items-baseline gap-2">
              <Counter to={t.projects.projects.length} className="font-display text-3xl font-black text-white" />
              <span>PROJETOS</span>
            </span>
            <span className="flex items-baseline gap-2">
              <Counter to={t.about.stack.length} className="font-display text-3xl font-black text-white" />
              <span>STACK</span>
            </span>
            <span className="flex items-baseline gap-2">
              <Counter to={t.experience.timeline.length} className="font-display text-3xl font-black text-white" />
              <span>ROLES</span>
            </span>
          </div>
        </Reveal>

        {/* CTAs + contact info */}
        <div className="mt-10 flex flex-wrap items-start gap-8 sm:gap-16">
          {/* Liquid CTA — hover fills with ink */}
          <Reveal delay={0.15}>
            <div className="flex flex-col gap-4">
              <Magnet padding={56} magnetStrength={2} magnetStrengthInner={0.4}>
                <LiquidButton
                  variant="solid"
                  size="lg"
                  onClick={() => {
                    window.location.href =
                      "mailto:arthuriarleydev@gmail.com?subject=Contato%20via%20portfolio";
                  }}
                >
                  {t.contact.cta}
                </LiquidButton>
              </Magnet>
              <Link href="/sobre" className="btn-outline text-sm">
                {t.contact.aboutCta}
              </Link>
            </div>
          </Reveal>

          {/* Terminal-style contact info */}
          <Reveal delay={0.2}>
            <div className="hard-border break-words bg-black-4 px-5 py-4 font-mono text-xs leading-loose text-white/70">
              <p>
                <span className="text-accent">$ </span>mail
                &lt;arthuriarleydev@gmail.com&gt;
              </p>
              <p>
                <span className="text-accent">$ </span>github &lt;github.com/1arley&gt;
              </p>
              <p>
                <span className="text-accent">$ </span>linkedin
                &lt;linkedin.com/in/arthuriarley&gt;
              </p>
              <p>
                <span className="text-accent">$ </span>status
                &lt;{t.contact.status}&gt;
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
          <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 font-mono text-[10px] tracking-[0.2em] text-white/70">
            <span>© 2026 ARTHUR IARLEY</span>
            <span className="hidden sm:inline">
              MADE WITH GRAIN · BRUTAL · MONOCHROME
            </span>
            <span>END OF SESSION</span>
          </div>
        </Reveal>
      </div>
    </div>
  );

  return (
    <section
      className="relative border-t border-white/10 bg-black-2"
      aria-labelledby="contact-title"
    >
      {isMobile ? (
        content
      ) : (
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
          {content}
        </Ripple>
      )}
    </section>
  );
}
