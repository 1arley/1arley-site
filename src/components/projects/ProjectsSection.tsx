"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { useLocale } from "@/lib/i18n";

const projectLayouts = [
  "lg:col-span-8",
  "lg:col-span-5 lg:col-start-8 lg:mt-28",
  "lg:col-span-7 lg:mt-8",
  "lg:col-span-6 lg:col-start-7 lg:mt-24",
];

const projectAspects = [
  "aspect-[16/9]",
  "aspect-[4/3]",
  "aspect-[3/2]",
  "aspect-[16/10]",
];

export default function ProjectsSection() {
  const { t } = useLocale();

  return (
    <section
      id="projetos"
      className="relative bg-black-2 py-24 sm:py-32"
      aria-labelledby="projects-title"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <Reveal>
          <div className="border-b border-white/20 pb-6">
            <h2
              id="projects-title"
              className="max-w-5xl font-display text-4xl sm:text-6xl lg:text-8xl uppercase leading-none text-white"
            >
              {t.projects.title}
            </h2>
            <p className="mt-5 font-mono text-[10px] uppercase text-white/50">
              {t.projects.count}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-y-20 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-28">
          {t.projects.projects.map((project, index) => (
            <Reveal
              key={project.id}
              className={`min-w-0 ${projectLayouts[index] ?? "lg:col-span-6"}`}
              delay={index * 0.04}
            >
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link group block"
                aria-label={`${project.title} - ${project.kind}`}
              >
                <div className="mb-3 flex items-center justify-between gap-4 border-b border-white/15 pb-3 font-mono text-[10px] uppercase text-white/55">
                  <span>{project.kind}</span>
                  <span>{project.id}</span>
                </div>

                <div
                  className={`relative overflow-hidden bg-black-8 ${projectAspects[index]}`}
                >
                  <Image
                    src={project.img}
                    alt={project.alt}
                    fill
                    className="object-cover grayscale contrast-[1.08] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.025]"
                    sizes={
                      index === 0
                        ? "(min-width: 1024px) 65vw, 100vw"
                        : "(min-width: 1024px) 48vw, 100vw"
                    }
                  />
                  <div
                    className="project-scan absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                  <div>
                    <h3 className="font-headline text-3xl uppercase leading-none text-white sm:text-4xl">
                      {project.title}
                    </h3>
                    <p className="prose-read mt-3 max-w-2xl text-sm leading-relaxed text-white/58">
                      {project.body}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] uppercase text-white/55">
                      {project.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  <span className="grid h-12 w-12 shrink-0 place-items-center border border-white/25 text-white transition-colors duration-150 group-hover:bg-white group-hover:text-black">
                    <ArrowUpRight size={19} />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
