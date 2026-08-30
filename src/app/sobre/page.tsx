export default function SobrePage() {
  return (
    <main className="container mx-auto px-6 pt-40 pb-20">
      <div className="max-w-3xl mx-auto space-y-12">
        <section>
          <h1 className="text-4xl font-bold text-white mb-6">
            Sobre o <span className="gradient-text">Projeto</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Este é um template multi-domínio construído com Next.js 16, React 19, TypeScript e Tailwind CSS.
            Ele fornece uma base sólida e reutilizável para criar sites institucionais, dashboards,
            portfólios e aplicações web modernas.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Stack</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'Next.js 16', desc: 'App Router, SSR, RSC' },
              { name: 'React 19', desc: 'Hooks, Context, Suspense' },
              { name: 'TypeScript 5', desc: 'Tipagem estária' },
              { name: 'Tailwind CSS 3', desc: 'Design system utilitário' },
              { name: 'Radix UI / shadcn', desc: 'Componentes acessíveis' },
              { name: 'Framer Motion', desc: 'Animações fluidas' },
              { name: 'Axios', desc: 'HTTP client com proxy' },
              { name: 'React Hook Form', desc: 'Formulários performáticos' },
            ].map((tech) => (
              <div key={tech.name} className="glass-card p-4">
                <h3 className="text-white font-semibold">{tech.name}</h3>
                <p className="text-muted-foreground text-sm">{tech.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Estrutura</h2>
          <div className="glass-card break-words p-6 font-mono text-sm text-muted-foreground space-y-1">
            <p><span className="text-cyan">src/</span></p>
            <p className="pl-4">├── <span className="text-cyan">app/</span> — Rotas e páginas</p>
            <p className="pl-4">├── <span className="text-cyan">components/</span> — UI e seções reutilizáveis</p>
            <p className="pl-4">├── <span className="text-cyan">hooks/</span> — Lógica customizada</p>
            <p className="pl-4">├── <span className="text-cyan">lib/</span> — Utilitários e helpers</p>
            <p className="pl-4">├── <span className="text-cyan">services/</span> — Camada de API (contrato genérico)</p>
            <p className="pl-4">├── <span className="text-cyan">types/</span> — Definições TypeScript</p>
            <p className="pl-4">├── <span className="text-cyan">utils/</span> — Funções auxiliares</p>
            <p className="pl-4">└── <span className="text-cyan">config.ts</span> — Configuração central</p>
          </div>
        </section>
      </div>
    </main>
  )
}
