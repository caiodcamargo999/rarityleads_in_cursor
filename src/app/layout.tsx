import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Rarity Leads - AI-Powered Lead Generation Platform',
  description: 'AI-powered warm lead hunting for faster deals, deeper conversations, and scalable outreach — with zero guesswork.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  keywords: 'AI lead generation, B2B prospecting, sales automation, lead qualification, WhatsApp automation',
  authors: [{ name: 'Rarity Leads' }],
  openGraph: {
    title: 'Rarity Leads - AI-Powered Lead Generation',
    description: 'Transform your lead generation with AI-powered prospecting and qualification.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rarity Leads - AI-Powered Lead Generation',
    description: 'Transform your lead generation with AI-powered prospecting and qualification.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <head>
        <link rel="icon" type="image/png" href="/favicon.ico" />
        <link rel="shortcut icon" type="image/png" href="/favicon.ico" />
        <link rel="apple-touch-icon" type="image/png" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 