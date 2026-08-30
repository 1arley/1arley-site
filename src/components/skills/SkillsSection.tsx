"use client";

import { Reveal } from "@/components/ui/Reveal";
import { HexFloat } from "@/components/canvasui/HexFloat";

const CATEGORIES = [
  {
    id: "01",
    title: "BACKEND",
    items: [
      "TypeScript",
      "Node.js",
      "NestJS",
      "Python",
      "APIs REST",
      "Segurança",
    ],
  },
  {
    id: "02",
    title: "DADOS",
    items: [
      "PostgreSQL",
      "Prisma",
      "SQLite",
      "Modelagem relacional",
      "Migrations",
      "Validação",
    ],
  },
  {
    id: "03",
    title: "FRONTEND",
    items: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "UI componentizada",
      "Responsividade",
      "Acessibilidade",
    ],
  },
  {
    id: "04",
    title: "DEVOPS",
    items: [
      "Docker",
      "CI/CD",
      "Swagger/OpenAPI",
      "JWT",
      "Git",
      "Linux",
    ],
  },
];

/**
 * SKILLS — "TRACK 02: THE GEAR".
 * The capability grid floats on shiny hex tiles with a fluid reading window
 * that follows the cursor. HexFloat re-renders the captured HTML on
 * perspective-tilted hexagons.
 */
export default function SkillsSection() {
  return (
    <section
      className="relative border-t border-white/10 bg-black-2 py-[12vh]"
      aria-labelledby="skills-title"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        {/* Section header */}
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/15 pb-4">
            <div>
              <p className="mono-label text-white/50">// SKILLS · STACK REAL</p>
              <h2
                id="skills-title"
                className="mt-2 font-headline text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl"
              >
Tecnologias e categorias
              </h2>
            </div>
            <p className="font-mono text-xs text-white/60">
              [ TOOLS_01 → TOOLS_04 ]
            </p>
          </div>
        </Reveal>

        {/* HexFloat skill grid — floating hex tiles with fluid window */}
        <div className="mt-8">
          <HexFloat
            size={72}
            gap={2}
            bevel={1.2}
            tilt={6}
            perspective={0.55}
            float={0.12}
            speed={0.8}
            shine={0.8}
            lift={0.4}
            radius={240}
            flow={0.6}
            swirl={2}
            trail={0.4}
            iridescence={0}
            bloom={0.15}
            grain={0.06}
            gapColor="auto"
          >
            <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="group flex h-full flex-col border border-white/10 bg-black-2 p-5 transition-colors hover:border-white/40 hover:bg-black-4"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[11px] tracking-[0.25em] text-white/50">
                      {cat.id}
                    </span>
                    <span
                      className="font-mono text-[10px] text-white/30 group-hover:text-white/70"
                      aria-hidden="true"
                    >
                      ▣
                    </span>
                  </div>
                  <h3 className="mt-4 font-headline text-lg font-bold uppercase tracking-wide text-white">
                    {cat.title}
                  </h3>
                  <ul className="mt-4 space-y-2 border-t border-white/10 pt-4">
                    {cat.items.map((item, idx) => (
                      <li
                        key={item}
                        className="flex items-baseline gap-2 text-sm text-gray-80"
                      >
                        <span
                          className="font-mono text-[10px] text-white/50"
                          aria-hidden="true"
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </HexFloat>
        </div>
      </div>
    </section>
  );
}