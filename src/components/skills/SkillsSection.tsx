"use client";

import { Reveal } from "@/components/ui/Reveal";
import { useLocale } from "@/lib/i18n";

export default function SkillsSection() {
  const { t } = useLocale();

  return (
    <section
      className="border-y border-white/15 bg-black py-24 sm:py-32"
      aria-labelledby="skills-title"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <Reveal>
          <h2
            id="skills-title"
            className="max-w-5xl font-headline text-4xl sm:text-6xl lg:text-8xl uppercase leading-none text-white"
          >
            {t.skills.title}
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 border-l border-t border-white/15 sm:grid-cols-2 lg:grid-cols-4">
          {t.skills.categories.map((category, index) => (
            <Reveal
              key={category.id}
              className={`border-b border-r border-white/15 p-5 sm:p-6 ${
                index % 2 === 1 ? "lg:translate-y-8" : ""
              }`}
              delay={index * 0.03}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-3xl uppercase text-white">
                  {category.title}
                </h3>
                <span className="font-mono text-[10px] text-white/55">
                  {category.id}
                </span>
              </div>
              <p className="prose-read mt-10 text-sm leading-8 text-white/58">
                {category.items.join(" / ")}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
