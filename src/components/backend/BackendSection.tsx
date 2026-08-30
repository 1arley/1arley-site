"use client";

import { Reveal } from "@/components/ui/Reveal";
import { GlyphRain } from "@/components/canvasui/GlyphRain";
import { useLocale } from "@/lib/i18n";

/**
 * BACKEND — "TRACK 05: THE CONSOLE".
 * A glyph rain terminal: the API contract is lit by falling character streams
 * that surge where the cursor cuts through. The terminal stays readable
 * (dim ~0.55) while the glyphs dance on top.
 */
export default function BackendSection() {
  const { t } = useLocale();

  return (
    <section
      className="relative border-t border-white/10 bg-black-4 py-[10vh]"
      aria-labelledby="backend-title"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-2">
        {/* ---- Left: terminal with GlyphRain ---- */}
        <Reveal>
          <div className="relative overflow-hidden hard-border">
            <GlyphRain
              cell={16}
              color={[0.6, 0.6, 0.6]}
              headColor={[1, 1, 1]}
              speed={0.8}
              speedVariance={0.5}
              density={0.5}
              trail={1.5}
              glow={1.2}
              mutate={2}
              flicker={0.3}
              layers={2}
              dim={0.78}
              light={0.9}
              lightRadius={180}
              lightHeight={40}
              relief={0.3}
              stir={0.3}
              stirRadius={120}
              settle={1.5}
            >
              <div className="h-full">
                {/* terminal header */}
                <div className="flex items-center justify-between border-b border-white/15 bg-black-8 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 bg-white/30" aria-hidden="true" />
                    <span className="h-3 w-3 bg-white/15" aria-hidden="true" />
                    <span className="h-3 w-3 bg-white/40" aria-hidden="true" />
                    <span className="ml-2 font-mono text-xs text-white/60">
                      contrato-api.ts
                    </span>
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-white/60">
                    API REST
                  </span>
                </div>
                {/* terminal body */}
                <div className="p-5 font-mono text-[13px] leading-relaxed">
                  {t.backend.endpoints.map((ep) => (
                    <div
                      key={ep.method + ep.path}
                      className="flex items-baseline gap-3 py-1"
                    >
                      <span
                        className={`w-12 shrink-0 font-bold ${
                          ep.method === "GET" ? "text-white" : "text-gray-53"
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="text-gray-95">{ep.path}</span>
                      <span className="ml-auto hidden text-white/60 sm:inline">
                        {ep.note}
                      </span>
                    </div>
                  ))}
                  <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3 text-white/60">
                    <span className="text-white" aria-hidden="true">
                      ❯
                    </span>
                    <span className="inline-block h-3 w-2 animate-blink bg-white/70" aria-hidden="true" />
                    <span className="ml-2">ready</span>
                  </div>
                </div>
              </div>
            </GlyphRain>
          </div>
        </Reveal>

        {/* ---- Right: text + features ---- */}
        <div className="lg:pl-6">
          <Reveal>
            <p className="mono-label text-white/60">{t.backend.label}</p>
            <h2
              id="backend-title"
              className="mt-2 font-headline text-4xl font-bold uppercase leading-[1.02] tracking-tight text-white sm:text-5xl"
            >
              {t.backend.title1}
              <br />
              <span className="text-outline">{t.backend.title2}</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-80">
              {t.backend.body}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <ul className="mt-8 space-y-0">
              {t.backend.features.map((f, i) => (
                <li
                  key={f.title}
                  className="group flex gap-4 border-t border-white/10 py-4 transition-colors hover:bg-black-8 hover:px-2"
                >
                  <span className="w-8 shrink-0 font-mono text-sm text-white/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-headline text-base font-bold uppercase tracking-wide text-white">
                      {f.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-53">
                      {f.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8">
              <a
                href="https://github.com/1arley"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brutal"
              >
                {t.backend.cta}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
