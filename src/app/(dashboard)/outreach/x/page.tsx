"use client"

import { useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'next/navigation'
import { Twitter, Users, MessageSquare, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ClientOnly } from '@/components/ClientOnly'
import MessageModal from '@/components/outreach/MessageModal'
import AccountModal from '@/components/outreach/AccountModal'

export default function XPage() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const pageRef = useRef(null)
  const pageInView = useInView(pageRef, { once: true })

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
    console.log('Saving X message:', message)
  }

  const handleSaveAccount = async (account: any) => {
    // TODO: Implement save account logic
    console.log('Saving X account:', account)
  }

  const stats = [
    { label: t('outreach.x.metrics.followers'), value: 0, icon: Users, color: 'text-blue-500' },
    { label: t('outreach.x.metrics.dmsSent'), value: 0, icon: MessageSquare, color: 'text-green-500' },
    { label: t('outreach.x.metrics.responseRate'), value: '0%', icon: BarChart3, color: 'text-purple-500' },
    { label: t('outreach.x.metrics.leadsGenerated'), value: 0, icon: Twitter, color: 'text-blue-400' }
  ]

  return (
    <div ref={pageRef} className="min-h-screen bg-background p-4">
      <div className="w-full pl-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-medium text-foreground mb-2">
            <ClientOnly fallback="X (Twitter) Outreach">
              {t('outreach.x.title')}
            </ClientOnly>
          </h1>
          <p className="text-base text-muted-foreground">
            <ClientOnly fallback="Connect and engage with prospects on X (Twitter)">
              {t('outreach.x.description')}
            </ClientOnly>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-lg font-medium text-foreground">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center py-12"
        >
          <Twitter className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-foreground mb-2">
            <ClientOnly fallback="X (Twitter) Integration Coming Soon">
              {t('outreach.x.comingSoon')}
            </ClientOnly>
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            <ClientOnly fallback="We're working on bringing X (Twitter) outreach capabilities to Rarity Leads.">
              {t('outreach.x.comingSoonDescription')}
            </ClientOnly>
          </p>
          <Button 
            variant="outline"
            onClick={() => handleOpenMessageModal()}
          >
            <ClientOnly fallback="Get Notified">
              {t('outreach.x.getNotified')}
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