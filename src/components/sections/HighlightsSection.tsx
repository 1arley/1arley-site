"use client";

import { motion } from "framer-motion";
import { FileCode2, Database, Globe } from "lucide-react";

const highlights = [
  {
    icon: FileCode2,
    title: "Contrato API Genérico",
    description: "Tipos TypeScript e serviço Axios prontos para conectar a qualquer backend REST.",
  },
  {
    icon: Database,
    title: "CRUD Configurável",
    description: "Módulos de conteúdo, equipe, links e usuários com operações Create, Read, Update e Delete.",
  },
  {
    icon: Globe,
    title: "SEO & Metadados",
    description: "Metadata dinâmica, Open Graph, sitemap e robots configurados automaticamente.",
  },
];

const HighlightsSection = () => {
  return (
    <section className="py-24 relative bg-dots">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto para{" "}
              <span className="gradient-text">conectar</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              O template não depende de um backend específico. Defina sua API_BASE_URL,
              implemente os endpoints do contrato e a aplicação funciona. A camada de
              administração já inclui login, RBAC e upload de imagens.
            </p>
            <div className="space-y-4">
              {highlights.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-cyan" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-6 font-mono text-sm"
          >
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <div className="w-3 h-3 rounded-full bg-orange" />
              <div className="w-3 h-3 rounded-full bg-green" />
              <span className="ml-2 text-muted-foreground text-xs">contrato-api.ts</span>
            </div>
            <pre className="text-muted-foreground overflow-x-auto">
              <code>{`// GET /api/v1/posts → Post[]
// POST /api/v1/posts → CreatePost
// GET /api/v1/team-members → { data: Member[] }
// GET /api/v1/faq/topics → FaqTopic[]
// POST /api/v1/auth/login → LoginResponse
// POST /api/v1/auth/refresh → { access_token }`}</code>
            </pre>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HighlightsSection;
