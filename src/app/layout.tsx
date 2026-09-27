import type { Metadata, Viewport } from 'next'
import { Anton, Oswald, JetBrains_Mono } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import './globals.css'
import { baseUrl } from '@/config'
import Chrome from '@/components/core/Chrome'
import { LocaleProvider } from '@/lib/i18n'
import { Toaster } from '@/components/ui/sonner'
import { INTRO_BOOT, INTRO_SRC } from '@/lib/site-intro'

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
        default: 'Arthur Iarley - Desenvolvedor Full-Stack',
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
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
                {/*
                  The intro clip is the last thing the hero needs and the first
                  thing it plays. Preloading it here puts the request in flight
                  while the HTML and the JS chunks are still downloading, so
                  hydration finds it in cache instead of waiting on the network.
                  Browsers that ignore as="video" fall back to the <video src>.
                */}
                <link rel="preload" as="video" href={INTRO_SRC} type="video/mp4" />
                {/*
                  Blocking by design. The intro curtain must be on screen at the
                  very first paint, and a React effect only runs after hydration
                  — by then the portfolio has already been seen. Runs in <head>,
                  so its verdict on <html> is settled before the body parses.
                */}
                <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT }} />
            </head>
            <body
                className={`${anton.variable} ${oswald.variable} ${jetbrainsMono.variable} ${GeistSans.variable} antialiased`}
            >
                <LocaleProvider>
                    <Chrome>{children}</Chrome>
                    <Toaster richColors position="top-center" />
                </LocaleProvider>
            </body>
        </html>
    )
}
