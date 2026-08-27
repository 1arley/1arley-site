'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface FaqItem {
  question: string
  answer: string
}

interface FaqCategory {
  name: string
  items: FaqItem[]
}

const faqData: FaqCategory[] = [
  {
    name: 'Geral',
    items: [
      {
        question: 'O que é este template?',
        answer: 'Um template multi-domínio com Next.js 16, React 19, TypeScript e Tailwind CSS. É uma base reutilizável para projetos web modernos.',
      },
      {
        question: 'Posso usar em qualquer projeto?',
        answer: 'Sim. Ele foi projetado para ser genérico e adaptável. Basta trocar o conteúdo, cores e configurações para se adequar ao seu projeto.',
      },
    ],
  },
  {
    name: 'API',
    items: [
      {
        question: 'Como conecto minha API?',
        answer: 'Defina API_BASE_URL no arquivo .env. O cliente Axios já está configurado com proxy via /api/v1 e interceptors de autenticação.',
      },
      {
        question: 'Qual é o contrato da API?',
        answer: 'O template espera endpoints RESTful com auth, CRUD de conteúdo, equipe, links e upload de mídia. Veja a documentação em docs/API.md.',
      },
    ],
  },
  {
    name: 'Desenvolvimento',
    items: [
      {
        question: 'Como rodar localmente?',
        answer: 'Copie .env.dev.example para .env.local, rode npm install e npm run dev.',
      },
      {
        question: 'O que vem incluído?',
        answer: 'UI completa com Navbar, Footer, Hero, Features, Highlights, CTA, páginas institucionais, admin com CRUD, sistema de auth e componentes shadcn.',
      },
    ],
  },
]

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null)

  return (
    <main className="container mx-auto px-6 pt-40 pb-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">
          Perguntas <span className="gradient-text">Frequentes</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-12">
          Respostas sobre o template, API e desenvolvimento.
        </p>

        <div className="space-y-8">
          {faqData.map((category) => (
            <div key={category.name}>
              <h2 className="text-xl font-bold text-white mb-4">{category.name}</h2>
              <div className="space-y-2">
                {category.items.map((item) => {
                  const id = `${category.name}-${item.question}`
                  const isOpen = openIndex === id
                  return (
                    <div key={id} className="glass-card">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : id)}
                        className="w-full flex items-center justify-between p-4 text-left"
                      >
                        <span className="text-white font-medium">{item.question}</span>
                        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="px-4 pb-4 text-muted-foreground text-sm leading-relaxed">
                              {item.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
