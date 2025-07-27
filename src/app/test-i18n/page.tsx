"use client"

import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { LanguageSelector } from '@/components/LanguageSelector'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Globe, Check } from 'lucide-react'

export default function TestI18nPage() {
  const { t, i18n } = useTranslation()

  const testTranslations = [
    'common.loading',
    'common.success',
    'common.error',
    'auth.signIn',
    'auth.signUp',
    'navigation.dashboard',
    'navigation.leads',
    'settings.language',
    'sales.hero.title',
    'sales.hero.subtitle',
    'sales.hero.cta'
  ]

  return (
    <div className="min-h-screen bg-dark-bg p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">i18n Test Page</h1>
          <LanguageSwitcher />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Language Info */}
          <Card className="bg-dark-bg-secondary border-dark-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Current Language
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Language Code:</strong> {i18n.language}</p>
                <p><strong>HTML Lang:</strong> {typeof document !== 'undefined' ? document.documentElement.lang : 'N/A'}</p>
                <p><strong>Local Storage:</strong> {typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') || 'Not set' : 'N/A'}</p>
                <p><strong>IP Detected:</strong> {typeof window !== 'undefined' ? localStorage.getItem('ip-detected-language') || 'Not set' : 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Language Selector Test */}
          <Card className="bg-dark-bg-secondary border-dark-border">
            <CardHeader>
              <CardTitle>Language Selector (Buttons)</CardTitle>
            </CardHeader>
            <CardContent>
              <LanguageSelector variant="buttons" />
            </CardContent>
          </Card>
        </div>

        {/* Translation Tests */}
        <Card className="bg-dark-bg-secondary border-dark-border mt-8">
          <CardHeader>
            <CardTitle>Translation Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testTranslations.map((key) => (
                <div key={key} className="p-4 border border-dark-border rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">{key}</p>
                  <p className="text-white font-medium">{t(key)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Language Detection Test */}
        <Card className="bg-dark-bg-secondary border-dark-border mt-8">
          <CardHeader>
            <CardTitle>Language Detection Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-300">
                This page tests the internationalization system. The language should be automatically detected based on:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>IP-based country detection (primary)</li>
                <li>Browser language (fallback)</li>
                <li>User preference (manual selection)</li>
                <li>English (default fallback)</li>
              </ol>
              
              <div className="flex gap-4 mt-6">
                <Button 
                  onClick={() => {
                    localStorage.removeItem('language-detection-initialized')
                    window.location.reload()
                  }}
                  variant="outline"
                >
                  Reset Language Detection
                </Button>
                <Button 
                  onClick={() => {
                    localStorage.clear()
                    window.location.reload()
                  }}
                  variant="outline"
                >
                  Clear All Storage
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 