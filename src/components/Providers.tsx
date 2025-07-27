"use client"

import { useState, useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import { ThemeProvider } from '@/components/theme-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)
  const [isI18nReady, setIsI18nReady] = useState(false)
  const [i18nInstance, setI18nInstance] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
    
    // Initialize i18n on client side only
    if (typeof window !== 'undefined') {
      import('@/i18n/config').then(({ default: i18n }) => {
        if (!i18n.isInitialized) {
          i18n.init().then(() => {
            setI18nInstance(i18n)
            setIsI18nReady(true)
          })
        } else {
          setI18nInstance(i18n)
          setIsI18nReady(true)
        }
      })
    } else {
      setIsI18nReady(true)
    }
  }, [])

  if (!isClient || !isI18nReady || !i18nInstance) {
    // Return a simple wrapper during SSR to avoid hydration issues
    return <div>{children}</div>
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <I18nextProvider i18n={i18nInstance}>
        {children}
      </I18nextProvider>
    </ThemeProvider>
  )
} 