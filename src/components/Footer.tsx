"use client";

import Link from "next/link";
import { Asciify } from "@/components/canvasui/Asciify";
import { useLocale } from "@/lib/i18n";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * FOOTER — the end credits.
 * Asciify lens redraws the footer as ASCII under the cursor (desktop only).
 * Brand block, nav, admin, contact, and a giant watermark. Zero radius,
 * grayscale.
 */
const Footer = () => {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const year = new Date().getFullYear();
  const mailtoHref =
    "mailto:arthuriarleydev@gmail.com?subject=Contato%20via%20portfolio&body=Ola%2C%20gostaria%20de%20falar%20sobre%20oportunidades.";

  const footerContent = (
    <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center bg-white font-mono text-sm font-bold text-black">
              &gt;_
            </span>
            <div className="flex flex-col leading-none">
              <span className="font-display text-sm font-black uppercase tracking-wide text-white">
                1arley
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/70">
                rock·full-stack
              </span>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-gray-53">
            {t.footer.desc}
          </p>
        </div>

        {/* Navegação */}
        <div>
          <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-white/70">
            {t.footer.navLabel}
          </h4>
          <div className="flex flex-col gap-2">
            <Link href="/" className="text-sm text-gray-53 transition-colors hover:text-white">
              {t.footer.home}
            </Link>
            <Link href="/sobre" className="text-sm text-gray-53 transition-colors hover:text-white">
              {t.footer.about}
            </Link>
          </div>
        </div>

        {/* Contato */}
        <div>
          <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-white/70">
            {t.footer.contactLabel}
          </h4>
          <a
            href={mailtoHref}
            className="inline-flex items-center gap-2 border border-white/20 px-4 py-2.5 text-sm text-white transition-colors hover:bg-white hover:text-black"
          >
            <span aria-hidden="true">✉</span>
            {t.footer.sendEmail}
          </a>
          <div className="mt-3 flex flex-col gap-1 text-sm text-gray-53">
            <a
              href="https://github.com/1arley"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              GitHub · @1arley
            </a>
            <a
              href="https://www.linkedin.com/in/arthuriarley"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              LinkedIn · /in/arthuriarley
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
        <p className="font-mono text-xs text-white/60">
          © {year} 1arley — {t.footer.rights}
        </p>
        <p className="hidden font-mono text-[10px] tracking-[0.2em] text-white/70 sm:block">
          GRAIN · BRUTAL · MONOCHROME · ROCK
        </p>
      </div>
    </div>
  );

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black">
      {!isMobile && (
        <Asciify
          radius={0.45}
          softness={0.4}
          scale={2.2}
          spacing={1}
          charset="ascii"
          background={[0, 0, 0]}
          backgroundOpacity={0.85}
          contrast={1.5}
          brightness={0.1}
          invert={0}
          strength={0.85}
          baseStrength={0}
          followSpeed={6}
          glow={0.15}
          aberration={0.2}
          className=""
        >
          {footerContent}
        </Asciify>
      )}
      {isMobile && footerContent}

      {/* Giant watermark */}
      <div className="pointer-events-none relative -mt-10 overflow-hidden" aria-hidden="true">
        <p className="select-none whitespace-nowrap px-5 text-center font-display text-[clamp(2rem,13vw,6rem)] font-black uppercase leading-[0.72] tracking-[-0.03em] text-white/[0.04] sm:text-[clamp(4rem,16vw,14rem)]">
          Arthur Iarley
        </p>
      </div>
    </footer>
  );
};

export default Footer;
