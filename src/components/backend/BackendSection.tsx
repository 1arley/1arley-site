"use client";

import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { useLocale } from "@/lib/i18n";

export default function BackendSection() {
  const { t } = useLocale();

  return (
    <section
      className="bg-black-4 py-24 sm:py-32"
      aria-labelledby="backend-title"
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-7">
          <div className="overflow-hidden border border-white/20 bg-black">
            <div className="flex min-h-12 items-center justify-between border-b border-white/15 px-4 font-mono text-[10px] uppercase text-white/58">
              <span>contrato-api.ts</span>
              <span>REST / production</span>
            </div>
            <div className="terminal-screen p-4 sm:p-6">
              {t.backend.endpoints.map((endpoint) => (
                <div
                  key={`${endpoint.method}-${endpoint.path}`}
                  className="grid gap-2 border-b border-white/10 py-4 font-mono text-xs sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:items-baseline"
                >
                  <span className="text-white">{endpoint.method}</span>
                  <code className="break-words text-white/75">
                    {endpoint.path}
                  </code>
                  <span className="text-white/58">{endpoint.note}</span>
                </div>
              ))}
              <p className="mt-5 font-mono text-xs text-white/50">
                <span className="text-white">&gt;_</span> ready
              </p>
            </div>
          </div>
        </Reveal>

        <div className="lg:col-span-4 lg:col-start-9">
          <Reveal>
            <h2
              id="backend-title"
              className="font-headline text-4xl sm:text-6xl uppercase leading-none text-white"
            >
              {t.backend.title1}{" "}
              <span className="text-outline">{t.backend.title2}</span>
            </h2>
            <p className="prose-read mt-6 text-base leading-relaxed text-white/58">
              {t.backend.body}
            </p>
          </Reveal>

          <div className="mt-10">
            {t.backend.features.map((feature, index) => (
              <Reveal
                key={feature.title}
                className="border-t border-white/15 py-5"
                delay={index * 0.03}
              >
                <h3 className="font-headline text-lg uppercase text-white">
                  {feature.title}
                </h3>
                <p className="prose-read mt-2 text-sm leading-relaxed text-white/58">
                  {feature.body}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-7">
            <a
              href="https://github.com/1arley"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link group"
            >
              {t.backend.cta}
              <ArrowUpRight
                size={17}
                className="transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
