'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { sanitizeNextPath } from '@/lib/admin-cookie'
import { login, setSession } from '@/services/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await login({ email, password })
      if (response.user) {
        setSession(response.user)
        toast.success('Login realizado com sucesso')
        const rawNext =
          typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search).get('next')
            : null
        const destination = sanitizeNextPath(rawNext, '/admin/site')
        router.push(destination)
      } else {
        throw new Error('Resposta inválida')
      }
    } catch {
      toast.error('Credenciais inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black-2 px-6">
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="border border-border bg-black-4 p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Área Administrativa</h1>
            <p className="text-muted-foreground text-sm mt-2">Entre com suas credenciais</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-muted-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-muted-foreground">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full btn-brutal"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
