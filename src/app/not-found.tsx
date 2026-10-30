import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black-2 px-5">
      <div className="relative z-10 text-center border border-border bg-black-4 p-8 sm:p-12">
        <h1 className="font-display text-7xl uppercase leading-none text-white mb-4">404</h1>
        <p className="text-muted-foreground text-lg mb-8">Página não encontrada</p>
        <Link
          href="/"
          className="btn-brutal"
        >
          Voltar ao início
        </Link>
      </div>
    </main>
  )
}
