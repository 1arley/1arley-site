"use client";

import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-bg">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-dots opacity-20" />

      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan/20 bg-cyan/5 mb-8">
              <Terminal className="w-4 h-4 text-cyan" />
              <span className="text-cyan text-sm font-mono">template v1.0</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Construa projetos{" "}
            <span className="gradient-text">modernos</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Next.js 16, React 19, TypeScript, Tailwind CSS e Radix UI.
            Uma base sólida para qualquer tipo de projeto web.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/sobre"
              className="btn-primary-gradient inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm"
            >
              Saiba mais
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/admin/content"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm border border-white/10 text-white hover:bg-white/5 transition-all"
            >
              Abrir Admin
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
