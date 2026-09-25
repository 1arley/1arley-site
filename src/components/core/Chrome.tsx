'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Preloader from '@/components/effects/Preloader'
import { GrainOverlay } from '@/components/effects/GrainOverlay'
import { CustomCursor } from '@/components/effects/CustomCursor'
import { CursorTrail } from '@/components/effects/CursorTrail'

// Rota "secreta" /presente é um presente único, sem o chrome do site.
// Se o nome da rota mudar, procurar este comentário para atualizar a lista.
const BARE_ROUTES = ['/presente']

export default function Chrome({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const bare = BARE_ROUTES.includes(pathname)

    if (bare) return <>{children}</>

    return (
        <>
            <Preloader />
            <Navbar />
            {children}
            <Footer />
            <GrainOverlay />
            <CursorTrail />
            <CustomCursor />
        </>
    )
}
