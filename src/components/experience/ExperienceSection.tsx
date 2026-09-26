"use client";

import { Reveal } from "@/components/ui/Reveal";
import { useLocale } from "@/lib/i18n";

export default function ExperienceSection() {
  const { t } = useLocale();

  return (
    <section
      className="bg-black-2 py-24 sm:py-32"
      aria-labelledby="experience-title"
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h2
              id="experience-title"
              className="font-display text-4xl sm:text-6xl lg:text-7xl uppercase leading-none text-white"
            >
              {t.experience.title}
            </h2>
            <p className="prose-read mt-6 max-w-sm text-sm leading-relaxed text-white/58">
              {t.about.p2}
            </p>
          </div>
        </Reveal>

        <ol className="lg:col-span-7 lg:col-start-6">
          {t.experience.timeline.map((item, index) => (
            <Reveal
              key={`${item.year}-${item.title}`}
              as="li"
              className="grid gap-4 border-t border-white/20 py-8 sm:grid-cols-[7rem_minmax(0,1fr)] sm:py-10"
              delay={index * 0.03}
            >
              <p className="font-mono text-[10px] uppercase text-white/58">
                {item.year}
              </p>
              <div>
                <h3 className="font-headline text-2xl uppercase leading-tight text-white sm:text-3xl">
                  {item.title}
                </h3>
                <p className="prose-read mt-3 max-w-xl text-sm leading-relaxed text-white/55">
                  {item.body}
                </p>
                <p className="mt-4 font-mono text-[10px] uppercase text-white/55">
                  {item.tag}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
