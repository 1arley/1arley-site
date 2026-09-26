"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { useLocale } from "@/lib/i18n";

export default function AboutSection() {
  const { t } = useLocale();

  return (
    <section
      id="sobre"
      className="border-y border-white/15 bg-black-4 py-24 sm:py-32"
      aria-labelledby="about-title"
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-4">
          <div className="relative aspect-[4/5] overflow-hidden bg-black-8">
            <Image
              src="/icon-portrait.jpg"
              alt="Retrato em preto e branco de Arthur Iarley"
              fill
              className="object-cover object-top grayscale contrast-[1.18]"
              sizes="(min-width: 1024px) 32vw, 100vw"
            />
            <div className="portrait-screen absolute inset-0" aria-hidden="true" />
          </div>
          <div className="mt-3 flex justify-between border-t border-white/20 pt-3 font-mono text-[10px] uppercase text-white/58">
            <span>Arthur Iarley</span>
            <span>Full-stack / backend</span>
          </div>
        </Reveal>

        <div className="lg:col-span-7 lg:col-start-6 lg:flex lg:flex-col lg:justify-between">
          <Reveal>
            <h2
              id="about-title"
              className="max-w-4xl font-headline text-4xl sm:text-6xl lg:text-7xl uppercase leading-none text-white"
            >
              {t.about.title1}{" "}
              <span className="text-outline">{t.about.title2}</span>
            </h2>
          </Reveal>

          <Reveal className="mt-10 max-w-2xl" delay={0.04}>
            <p className="prose-read text-lg leading-relaxed text-white/82">
              {t.about.p1Before}{" "}
              <strong className="font-semibold text-white">Arthur Iarley</strong>
              {t.about.p1After}
            </p>
            <p className="prose-read mt-5 text-base leading-relaxed text-white/52">
              {t.about.p2}
            </p>
          </Reveal>

          <Reveal className="mt-12" delay={0.08}>
            <div className="grid grid-cols-2 border-l border-t border-white/15 sm:grid-cols-4">
              {t.about.stack.map((tech) => (
                <div
                  key={tech.name}
                  className="min-h-28 border-b border-r border-white/15 p-4"
                >
                  <p className="font-headline text-lg uppercase text-white">
                    {tech.name}
                  </p>
                  <p className="prose-read mt-2 text-xs leading-relaxed text-white/58">
                    {tech.desc}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="mt-8" delay={0.1}>
            <Link href="/sobre" className="text-link group">
              {t.about.cta}
              <ArrowRight
                size={17}
                className="transition-transform duration-150 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
