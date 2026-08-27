'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, Users, Link2, Shield } from 'lucide-react'
import { cn } from '@/utils/lib/utils'

const adminLinks = [
  { label: 'Conteúdo', href: '/admin/content', icon: FileText },
  { label: 'Equipe', href: '/admin/team', icon: Users },
  { label: 'Links', href: '/admin/links', icon: Link2 },
  { label: 'Usuários', href: '/admin/users', icon: Shield },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="glass-card p-4 lg:sticky lg:top-24">
              <h2 className="text-white font-bold mb-4 px-3">Admin</h2>
              <nav className="space-y-1">
                {adminLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
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
