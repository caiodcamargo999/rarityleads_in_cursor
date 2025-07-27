"use client"

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { initializeLanguageDetection } from '@/i18n/config'

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    const initializeLanguage = async () => {
      try {
        // Check if language detection has already been initialized
        const hasBeenInitialized = localStorage.getItem('language-detection-initialized')
        
        if (!hasBeenInitialized) {
          await initializeLanguageDetection()
          localStorage.setItem('language-detection-initialized', 'true')
        }
        
        setIsInitialized(true)
      } catch (error) {
        console.warn('Failed to initialize language detection:', error)
        setIsInitialized(true)
      }
    }

    initializeLanguage()
  }, [])

  useEffect(() => {
    // Set the HTML lang attribute based on the current language
    if (typeof document !== 'undefined' && isInitialized) {
      document.documentElement.lang = i18n.language
    }
  }, [i18n.language, isInitialized])

  return <>{children}</>
} 