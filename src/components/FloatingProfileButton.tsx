"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'

interface FloatingProfileButtonProps {
  user: any
  onClick: () => void
}

export default function FloatingProfileButton({
  user,
  onClick
}: FloatingProfileButtonProps) {
  const getUserInitials = (email: string) => {
    return email ? email.substring(0, 2).toUpperCase() : 'U'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed bottom-4 left-4 lg:left-72 z-30"
    >
      <Button
        onClick={onClick}
        variant="ghost"
        size="sm"
        className="bg-background border border-border rounded-lg shadow-lg hover:bg-muted p-2 h-auto"
        aria-label="Profile settings"
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <span className="text-foreground font-medium text-xs">
              {getUserInitials(user?.email)}
            </span>
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-medium text-foreground truncate">
              {user?.email?.split('@')[0] || 'User'}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {user?.email}
            </div>
          </div>
          <Settings className="w-4 h-4 text-muted-foreground" />
        </div>
      </Button>
    </motion.div>
  )
} 