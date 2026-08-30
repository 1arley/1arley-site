import type { Metadata } from 'next'
import { Anton, Oswald, JetBrains_Mono } from 'next/font/google';
import './globals.css'
import { baseUrl } from '@/config'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Preloader from '@/components/effects/Preloader'
import { GrainOverlay } from '@/components/effects/GrainOverlay'
import { CustomCursor } from '@/components/effects/CustomCursor'
import { CursorTrail } from '@/components/effects/CursorTrail'
import { LocaleProvider } from '@/lib/i18n'

const anton = Anton({
    variable: '--font-anton',
    subsets: ['latin'],
    weight: ['400'],
})

const oswald = Oswald({
    variable: '--font-oswald',
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
    variable: '--font-mono',
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
    title: {
        default: 'Arthur Iarley — Desenvolvedor Full-Stack',
        template: '%s | Arthur Iarley',
    },
    description: 'Portfólio de Arthur Iarley com experiências reais, projetos, skills, links e contato. Design Rockstar 2 em P&B.',
    metadataBase: baseUrl ? new URL(baseUrl) : undefined,
    applicationName: 'Arthur Iarley Portfolio',
    keywords: ['portfolio', 'arthur iarley', 'desenvolvedor', 'full-stack', 'backend', 'frontend', 'typescript', 'nodejs', 'nestjs', 'postgresql'],
    openGraph: {
        type: 'website',
        locale: 'pt_BR',
        url: baseUrl,
        siteName: 'Arthur Iarley',
        description: 'Portfólio P&B brutal. Next.js, React, TypeScript, WebGL.',
    },
    twitter: {
        card: 'summary_large_image',
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang='pt-BR' data-scroll-behavior="smooth">
            <head>
                <link rel="icon" href="/favicon.png" />
            </head>
            <body
                className={`${anton.variable} ${oswald.variable} ${jetbrainsMono.variable} antialiased`}
            >
                <LocaleProvider>
                    <Preloader />
                    <Navbar />
                    {children}
                    <Footer />
                    <GrainOverlay />
                    <CursorTrail />
                    <CustomCursor />
                </LocaleProvider>
            </body>
        </html>
    )
}
