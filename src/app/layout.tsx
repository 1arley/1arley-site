import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Titillium_Web } from 'next/font/google'
import './globals.css'
import { baseUrl } from '@/config'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const titilliumWeb = Titillium_Web({
    variable: '--font-titillium-web',
    subsets: ['latin'],
    weight: ['400', '700', '900'],
})

export const metadata: Metadata = {
    title: {
        default: '1arley — Template',
        template: '%s | 1arley',
    },
    description: 'Template multi-domínio com Next.js, React, TypeScript e Tailwind CSS.',
    metadataBase: baseUrl ? new URL(baseUrl) : undefined,
    applicationName: '1arley Template',
    keywords: ['template', 'nextjs', 'react', 'typescript', 'tailwind'],
    openGraph: {
        type: 'website',
        locale: 'pt_BR',
        url: baseUrl,
        siteName: '1arley Template',
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
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <link rel="manifest" href="/site.webmanifest" />
            </head>
            <body
                className={`${GeistSans.variable} ${GeistMono.variable} ${titilliumWeb.variable} antialiased`}
            >
                <Navbar />
                {children}
                <Footer />
            </body>
        </html>
    )
}
