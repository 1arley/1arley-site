"use client";

import { motion } from "framer-motion";
import { Layers, Zap, Shield, Palette } from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Arquitetura Modular",
    description: "Componentes, hooks e serviços desacoplados. Adicione ou remova módulos conforme a necessidade.",
    color: "cyan",
  },
  {
    icon: Zap,
    title: "Performance",
    description: "SSR com App Router, React Server Components e cache inteligente. Build standalone para produção.",
    color: "green",
  },
  {
    icon: Shield,
    title: "Auth & Admin",
    description: "Sistema de autenticação com refresh de token, RBAC e painel administrativo com CRUD.",
    color: "magenta",
  },
  {
    icon: Palette,
    title: "Design System",
    description: "Tema dark com tokens CSS, glassmorphism, gradientes e componentes Radix/shadcn prontos.",
    color: "orange",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Recursos do <span className="gradient-text">Template</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Tudo que você precisa para começar, sem o quê você não precisa.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="tech-card p-6 group"
              style={{ '--card-accent': `hsl(var(--${feature.color}))` } as React.CSSProperties}
            >
              <div className={`w-12 h-12 rounded-xl bg-${feature.color}/10 border border-${feature.color}/20 flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 text-${feature.color}`} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
