"use client"

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'es', name: 'Español', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'pt', name: 'Português', flag: '🇧🇷', nativeName: 'Português' },
]

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState(languages[0])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const lang = languages.find(lang => lang.code === i18n.language) || languages[0]
    setCurrentLanguage(lang)
  }, [i18n.language])

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
    localStorage.setItem('i18nextLng', languageCode)
    localStorage.setItem('ip-detected-language', languageCode)
    setIsOpen(false)
  }

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Globe className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <Globe className="h-4 w-4" />
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="bg-card border border-border text-foreground min-w-[160px] p-1 shadow-lg"
        sideOffset={4}
        side="bottom"
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {languages.map((language, index) => (
                <motion.div
                  key={language.code}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: index * 0.03 }}
                >
                  <DropdownMenuItem
                    onClick={() => changeLanguage(language.code)}
                    className={`hover:bg-muted focus:bg-muted transition-all duration-200 rounded-md cursor-pointer ${
                      i18n.language === language.code ? 'bg-rarity-600/20 text-rarity-600' : ''
                    }`}
                  >
                    <motion.div
                      className="flex items-center w-full"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="mr-3 text-base">{language.flag}</span>
                      <span className="text-sm font-medium">{language.nativeName}</span>
                    </motion.div>
                  </DropdownMenuItem>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageSwitcher
