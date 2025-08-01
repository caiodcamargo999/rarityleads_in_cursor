"use client"

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Twitter, Users, MessageSquare, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ClientOnly } from '@/components/ClientOnly'

export default function XPage() {
  const { t } = useTranslation()
  const pageRef = useRef(null)
  const pageInView = useInView(pageRef, { once: true })

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
          <Button variant="outline">
            <ClientOnly fallback="Get Notified">
              {t('outreach.x.getNotified')}
            </ClientOnly>
          </Button>
        </motion.div>
      </div>
    </div>
  )
} 