"use client";

import Link from "next/link";
import { Asciify } from "@/components/canvasui/Asciify";

/**
 * FOOTER — the end credits.
 * Asciify lens redraws the footer as ASCII under the cursor. Brand block,
 * nav, admin, contact, and a giant watermark. Zero radius, grayscale.
 */
const Footer = () => {
  const mailtoHref =
    "mailto:contato@seu-dominio.com?subject=Contato%20via%201arley&body=Ola%2C%20gostaria%20de%20mais%20informacoes.";

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black">
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
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/50">
                    rock·full-stack
                  </span>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-53">
                Template multi-domínio para projetos web. P&B, brutal, sem
                concessão.
              </p>
            </div>

            {/* Navegação */}
            <div>
              <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-white/50">
                Navegação
              </h4>
              <div className="flex flex-col gap-2">
                <Link href="/" className="text-sm text-gray-53 transition-colors hover:text-white">
                  Home
                </Link>
                <Link href="/sobre" className="text-sm text-gray-53 transition-colors hover:text-white">
                  Sobre
                </Link>
                <Link href="/faq" className="text-sm text-gray-53 transition-colors hover:text-white">
                  FAQ
                </Link>
              </div>
            </div>

            {/* Admin */}
            <div>
              <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-white/50">
                Admin
              </h4>
              <div className="flex flex-col gap-2">
                <Link href="/admin/content" className="text-sm text-gray-53 transition-colors hover:text-white">
                  Conteúdo
                </Link>
                <Link href="/admin/team" className="text-sm text-gray-53 transition-colors hover:text-white">
                  Equipe
                </Link>
                <Link href="/admin/links" className="text-sm text-gray-53 transition-colors hover:text-white">
                  Links
                </Link>
                <Link href="/admin/users" className="text-sm text-gray-53 transition-colors hover:text-white">
                  Usuários
                </Link>
              </div>
            </div>

            {/* Contato */}
            <div>
              <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-white/50">
                Contato
              </h4>
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-2 border border-white/20 px-4 py-2.5 text-sm text-white transition-colors hover:bg-white hover:text-black"
              >
                <span aria-hidden="true">✉</span>
                Enviar e-mail
              </a>
              <p className="mt-3 text-sm text-gray-53">
                contato@seu-dominio.com
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
            <p className="font-mono text-xs text-white/60">
              © {new Date().getFullYear()} 1arley — Todos os direitos
              reservados
            </p>
            <p className="hidden font-mono text-[10px] tracking-[0.2em] text-white/50 sm:block">
              GRAIN · BRUTAL · MONOCHROME · ROCK
            </p>
          </div>
        </div>
      </Asciify>

      {/* Giant watermark */}
      <div className="pointer-events-none relative -mt-10 overflow-hidden" aria-hidden="true">
        <p className="select-none whitespace-nowrap px-5 text-center font-display text-[clamp(4rem,16vw,14rem)] font-black uppercase leading-[0.72] tracking-[-0.03em] text-white/[0.04]">
          Arthur Iarley
        </p>
      </div>
    </footer>
  );
};

export default Footer;