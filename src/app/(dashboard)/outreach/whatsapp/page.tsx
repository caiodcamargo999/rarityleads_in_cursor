"use client"

import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  MessageSquare, 
  Plus, 
  Users, 
  Target, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Send,
  Settings,
  BarChart3,
  Phone,
  Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ClientOnly } from '@/components/ClientOnly'

interface Campaign {
  id: string
  name: string
  status: 'active' | 'paused' | 'completed' | 'draft'
  leads: number
  sent: number
  responses: number
  conversionRate: number
  lastSent: string
  template: string
}

export default function WhatsAppPage() {
  const { t } = useTranslation()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  
  const pageRef = useRef(null)
  const pageInView = useInView(pageRef, { once: true })

  const stats = [
    { label: t('outreach.whatsapp.status.active'), value: 0, icon: MessageSquare, color: 'text-green-500' },
    { label: t('dashboard.totalLeads'), value: 0, icon: Users, color: 'text-blue-500' },
    { label: t('outreach.whatsapp.metrics.responseRate'), value: '0%', icon: Target, color: 'text-purple-500' },
    { label: t('outreach.whatsapp.metrics.messagesSentToday'), value: 0, icon: TrendingUp, color: 'text-yellow-500' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'paused': return 'bg-yellow-500'
      case 'completed': return 'bg-blue-500'
      case 'draft': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return t('outreach.whatsapp.status.active')
      case 'paused': return t('outreach.whatsapp.status.paused')
      case 'completed': return t('outreach.whatsapp.status.completed')
      case 'draft': return t('outreach.whatsapp.status.draft')
      default: return 'Unknown'
    }
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 dark:from-background/90 dark:to-background/70 w-full overflow-x-hidden">
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
                <ClientOnly fallback="WhatsApp Outreach">
                  {t('outreach.whatsapp.outreach')}
                </ClientOnly>
              </h1>
              <p className="text-base text-muted-foreground">
                <ClientOnly fallback="Manage your WhatsApp campaigns and conversations">
                  {t('outreach.whatsapp.manageCampaigns')}
                </ClientOnly>
              </p>
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Link href="/dashboard/outreach/whatsapp/accounts">
                <Button variant="outline" size="sm" className="flex items-center gap-2 w-full sm:w-auto bg-gradient-to-br from-muted to-muted/80 dark:from-muted/60 dark:to-muted/40 border-border text-foreground hover:from-muted/90 hover:to-muted/70 dark:hover:from-muted/70 dark:hover:to-muted/50">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    <ClientOnly fallback="Accounts">
                      {t('outreach.whatsapp.accounts')}
                    </ClientOnly>
                  </span>
                  <span className="sm:hidden">
                    <ClientOnly fallback="Settings">
                      {t('outreach.whatsapp.settings')}
                    </ClientOnly>
                  </span>
                </Button>
              </Link>
              <Link href="/dashboard/outreach/whatsapp/conversations">
                <Button variant="outline" size="sm" className="flex items-center gap-2 w-full sm:w-auto bg-gradient-to-br from-muted to-muted/80 dark:from-muted/60 dark:to-muted/40 border-border text-foreground hover:from-muted/90 hover:to-muted/70 dark:hover:from-muted/70 dark:hover:to-muted/50">
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    <ClientOnly fallback="Conversations">
                      {t('outreach.whatsapp.conversations')}
                    </ClientOnly>
                  </span>
                  <span className="sm:hidden">
                    <ClientOnly fallback="Chat">
                      {t('outreach.whatsapp.conversations')}
                    </ClientOnly>
                  </span>
                </Button>
              </Link>
              <Button variant="primary" size="sm" className="flex items-center gap-2 w-full sm:w-auto">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">
                  <ClientOnly fallback="New Campaign">
                    {t('outreach.whatsapp.newCampaign')}
                  </ClientOnly>
                </span>
                <span className="sm:hidden">
                  <ClientOnly fallback="New">
                    {t('outreach.whatsapp.newCampaign')}
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
              className="bg-gradient-to-br from-card via-card to-card/80 dark:from-card/90 dark:to-card/70 border border-border rounded-lg p-6 shadow-lg overflow-hidden"
            >
              {/* Purple gradient overlay - more prominent in light theme */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 via-purple-400/5 to-transparent pointer-events-none dark:from-purple-500/3 dark:to-transparent"></div>
              
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br from-muted to-muted/80 dark:from-muted/60 dark:to-muted/40 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
        >
          <Card className="bg-gradient-to-br from-card via-card to-card/80 border-border shadow-lg overflow-hidden dark:from-card/90 dark:to-card/70">
            {/* Subtle purple gradient overlay - more prominent in light theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 via-purple-400/5 to-transparent pointer-events-none dark:from-purple-500/2 dark:to-transparent"></div>
            <CardContent className="p-4 lg:p-6 relative z-10">
              <MessageSquare className="w-6 h-6 lg:w-8 lg:h-8 text-purple-500 mb-3" />
              <h3 className="text-base lg:text-lg font-medium text-foreground mb-2">
                <ClientOnly fallback="Create Campaign">
                  {t('outreach.whatsapp.newCampaign')}
                </ClientOnly>
              </h3>
              <p className="text-xs lg:text-sm text-muted-foreground mb-4">
                <ClientOnly fallback="Start a new WhatsApp outreach campaign">
                  {t('outreach.whatsapp.manageCampaigns')}
                </ClientOnly>
              </p>
              <Button variant="outline" size="sm" className="w-full text-xs lg:text-sm">
                <ClientOnly fallback="Get Started">
                  {t('outreach.whatsapp.newCampaign')}
                </ClientOnly>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card via-card to-card/80 border-border shadow-lg overflow-hidden dark:from-card/90 dark:to-card/70">
            {/* Subtle purple gradient overlay - more prominent in light theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 via-purple-400/5 to-transparent pointer-events-none dark:from-purple-500/2 dark:to-transparent"></div>
            <CardContent className="p-4 lg:p-6 relative z-10">
              <Users className="w-6 h-6 lg:w-8 lg:h-8 text-purple-500 mb-3" />
              <h3 className="text-base lg:text-lg font-medium text-foreground mb-2">
                <ClientOnly fallback="Import Leads">
                  {t('leads.importLeads')}
                </ClientOnly>
              </h3>
              <p className="text-xs lg:text-sm text-muted-foreground mb-4">
                <ClientOnly fallback="Upload your prospect list">
                  {t('leads.uploadProspectList')}
                </ClientOnly>
              </p>
              <Button variant="outline" size="sm" className="w-full text-xs lg:text-sm">
                <ClientOnly fallback="Import CSV">
                  {t('leads.importCsv')}
                </ClientOnly>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card via-card to-card/80 border-border shadow-lg overflow-hidden dark:from-card/90 dark:to-card/70 sm:col-span-2 lg:col-span-1">
            {/* Subtle purple gradient overlay - more prominent in light theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 via-purple-400/5 to-transparent pointer-events-none dark:from-purple-500/2 dark:to-transparent"></div>
            <CardContent className="p-4 lg:p-6 relative z-10">
              <BarChart3 className="w-6 h-6 lg:w-8 lg:h-8 text-purple-500 mb-3" />
              <h3 className="text-base lg:text-lg font-medium text-foreground mb-2">
                <ClientOnly fallback="View Analytics">
                  {t('outreach.whatsapp.analytics')}
                </ClientOnly>
              </h3>
              <p className="text-xs lg:text-sm text-muted-foreground mb-4">
                <ClientOnly fallback="Track campaign performance">
                  {t('outreach.whatsapp.manageCampaigns')}
                </ClientOnly>
              </p>
              <Button variant="outline" size="sm" className="w-full text-xs lg:text-sm">
                <ClientOnly fallback="View Reports">
                  {t('outreach.whatsapp.analytics')}
                </ClientOnly>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Campaigns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-card via-card to-card/80 border-border shadow-lg overflow-hidden dark:from-card/90 dark:to-card/70">
            {/* Subtle purple gradient overlay - more prominent in light theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 via-purple-400/5 to-transparent pointer-events-none dark:from-purple-500/2 dark:to-transparent"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-foreground">
                <ClientOnly fallback="Active Campaigns">
                  {t('outreach.whatsapp.campaigns')}
                </ClientOnly>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                <ClientOnly fallback="Manage your WhatsApp outreach campaigns">
                  {t('outreach.whatsapp.manageCampaigns')}
                </ClientOnly>
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-4">
                {campaigns.map((campaign, index) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-dark-bg border border-dark-border rounded-lg hover:bg-dark-bg-tertiary transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-dark-text">{campaign.name}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)} text-white`}>
                          {getStatusText(campaign.status)}
                        </span>
                      </div>
                      <p className="text-sm text-dark-text-secondary mb-2">
                        {campaign.template.substring(0, 60)}...
                      </p>
                      <div className="flex items-center gap-4 text-xs text-dark-text-muted">
                        <span>{campaign.leads} leads</span>
                        <span>{campaign.sent} sent</span>
                        <span>{campaign.responses} responses</span>
                        <span>{campaign.conversionRate}% rate</span>
                        <span>Last: {campaign.lastSent}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Send className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-dark-bg-secondary border-dark-border">
            <CardHeader>
              <CardTitle className="text-dark-text">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'Message sent', target: 'Sarah Johnson', time: '2 min ago', status: 'success' },
                  { action: 'Campaign started', target: 'Tech Startup Outreach', time: '1 hour ago', status: 'success' },
                  { action: 'Lead imported', target: '150 contacts', time: '3 hours ago', status: 'success' },
                  { action: 'Account connected', target: 'WhatsApp Business', time: '1 day ago', status: 'success' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-dark-bg rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div className="flex-1">
                      <p className="text-sm text-dark-text">
                        <span className="font-medium">{activity.action}</span> to {activity.target}
                      </p>
                      <p className="text-xs text-dark-text-muted">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 