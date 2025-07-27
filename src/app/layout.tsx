import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

// Optimized font loading
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
  variable: '--font-inter',
})

// Performance-optimized metadata
export const metadata: Metadata = {
  title: {
    default: 'Rarity Leads - AI-Powered Lead Generation Platform',
    template: '%s | Rarity Leads'
  },
  description: 'AI-powered warm lead hunting for faster deals, deeper conversations, and scalable outreach — with zero guesswork.',
  keywords: [
    'AI lead generation',
    'B2B prospecting', 
    'sales automation',
    'lead qualification',
    'WhatsApp automation',
    'outreach automation',
    'sales development',
    'lead scoring'
  ],
  authors: [{ name: 'Rarity Leads Team' }],
  creator: 'Rarity Leads',
  publisher: 'Rarity Leads',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rarityleads.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rarityleads.com',
    title: 'Rarity Leads - AI-Powered Lead Generation',
    description: 'Transform your lead generation with AI-powered prospecting and qualification.',
    siteName: 'Rarity Leads',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Rarity Leads - AI-Powered Lead Generation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rarity Leads - AI-Powered Lead Generation',
    description: 'Transform your lead generation with AI-powered prospecting and qualification.',
    images: ['/og-image.png'],
    creator: '@rarityleads',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
}

export const viewport: Viewport = {
  themeColor: '#0A0A23',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={`${inter.variable} antialiased`}>
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Rarity Leads",
              "description": "AI-powered lead generation platform for B2B sales teams",
              "url": "https://rarityleads.com",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "47",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} bg-background text-foreground`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 