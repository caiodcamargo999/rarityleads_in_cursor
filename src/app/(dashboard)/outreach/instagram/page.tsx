"use client"

import { useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  Instagram, 
  Plus, 
  Users, 
  Target, 
  TrendingUp, 
  MessageSquare,
  Heart,
  Share2,
  BarChart3,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'
import { ClientOnly } from '@/components/ClientOnly'
import MessageModal from '@/components/outreach/MessageModal'
import AccountModal from '@/components/outreach/AccountModal'

export default function InstagramPage() {
  const pageRef = useRef(null)
  const pageInView = useInView(pageRef, { once: true })
  const { t } = useTranslation()
  const searchParams = useSearchParams()

  // Modal states
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [selectedAccount, setSelectedAccount] = useState<any>(null)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)

  // Handle deep linking for modals
  useEffect(() => {
    const messageId = searchParams?.get('messageId')
    const accountId = searchParams?.get('accountId')
    
    if (messageId) {
      setIsMessageModalOpen(true)
    }
    
    if (accountId) {
      setIsAccountModalOpen(true)
    }
  }, [searchParams])

  // Modal handlers
  const handleOpenMessageModal = (message?: any) => {
    setSelectedMessage(message || null)
    setIsMessageModalOpen(true)
  }

  const handleCloseMessageModal = () => {
    setIsMessageModalOpen(false)
    setSelectedMessage(null)
  }

  const handleOpenAccountModal = (account?: any) => {
    setSelectedAccount(account || null)
    setIsAccountModalOpen(true)
  }

  const handleCloseAccountModal = () => {
    setIsAccountModalOpen(false)
    setSelectedAccount(null)
  }

  const handleSaveMessage = async (message: any) => {
    // TODO: Implement save message logic
    console.log('Saving Instagram message:', message)
  }

  const handleSaveAccount = async (account: any) => {
    // TODO: Implement save account logic
    console.log('Saving Instagram account:', account)
  }

  const stats = [
    { label: t('outreach.instagram.metrics.connectedAccounts'), value: 0, icon: Instagram, color: 'text-pink-500' },
    { label: t('outreach.instagram.metrics.totalFollowers'), value: 0, icon: Users, color: 'text-blue-500' },
    { label: t('outreach.instagram.metrics.engagementRate'), value: '0%', icon: Heart, color: 'text-red-500' },
    { label: t('outreach.instagram.metrics.messagesSent'), value: 0, icon: MessageSquare, color: 'text-green-500' }
  ]

  return (
    <div ref={pageRef} className="min-h-screen bg-background w-full overflow-x-hidden">
      <div className="w-full max-w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <h1 className="text-2xl lg:text-3xl font-medium text-foreground mb-2">
                <ClientOnly fallback="Instagram Outreach">
                  {t('outreach.instagram.outreach')}
                </ClientOnly>
              </h1>
              <p className="text-base text-muted-foreground">
                <ClientOnly fallback="Manage your Instagram campaigns and direct messages">
                  {t('outreach.instagram.manageCampaigns')}
                </ClientOnly>
              </p>
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 w-full sm:w-auto bg-muted border-border text-foreground hover:bg-muted/80"
                onClick={() => handleOpenAccountModal()}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">
                  <ClientOnly fallback="Accounts">
                    {t('outreach.instagram.accounts')}
                  </ClientOnly>
                </span>
                <span className="sm:hidden">
                  <ClientOnly fallback="Settings">
                    {t('outreach.instagram.settings')}
                  </ClientOnly>
                </span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 w-full sm:w-auto bg-muted border-border text-foreground hover:bg-muted/80"
                onClick={() => handleOpenMessageModal()}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">
                  <ClientOnly fallback="Conversations">
                    {t('outreach.instagram.conversations')}
                  </ClientOnly>
                </span>
                <span className="sm:hidden">
                  <ClientOnly fallback="Chat">
                    Chat
                  </ClientOnly>
                </span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card border border-border rounded-lg p-6 shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-medium text-foreground">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center py-12"
        >
          <Instagram className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-foreground mb-2">
            <ClientOnly fallback="Instagram Integration Coming Soon">
              {t('outreach.instagram.comingSoon')}
            </ClientOnly>
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            <ClientOnly fallback="We're working on bringing Instagram outreach capabilities to Rarity Leads. You'll be able to connect your Instagram accounts and engage with prospects directly.">
              {t('outreach.instagram.comingSoonDescription')}
            </ClientOnly>
          </p>
          <Button variant="outline" className="bg-muted border-border text-foreground hover:bg-muted/80">
            <ClientOnly fallback="Get Notified">
              {t('outreach.instagram.getNotified')}
            </ClientOnly>
          </Button>
        </motion.div>
      </div>

      {/* Modals */}
      <MessageModal
        message={selectedMessage}
        isOpen={isMessageModalOpen}
        onClose={handleCloseMessageModal}
        onSave={handleSaveMessage}
      />
      
      <AccountModal
        account={selectedAccount}
        isOpen={isAccountModalOpen}
        onClose={handleCloseAccountModal}
        onSave={handleSaveAccount}
      />
    </div>
  )
} 