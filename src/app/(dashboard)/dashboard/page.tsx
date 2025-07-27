"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Target,
  BarChart3,
  Calendar,
  ArrowUpRight,
  Plus
} from 'lucide-react'
import { ClientOnly } from '@/components/ClientOnly'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const metrics = [
    {
      title: t('dashboard.totalLeads'),
      value: '0',
      change: '0%',
      icon: Users,
      color: 'text-blue-500'
    },
    {
      title: t('dashboard.conversionRate'),
      value: '0%',
      change: '0%',
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      title: t('dashboard.activeConversations'),
      value: '0',
      change: '0',
      icon: MessageSquare,
      color: 'text-purple-500'
    },
    {
      title: t('dashboard.pipelineValue'),
      value: '$0',
      change: '0%',
      icon: Target,
      color: 'text-orange-500'
    }
  ]

  const recentActivity = [
    {
      type: 'lead',
      message: t('dashboard.recentLeads'),
      time: t('common.justNow'),
      icon: Users
    },
    {
      type: 'conversion',
      message: t('dashboard.convertedLeads'),
      time: t('common.justNow'),
      icon: TrendingUp
    },
    {
      type: 'message',
      message: t('dashboard.activeConversations'),
      time: t('common.justNow'),
      icon: MessageSquare
    }
  ]

  // Quick action handlers - Notion.com style
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'addLead':
        // Navigate to leads page with focus on lead creation
        router.push('/leads')
        break
      case 'sendMessage':
        // Navigate to WhatsApp outreach (most common channel)
        router.push('/outreach/whatsapp')
        break
      case 'viewAnalytics':
        // Navigate to analytics page
        router.push('/analytics')
        break
      case 'schedule':
        // Navigate to CRM for scheduling
        router.push('/dashboard/crm')
        break
      default:
        break
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-muted-foreground"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-background">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            <ClientOnly fallback="Dashboard">
              {t('dashboard.title')}
            </ClientOnly>
          </h1>
          <p className="text-muted-foreground mt-1">
            <ClientOnly fallback="Welcome to Rarity Leads">
              {t('dashboard.welcome')}
            </ClientOnly>
          </p>
        </div>
        <Button className="bg-muted hover:bg-muted/80 text-foreground border border-border">
          <Plus className="w-4 h-4 mr-2" />
          <ClientOnly fallback="Add Lead">
            {t('leads.addLead')}
          </ClientOnly>
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-card border-border shadow-lg">
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {metric.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-muted ${metric.color}`}>
                    <metric.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500 font-medium">
                    {metric.change}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    <ClientOnly fallback="from last month">
                      {t('dashboard.fromLastMonth')}
                    </ClientOnly>
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="bg-card border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground">
                <ClientOnly fallback="Performance">
                  {t('dashboard.performance')}
                </ClientOnly>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                <ClientOnly fallback="Last 30 days">
                  {t('dashboard.last30Days')}
                </ClientOnly>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    <ClientOnly fallback="Chart coming soon">
                      {t('dashboard.chartComingSoon')}
                    </ClientOnly>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-card border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground">
                <ClientOnly fallback="Recent Activity">
                  {t('dashboard.recentActivity')}
                </ClientOnly>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <activity.icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="bg-card border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-foreground">
              <ClientOnly fallback="Quick Actions">
                {t('dashboard.quickActions')}
              </ClientOnly>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2 bg-muted border-border text-foreground hover:bg-muted/80 transition-all duration-200 hover:scale-105"
                onClick={() => handleQuickAction('addLead')}
              >
                <Users className="w-6 h-6" />
                <span className="text-sm">
                  <ClientOnly fallback="Add Lead">
                    {t('leads.addLead')}
                  </ClientOnly>
                </span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2 bg-muted border-border text-foreground hover:bg-muted/80 transition-all duration-200 hover:scale-105"
                onClick={() => handleQuickAction('sendMessage')}
              >
                <MessageSquare className="w-6 h-6" />
                <span className="text-sm">
                  <ClientOnly fallback="Send Message">
                    {t('outreach.sendMessage')}
                  </ClientOnly>
                </span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2 bg-muted border-border text-foreground hover:bg-muted/80 transition-all duration-200 hover:scale-105"
                onClick={() => handleQuickAction('viewAnalytics')}
              >
                <BarChart3 className="w-6 h-6" />
                <span className="text-sm">
                  <ClientOnly fallback="View Analytics">
                    {t('analytics.title')}
                  </ClientOnly>
                </span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2 bg-muted border-border text-foreground hover:bg-muted/80 transition-all duration-200 hover:scale-105"
                onClick={() => handleQuickAction('schedule')}
              >
                <Calendar className="w-6 h-6" />
                <span className="text-sm">
                  <ClientOnly fallback="Schedule">
                    {t('dashboard.schedule')}
                  </ClientOnly>
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 