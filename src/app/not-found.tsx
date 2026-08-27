import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative z-10 text-center">
        <h1 className="text-7xl font-bold text-white mb-4">404</h1>
        <p className="text-muted-foreground text-lg mb-8">Página não encontrada</p>
        <Link
          href="/"
          className="btn-primary-gradient inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm"
        >
          Voltar ao início
        </Link>
      </div>
    </main>
  )
}
