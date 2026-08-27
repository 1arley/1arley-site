"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const CTASection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="tech-card p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-dots opacity-10" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Comece agora
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Copie o template, defina sua API e comece a construir.
              A base está pronta.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sobre"
                className="btn-primary-gradient inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm"
              >
                Ver documentação
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm border border-white/10 text-white hover:bg-white/5 transition-all"
              >
                Área administrativa
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
