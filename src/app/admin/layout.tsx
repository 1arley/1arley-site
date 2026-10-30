'use client'

import { useEffect, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FileText, Users, Link2, Shield, Globe } from 'lucide-react'
import { cn } from '@/utils/lib/utils'
import { isAdminSessionActive } from '@/utils/lib/admin-auth'

export const ENABLE_EXTRA_ADMIN_TABS =
  process.env.NEXT_PUBLIC_ENABLE_EXTRA_ADMIN_TABS === 'true'

const allAdminLinks = [
  { label: 'Site', href: '/admin/site', icon: Globe, extra: false },
  { label: 'Conteúdo', href: '/admin/content', icon: FileText, extra: true },
  { label: 'Equipe', href: '/admin/team', icon: Users, extra: true },
  { label: 'Links', href: '/admin/links', icon: Link2, extra: true },
  { label: 'Usuários', href: '/admin/users', icon: Shield, extra: false },
]

const adminLinks = allAdminLinks.filter(
  (link) => !link.extra || ENABLE_EXTRA_ADMIN_TABS,
)

function subscribeSession() {
  return () => {}
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const authed = useSyncExternalStore(
    subscribeSession,
    isAdminSessionActive,
    () => false,
  )

  useEffect(() => {
    if (!authed) {
      router.replace('/login')
    }
  }, [authed, router])

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black">
        <p className="font-mono text-xs tracking-[0.2em] text-white/50">AUTENTICANDO…</p>
      </main>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="border border-border bg-black-4 p-4 lg:sticky lg:top-24">
              <h2 className="text-white font-bold mb-4 px-3">Admin</h2>
              <nav className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:gap-0 lg:space-y-1 lg:overflow-visible lg:pb-0">
                {adminLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'flex min-h-11 items-center gap-3 whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-muted-foreground hover:text-white hover:bg-white/5'
                      )}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </aside>
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
