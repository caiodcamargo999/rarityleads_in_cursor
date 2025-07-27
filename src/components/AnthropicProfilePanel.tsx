"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { User, LogOut, Building2 } from 'lucide-react'
import { ClientOnly } from '@/components/ClientOnly'

interface AnthropicProfilePanelProps {
  user: any
  isVisible: boolean
  onClose: () => void
  onLogout: () => void
  onSettingsClick: () => void
}

export default function AnthropicProfilePanel({
  user,
  isVisible,
  onClose,
  onLogout,
  onSettingsClick
}: AnthropicProfilePanelProps) {
  const { t } = useTranslation()

  const getUserInitials = (email: string) => {
    return email ? email.substring(0, 2).toUpperCase() : 'U'
  }

  if (!isVisible) return null

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
            className="fixed bottom-4 left-4 lg:left-72 bg-card border border-border rounded-lg shadow-xl z-50 w-80 max-w-[calc(100vw-2rem)] backdrop-blur-none"
            style={{
              maxHeight: 'calc(100vh - 2rem)',
              overflow: 'hidden',
              backgroundColor: 'hsl(var(--card))',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            {/* User Info Section */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-foreground font-medium text-sm">
                    {getUserInitials(user?.email)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-medium text-sm truncate">
                    {user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-muted-foreground text-xs truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              
              {/* Organization */}
              <div className="mt-3 flex items-center space-x-2 p-2 bg-muted rounded-md">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground text-sm">
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
                className="w-full justify-start text-foreground hover:bg-muted h-10"
              >
                <User className="w-4 h-4 mr-3" />
                <span className="text-sm">
                  <ClientOnly fallback="Profile Settings">
                    {t('settings.profile.title')}
                  </ClientOnly>
                </span>
              </Button>
              <div className="border-t border-border my-2"></div>
              <Button
                variant="ghost"
                onClick={onLogout}
                className="w-full justify-start text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950 h-10"
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