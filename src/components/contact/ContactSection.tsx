"use client";

import { ArrowUpRight, BriefcaseBusiness, Code2, Mail } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { useLocale } from "@/lib/i18n";

export default function ContactSection() {
  const { t } = useLocale();

  return (
    <section
      className="relative overflow-hidden border-t border-white/15 bg-black py-24 sm:py-32"
      aria-labelledby="contact-title"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <Reveal>
          <p className="font-mono text-[10px] uppercase text-white/58">
            {t.contact.status}
          </p>
          <h2
            id="contact-title"
            className="mt-5 max-w-7xl font-display text-4xl sm:text-6xl lg:text-8xl uppercase leading-none text-white"
          >
            {t.contact.title1}{" "}
            <span className="text-outline-white">{t.contact.title2}</span>{" "}
            {t.contact.title3}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-8 border-t border-white/20 pt-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="prose-read max-w-xl text-lg leading-relaxed text-white/62">
              {t.contact.subtitle}
            </p>
          </Reveal>

          <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.04}>
            <a
              href="mailto:arthuriarleydev@gmail.com?subject=Contato%20via%20portfolio"
              className="contact-mail group flex min-h-20 items-center justify-between gap-6 border border-white bg-white px-5 font-headline text-2xl uppercase text-black sm:px-7 sm:text-3xl"
            >
              {t.contact.cta}
              <ArrowUpRight
                size={25}
                className="transition-transform duration-150 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </a>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <a
                href="https://github.com/1arley"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social"
              >
                <Code2 size={17} />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/arthuriarley"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social"
              >
                <BriefcaseBusiness size={17} />
                LinkedIn
              </a>
            </div>

            <p className="mt-5 flex items-center gap-2 break-all font-mono text-[10px] uppercase text-white/58">
              <Mail size={14} />
              arthuriarleydev@gmail.com
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
