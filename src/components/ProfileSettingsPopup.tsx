"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  User, 
  LogOut, 
  Building2,
  Moon,
  Sun,
  Settings,
  ChevronDown
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ClientOnly } from './ClientOnly'

interface ProfileSettingsPopupProps {
  user: any
  isVisible: boolean
  onClose: () => void
  onLogout: () => void
  onSettingsClick: () => void
  isMobile?: boolean
}

export default function ProfileSettingsPopup({
  user,
  isVisible,
  onClose,
  onLogout,
  onSettingsClick,
  isMobile = false
}: ProfileSettingsPopupProps) {
  const { t } = useTranslation()
  const [isThemeDark, setIsThemeDark] = useState(true)

  const toggleTheme = () => {
    setIsThemeDark(!isThemeDark)
    // TODO: Implement actual theme switching
  }

  const getUserInitials = (email: string) => {
    return email ? email.substring(0, 2).toUpperCase() : 'U'
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          
          {/* Anthropic-style Floating Panel - Bottom Left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-80 max-w-[calc(100vw-2rem)]"
            style={{
              maxHeight: 'calc(100vh - 2rem)',
              overflow: 'hidden'
            }}
          >
            {/* User Info Section */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-700 font-medium text-sm">
                    {getUserInitials(user?.email)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium text-sm truncate">
                    {user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-gray-500 text-xs truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              
              {/* Organization */}
              <div className="mt-3 flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                <Building2 className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 text-sm">
                  <ClientOnly fallback="Individual Account">
                    {t('profile.individualAccount')}
                  </ClientOnly>
                </span>
                <div className="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>
              </div>
            </div>

            {/* Settings Options */}
            <div className="p-2">
              {/* Profile Settings */}
              <Button
                variant="ghost"
                onClick={onSettingsClick}
                className="w-full justify-start text-gray-700 hover:bg-gray-100 h-10"
              >
                <User className="w-4 h-4 mr-3" />
                <span className="text-sm">
                  <ClientOnly fallback="Profile Settings">
                    {t('settings.profile.title')}
                  </ClientOnly>
                </span>
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                onClick={toggleTheme}
                className="w-full justify-start text-gray-700 hover:bg-gray-100 h-10"
              >
                {isThemeDark ? (
                  <Moon className="w-4 h-4 mr-3" />
                ) : (
                  <Sun className="w-4 h-4 mr-3" />
                )}
                <span className="text-sm">
                  <ClientOnly fallback={isThemeDark ? 'Dark Theme' : 'Light Theme'}>
                    {isThemeDark ? t('settings.appearance.darkTheme') : t('settings.appearance.lightTheme')}
                  </ClientOnly>
                </span>
              </Button>

              {/* Divider */}
              <div className="border-t border-gray-100 my-2"></div>

              {/* Logout */}
              <Button
                variant="ghost"
                onClick={onLogout}
                className="w-full justify-start text-red-600 hover:bg-red-50 h-10"
              >
                <LogOut className="w-4 h-4 mr-3" />
                <span className="text-sm">
                  <ClientOnly fallback="Sign Out">
                    {t('auth.signOut')}
                  </ClientOnly>
                </span>
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 